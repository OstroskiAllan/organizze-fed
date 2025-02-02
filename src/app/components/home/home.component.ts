import { Component, OnInit } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { AuthService } from '../auth/auth.service';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projetos: Projeto[] = [];
  tarefas: Tarefa[] = [];
  usuario: any;
  projetosProximosDoFim: Projeto[] = [];
  tarefasAtribuidas: Tarefa[] = [];
  quantidadeTarefasUsuario: number = 0;
  response: any[] = [];
  projetoId: number = 1;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
    this.carregarProjetos();
    this.carregarTarefasAtribuidas();
    this.carregarTask();
  }

  carregarProjetos(): void {
    this.projectService.getProjetos().subscribe(projetos => {
      this.projetos = projetos;
      this.projetosProximosDoFim = this.projetos
        .filter(projeto => projeto.dataFim)
        .sort((a, b) => new Date(a.dataFim!).getTime() - new Date(b.dataFim!).getTime())
        .slice(0, 5);
    });
  }

  carregarTarefasAtribuidas(): void {
    this.taskService.getTarefasProjeto(this.usuario.id).subscribe(tarefas => {
      this.tarefas = tarefas;
      this.tarefasAtribuidas = this.tarefas.filter(tarefa => tarefa.usuarioId === this.usuario.id);
    });
  }

  abrirDetalhes(projetoId: number): void {
    this.router.navigate(['/project/', projetoId]);
  }


  // No carregarTask
  carregarTask() {
    this.taskService.getTarefasProjeto(this.projetoId).subscribe(
      (response) => {
        this.response = response;
        const usuarioId = 803; // Substitua pelo ID do usuário desejado
        const quantidadeTarefas = this.contarTarefasPorUsuario(response, usuarioId);
        console.log(`O usuário ${usuarioId} tem ${quantidadeTarefas} tarefas atribuídas.`);
        this.quantidadeTarefasUsuario = quantidadeTarefas;
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
      }
    );
  }

  contarTarefasPorUsuario(tarefas: any[], usuarioId: number): number {
    const tarefasDoUsuario = tarefas.filter(tarefa => tarefa.usuarioId === usuarioId);
    return tarefasDoUsuario.length;
  }

  distribuirTarefas(tarefas: any[]) {
    // Implemente a lógica de distribuição de tarefas, se necessário
  }
}