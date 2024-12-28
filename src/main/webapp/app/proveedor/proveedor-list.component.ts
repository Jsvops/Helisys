import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProveedorService } from 'app/proveedor/proveedor.service';
import { ProveedorDTO } from 'app/proveedor/proveedor.model';


@Component({
  selector: 'app-proveedor-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './proveedor-list.component.html'})
export class ProveedorListComponent implements OnInit, OnDestroy {

  proveedorService = inject(ProveedorService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  proveedores?: ProveedorDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@proveedor.delete.success:Proveedor was removed successfully.`,
      'proveedor.contactoProveedor.cpePve.referenced': $localize`:@@proveedor.contactoProveedor.cpePve.referenced:This entity is still referenced by Contacto Proveedor ${details?.id} via field Cpe Pve.`,
      'proveedor.producto.proPve.referenced': $localize`:@@proveedor.producto.proPve.referenced:This entity is still referenced by Producto ${details?.id} via field Pro Pve.`
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
    this.proveedorService.getAllProveedores()
        .subscribe({
          next: (data) => this.proveedores = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(pveId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.proveedorService.deleteProveedor(pveId)
          .subscribe({
            next: () => this.router.navigate(['/proveedores'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/proveedores'], {
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
