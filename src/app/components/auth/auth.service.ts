import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private loginUrl = 'http://localhost:8080'; // A URL para a API
  currentUser: any = null;
  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string): void {
    this.snackBar.open(msg, '', {
      duration: 3500,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ['msgerror']
    })
  }
  isLoggedIn(): boolean {
    // Implemente a lógica para verificar se o usuário está autenticado
    // Por exemplo, verificar se há um token válido no armazenamento local
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se houver um token válido, false caso contrário
  }

  // login(email: string, password: string): Observable<any> {
  //   localStorage.setItem('token', 'seu-token-jwt-aqui');
  //   //localStorage.setItem('currentUser', JSON.stringify(response.user));
  //   return this.http.post<any>(`${this.loginUrl}/login`, { email, password });
  // }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Armazene o token no local storage
        localStorage.setItem('token', response.token);
        // Armazene as informações do usuário no local storage
       localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }
  getUser(): any {
    let user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  register(nome: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/register`, { nome, email, password });
  }

  home(): Observable<any> {
    return this.http.get<any>(`${this.loginUrl}/alla`);
  }

  // Método para salvar o token no localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para recuperar o token do localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para remover o token do localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('token');
  }

}