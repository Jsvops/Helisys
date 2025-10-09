import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service'; // Importa UserService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/usuarios/current-user-info';

  constructor(private http: HttpClient, private userService: UserService) {}


  getCurrentUserInfo(): Observable<{ usrId: number, usrNombre: string }> {
    return this.http.get<{ usrId: number, usrNombre: string }>(this.apiUrl);
  }


  initializeUser() {
    this.getCurrentUserInfo().subscribe(userInfo => {
      this.userService.setUserName(userInfo.usrNombre);
    });
  }
}
