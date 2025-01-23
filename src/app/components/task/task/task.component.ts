import { TaskService } from './../task.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Tarefa } from 'src/app/models/tarefa.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  taskForm: FormGroup;
  isEditing: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      nome: [''],
      observacoes: [''],
      dataCriacao: [''],
      dataEntrega: ['']
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.task) {
      this.taskForm.patchValue({
        nome: this.data.task.nome,
        observacoes: this.data.task.observacoes,
        dataCriacao: this.formatDate(this.data.task.dataCriacao),
        dataEntrega: this.formatDate(this.data.task.dataEntrega),
        statusId: this.data.task.statusId
      });
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  toggleEdit(field: string): void {
    this.isEditing = this.isEditing === field ? null : field;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    if (this.taskForm.valid) {
      // TODO: Salvar alterações na tarefa
      const updatedTask: Tarefa = {
        id: this.data.task.id,
        nome: this.taskForm.get('nome')!.value,
        observacoes: this.taskForm.get('observacoes')!.value,
        dataCriacao: new Date(this.taskForm.get('dataCriacao')!.value),
        dataEntrega: new Date(this.taskForm.get('dataEntrega')!.value),
        projetoId: this.data.task.projetoId,
        statusId: this.data.task.statusId,
        usuarioId: this.data.task.usuarioId,
        // TODO: Remover as outras propriedades caso necessário (dependendo do seu backend)'
      }

      this.taskService.update(updatedTask).subscribe(
        data => {
          this.taskService.showMessage('Tarefa atualizada com sucesso!');
          this.dialogRef.close(updatedTask);
          this.reload();
        },
        error => {
          this.taskService.showMessage('Erro ao atualizar tarefa!');
          console.error(error);
        }
      );
    }
  }

  reload(): void {
    window.location.reload();
 }
}