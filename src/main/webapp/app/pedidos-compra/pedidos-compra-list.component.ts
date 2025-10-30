import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PedidosCompraService } from 'app/pedidos-compra/pedidos-compra.service';
import { PedidosCompraDTO } from 'app/pedidos-compra/pedidos-compra.model';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-pedidos-compra-list',
  imports: [CommonModule, RouterLink,MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './pedidos-compra-list.component.html',
  styleUrls: ['./pedidos-compra-list.component.scss'],
  })
export class PedidosCompraListComponent implements OnInit, OnDestroy {

  pedidosCompraService = inject(PedidosCompraService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  pedidosCompras?: PedidosCompraDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Seguro que quieres eliminar este pedido de compra? No se podra deshacer`,
      deleted: $localize`:@@pedidosCompra.delete.success:El pedido de compra fue eliminado con éxito ✅`,
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
            next: () => {
              this.snackBar.open(this.getMessage('deleted'),
              undefined,
              {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ['snackbar-success']
              });
              this.router.navigate(['/pedidosCompras']);
            },
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
