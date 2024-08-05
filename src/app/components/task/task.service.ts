import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from 'src/app/models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl = 'http://localhost:8080/';
  headers = new HttpHeaders().set('Authorization', `${localStorage.getItem('token')}`);

  constructor(private http: HttpClient) { }

  create(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, tarefa, { headers: this.headers });
  }

  getTarefasProjeto(projetoId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    const url = `${this.apiUrl}/${projetoId}/tarefas`; 
    //return this.http.get<Tarefa>(url);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}