import { Component, OnInit, ViewChild } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from '../task/task/task.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  projetos: Projeto[] = [];
  tarefas: Tarefa[] = [];
  projetosProximos: Projeto[] = [];
  tarefasProximas: Tarefa[] = [];

  // Controles de exibição
  mostrarProjetos = false;
  mostrarTarefas = false;
  dataFiltro: Date = new Date();

  // Paginação
  pageSize = 5;
  pageIndexProjetos = 0;
  pageIndexTarefas = 0;

  @ViewChild('paginatorProjetos') paginatorProjetos!: MatPaginator;
  @ViewChild('paginatorTarefas') paginatorTarefas!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  viewTaskDetails(task: any) {
    this.openDialog(task);
  }

  openDialog(task: any): void {
    const dialogRef = this.dialog.open(TaskComponent, {
      width: '600px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  abrirProjeto(projetoId: any) {
    this.router.navigate(['/project/', projetoId]);
  }

  carregarProjetos(): void {
    this.projectService.getProjetos().subscribe(
      (projetos: Projeto[]) => {
        this.projetos = projetos;
        this.projetosProximos = this.getProjetosProximosDaData();
        this.carregarTarefasDosProjetos();
      },
      (error) => {
        console.error('Erro ao carregar projetos:', error);
      }
    );
  }

  carregarTarefasDosProjetos(): void {
    this.tarefas = []; // Limpa a lista de tarefas antes de carregar
    this.projetos.forEach(projeto => {
      if (projeto.id) {
        this.taskService.getTarefasProjeto(projeto.id).subscribe(
          (tarefas: Tarefa[]) => {
            this.tarefas = this.tarefas.concat(tarefas);
            this.tarefasProximas = this.getTarefasProximasDaData();
          },
          (error) => {
            console.error(`Erro ao carregar tarefas do projeto ${projeto.id}:`, error);
          }
        );
      }
    });
  }

  getProjetosProximosDaData(): Projeto[] {
    if (!this.dataFiltro) return this.projetos; // Se não houver filtro, retorna todos os projetos
    // console.log("Projetos" + this.dataFiltro);
    // const hoje = new Date();
    return this.projetos.filter(projeto => {
      if (projeto.dataFim) {
        const dataFim = new Date(projeto.dataFim);
        return dataFim <= this.dataFiltro; 
        // const diferenca = dataFim.getTime() - hoje.getTime();
        // const diasParaDataFim = diferenca / (1000 * 3600 * 24);
        // return diasParaDataFim <= 7; // Projetos com data de entrega em até 7 dias
      }
      return false;
    });
  }

  getTarefasProximasDaData(): Tarefa[] {
    if (!this.dataFiltro) return this.tarefas; // Se não houver filtro, retorna todas as tarefas

    const hoje = new Date();
    return this.tarefas.filter(tarefa => {
      if (tarefa.dataEntrega) {
        const dataEntrega = new Date(tarefa.dataEntrega);
        // const diferenca = dataEntrega.getTime() - hoje.getTime();
        // const diasParaDataEntrega = diferenca / (1000 * 3600 * 24);
        // return diasParaDataEntrega <= 60; // Tarefas com data de entrega em até 7 dias
        return dataEntrega <= this.dataFiltro; // Filtra tarefas até a data escolhida
      
      }
      return false;
    });
  }

  getNomeProjeto(projetoId: any): string {
    const projeto = this.projetos.find(p => p.id === projetoId);
    return projeto ? projeto.nome : 'Projeto não encontrado';
  }

  // Métodos para paginação
  onPageChangeProjetos(event: PageEvent): void {
    this.pageIndexProjetos = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onPageChangeTarefas(event: PageEvent): void {
    this.pageIndexTarefas = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Métodos para exibir/recolher listas
  toggleProjetos(): void {
    this.mostrarProjetos = !this.mostrarProjetos;
  }

  toggleTarefas(): void {
    this.mostrarTarefas = !this.mostrarTarefas;
  }

 onDataFiltroChange(event: any) {
    this.projetosProximos = this.getProjetosProximosDaData();
    this.tarefasProximas = this.getTarefasProximasDaData();
  }



  
}