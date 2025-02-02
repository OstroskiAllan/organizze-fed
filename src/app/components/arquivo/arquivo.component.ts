import { Component, OnInit } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { ModalConfirmacaoComponent } from 'src/app/views/template/modal-confirmacao/modal-confirmacao.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertaComponent } from 'src/app/views/template/modal-alerta/modal-alerta.component';


@Component({
  selector: 'app-arquivo',
  templateUrl: './arquivo.component.html',
  styleUrls: ['./arquivo.component.scss']
})
export class ArquivoComponent  implements OnInit {

  projetos: Projeto[] = [];
  tarefasArquivadas: Tarefa[] = [];
  projetosComTarefasArquivadas: Projeto[] = [];
  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projectService.getProjetos().subscribe(
      (projetos: Projeto[]) => {
        this.projetos = projetos;
        this.carregarTarefasArquivadas();
      },
      (error) => {
        console.error('Erro ao carregar projetos:', error);
      }
    );
  }

  retornarTarefa(tarefa: any): void {
    this.openConfirmacaoDialog('Você tem certeza que deseja retornar esta tarefa ao projeto? Ao clicar opção de retornar para o sistema, ela retornará com o status de "A fazer"')
    .then(result => {
      if (result) {
        tarefa.statusId = 1;
          this.taskService.update(tarefa).subscribe(
            () => {
              console.log('Tarefa atualizada com sucesso.',tarefa);
              this.reload();
            },
            (error) => {
              console.error('Erro ao atualizar tarefa:', error);
            });
        console.log('Ação confirmada pelo usuário', tarefa);
      } else {
        console.log('Ação cancelada pelo usuário', tarefa);
      }
    });
  }
  carregarTarefasArquivadas(): void {
    this.tarefasArquivadas = []; // Limpa a lista de tarefas antes de carregar
    this.projetosComTarefasArquivadas = []; // Limpa a lista de projetos filtrados
  
    this.projetos.forEach(projeto => {
      if (projeto.id) {
        this.taskService.getTarefasProjeto(projeto.id).subscribe(
          (tarefas: Tarefa[]) => {
            // Filtra tarefas com status 5 (arquivadas)
            const tarefasArquivadas = tarefas.filter(tarefa => tarefa.statusId === 5);
            if (tarefasArquivadas.length > 0) {
              this.projetosComTarefasArquivadas.push(projeto); // Adiciona o projeto à lista filtrada
            }
            this.tarefasArquivadas = this.tarefasArquivadas.concat(tarefasArquivadas);
          },
          (error) => {
            console.error(`Erro ao carregar tarefas do projeto ${projeto.id}:`, error);
          }
        );
      }
    });
  }

  getTarefasArquivadasPorProjeto(projetoId: any): Tarefa[] {
    return this.tarefasArquivadas.filter(tarefa => tarefa.projetoId === projetoId);
  }

  getNomeProjeto(projetoId: any): string {
    const projeto = this.projetos.find(p => p.id === projetoId);
    return projeto ? projeto.nome : 'Projeto não encontrado';
  }
  excluirTarefa(tarefa: any){
    this.openAlertaDialog(' Somente permitido excluir tarefa após 60 dias arquivada!')
  }


  reload(): void {
    window.location.reload();
  }
  openConfirmacaoDialog(texto: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '500px',
      data: { texto: texto }
    });

    return dialogRef.afterClosed().toPromise();
  }
  openAlertaDialog(texto: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalAlertaComponent, {
      width: '500px',
      data: { texto: texto }
    });

    return dialogRef.afterClosed().toPromise();
  }
}