import { AuthService } from 'src/app/components/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.scss']
})
export class UsuarioUpdateComponent implements OnInit {
  userForm: FormGroup;
  isEditing: string | null = null;
  hide = true;
  senhaVerificada = false;
  dadosOriginais: any;
  user:any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsuarioUpdateComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      nome: [data.nome, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      senhaAtual: [''],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: [this.passwordMatchValidator, this.passwordSameAsOldValidator.bind(this)] });

    this.dadosOriginais = { ...data };
  }

  ngOnInit(): void {
    this.carregarUsuario();
    this.user = this.getUser();
  }

  carregarUsuario() {
    let user = this.getUser();
    if (user) {
      this.userForm.patchValue({
        nome: user.nome,
        email: user.email // Preenchendo o campo de email
      });
      console.log('Usuário carregado:', user);
    }
  }

  toggleEdit(field: string) {
    this.isEditing = field;
  }

  verificarSenhaAtual() {
    const senhaAtual = this.userForm.get('senhaAtual')?.value;
    this.authService.verifyCurrentPassword(senhaAtual).subscribe(
      response => {
        this.senhaVerificada = true; // Senha verificada com sucesso
        console.log('Senha atual verificada com sucesso:', response);
      },
      error => {
        this.senhaVerificada = false; // Senha não verificada
        console.error('Erro ao verificar a senha atual:', error);
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl &&
      passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }

  passwordSameAsOldValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const senhaAtualControl = formGroup.get('senhaAtual');

    if (passwordControl && senhaAtualControl &&
      passwordControl.value === senhaAtualControl.value) {
      passwordControl.setErrors({ passwordSameAsOld: true });
    } else {
      passwordControl?.setErrors(null);
    }
  }

  cancelEdit() {
    this.userForm.patchValue({ ...this.dadosOriginais });
    this.isEditing = null;
    this.dialogRef.close();
  }

  atualizarUsuario() {
    let user = this.getUser();
    // if (this.userForm.valid) {
      const updatedData: any = {};

      if (this.dadosOriginais.nome !== this.userForm.get('nome')?.value) {
        updatedData.nome = this.userForm.get('nome')?.value;
      }
      
      if (this.dadosOriginais.email !== this.userForm.get('email')?.value) {
        updatedData.email = this.userForm.get('email')?.value;
      }
      
      if (this.senhaVerificada && this.userForm.get('password')?.value) {
        updatedData.senha = this.userForm.get('password')?.value;
      }

      console.log('AtualizarUsuario', user.id, updatedData);
      
      this.authService.updateUser(this.user.id, updatedData).subscribe(
        response => {
          this.dialogRef.close(response);
          console.log('Usuário atualizado com sucesso:', response);
        },
        error => {
          console.error('Erro ao atualizar usuário', error);
        }
      );
    // }
  }

  getUser(): any {
    let user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}