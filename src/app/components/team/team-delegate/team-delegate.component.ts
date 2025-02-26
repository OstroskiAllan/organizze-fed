import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, forkJoin } from 'rxjs';
import { UsuarioProjeto } from 'src/app/models/usuarioprojeto.model';
import { ProjectService } from '../../project/project.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../task/task.service';

@Component({
  selector: 'team-delegate',
  templateUrl: './team-delegate.component.html',
  styleUrls: ['./team-delegate.component.scss']
})
export class TeamDelegateComponent implements OnInit {
  @Input() numberProjeto!: number;
  @Output() usuarioSelecionado = new EventEmitter<number>();

  team: UsuarioProjeto[] = [];
  projetoId!: number;
  form: FormGroup;
  selectedUserId!: number | null
  tarefa: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private taskService: TaskService,
    public projetoService: ProjectService,
    private route: ActivatedRoute,  // codigo verificar depois
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projetoId = data.projetoId;
    this.form = this.fb.group({
      selectedMember: [null,]
    });
  }

  ngOnInit(): void {
    this.carregarTeam(this.numberProjeto); // codigo verificar depois
    

    this.form.get('selectedMember')?.valueChanges.subscribe((idSelecionado) => {
      this.selectedUserId = idSelecionado;
      this.emitirUsuarioSelecionado();
    });
  }
  
  carregarTeam(numberProjeto: number){
    if (!this.numberProjeto) return;

    this.projetoService.getTeamProjetoId(numberProjeto).subscribe(
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
            this.team = result.sort((a, b) => {
              if (a.nome && b.nome) {
                return a.nome.localeCompare(b.nome);
              }
              return 0;
            })  
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

  emitirUsuarioSelecionado(){
    const selectUserId = this.form.get('selectedMember')?.value;
    this.usuarioSelecionado.emit(selectUserId);
  }

  atualizarTarefa(): void {
    if (this.selectedUserId) {
      this.tarefa.usuarioId = this.selectedUserId;
    }

    this.taskService.update(this.tarefa).subscribe(
      (updatedTask) => {
        console.log('Tarefa atualizada com sucesso:', updatedTask);
      },
      (erro) => {
        console.error('Erro ao atualizar a tarefa:', erro);
      }
    );
  }

  removerResponsavel() {
    this.selectedUserId = null;
    this.form.get('selectedMember')?.setValue(null);  // Limpa o valor do formulário
    this.atualizarTarefa();  // Atualiza a tarefa sem um responsável
    window.location.reload();
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