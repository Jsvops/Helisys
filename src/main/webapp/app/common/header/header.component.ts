import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from 'app/user.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  userName: string = ''; // Variable para almacenar el nombre del usuario

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Suscribirse a los cambios en el nombre del usuario
    this.userService.currentUserName.subscribe(name => {
      this.userName = name;
    });
  }
}
