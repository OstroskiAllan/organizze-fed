import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';
import { Projeto } from 'src/app/models/projeto.model';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  apiUrl = 'http://localhost:8080/projeto';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any): Observable<never> {
    this.showMessage('Ocorreu um erro ao processar a solicitação');
    return throwError(error);
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ['msgerror']
    })
  }

  getProjetos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }


  create(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(this.apiUrl, projeto, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getProjetoById(id: number): Observable<Projeto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    const url = `${this.apiUrl}/${id}`
    return this.http.get<Projeto>(url, { headers });
  }

  getUserNameById(userId: number): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/${userId}/nome`;

    return this.http.get<string>(url, { headers, responseType: 'text' as 'json' });
  }

  getTeamProjetoId(id: number): Observable<UsuarioProjeto[]> {
    const url = `${this.apiUrl}/team/${id}`;
    return this.http.get<UsuarioProjeto[]>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }


  getProjetoPart(id: number): Observable<UsuarioProjeto[]> {
    const url = `${this.apiUrl}/part/${id}`;
    return this.http.get<UsuarioProjeto[]>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteProjeto(id: number): Observable<Projeto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<Projeto>(url, { headers });
  }


  //ORGANIZAR MELHOR ISSO AQUI -- ENDPOINT DO TEAM
  addParticipante(email: string, projetoId: any, cargo: string): Observable<UsuarioProjeto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/add`;

    const body = { email, projetoId, cargo };
    return this.http.post<UsuarioProjeto>(url, body, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          return throwError('Participante nao encontrado.');
        }
        return throwError(error);
      })
    );
  }
}

  // TESTAR DEPOIS
  // updateProjeto(projeto: Projeto): Observable<Projeto> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `${token}`);

  //   return this.http.put<Projeto>(this.apiUrl, projeto, { headers });
  // }

