import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss']
})
export class TaskboardComponent implements OnInit {
  usuario!: Usuario;
  projeto!: Projeto;
  tarefas!: Tarefa;

  done: any[] = [];
  todo: any[] = [];
  work: any[] = [];
  selectedTask: any;
  constructor(
    private projetoService: ProjectService, 
    private router: Router, 
    private route: ActivatedRoute, 
    public dialog: MatDialog, 
  ) { }



  ngOnInit(): void {
    this.carregarTarefas();
    this.carregarDadosProjeto();
  }
  carregarDadosProjeto() {
    const projetoId = +this.route.snapshot.params['id'];
    this.projetoService.getProjetoById(projetoId).subscribe(projeto => {
      this.projeto = projeto;

      // Recupere as tabelas do projeto
      // this.projetoService.getTabelasDoProjeto(projetoId).subscribe(tabela => {
      //   this.tabela = tabela;

    });
  }

  carregarTarefas() {
    const projetoId = +this.route.snapshot.params['id'];

    // this.tarefaService.getTarefasProjeto(projetoId).subscribe(
    //   (tarefas) => {
    //     this.tarefas = tarefas;
    //   },
    //   (error) => {
    //     console.error('Erro ao carregar as tarefas:', error);
    //   }
    // );
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  
}