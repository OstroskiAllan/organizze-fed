import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, forkJoin } from 'rxjs';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';
import { ProjectService } from '../../project/project.service';
import { TeamComponent } from '../team/team.component';

@Component({
  selector: 'team-delegate',
  templateUrl: './team-delegate.component.html',
  styleUrls: ['./team-delegate.component.scss']
})
export class TeamDelegateComponent implements OnInit {

  team: UsuarioProjeto[] = [];
  projetoId!: number;
  form: FormGroup;
 

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TeamComponent>,
    public projetoService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projetoId = data.projetoId;
    this.form = this.fb.group({
      selectedMember: [null,]
    });
  }

  ngOnInit(): void {
    this.carregarTeam(1); // codigo verificar depois
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

  // get selectedMember() {
  //   return this.form.get('selectedMember')?.value;
  // }

  // onSubmit() {
  //   const selectedMember = this.selectedMember;
  //   console.log('Membro Selecionado:', selectedMember);
  //   // Aqui você pode adicionar a lógica para associar o membro à tarefa
  // }
  
}