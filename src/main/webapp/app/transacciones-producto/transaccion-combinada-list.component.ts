import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router'; // Asegúrate de importar NavigationEnd
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';

@Component({
  selector: 'app-transaccion-combinada-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './transaccion-combinada-list.component.html'
})
export class TransaccionCombinadaListComponent implements OnInit, OnDestroy {

  transaccionService = inject(TransaccionService);
  transaccionesProductoService = inject(TransaccionesProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  transaccionesCombinadas: (TransaccionDTO & TransaccionesProductoDTO)[] = [];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@transaccion.delete.success:Transaccion was removed successfully.`,
      'transaccion.transaccionesProducto.tcoTce.referenced': $localize`:@@transaccion.transaccionesProducto.tcoTce.referenced:This entity is still referenced by Transacciones Producto ${details?.id} via field Tco Tce.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) { // Asegúrate de que NavigationEnd esté disponible aquí
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }

  loadData() {
    this.transaccionService.getAllTransacciones().subscribe({
      next: (transacciones) => {
        this.transaccionesProductoService.getAllTransaccionesProductos().subscribe({
          next: (productos) => {
            this.transaccionesCombinadas = transacciones.map(transaccion => ({
              ...transaccion,
              ...productos.find(producto => producto.tcoTce === transaccion.tceId)
            }));
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  confirmDelete(tceId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.transaccionService.deleteTransaccion(tceId).subscribe({
        next: () => this.router.navigate(['/transacciones'], {
          state: {
            msgInfo: this.getMessage('deleted')
          }
        }),
        error: (error) => {
          if (error.error?.code === 'REFERENCED') {
            const messageParts = error.error.message.split(',');
            this.router.navigate(['/transacciones'], {
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
