import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Para mapear os dados da API
import { Tarefa } from 'src/app/models/tarefa.model';  // Certifique-se de importar a interface correta

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl = 'http://localhost:8080/tarefa'; // Ajuste a URL da API conforme necessário
  headers = new HttpHeaders().set('Authorization', `${localStorage.getItem('token')}`);

  constructor(private http: HttpClient) { }

  // Método para buscar as tarefas do projeto
  getTarefasProjeto(projetoId: number): Observable<Tarefa[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/${projetoId}`;  // URL correta para o endpoint
  
    // Mapear a resposta para garantir que seja do tipo Tarefa[]
    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => response.map(tarefa => ({
        nome: tarefa.nome,
        observacoes: tarefa.observacoes,
        dataCriacao: new Date(tarefa.dataCriacao),
        dataEntrega: new Date(tarefa.dataEntrega),
        projetoId: tarefa.projetoId,
        statusId: tarefa.statusId,
        usuarioId: tarefa.usuarioId
      })))
    );
  }
  
}
