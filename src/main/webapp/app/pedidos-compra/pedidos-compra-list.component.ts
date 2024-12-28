import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PedidosCompraService } from 'app/pedidos-compra/pedidos-compra.service';
import { PedidosCompraDTO } from 'app/pedidos-compra/pedidos-compra.model';


@Component({
  selector: 'app-pedidos-compra-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './pedidos-compra-list.component.html'})
export class PedidosCompraListComponent implements OnInit, OnDestroy {

  pedidosCompraService = inject(PedidosCompraService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  pedidosCompras?: PedidosCompraDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@pedidosCompra.delete.success:Pedidos Compra was removed successfully.`,
      'pedidosCompra.pedidosProducto.pptPca.referenced': $localize`:@@pedidosCompra.pedidosProducto.pptPca.referenced:This entity is still referenced by Pedidos Producto ${details?.id} via field Ppt Pca.`
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
    this.pedidosCompraService.getAllPedidosCompras()
        .subscribe({
          next: (data) => this.pedidosCompras = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(pcaId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.pedidosCompraService.deletePedidosCompra(pcaId)
          .subscribe({
            next: () => this.router.navigate(['/pedidosCompras'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/pedidosCompras'], {
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
