import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';


@Component({
  selector: 'app-transacciones-producto-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './transacciones-producto-list.component.html'})
export class TransaccionesProductoListComponent implements OnInit, OnDestroy {

  transaccionesProductoService = inject(TransaccionesProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  transaccionesProductos?: TransaccionesProductoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@transaccionesProducto.delete.success:Transacciones Producto was removed successfully.`    };
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
    this.transaccionesProductoService.getAllTransaccionesProductos()
        .subscribe({
          next: (data) => this.transaccionesProductos = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(tcoId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.transaccionesProductoService.deleteTransaccionesProducto(tcoId)
          .subscribe({
            next: () => this.router.navigate(['/transaccionesProductos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
