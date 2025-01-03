import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { Projeto } from 'src/app/models/projeto.model';

@Component({
  selector: 'app-projects-create',
  templateUrl: './projects-create.component.html',
  styleUrls: ['./projects-create.component.scss']
})
export class ProjectsCreateComponent implements OnInit {
  novoProjetoForm!: FormGroup;
  semDataInicio = false;
  semDataFim = false;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ProjectsCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.novoProjetoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: [''],
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]],
      semDataInicio: [false],
      semDataFim: [false]
    });

    this.novoProjetoForm.get('semDataInicio')?.valueChanges.subscribe((checked) => {
      this.toggleDataInicio(checked);
    });

    this.novoProjetoForm.get('semDataFim')?.valueChanges.subscribe((checked) => {
      this.toggleDataFim(checked);
    });
  }

  toggleDataInicio(checked: boolean): void {
    this.semDataInicio = checked;
    const dataInicioControl = this.novoProjetoForm.get('dataInicio');
    if (checked) {
      dataInicioControl?.clearValidators();
    } else {
      dataInicioControl?.setValidators(Validators.required);
    }
    dataInicioControl?.updateValueAndValidity();
  }

  toggleDataFim(checked: boolean): void {
    this.semDataFim = checked;
    const dataFimControl = this.novoProjetoForm.get('dataFim');
    if (checked) {
      dataFimControl?.clearValidators();
    } else {
      dataFimControl?.setValidators(Validators.required);
    }
    dataFimControl?.updateValueAndValidity();
  }

  salvarProjeto(): void {
    if (this.novoProjetoForm.valid) {
      const novoProjeto: Projeto = {
        nome: this.novoProjetoForm.get('nome')!.value,
        descricao: this.novoProjetoForm.get('descricao')!.value,
        dataInicio: this.semDataInicio ? null : this.novoProjetoForm.get('dataInicio')!.value,
        dataFim: this.semDataFim ? null : this.novoProjetoForm.get('dataFim')!.value
      };

      this.projectService.create(novoProjeto).subscribe(
        data => {
          this.projectService.showMessage("Projeto cadastrado com sucesso!");
          this.closeDialog();
          this.reload();
        },
        error => {
          this.projectService.showMessage("Ocorreu um erro ao cadastrar o projeto." + error);
        }
      );
    }
  }

  reload(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['projects']);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
