import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service'; // Importa UserService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/usuarios/current-user-info'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient, private userService: UserService) {} // Inyecta UserService

  // Método para obtener la información del usuario autenticado
  getCurrentUserInfo(): Observable<{ usrId: number, usrNombre: string }> {
    return this.http.get<{ usrId: number, usrNombre: string }>(this.apiUrl);
  }

  // Método para establecer la información del usuario en el UserService
  initializeUser() {
    this.getCurrentUserInfo().subscribe(userInfo => {
      this.userService.setUserName(userInfo.usrNombre);
    });
  }
}
