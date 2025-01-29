import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Para mapear os dados da API
import { Tarefa } from 'src/app/models/tarefa.model';  // Certifique-se de importar a interface correta

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl = 'http://localhost:8080/tarefa'; // Ajuste a URL da API conforme necessário
  apiPro = 'http://localhost:8080/projeto'; // Ajuste a URL da API conforme necessário
  headers = new HttpHeaders().set('Authorization', `${localStorage.getItem('token')}`);

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar) { }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ['msgerror']
    })
  }

  // Método para buscar as tarefas do projeto
  getTarefasProjeto(projetoId: number): Observable<Tarefa[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/${projetoId}`;  // URL correta para o endpoint
  
    // Mapear a resposta para garantir que seja do tipo Tarefa[]
    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => response.map(tarefa => ({
        id: tarefa.id,
        nome: tarefa.nome,
        observacoes: tarefa.observacoes,
        dataCriacao: new Date(tarefa.dataCriacao),
        dataEntrega: tarefa.dataEntrega ? new Date(tarefa.dataEntrega) : null,
        projetoId: tarefa.projetoId,
        statusId: tarefa.statusId,
        usuarioId: tarefa.usuarioId
      })))
    );
  }

  create(tarefa: Tarefa): Observable<Tarefa> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);

    return this.http.post<Tarefa>(this.apiUrl, tarefa, { headers });
  }

  update(tarefa: Tarefa): Observable<Tarefa> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const url = `${this.apiUrl}/${tarefa.id}`;  // URL correta para o endpoint

    return this.http.put<Tarefa>(url, tarefa, { headers });
  }


    getNome(id: any): Observable<any[]>{
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const url = `${this.apiPro}/${id}/nome`;
      return this.http.get<any[]>(url, { headers, responseType: 'text' as 'json' });
    }
}
