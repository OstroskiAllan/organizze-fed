import { Component, OnInit } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { AuthService } from '../auth/auth.service';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { Router } from '@angular/router';
import { map, forkJoin } from 'rxjs';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';
import { MatTableDataSource } from '@angular/material/table';


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
  quantidadeProjetosUsuario: number = 0;
  quantidadeProjetosParticipa: number = 0;
  response: any[] = [];
  projetoId: number = 1;



  totalItems!: number;
  totalIPart: number = 0;
  totalItemsPart!: boolean;
  dataSourceParticipacao: MatTableDataSource<UsuarioProjeto>;



  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.dataSourceParticipacao = new MatTableDataSource<UsuarioProjeto>([]);
  }

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
    this.carregarProjetos();
    this.carregarTarefasAtribuidas();
    this.carregarProjetosPart(this.usuario.id);
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
    let user = this.getUser();
    console.log('teste denovo', user.id);
    this.taskService.getTarefasProjeto(this.projetoId).subscribe(
      (response) => {
        this.response = response;
        console.log(response, ' diacho');
        const usuarioId = user.id; // Substitua pelo ID do usuário desejado
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

  getUser(): any {
    let user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }



  carregarProjetosPart(idUser: number) {
    this.projectService.getProjetoPart(idUser).subscribe(
      (projetosPart: UsuarioProjeto[]) => {
        const requests = projetosPart.map(projetoPart =>
          this.projectService.getProjetoById(projetoPart.projetoId).pipe(
            map(projeto => {
              projetoPart.projeto = projeto;
              return projetoPart;
            })
          )
        );

        forkJoin(requests).subscribe(
          (result: UsuarioProjeto[]) => {
            this.dataSourceParticipacao.data = result;
            this.totalItemsPart = result.length > 0;
            this.totalIPart = result.length;
            console.log('Teste dos part', this.totalIPart)
          },
          (erro) => {
            console.error('Erro ao buscar detalhes dos projetos', erro);
          }
        );
      }
    );
  }
}