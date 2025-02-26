import { TaskService } from './../task.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tarefa } from 'src/app/models/tarefa.model';
import { dateRangeValidator, startDateValidator} from 'src/app/core/validator/date-validator';

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
  ) {
    this.projetoId = data.projetoId;
  }

  ngOnInit(): void {
    this.novaTarefaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      observacoes: ['', Validators.required],
      dataCriacao: ['', [startDateValidator]],
      dataEntrega: [''],
      semDataInicio: [false],  // Adicionando os campos de checkbox ao FormGroup
      semDataEntrega: [false],
      statusId: [1, Validators.required],
      usuarioId: [null]
    }, { validators: dateRangeValidator });

    this.idDoProjeto = this.projetoId;
  }

  salvarTarefa() {
    if (this.novaTarefaForm.valid) {
      const usuarioId = this.novaTarefaForm.get('usuarioId')?.value;

      const dataInicioValue = this.semDataInicio ? null : this.converterParaTimestamp(this.novaTarefaForm.get('dataCriacao')!.value);
      const dataEntregaValue = this.semDataEntrega ? null : this.converterParaTimestamp(this.novaTarefaForm.get('dataEntrega')!.value);
  

      const novaTarefa: Tarefa = {
        nome: this.novaTarefaForm.get('nome')!.value,
        observacoes: this.novaTarefaForm.get('observacoes')!.value,
        dataCriacao: dataInicioValue,
        dataEntrega: dataEntregaValue,
        projetoId: this.projetoId,
        statusId: this.novaTarefaForm.get('statusId')!.value,
        usuarioId: usuarioId
      };

      this.tarefaService.create(novaTarefa).subscribe(
        data => {
          this.tarefaService.showMessage("Tarefa cadastrada com sucesso!");
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
    this.novaTarefaForm.get('usuarioId')?.setValue(this.selectedUserId);
  }

  reload(): void {
    window.location.reload();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleDataInicio(checked: boolean): void {
    this.semDataInicio = checked;
    this.novaTarefaForm.patchValue({ semDataInicio: checked });

    const dataInicioControl = this.novaTarefaForm.get('dataCriacao');
    if (checked) {
      dataInicioControl?.clearValidators();
      dataInicioControl?.setValue('');
    } else {
      dataInicioControl?.setValidators([Validators.required, startDateValidator]);
    }
    dataInicioControl?.updateValueAndValidity();
  }

  toggleDataEntrega(checked: boolean): void {
    this.semDataEntrega = checked;
    this.novaTarefaForm.patchValue({ semDataEntrega: checked });

    const dataEntregaControl = this.novaTarefaForm.get('dataEntrega');
    if (checked) {
      dataEntregaControl?.clearValidators();
      dataEntregaControl?.setValue('');
    } else {
      dataEntregaControl?.setValidators(Validators.required);
    }
    dataEntregaControl?.updateValueAndValidity();
  }

  converterParaTimestamp(dataString: string | null): number | null {
    if (!dataString) return null;
  
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.getTime(); // Retorna o timestamp em milissegundos
  }
}