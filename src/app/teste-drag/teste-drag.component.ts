import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
}

@Component({
  selector: 'app-teste-drag',
  templateUrl: './teste-drag.component.html',
  styleUrls: ['./teste-drag.component.scss']
})
export class TesteDragComponent {
  analyzing: Task[] = [
    { nome: 'Review code', observacoes: 'Check for bugs', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Write documentation', observacoes: 'Update API docs', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false }
  ];

  todo: Task[] = [
    { nome: 'Get to work', observacoes: 'Prepare for the day', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Pick up groceries', observacoes: 'Buy essential items', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Go home', observacoes: 'Relax after work', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Fall asleep', observacoes: 'Get a good night\'s rest', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false }
  ];

  doing: Task[] = [
    { nome: 'Work on project', observacoes: 'Complete tasks for the project', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Attend meeting', observacoes: 'Discuss project status', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false }
  ];

  done: Task[] = [
    { nome: 'Get up', observacoes: 'Morning routine', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Brush teeth', observacoes: 'Hygiene task', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Take a shower', observacoes: 'Freshen up', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Check e-mail', observacoes: 'Respond to important messages', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false },
    { nome: 'Walk dog', observacoes: 'Exercise and fresh air', data_criacao: new Date(), data_entrega: new Date(), status_id: 1, usuario_projeto_usuario_id: 1, usuario_projeto_projeto_id: 1, usuario_projeto_data_inicio_trabalho: new Date(), isExpanded: false }
  ];

  isDoneExpanded = false;
  readonly maxVisibleItems = 10;

  drop(event: CdkDragDrop<Task[]>): void {
    const currentIndex = event.currentIndex;
    const previousIndex = event.previousIndex;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, previousIndex, currentIndex);
    } else {
      if (this.canMoveForward(event.previousContainer.id, event.container.id)) {
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
  }

  canMoveForward(fromListId: string, toListId: string): boolean {
    const listOrder = ['analyzingList', 'todoList', 'doingList', 'doneList'];
    const fromIndex = listOrder.indexOf(fromListId);
    const toIndex = listOrder.indexOf(toListId);

    return fromIndex <= toIndex;
  }

  toggleDoneList(): void {
    this.isDoneExpanded = !this.isDoneExpanded;
  }

  toggleTaskDetails(task: Task, list: Task[]): void {
    // Collapse all tasks in the list first
    list.forEach(t => {
      if (t !== task) {
        t.isExpanded = false;
      }
    });

    // Toggle the selected task
    task.isExpanded = !task.isExpanded;
  }
}
