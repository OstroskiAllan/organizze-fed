import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { TaskComponent } from '../task/task/task.component';
import { TeamComponent } from '../team/team/team.component';

@Component({
  selector: 'dash-project',
  templateUrl: './dash-project.component.html',
  styleUrls: ['./dash-project.component.scss']
})
export class DashProjectComponent implements OnInit {
  usuario!: Usuario;
  projeto!: Projeto;
  tarefas!: Tarefa;
  projetoId?: number;

  done: any[] = [];
  todo: any[] = [];
  work: any[] = [];

  selectedTask: any;
  constructor(
    private projetoService: ProjectService, 
    private route: ActivatedRoute, 
    public dialog: MatDialog, 
    private tarefaService: TaskService
  ) { }



  ngOnInit(): void {
    //this.carregarTarefas();
    this.carregarDadosProjeto();
    this.projetoId = +this.route.snapshot.params['id'];
  }
  carregarDadosProjeto() {
    const projetoId = +this.route.snapshot.params['id'];
    this.projetoService.getProjetoById(projetoId).subscribe(projeto => {
      this.projeto = projeto;
      // Recupere as tabelas do projeto
      // this.projetoService.getTabelasDoProjeto(projetoId).subscribe(tabela => {
      //   this.tabela = tabela;

    });
  }

  carregarTarefas() {
    const projetoId = +this.route.snapshot.params['id'];

    this.tarefaService.getTarefasProjeto(projetoId).subscribe(
      (tarefas) => {
        this.tarefas = tarefas;
      },
      (error) => {
        console.error('Erro ao carregar as tarefas:', error);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  openDialog(modalType: string): MatDialogRef<any> | undefined {
    let dialogRef: MatDialogRef<any> | undefined;
    const dialogData = { projetoId: this.projetoId }; // Crie um objeto de dados com o ID do projeto

    if (modalType === 'task') {
      dialogRef = this.dialog.open(TaskComponent, {
        width: '500px',
        data: {} // Aqui você pode passar quaisquer dados necessários para o modal
      });
    } else if (modalType === 'equipe') {
      dialogRef = this.dialog.open(TeamComponent, {
        width: '800px',
        data: dialogData  // Aqui você pode passar quaisquer dados necessários para o modal
      });
    }

    return dialogRef;
  }
}