import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit{
  equipeForm!: FormGroup;
 // membrosEquipe: any[]; // Aqui você pode substituir 'any' pelo tipo de objeto que representa um membro da equipe
  cargos: string[] = ['Desenvolvedor', 'Designer', 'Gerente de Projeto']; // Exemplo de lista de cargos
  displayedColumns: string[] = ['email', 'cargo', 'acoes'];

  constructor(
    public dialogRef: MatDialogRef<TeamComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit():void{
    this.equipeForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      cargo: ['', Validators.required]
    });
    // Inicialize membrosEquipe com os membros existentes do projeto
    //this.membrosEquipe = [];
  }

  adicionarMembro(): void {
    // if (this.equipeForm.valid) {
    //   // Adicione o novo membro à lista de membros da equipe
    //   this.membrosEquipe.push({
    //     email: '',
    //     cargo: ''
    //   });
      // Limpe os campos do formulário após adicionar o membro
      this.equipeForm.reset();
   // }
  }

  excluirMembro(id: number): void {
    // Implemente a lógica para excluir um membro da equipe
    console.log('Excluir membro com ID:', id);
  }

  editarCargo(id: number): void {
    // Implemente a lógica para editar o cargo de um membro da equipe
    console.log('Editar cargo do membro com ID:', id);
  }

  fecharDialog(): void {
    this.dialogRef.close();
  }
}
