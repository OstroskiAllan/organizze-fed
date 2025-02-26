import { TaskComponent } from './../../task/task/task.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Tarefa } from 'src/app/models/tarefa.model';
import { TaskService } from '../../task/task.service';
import { ModalConfirmacaoComponent } from 'src/app/views/template/modal-confirmacao/modal-confirmacao.component';


@Component({
  selector: 'taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss']
})
export class TaskboardComponent implements OnInit {
  todo: Tarefa[] = [];
  doing: Tarefa[] = [];
  analyzing: Tarefa[] = [];
  done: Tarefa[] = [];

  response: any[] = [];

  // Variável para controlar a expansão da lista "Done"
  isDoneExpanded = false;

  // Número máximo de itens visíveis inicialmente
  readonly maxVisibleItems = 5;
  projetoId!: number;

  constructor(
    public dialog: MatDialog,
    private taskservice: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projetoId = +(params.get('id') ?? 0);
      this.carregarTask();
    });
  }
  arquivarTask(item: any) {
    this.openConfirmacaoDialog('Você tem certeza que deseja arquivar a tarefa?')
      .then(result => {
        if (result) {
          console.log('Arquivar tarefa', item);
          item.statusId = 5;
          item.usuarioId = null;
          this.taskservice.update(item).subscribe(
            () => {
              console.log('Tarefa atualizada com sucesso.');
              this.reload();
            },
            (error) => {
              console.error('Erro ao atualizar tarefa:', error);
            });
          // this.reload();
          console.log('Ação confirmada pelo usuário', item);
        } else {
          console.log('Ação cancelada pelo usuário', item);
        }
      });

  }



  carregarTask() {
    this.taskservice.getTarefasProjeto(this.projetoId).subscribe(
      (response) => {
        // Aqui você pode manipular a resposta
        this.response = response
        this.distribuirTarefas(response);

        response.forEach(tarefa => {
          this.taskservice.getNome(tarefa.usuarioId).subscribe(
            (nomeResponse) => {
              tarefa.nomeUsuario = nomeResponse;
            },
            (error) => {
              console.error('Erro ao carregar nome do usuário:', error);
            }
          );
        });
      },
      (error) => {
        // Tratar erros
        console.error('Erro ao carregar tarefas:', error);
      }
    );
  }

  distribuirTarefas(tarefas: Tarefa[]) {
    this.todo = [];
    this.doing = [];
    this.analyzing = [];
    this.done = [];

    tarefas.forEach(tarefa => {
      switch (tarefa.statusId) {
        case 1:
          this.todo.push(tarefa);
          break;
        case 2:
          this.doing.push(tarefa);
          break;
        case 3:
          this.analyzing.push(tarefa);
          break;
        case 4:
          this.done.push(tarefa);
          break;
        default:
          break;
      }
    });
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

  drop(event: CdkDragDrop<Tarefa[]>, fromList: string): void {
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

      // Atualizar o status da tarefa
      const movedTask: Tarefa = event.container.data[currentIndex];
      movedTask.statusId = this.getStatusIdFromListId(toListId);
      this.taskservice.update(movedTask).subscribe(
        () => {
          console.log('Tarefa atualizada com sucesso.');
        },
        (error) => {
          console.error('Erro ao atualizar tarefa:', error);
        });
    } else {
      console.log('Item cannot be moved back.');
    }
  }

  getStatusIdFromListId(listId: string): number {
    switch (listId) {
      case 'ToDo':
        return 1;
      case 'Doing':
        return 2;
      case 'Analyzing':
        return 3;
      case 'Done':
        return 4;
      default:
        return 0;
    }
  }

  canMoveForward(fromList: string, toListId: string): boolean {
    const listOrder = ['ToDo', 'Doing', 'Analyzing', 'Done'];
    const fromIndex = listOrder.indexOf(fromList);
    const toIndex = listOrder.indexOf(toListId);

    return fromIndex <= toIndex;
  }

  // Método para alternar entre expandido e comprimido
  toggleDoneList(): void {
    this.isDoneExpanded = !this.isDoneExpanded;
  }
  reload(): void {
    window.location.reload();
  }
  openConfirmacaoDialog(texto: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '450px',
      data: { texto: texto }
    });

    return dialogRef.afterClosed().toPromise();
  }
}