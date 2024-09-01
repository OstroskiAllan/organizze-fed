import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tarefa } from 'src/app/models/tarefa.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  taskForm: FormGroup;
  isEditing: string | null = null;  // Variável de controle para edição

  constructor(
    public dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) public task: any,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      nome: [task.nome, Validators.required],
      observacoes: [task.observacoes],
      dataCriacao: [task.dataCriacao, Validators.required],
      dataEntrega: [task.dataEntrega, Validators.required],
    });
  }

  toggleEdit(field: string) {
    if (this.isEditing === field) {
      this.isEditing = null; // Termina a edição
    } else {
      this.isEditing = field; // Inicia a edição
    }
  }

  saveChanges() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}