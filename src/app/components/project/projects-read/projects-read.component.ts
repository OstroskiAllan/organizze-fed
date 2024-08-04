import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { ModalConfirmacaoComponent } from 'src/app/views/template/modal-confirmacao/modal-confirmacao.component';

@Component({
  selector: 'app-projects-read',
  templateUrl: './projects-read.component.html',
  styleUrls: ['./projects-read.component.scss']
})
export class ProjectsReadComponent  implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nome', 'descricao', 'data_criacao', 'data_inicio', 'data_fim', 'actions'];
  projetos: any[] = [];
  totalItems!: number;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private projectService: ProjectService, private router: Router, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.carregarProjetos();
  }

  ngAfterViewInit(): void {
    // Configurar MatSort e MatPaginator após a visualização dos componentes
    if (this.sort && this.paginator) {
      this.sort.sortChange.subscribe(() => this.carregarProjetos());
      this.paginator.page.subscribe(() => this.carregarProjetos());
    }
  }

  carregarProjetos() {
    this.projectService.getProjetos().subscribe(
      (projetos) => {
        // Ordenar os projetos
        const projetosOrdenados = this.getSortedData(projetos);
        // Paginar os projetos
        this.projetos = this.getPagedData(projetosOrdenados);
        this.totalItems = projetos.length;
      },
      (erro) => {
        console.error('Erro ao buscar projetos', erro);
      }
    );
  }


  abrirDialogoConfirmacao(projetoId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Excluir o projeto aqui
        this.deleteProjeto(projetoId);
      }
    });
  }
  deleteProjeto(projetoId: number): void {
    this.projectService.deleteProjeto(projetoId).subscribe(() => {
      this.projectService.showMessage('Projeto excluído com sucesso!');
      this.carregarProjetos(); // Atualiza a lista após a exclusão
    }, (error) => {
      this.projectService.showMessage('Erro ao excluir projeto ' + projetoId);
    });
  }

  abrirDetalhes(projetoId: number): void{
    this.router.navigate(['/projeto/', projetoId]);
  }

  editarProjeto(projetoId: number): void {
    // Implemente a lógica para abrir o projeto, por exemplo, navegar para uma rota específica
  }

  private getPagedData(data: any[]): any[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.slice(startIndex, startIndex + this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: any[]): any[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    const isAsc = this.sort && this.sort.direction === 'asc'; // Verifica se sort é definido
    return data.sort((a, b) => {
      switch (this.sort && this.sort.active) { // Verifica se sort.active é definido
        case 'nome': return ProjectsReadComponent.compare(a.nome, b.nome, isAsc);
        case 'descricao': return ProjectsReadComponent.compare(a.descricao, b.descricao, isAsc);
        case 'data_criacao': return ProjectsReadComponent.compare(a.data_criacao, b.data_criacao, isAsc);
        case 'data_inicio': return ProjectsReadComponent.compare(a.data_inicio, b.data_inicio, isAsc);
        case 'data_fim': return ProjectsReadComponent.compare(a.data_fim, b.data_fim, isAsc);
        default: return 0;
      }
    });
  }

  static compare(a: string | number | Date, b: string | number | Date, isAsc: boolean | undefined): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}



