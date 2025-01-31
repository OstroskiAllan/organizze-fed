import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';
import { ModalConfirmacaoComponent } from 'src/app/views/template/modal-confirmacao/modal-confirmacao.component';
import { AuthService } from '../../auth/auth.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projects-read',
  templateUrl: './projects-read.component.html',
  styleUrls: ['./projects-read.component.scss']
})
export class ProjectsReadComponent implements OnInit, AfterViewInit {
  @ViewChild('paginatorProjetos') paginatorProjetos!: MatPaginator;
  @ViewChild('paginatorParticipacao') paginatorParticipacao!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nome', 'descricao', 'data_inicio', 'data_fim'];
  projectColumns: string[] = ['nome', 'descricao', 'cargo'];
  
  dataSourceProjetos: MatTableDataSource<any>;
  dataSourceParticipacao: MatTableDataSource<UsuarioProjeto>;
  
  totalItems!: number;
  totalIPart!: number;
  totalItemsPart!: boolean;

  constructor(
    private authService: AuthService, 
    private projectService: ProjectService,
    private router: Router, 
    public dialog: MatDialog
  ) {
    this.dataSourceProjetos = new MatTableDataSource<any>([]);
    this.dataSourceParticipacao = new MatTableDataSource<UsuarioProjeto>([]);
  }

  ngOnInit(): void {
    this.carregarProjetos();
    this.carregarProjetosPart(1);
  }

  ngAfterViewInit(): void {
    this.dataSourceProjetos.paginator = this.paginatorProjetos;
    this.dataSourceProjetos.sort = this.sort;
    this.dataSourceParticipacao.paginator = this.paginatorParticipacao;
  }

  carregarProjetos() {
    this.projectService.getProjetos().subscribe(
      (projetos) => {
        this.dataSourceProjetos.data = projetos;
        this.totalItems = projetos.length;
      },
      (erro) => {
        console.error('Erro ao buscar projetos', erro);
      }
    );
  }

  carregarProjetosPart(idUser: number) {
    this.projectService.getProjetoPart(idUser).subscribe(
      (projetosPart: UsuarioProjeto[]) => {
        const requests = projetosPart.map(projetoPart =>
          this.projectService.getProjetoById(projetoPart.projetoId).pipe(
            map(projeto => {
              projetoPart.projeto = projeto;
              return projetoPart;
            })
          )
        );

        forkJoin(requests).subscribe(
          (result: UsuarioProjeto[]) => {
            this.dataSourceParticipacao.data = result;
            this.totalItemsPart = result.length > 0;
            this.totalIPart = result.length;
          },
          (erro) => {
            console.error('Erro ao buscar detalhes dos projetos', erro);
          }
        );
      }
    );
  }
  abrirDialogoConfirmacao(projetoId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProjeto(projetoId);
      }
    });
  }

  deleteProjeto(projetoId: number): void {
    this.projectService.deleteProjeto(projetoId).subscribe(() => {
      this.projectService.showMessage('Projeto excluído com sucesso!');
      this.carregarProjetos();
    }, (error) => {
      this.projectService.showMessage('Erro ao excluir projeto ' + projetoId);
    });
  }

  abrirDetalhes(projetoId: number): void {
    this.router.navigate(['/project/', projetoId]);
  }

  editarProjeto(projetoId: number): void {
    // Implemente a lógica para abrir o projeto, por exemplo, navegar para uma rota específica
  }
}