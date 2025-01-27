import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  apiUrl = 'http://localhost:8080/team';

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ['msgerror']
    })
  }

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

  getProjetoPart(id: number): Observable<UsuarioProjeto[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const url = `${this.apiUrl}/part/${id}`

    return this.http.get<UsuarioProjeto[]>(url, { headers })
  }

  getTeamProjetoId(id: number): Observable<UsuarioProjeto[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const url = `${this.apiUrl}/${id}`

    return this.http.get<UsuarioProjeto[]>(url, { headers });
  }
}
