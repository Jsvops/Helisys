import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AlmacenContenedorService } from 'app/almacen-contenedor/almacen-contenedor.service';
import { AlmacenContenedorDTO } from 'app/almacen-contenedor/almacen-contenedor.model';


@Component({
  selector: 'app-almacen-contenedor-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './almacen-contenedor-list.component.html'})
export class AlmacenContenedorListComponent implements OnInit, OnDestroy {

  almacenContenedorService = inject(AlmacenContenedorService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  almacenContenedores?: AlmacenContenedorDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@almacenContenedor.delete.success:Almacen Contenedor was removed successfully.`,
      'almacenContenedor.producto.proAmc.referenced': $localize`:@@almacenContenedor.producto.proAmc.referenced:This entity is still referenced by Producto ${details?.id} via field Pro Amc.`
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
    this.almacenContenedorService.getAllAlmacenContenedores()
        .subscribe({
          next: (data) => this.almacenContenedores = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(amcId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.almacenContenedorService.deleteAlmacenContenedor(amcId)
          .subscribe({
            next: () => this.router.navigate(['/almacenContenedores'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/almacenContenedores'], {
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
