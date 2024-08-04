import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.scss']
})
export class LoginComponent {
  
  loginForm!: FormGroup;
  hide = true;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit(): void {
    //this.authService.removeToken();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]], // Validators.email adicionar isso para validar O EMAIL
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        data => {
          // Verifica se a resposta possui um token JWT
          if (data && data.token) {
            // Salva o token no localStorage
            this.authService.saveToken(data.token);
          }
          this.route.navigate(['/home']);
        },
        error => {
          this.authService.removeToken();
          this.authService.showMessage("Email ou senha invalidos!");
        }
      )
    }
  }

}
