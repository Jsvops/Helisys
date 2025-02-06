import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service'; // Importa AuthService
import { UserService } from './user.service'; // Asegúrate de que la ruta es correcta
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './common/header/header.component'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService); // Inyecta AuthService

  msgSuccess = null;
  msgInfo = null;
  msgError = null;

  ngOnInit() {
    // Inicializar la información del usuario al iniciar la aplicación
    this.authService.initializeUser();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const navigationState = this.router.getCurrentNavigation()?.extras.state;
        this.msgSuccess = navigationState?.['msgSuccess'] || null;
        this.msgInfo = navigationState?.['msgInfo'] || null;
        this.msgError = navigationState?.['msgError'] || null;
      }
    });
  }
}
