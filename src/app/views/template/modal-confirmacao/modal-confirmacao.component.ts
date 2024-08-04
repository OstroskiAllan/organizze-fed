import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.scss']
})
export class ModalConfirmacaoComponent {
  constructor(
    private dialog: MatDialog
  ) { }


  openDeleteDialog(projetoId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '250px',
      data: { projetoId: projetoId }
    });

  }
}
