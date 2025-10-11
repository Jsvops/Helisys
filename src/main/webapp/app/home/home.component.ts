import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';
import { RouterLink } from '@angular/router';
import {ProductExpiringWidgetComponent} from 'app/product-expiring/product-expiring-widget.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductExpiringWidgetComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  environment = environment;

}
