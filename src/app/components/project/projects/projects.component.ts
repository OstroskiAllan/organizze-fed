import { Component, OnInit } from '@angular/core';
import { ProjectsCreateComponent } from '../projects-create/projects-create.component';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'descricao', 'data_criacao', 'data_inicio', 'data_fim', 'actions'];
  projetos: any[] = [];

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  constructor(private projetoService: ProjectService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos() {
    this.projetoService.getProjetos().subscribe(
      (projetos) => {
        this.projetos = projetos;
      },
      (erro) => {
        console.error('Erro ao buscar projetos', erro);
      }
    );
  }

  openProjeto(projetoId: number): void {
    // Implemente a lógica para abrir o projeto, por exemplo, navegar para uma rota específica
  }


  deleteProjeto(projetoId: number): void {
    this.projetoService.deleteProjeto(projetoId).subscribe(() => {
      this.projetoService.showMessage('Projeto excluído com sucesso!');
      this.carregarProjetos(); // Atualiza a lista após a exclusão
    }, (error) => {
      this.projetoService.showMessage('Erro ao excluir projeto' +  error);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectsCreateComponent, {
      width: '500px',
      data: {} // Aqui você pode passar quaisquer dados necessários para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado');
      this.carregarProjetos();
    });
    this.carregarProjetos();
  }
}