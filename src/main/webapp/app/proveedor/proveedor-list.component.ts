import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProveedorService } from 'app/proveedor/proveedor.service';
import { ProveedorDTO } from 'app/proveedor/proveedor.model';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-proveedor-list',
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.scss'],

  })
export class ProveedorListComponent implements OnInit, OnDestroy {

  proveedorService = inject(ProveedorService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  proveedores?: ProveedorDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Seguro que quieres eliminar este proveedor? No se podra deshacer`,
      deleted: $localize`:@@proveedor.delete.success:El proveedor fue eliminado con éxito ✅`,
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
            next: () => {
              this.snackBar.open(this.getMessage('deleted'),
              undefined,
              {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ['snackbar-success']
              });
              this.router.navigate(['/proveedores']);
            },
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
