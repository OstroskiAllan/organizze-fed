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
  idDoProjeto!: number;
  selectedUserId!: number;
  //usuarioId!: number;
  usuarioNome?: any;


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
      dataEntrega: [''],
      usuarioId: [null]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.task) {
      this.taskForm.patchValue({
        nome: this.data.task.nome,
        observacoes: this.data.task.observacoes,
        dataCriacao: this.data.task.dataCriacao ? this.formatDate(this.data.task.dataCriacao) : '',
        dataEntrega: this.data.task.dataEntrega ? this.formatDate(this.data.task.dataEntrega) : '',
        statusId: this.data.task.statusId,
        usuarioId: this.data.task.usuarioId || null
      });
    }

    
    
    // this.pro = this.data.task.projetoId;
    // console.log( 'aaaaaaaaaaaaaaaaa -----',this.pro);
    // this.checkDataEntrega();

    // Chama o método getNome para obter o nome do usuário
    if (this.data.task.usuarioId) {
      this.taskService.getNome(this.data.task.usuarioId).subscribe(
        (nomeResponse) => {
          this.usuarioNome = nomeResponse;
          console.log('Nome do usuário:', this.usuarioNome);
        },
        (error) => {
          console.error('Erro ao carregar nome do usuário:', error);
        }
      );
    }
    console.log('Task:', this.data.task.projetoId);
    this.idDoProjeto =  this.data.task.projetoId;
  }

  saveChanges(): void {
    if (this.taskForm.valid) {
      const usuarioId = this.taskForm.get('usuarioId')?.value; 
      console.log('usuarioId:', usuarioId);
      // TODO: Salvar alterações na tarefa

      const updatedTask: Tarefa = {
        id: this.data.task.id,
        nome: this.taskForm.get('nome')!.value,
        observacoes: this.taskForm.get('observacoes')!.value,
        dataCriacao: new Date(this.taskForm.get('dataCriacao')!.value),
        dataEntrega: this.taskForm.get('dataEntrega')!.value ? new Date(this.taskForm.get('dataEntrega')!.value) : null,
        projetoId: this.data.task.projetoId,
        statusId: this.data.task.statusId,
        usuarioId: usuarioId,
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

  onUsuarioSelecionado(usuarioId: number): void {
    this.selectedUserId = usuarioId;
    this.taskForm.get('usuarioId')?.setValue(this.selectedUserId); 
    // Atualiza o valor no formulário
    console.log('usuario id', usuarioId);
    
  }
  formatDate(date: any): string {
    if (!date) return ''; // Retorna uma string vazia se a data estiver indefinida

    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  reload(): void {
    window.location.reload();
  }

  toggleEdit(field: string): void {
    this.isEditing = this.isEditing === field ? null : field;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}