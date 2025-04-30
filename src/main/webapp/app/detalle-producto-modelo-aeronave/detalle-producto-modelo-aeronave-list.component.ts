import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DetalleProductoModeloAeronaveService } from './detalle-producto-modelo-aeronave.service';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';

@Component({
  selector: 'app-detalle-producto-modelo-aeronave-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-producto-modelo-aeronave-list.component.html'
})
export class DetalleProductoModeloAeronaveListComponent implements OnInit, OnDestroy {

  detalleService = inject(DetalleProductoModeloAeronaveService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  detalles?: DetalleProductoModeloAeronaveDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@detalle.delete.success:Detalle was removed successfully.`
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
    this.detalleService.getAllDetalles()
      .subscribe({
        next: (data) => this.detalles = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  confirmDelete(dpmaId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.detalleService.deleteDetalle(dpmaId)
        .subscribe({
          next: () => this.router.navigate(['/detalle-producto-modelo-aeronave-list'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    }
  }
}
