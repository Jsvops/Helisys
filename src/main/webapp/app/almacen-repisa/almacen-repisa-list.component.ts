import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AlmacenRepisaService } from 'app/almacen-repisa/almacen-repisa.service';
import { AlmacenRepisaDTO } from 'app/almacen-repisa/almacen-repisa.model';


@Component({
  selector: 'app-almacen-repisa-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './almacen-repisa-list.component.html'})
export class AlmacenRepisaListComponent implements OnInit, OnDestroy {

  almacenRepisaService = inject(AlmacenRepisaService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  almacenRepisas?: AlmacenRepisaDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@almacenRepisa.delete.success:Almacen Repisa was removed successfully.`,
      'almacenRepisa.almacenContenedor.amcAmr.referenced': $localize`:@@almacenRepisa.almacenContenedor.amcAmr.referenced:This entity is still referenced by Almacen Contenedor ${details?.id} via field Amc Amr.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.almacenRepisaService.getAllAlmacenRepisas()
        .subscribe({
          next: (data) => this.almacenRepisas = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(amrId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.almacenRepisaService.deleteAlmacenRepisa(amrId)
          .subscribe({
            next: () => this.router.navigate(['/almacenRepisas'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/almacenRepisas'], {
                  state: {
                    msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                  }
                });
                return;
              }
              this.errorHandler.handleServerError(error.error)
            }
          });
    }
  }

}
