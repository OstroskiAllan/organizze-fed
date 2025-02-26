import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { Projeto } from 'src/app/models/projeto.model';
import { dateRangeValidator, startDateValidator } from 'src/app/core/validator/date-validator';

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
      dataInicio: ['', [startDateValidator]],
      dataFim: [''],
      semDataInicio: [false],
      semDataFim: [false]
    }, { validators: dateRangeValidator });

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
      dataInicioControl?.setValidators([Validators.required, startDateValidator]);
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
      const dataInicioValue = this.semDataInicio ? null : this.converterParaTimestamp(this.novoProjetoForm.get('dataInicio')!.value);
      const dataFimValue = this.semDataFim ? null : this.converterParaTimestamp(this.novoProjetoForm.get('dataFim')!.value);
  
      const novoProjeto: Projeto = {
        nome: this.novoProjetoForm.get('nome')!.value,
        descricao: this.novoProjetoForm.get('descricao')!.value,
        dataInicio: dataInicioValue,
        dataFim: dataFimValue
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
  converterParaTimestamp(dataString: string | null): number | null {
    if (!dataString) return null;
  
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.getTime(); // Retorna o timestamp em milissegundos
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
