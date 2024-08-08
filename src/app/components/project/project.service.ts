import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Projeto } from 'src/app/models/projeto.model';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  apiUrl = 'http://localhost:8080/projeto';

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ['msgerror']
    })
  }
  
  getProjetos(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  create(projeto: Projeto): Observable<Projeto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    return this.http.post<Projeto>(this.apiUrl, projeto, {headers});
  }

  getProjetoById(id: number): Observable<Projeto>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    const url = `${this.apiUrl}/${id}`
    return this.http.get<Projeto>(url, {headers});
  }

  getProjetoPart(id: number): Observable<UsuarioProjeto[]>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const url = `${this.apiUrl}/part/${id}`

    return this.http.get<UsuarioProjeto[]>(url, {headers})
  }
  
  
  deleteProjeto(id: number): Observable<Projeto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<Projeto>(url, { headers });
  }
/*
  
  getTabelasDoProjeto(projetoId: number): Observable<Tabela[]> {
    const url = `${this.apiUrl}/dash/${projetoId}`; 
    return this.http.get<Tabela[]>(url);
  }
 */
}
