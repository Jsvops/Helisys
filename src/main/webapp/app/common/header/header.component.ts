import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from 'app/user.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {

    this.userService.currentUserName.subscribe(name => {
      this.userName = name;
    });


  }

   logout() {
     fetch('/logout', { method: 'POST', credentials: 'include' })
       .finally(() => window.location.replace('/login'));
   }

}
