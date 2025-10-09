import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getReasonPhrase } from 'http-status-codes';


@Component({
  selector: 'app-error',
  imports: [CommonModule],
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  router = inject(Router);

  status = 404;
  error = getReasonPhrase(this.status);

  ngOnInit() {
    const nav = this.router.lastSuccessfulNavigation;
    if (nav?.finalUrl?.toString() !== '/error') return;

    const state = nav.extras.state as { errorStatus?: number | string; errorMessage?: string };
    const status = Number(state?.errorStatus ?? 503);
    this.status = status;
    this.error = state?.errorMessage ?? getReasonPhrase(status);
  }

}
