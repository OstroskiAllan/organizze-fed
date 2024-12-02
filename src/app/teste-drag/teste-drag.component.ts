import { TaskService } from './../components/task/task.service';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskComponent } from '../components/task/task/task.component';
import { TeamComponent } from '../components/team/team/team.component';
import { Router } from '@angular/router';
import { Tarefa } from '../models/tarefa.model';

interface Task {
  nome: string;
  observacoes: string;
  data_criacao: Date;
  data_entrega: Date;
  status_id: number;
  usuario_projeto_usuario_id: number;
  usuario_projeto_projeto_id: number;
  usuario_projeto_data_inicio_trabalho: Date;
  isExpanded: boolean;
  isEditing: boolean;
}

@Component({
  selector: 'app-teste-drag',
  templateUrl: './teste-drag.component.html',
  styleUrls: ['./teste-drag.component.scss']
})
export class TesteDragComponent implements OnInit{
  analyzing = ['Review code', 'Write documentation'];
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  doing = ['Work on project', 'Attend meeting'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog', 'Complete project', 'Plan next sprint', 'Team meeting', 'Client feedback', 'Refactor code', 'Push code', 'Deploy app'];
  response: any[] = [];
  // Variável para controlar a expansão da lista "Done"
  isDoneExpanded = false;

  // Número máximo de itens visíveis inicialmente
  readonly maxVisibleItems = 6;
  constructor(
    public dialog: MatDialog,
    private taskservice: TaskService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carregarTask();
  }

  carregarTask() {
    this.taskservice.getTarefasProjeto(1).subscribe(
      (response) => {
        // Aqui você pode manipular a resposta
        this.response = response
        console.log('Teste -- ', response);
      },
      (error) => {
        // Tratar erros
        console.error('Erro ao carregar tarefas:', error);
      }
    );
  }
  

  drop(event: CdkDragDrop<string[]>, fromList: string): void {
    const currentIndex = event.currentIndex;
    const previousIndex = event.previousIndex;

    const toListId = event.container.id;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, previousIndex, currentIndex);
    } else if (toListId && this.canMoveForward(fromList, toListId)) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        previousIndex,
        currentIndex
      );
    } else {
      console.log('Item cannot be moved back.');
    }
  }

  canMoveForward(fromList: string, toListId: string): boolean {
    const listOrder = ['Analyzing', 'ToDo', 'Doing', 'Done'];
    const fromIndex = listOrder.indexOf(fromList);
    const toIndex = listOrder.indexOf(toListId);

    return fromIndex <= toIndex;
  }

  // Método para alternar entre expandido e comprimido
  toggleDoneList(): void {
    this.isDoneExpanded = !this.isDoneExpanded;
  }

  openDialog(modalType: string): MatDialogRef<any> | undefined {
    let dialogRef: MatDialogRef<any> | undefined;
    //const dialogData = { projetoId: this.projetoId }; // Crie um objeto de dados com o ID do projeto

    if (modalType === 'task') {
      dialogRef = this.dialog.open(TaskComponent, {
        width: '500px',
        data: {} // Aqui você pode passar quaisquer dados necessários para o modal
      });
    } else if (modalType === 'equipe') {
      dialogRef = this.dialog.open(TeamComponent, {
        width: '800px',
        //data: dialogData  // Aqui você pode passar quaisquer dados necessários para o modal
      });
    }

    return dialogRef;
  }

  viewTaskDetails(item: any) {
    this.openDialog('task');
    // Aqui você pode abrir um modal, navegar para uma página de detalhes, ou apenas mostrar um alerta
    console.log('Detalhes da tarefa:', item);
    // Exemplo: abrir um modal (assumindo que você tenha um serviço de diálogo configurado)
    // this.dialog.open(TaskDetailsComponent, { data: item });
  }
  

}