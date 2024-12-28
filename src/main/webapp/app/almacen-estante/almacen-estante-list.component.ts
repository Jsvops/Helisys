import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AlmacenEstanteService } from 'app/almacen-estante/almacen-estante.service';
import { AlmacenEstanteDTO } from 'app/almacen-estante/almacen-estante.model';


@Component({
  selector: 'app-almacen-estante-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './almacen-estante-list.component.html'})
export class AlmacenEstanteListComponent implements OnInit, OnDestroy {

  almacenEstanteService = inject(AlmacenEstanteService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  almacenEstantes?: AlmacenEstanteDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@almacenEstante.delete.success:Almacen Estante was removed successfully.`,
      'almacenEstante.almacenRepisa.amrAmt.referenced': $localize`:@@almacenEstante.almacenRepisa.amrAmt.referenced:This entity is still referenced by Almacen Repisa ${details?.id} via field Amr Amt.`
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
    this.almacenEstanteService.getAllAlmacenEstantes()
        .subscribe({
          next: (data) => this.almacenEstantes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(amtId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.almacenEstanteService.deleteAlmacenEstante(amtId)
          .subscribe({
            next: () => this.router.navigate(['/almacenEstantes'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/almacenEstantes'], {
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
