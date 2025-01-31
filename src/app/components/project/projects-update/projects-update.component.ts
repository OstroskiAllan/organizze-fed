import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { startDateValidator, dateRangeValidator } from 'src/app/core/validator/date-validator';
import { Projeto } from 'src/app/models/projeto.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projects-update',
  templateUrl: './projects-update.component.html',
  styleUrls: ['./projects-update.component.scss']
})
export class ProjectsUpdateComponent implements OnInit {
  projeto!: Projeto;
  projetoId?: number;
  projetoForm!: FormGroup;


  semDataInicio = false;
  semDataFim = false;
  isEditing: string | null = null;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ProjectsUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) {
    this.projetoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: [''],
      dataInicio: ['', [startDateValidator]],
      dataFim: [''],
      semDataInicio: [false],
      semDataFim: [false]
    }, { validators: dateRangeValidator });
  }

  ngOnInit(): void {
    if (this.data) {
      this.projeto = this.data.projeto; // Extraindo o objeto projeto de data
      this.projetoId = this.data.projetoId; // Extraindo o ID do projeto de data

      this.projetoForm.patchValue({
        nome: this.projeto.nome || '',
        descricao: this.projeto.descricao || '',
        dataInicio: this.projeto.dataInicio ? new Date(this.projeto.dataInicio).toISOString().split('T')[0] : null,
        dataFim: this.projeto.dataFim ? new Date(this.projeto.dataFim).toISOString().split('T')[0] : null,
        semDataInicio: !this.projeto.dataInicio,
        semDataFim: !this.projeto.dataFim
      });
    }

    this.projetoForm.get('semDataInicio')?.valueChanges.subscribe((checked) => {
      this.toggleDataInicio(checked);
    });

    this.projetoForm.get('semDataFim')?.valueChanges.subscribe((checked) => {
      this.toggleDataFim(checked);
    });

  }

  salvarProjeto(): void {
    if (this.projetoForm.valid) {
      const projeto: Projeto = {
        nome: this.projetoForm.get('nome')!.value,
        descricao: this.projetoForm.get('descricao')!.value,
        dataInicio: this.semDataInicio ? null : this.projetoForm.get('dataInicio')!.value,
        dataFim: this.semDataFim ? null : this.projetoForm.get('dataFim')!.value
      };
      
      console.log('salvarProjeto', this.data.projetoId);

      this.projectService.updateProjeto(projeto, this.data.projetoId).subscribe(
        data => {
          this.projectService.showMessage("Projeto atualizado com sucesso!");
          this.closeDialog();
          this.reload();
        },
        error => {
          this.projectService.showMessage("Ocorreu um erro ao cadastrar o projeto." + error);
        }
      );
    }
  }
  arquivarProjeto(){
    
  }

  toggleEdit(field: string): void {
    this.isEditing = this.isEditing === field ? null : field;
  }

  toggleDataInicio(checked: boolean): void {
    this.semDataInicio = checked;
    const dataInicioControl = this.projetoForm.get('dataInicio');
    if (checked) {
      dataInicioControl?.clearValidators();
    } else {
      dataInicioControl?.setValidators([Validators.required, startDateValidator]);
    }
    dataInicioControl?.updateValueAndValidity();
  }

  toggleDataFim(checked: boolean): void {
    this.semDataFim = checked;
    const dataFimControl = this.projetoForm.get('dataFim');
    if (checked) {
      dataFimControl?.clearValidators();
    } else {
      dataFimControl?.setValidators(Validators.required);
    }
    dataFimControl?.updateValueAndValidity();
  }

  reload(): void {
    window.location.reload();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  metlog(){
    console.log('metlog ----');
  }
}

