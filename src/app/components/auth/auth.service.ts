import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';

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
    const token = localStorage.getItem('token');
    // return !!token; 
    // const token = this.getToken(); //codigo verificar depois essa parte aqqui
    return !!token; // Retorna true se houver um token válido, false caso contrário
  }

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

  updateUser(id: number, updatedData: any): Observable<Usuario> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    return this.http.put<Usuario>(`http://localhost:8080/usuario/update/${id}`, updatedData, {headers});
  }


  verifyCurrentPassword(senhaAtual: string): Observable<any> {
    const user = this.getUser();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    if (!user) {
      return new Observable(observer => {
        observer.error('Usuário não encontrado');
        observer.complete();
      });
    }

    return this.http.post<any>(`${this.loginUrl}/verify-password`, {
      email: user.email,
      senhaAtual
    }, { headers }).pipe(
      catchError(error => {
        this.showMessage('Erro ao verificar a senha atual');
        return new Observable(observer => {
          observer.error(error);
          observer.complete();
        });
      })
    );
  }


}
