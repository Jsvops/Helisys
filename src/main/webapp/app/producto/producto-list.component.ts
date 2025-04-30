import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProductoService } from 'app/producto/producto.service';
import { ProductoDTO } from 'app/producto/producto.model';

@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-list.component.html'
})
export class ProductoListComponent implements OnInit, OnDestroy {

  productoService = inject(ProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  productos?: ProductoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@producto.delete.success:Producto was removed successfully.`,
      'producto.pedidosProducto.pptPro.referenced': $localize`:@@producto.pedidosProducto.pptPro.referenced:This entity is still referenced by Pedidos Producto ${details?.id} via field Ppt Pro.`,
      'producto.transaccionesProducto.tcoPro.referenced': $localize`:@@producto.transaccionesProducto.tcoPro.referenced:This entity is still referenced by Transacciones Producto ${details?.id} via field Tco Pro.`
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
    this.productoService.getAllProductos()
      .subscribe({
        next: (data) => this.productos = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  confirmDelete(proId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.productoService.deleteProducto(proId)
        .subscribe({
          next: () => this.router.navigate(['/productos'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/productos'], {
                state: {
                  msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                }
              });
              return;
            }
            this.errorHandler.handleServerError(error.error);
          }
        });
    }
  }
}
