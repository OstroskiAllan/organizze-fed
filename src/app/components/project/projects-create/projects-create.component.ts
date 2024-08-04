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
export class ProjectsCreateComponent  implements OnInit {
  novoProjetoForm!: FormGroup;

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
      dataInicio: [''],
      dataFim: ['']
    });
  }


  salvarProjeto() {
    if (this.novoProjetoForm.valid) {
      const novoProjeto: Projeto = {
        nome: this.novoProjetoForm.get('nome')!.value,
        descricao: this.novoProjetoForm.get('descricao')!.value,
        dataInicio: this.novoProjetoForm.get('dataInicio')!.value,
        dataFim: this.novoProjetoForm.get('dataFim')!.value
      };

      this.projectService.create(novoProjeto).subscribe(
        data => {
          this.projectService.showMessage("Projeto cadastrado com sucesso!");
          this.reload();
          this.closeDialog();
        },
        error => {
          this.projectService.showMessage("Ocorreu um erro ao cadastrar o projeto." + error);
        }
      );
    }
  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['projeto']);
    });
  }

  formatarData(data: Date) {
    if (data instanceof Date) {
      return formatDate(data, 'yyyy-MM-dd', 'en-US'); // Formata a data no formato desejado
    } else {
      // Se a data for uma string, assume-se que já está no formato desejado
      return data;
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}