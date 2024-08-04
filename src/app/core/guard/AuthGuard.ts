import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Permitir o acesso à rota se o usuário estiver autenticado
    } else {
      this.router.navigate(['']); // Redirecionar para a página de login se o usuário não estiver autenticado
      return false; // Bloquear o acesso à rota
    }
  }
}
