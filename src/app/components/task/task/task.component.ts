import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Tarefa } from 'src/app/models/tarefa.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  novaTarefaForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskComponent>,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.novaTarefaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      observacoes: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      statusId: [1, Validators.required] // Definindo o status padrão como 1 (Analise)
    });
  }
  salvarTarefa() {
    if (this.novaTarefaForm.valid) {
      const novaTarefa: Tarefa = {
        nome: this.novaTarefaForm.get('nome')!.value,
        observacoes: this.novaTarefaForm.get('observacoes')!.value,
        dataCriacao: new Date(), // Definindo a data de criação como a data atual
        dataEntrega: this.novaTarefaForm.get('dataEntrega')!.value,
        //projetoId: null, // Defina o ID do projeto se necessário
        statusId: this.novaTarefaForm.get('statusId')!.value,
        //usuarioId:  // Defina o ID do usuário se necessário
      };
      // Lógica para salvar a tarefa (provavelmente uma chamada ao serviço)
      // Exemplo: this.tarefaService.criarTarefa(novaTarefa).subscribe(...);
      this.dialogRef.close(novaTarefa);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}