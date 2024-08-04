import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.required],         // TIREI SOMENTE PARA TESTE MAIS AGEIS!
      email: ['', [Validators.required]],     // , Validators.email adicionar isso para validar o email
      password: ['', [Validators.required]], // ,Validators.minLength(6) adicionar isso para validar a senha
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
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

  onSubmit(): void {
    this.authService.removeToken();

    if (this.registerForm.valid) {
      const { nome, email, password } = this.registerForm.value;
      this.authService.register(nome, email, password).subscribe(
        data => {
          this.authService.showMessage("Usuario cadastrado com sucesso!")
          this.route.navigate(['']);
        },
        error => {
          this.errorMessage = "Ocorreu um erro ao registrar o usuário.";
        }
      )
    } else {
      // Verifique quais campos estão faltando e defina a mensagem de erro apropriada
      if (this.registerForm.get('nome')?.errors?.['required']) {
        this.errorMessage = "Por favor, preencha o campo Nome.";
      } else if (this.registerForm.get('email')?.errors?.['required'] || this.registerForm.get('email')?.errors?.['email']) {
        this.errorMessage = "Por favor, insira um e-mail válido.";
      } else if (this.registerForm.get('password')?.errors?.['required']) {
        this.errorMessage = "Por favor, preencha o campo Senha.";
      } else if (this.registerForm.get('password')?.errors?.['minlength']) {
        this.errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (this.registerForm.get('confirmPassword')?.errors?.['required']) {
        this.errorMessage = "Por favor, confirme sua senha.";
      } else if (this.registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
        this.errorMessage = "As senhas não coincidem.";
      }
    }
  }
}