import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';
import { ProjectService } from '../../project/project.service';
import { ActivatedRoute } from '@angular/router';
import { Projeto } from 'src/app/models/projeto.model';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  equipeForm!: FormGroup;
  projeto!: Projeto;
  displayedColumns: string[] = ['nome', 'cargo'];
  cargos: string[] = ['Desenvolvedor', 'Designer', 'Gerente de Projeto']; // Exemplo de lista de cargos
  showAddForm = false;
  projetosPart: UsuarioProjeto[] = [];
  team: UsuarioProjeto[] = [];
  numerodoProj?: number;
  showOtherCargoField = false; // Controla a exibição do campo de novo cargo
  projetoId!: number;
  clickedInput: string | null = null;


  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TeamComponent>,
    private formBuilder: FormBuilder,
    public projetoService: ProjectService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projetoId = data.projetoId;
  }

  ngOnInit(): void {
    this.equipeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Adiciona validação de email
      cargo: ['', Validators.required]
    });
    this.carregarTeam(this.projetoId);
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

  onCargoChange(event: any) {
    if (event.value === 'Outro') {
      this.showOtherCargoField = true; // Exibe o campo de novo cargo
    } else {
      this.showOtherCargoField = false;
      this.equipeForm.get('otherCargo')?.reset(); // Reseta o campo caso "Outro" não seja selecionado
    }
  }
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  cancelarAdicao() {
    this.equipeForm.reset(); // Reseta o formulário
    this.showAddForm = false; // Esconde o formulário
  }
  salvarNovoMembro() {
    if (this.equipeForm.valid) {
      const novoMembro = this.equipeForm.value;
      this.team.push(novoMembro); // Adiciona o novo membro ao array team
      this.equipeForm.reset(); // Reseta o formulário após salvar
      this.showAddForm = false; // Esconde o formulário após salvar
    }
  }
  onInputClick(inputId: string): void {
    this.clickedInput = inputId;
  }
  fecharDialog(): void {
    this.dialogRef.close();
  }
}
