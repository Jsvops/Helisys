import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TipoProductoService } from 'app/tipo-producto/tipo-producto.service';
import { TipoProductoDTO } from 'app/tipo-producto/tipo-producto.model';


@Component({
  selector: 'app-tipo-producto-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './tipo-producto-list.component.html'})
export class TipoProductoListComponent implements OnInit, OnDestroy {

  tipoProductoService = inject(TipoProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  tipoProductos?: TipoProductoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@tipoProducto.delete.success:Tipo Producto was removed successfully.`,
      'tipoProducto.producto.proTpo.referenced': $localize`:@@tipoProducto.producto.proTpo.referenced:This entity is still referenced by Producto ${details?.id} via field Pro Tpo.`
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
    this.tipoProductoService.getAllTipoProductos()
        .subscribe({
          next: (data) => this.tipoProductos = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(tpoId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.tipoProductoService.deleteTipoProducto(tpoId)
          .subscribe({
            next: () => this.router.navigate(['/tipoProductos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/tipoProductos'], {
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
