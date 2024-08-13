import { UsuarioProjeto } from './../../../models/usuarioprojeto.model';
import { ProjectService } from './../../project/project.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskComponent } from '../../task/task/task.component';
import { TeamComponent } from '../team/team.component';
import { Projeto } from 'src/app/models/projeto.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'team-read',
  templateUrl: './team-read.component.html',
  styleUrls: ['./team-read.component.scss']
})
export class TeamReadComponent implements OnInit {
  projeto!: Projeto;
  team: UsuarioProjeto[] = [];

  projetosPart:  UsuarioProjeto[] = [];

  constructor(
    public dialogRef: MatDialogRef<TeamComponent>,
    public projetoService: ProjectService,
    public dialog: MatDialog,
    private route: ActivatedRoute, 

  ) { }

  ngOnInit() {
    this.carregarDadosProjeto();
    this.carregarTeam(1);
  }
  carregarDadosProjeto() {
    const projetoId = +this.route.snapshot.params['id'];
    this.projetoService.getProjetoById(projetoId).subscribe(projeto => {
      this.projeto = projeto;
    });
  }
  carregarTeam(idProjeto: number) {
    this.projetoService.getTeamProjetoId(idProjeto).subscribe(
      (team: UsuarioProjeto[]) => {
        // Array de observáveis para obter os nomes dos usuários
        const requests = team.map(usuario =>
          this.projetoService.getUserNameById(usuario.usuarioId).pipe(
            map(nome => {
              // Atualiza o objeto usuario com o nome
              return { ...usuario, nome };
            })
          )
        );
  
        // Executa todas as requisições e aguarda a conclusão
        forkJoin(requests).subscribe(
          (result: UsuarioProjeto[]) => {
            // Atualiza a equipe com os nomes dos usuários
            this.team = result;
          },
          (erro) => {
            console.error('Erro ao buscar detalhes dos projetos', erro);
          }
        );
      },
      (erro) => {
        console.error('Erro ao buscar equipe do projeto', erro);
      }
    );
  }
  

  fecharDialog(): void {
    this.dialogRef.close();
  }
}
