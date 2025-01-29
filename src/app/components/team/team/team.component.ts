import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';
import { ActivatedRoute } from '@angular/router';
import { Projeto } from 'src/app/models/projeto.model';
import { forkJoin, map } from 'rxjs';
import { ModalConfirmacaoComponent } from 'src/app/views/template/modal-confirmacao/modal-confirmacao.component';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  equipeForm!: FormGroup;
  projeto!: Projeto;
  displayedColumns: string[] = ['nome', 'cargo', 'acoes'];
  cargos: string[] = ['Desenvolvedor', 'Designer', 'Gerente de Projeto']; // Exemplo de lista de cargos
  showAddForm = false;
  projetosPart: UsuarioProjeto[] = [];
  team: UsuarioProjeto[] = [];
  numerodoProj?: number;
  showOtherCargoField = false; // Controla a exibição do campo de novo cargo
  projetoId!: number;
  clickedInput: string | null = null;
  errorMessage!: string;

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
      email: ['', Validators.required], // Adiciona validação de email [Validators.required, Validators.email]
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

  editarMembro(membro: any) {
    // Lógica para editar o membro
    this.openConfirmacaoDialog('Você tem certeza que deseja continuar?')
      .then(result => {
        if (result) {

          console.log('Ação confirmada pelo usuário' , membro);
        } else {
          console.log('Ação cancelada pelo usuário', membro);
        }
      });
    console.log('Editar membro', membro);
    // Você pode abrir um diálogo ou um formulário para editar o membro
  }

  removerMembro(membro: any) {

    this.openConfirmacaoDialog('Você tem certeza que deseja continuar?')
    .then(result => {
      if (result) {
        console.log('Ação confirmada pelo usuário' , membro);
      } else {
        console.log('Ação cancelada pelo usuário', membro);
      }
    });
    /*if (confirm('Tem certeza que deseja remover este membro?')) {
      // Lógica para remover o membro
      console.log('Remover membro', membro);
      // Chame o serviço para remover o membro e recarregue os dados
      this.projetoService.removerParticipante(membro.id).subscribe(
        response => {
          console.log('Membro removido com sucesso', response);
          this.loadData(); // Recarrega os dados do componente
        },
        erro => {
          console.error('Erro ao remover membro', erro);
        }
      );
    } */
  }

  carregarTeam(idProjeto: number) {
    console.log('Carregar---------', idProjeto);
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

  salvarNovoMembro() {
    this.projetoId = this.data.projetoId;
    const email = this.equipeForm.get('email')?.value;
    const cargo = this.equipeForm.get('cargo')?.value;

    this.openConfirmacaoDialog('Tem certeza que deseja adicionar essa pessoa ao projeto?')
    .then(result => {
      if (result) {
        this.projetoService.addParticipante(email, this.projetoId, cargo).subscribe(
          response => {
            console.log('Usuário adicionado com sucesso', response);
            this.projetoService.showMessage('Usuário adicionado com sucesso!');
            this.cancelarAdicao();
            this.loadData();
          },
          error => {
            this.errorMessage = error;
            this.projetoService.showMessage(error);
            console.error('Erro ao adicionar usuário ao projeto', error);
          }
        );
        console.log('Ação confirmada pelo usuário');
      } else {
        console.log('Ação cancelada pelo usuário');
      }
    });
  }

  loadData(): void {
    // Adicione aqui a lógica para carregar os dados necessários para o componente
    this.equipeForm = this.formBuilder.group({
      email: ['', Validators.required], // Adiciona validação de email [Validators.required, Validators.email]
      cargo: ['', Validators.required]
    });
    this.carregarTeam(this.projetoId);
    // Por exemplo, buscar a lista de membros do projeto
    const projetoId = this.equipeForm.get('projetoId')?.value;
    this.projetoService.getTeamProjetoId(projetoId).subscribe(
      response => {
        // Atualize os dados do componente com a resposta
        console.log('Dados carregados com sucesso', response);
      },
      erro => {
        console.error('Erro ao carregar dados', erro);
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


  onInputClick(inputId: string): void {
    this.clickedInput = inputId;
  }

  fecharDialog(): void {
    this.dialogRef.close();
  }

  cancelarAdicao() {
    this.equipeForm.reset(); // Reseta o formulário
    this.showAddForm = false; // Esconde o formulário
  }

  openConfirmacaoDialog(texto: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '350px',
      data: { texto: texto }
    });

    return dialogRef.afterClosed().toPromise();
  }

}
