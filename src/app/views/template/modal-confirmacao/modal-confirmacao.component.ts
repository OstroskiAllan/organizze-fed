import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.scss']
})
export class ModalConfirmacaoComponent {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  openCondicaoDialog(texto: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '250px',
      data: { texto: texto }
    });
    return dialogRef.afterClosed().toPromise();
  }
  
}
