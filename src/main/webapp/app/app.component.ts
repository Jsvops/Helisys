import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './common/header/header.component';
import { CanvasBgComponent } from './canvas-bg/canvas-bg.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HeaderComponent, CanvasBgComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);

   private iconReg = inject(MatIconRegistry);
   private sanitizer = inject(DomSanitizer);

  msgSuccess = null;
  msgInfo = null;
  msgError = null;

constructor() {
    this.registerIcons();
  }

  private registerIcons() {
    const icons: Record<string, string> = {
      list_alt:             '/list_alt.svg',
      home:                 '/home.svg',
      edit:                 '/edit.svg',
      delete:               '/delete.svg',
      save:                 '/save.svg',
      filter_alt:           '/filter_alt.svg',
      assignment:           '/assignment.svg',
      search:               '/search.svg',
      add_box:              '/add_box.svg',
      filter_alt_off:       '/filter_alt_off.svg',
      account_circle:       '/account_circle.svg',
      warning_yb_outline:   '/warning_yb_outline.svg'
    };

    Object.entries(icons).forEach(([name, url]) => {
      this.iconReg.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(url)
      );
    });
  }

  ngOnInit() {

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
