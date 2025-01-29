import { TaskService } from './../task.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tarefa } from 'src/app/models/tarefa.model';
import { dateRangeValidator, startDateValidator } from 'src/app/core/validator/date-validator';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  novaTarefaForm!: FormGroup;
  semDataInicio = false;
  semDataEntrega = false;
  projetoId!: number;
  idDoProjeto!: number;
  selectedUserId!: number;

  constructor(
    public dialogRef: MatDialogRef<TaskCreateComponent>,
    private formBuilder: FormBuilder,
    private tarefaService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){ this.projetoId = data.projetoId;}

  ngOnInit(): void {
    this.novaTarefaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      observacoes: ['', Validators.required],
      dataCriacao: ['', [startDateValidator]],
      dataEntrega: [''],
      statusId: [1, Validators.required], // Definindo o status padrão como 1 (Analise)
      usuarioId: [null]
    },{ validators: dateRangeValidator });
    
    this.novaTarefaForm.get('semDataInicio')?.valueChanges.subscribe((checked) => {
      this.toggleDataInicio(checked);
    });

    this.novaTarefaForm.get('semDataEntrega')?.valueChanges.subscribe((checked) => {
      this.toggleDataEntrega(checked);
    });

    this.idDoProjeto = this.projetoId; // importante 
  }

  salvarTarefa() {
    if (this.novaTarefaForm.valid) {
      const usuarioId = this.novaTarefaForm.get('usuarioId')?.value; 
      console.log('usuario id --------', usuarioId);

      const novaTarefa: Tarefa = {
        nome: this.novaTarefaForm.get('nome')!.value,
        observacoes: this.novaTarefaForm.get('observacoes')!.value,
        dataCriacao: new Date(), // Definindo a data de criação como a data atual
        dataEntrega: this.semDataEntrega ? undefined : this.novaTarefaForm.get('dataEntrega')!.value,
        projetoId: this.projetoId, 
        statusId: this.novaTarefaForm.get('statusId')!.value,
        usuarioId: usuarioId 
      };

      console.log('Objeto tarefa antes de salvar:', novaTarefa);
      this.tarefaService.create(novaTarefa).subscribe(
        data => {
          this.tarefaService.showMessage("Tarefa cadastrada com sucesso!");
          console.log('data ?()     ---',data);
          console.log('data ?()     ---',novaTarefa);
          this.closeDialog();
          this.reload();
        },
        error => {
          this.tarefaService.showMessage("Erro ao cadastrar tarefa!");
          console.error(error);
        }
      );
    }
  }

  onUsuarioSelecionado(usuarioId: number): void {
    this.selectedUserId = usuarioId;
    this.novaTarefaForm.get('usuarioId')?.setValue(this.selectedUserId); // Atualiza o valor no formulário
  }

  reload(): void {
     window.location.reload();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleDataInicio(checked: boolean): void {
      this.semDataInicio = checked;
      const dataInicioControl = this.novaTarefaForm.get('dataInicio');
      if (checked) {
        dataInicioControl?.clearValidators();
      } else {
        dataInicioControl?.setValidators([Validators.required, startDateValidator]);
      }
      dataInicioControl?.updateValueAndValidity();
    }
  
    toggleDataEntrega(checked: boolean): void {
      this.semDataEntrega = checked;
      const dataEntregaControl = this.novaTarefaForm.get('dataEntrega');
      if (checked) {
        dataEntregaControl?.clearValidators();
        dataEntregaControl?.setValue('');
      } else {
        dataEntregaControl?.setValidators(Validators.required);
      }
      dataEntregaControl?.updateValueAndValidity();
    }
}