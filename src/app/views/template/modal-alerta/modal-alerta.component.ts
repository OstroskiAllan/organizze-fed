import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConfirmacaoComponent } from '../modal-confirmacao/modal-confirmacao.component';

@Component({
  selector: 'app-modal-alerta',
  templateUrl: './modal-alerta.component.html',
  styleUrls: ['./modal-alerta.component.scss']
})
export class ModalAlertaComponent {
    constructor(
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<ModalAlertaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  
  
    openCondicaoDialog(texto: string): Promise<boolean> {
      const dialogRef = this.dialog.open(ModalAlertaComponent, {
        width: '250px',
        data: { texto: texto }
      });
      return dialogRef.afterClosed().toPromise();
    }
    
  }
  
