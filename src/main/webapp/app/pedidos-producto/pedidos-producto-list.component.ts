import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PedidosProductoService } from 'app/pedidos-producto/pedidos-producto.service';
import { PedidosProductoDTO } from 'app/pedidos-producto/pedidos-producto.model';


@Component({
  selector: 'app-pedidos-producto-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './pedidos-producto-list.component.html'})
export class PedidosProductoListComponent implements OnInit, OnDestroy {

  pedidosProductoService = inject(PedidosProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  pedidosProductos?: PedidosProductoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@pedidosProducto.delete.success:Pedidos Producto was removed successfully.`    };
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
    this.pedidosProductoService.getAllPedidosProductos()
        .subscribe({
          next: (data) => this.pedidosProductos = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(pptId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.pedidosProductoService.deletePedidosProducto(pptId)
          .subscribe({
            next: () => this.router.navigate(['/pedidosProductos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
