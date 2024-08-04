import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  //currentUser: any;
  constructor(private authService: AuthService, private route: Router, public dialog: MatDialog) { }
  
  logout(): void {
    this.authService.removeToken();
    this.route.navigate([""]);
  }
  ngOnInit(): void {
  }
  currentUser = this.authService.getUser();
  primeiroNome = this.obterPrimeiroNome(this.currentUser.nome);

  obterPrimeiroNome(nomeCompleto: string): string {
    // Divide a string pelo espaço em branco
    const partesNome = nomeCompleto.split(' ');
    // Retorna o primeiro elemento do array (que é o primeiro nome)
    return partesNome[0];
  }
  
  openDialog(modalType: string): MatDialogRef<any> | undefined {
    let dialogRef: MatDialogRef<any> | undefined;
    
    // if (modalType === 'task') {
    //   dialogRef = this.dialog.open(UsuarioEditComponent, {
    //     width: '600px',
    //     data: {} // Aqui você pode passar quaisquer dados necessários para o modal
    //   });
    // } 
    

    return dialogRef;
  }

}
