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
  cargos: string[] = []; // Exemplo de lista de cargos
  showAddForm = false;
  showEditForm = false;
  projetosPart: UsuarioProjeto[] = [];
  editandoMembro!: any;
  team: UsuarioProjeto[] = [];
  numerodoProj?: number;
  showOtherCargoField = false; // Controla a exibição do campo de novo cargo
  projetoId!: number;
  clickedInput: string | null = null;
  errorMessage!: string;
  isEditing = false;

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
    this.editandoMembro = membro;
    this.showEditForm = true;
    this.equipeForm.patchValue({
      email: membro.nome,
      cargo: membro.cargo
    });
    this.equipeForm.get('email')?.disable();
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
            const gerente = result.find(member => member.cargo === 'Gerente');
            const outrosMembros = result.filter(member => member.cargo !== 'Gerente');

            this.team = [
              ...(gerente ? [gerente] : []),
              ...outrosMembros.sort((a, b) => {
                if (a.nome && b.nome) {
                  return a.nome.localeCompare(b.nome);
                }
                return 0;
              })
            ];
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
  removerMembro(membro: any) {
    this.openConfirmacaoDialog('Você tem certeza que deseja continuar? A ação só pode ser efetuada se o usuário nao estiver atrelado a nenhuma tarefa e não poderá ser desfeita.')
      .then(result => {
        if (result) {
          // Lógica para remover o membro
          this.projetoService.removeMembro(membro.usuarioId, membro.projetoId).subscribe(
            () => {
              this.projetoService.showMessage('Membro removido com sucesso!');
              this.carregarTeam(this.projetoId); // Atualiza a lista após a exclusão
            },
            (error) => {
              this.projetoService.showMessage('Membro atrelado a tarefas, não pode ser removido!');
            }
          );
          console.log('Ação confirmada pelo usuário', membro);
        } else {
          console.log('Ação cancelada pelo usuário', membro);
        }
      });
  }

  salvarEdicaoMembro() {
    if (!this.editandoMembro) return;
    const cargo = this.equipeForm.get('cargo')?.value;

    this.openConfirmacaoDialog('Tem certeza que deseja editar esse membro?')
      .then(result => {
        if (result) {
          this.projetoService.updateMembro(this.projetoId, this.editandoMembro.usuarioId, cargo).subscribe(
            () => {
              this.projetoService.showMessage('Usuário atualizado com sucesso!');
              this.cancelarEdicao();
              this.carregarTeam(this.projetoId);
              this.equipeForm.get('email')?.enable();
            },
            error => {
              this.projetoService.showMessage(error);
              console.error('Erro ao editar usuário', error);
            }
          );
        }
      });
  }

  cancelarEdicao() {
    this.equipeForm.reset();
    this.showEditForm = false;
    this.editandoMembro = null;
  }

  salvarNovoMembro() {
    const email = this.equipeForm.get('email')?.value;
    const cargo = this.equipeForm.get('cargo')?.value;
  
    this.projetoService.getUserIdByEmail(email).subscribe(userId => {
      if (userId === null) {
        this.projetoService.showMessage('Usuário não encontrado.');
        return;
      }
  
      // Verifica se o usuário já está no time
      const usuarioJaNoTime = this.team.some(member => member.usuarioId === userId);
  
      if (usuarioJaNoTime) {
        this.projetoService.showMessage('Usuário já faz parte da equipe.');
        return;
      }
  
      this.openConfirmacaoDialog('Tem certeza que deseja adicionar essa pessoa ao projeto?')
        .then(result => {
          if (result) {
            this.projetoService.addParticipante(email, this.projetoId, cargo).subscribe(
              () => {
                this.projetoService.showMessage('Usuário adicionado com sucesso!');
                this.cancelarAdicao();
                this.loadData();
              },
              error => {
                this.errorMessage = error;
                this.projetoService.showMessage(error);
              }
            );
          } else {
            console.log('Ação cancelada pelo usuário');
          }
        });
  
    }, error => {
      this.projetoService.showMessage('Erro ao buscar usuário.');
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

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.equipeForm.get('email')?.enable();
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
      width: '500px',
      data: { texto: texto }
    });

    return dialogRef.afterClosed().toPromise();
  }

}
