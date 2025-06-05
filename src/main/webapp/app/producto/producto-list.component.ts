import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProductoService } from 'app/producto/producto.service';
import { ProductResponseDTO } from 'app/producto/product-response.dto';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './producto-list.component.html'
})
export class ProductoListComponent implements OnInit, OnDestroy {

  productoService = inject(ProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
   productos: ProductResponseDTO[] = [];
   totalItems = 0;
   page = 0;
   size = 10;
   modeloAeronaveId?: number;
   modelosAeronave: ModeloAeronaveDTO[] = [];
   Math = Math;
   totalPages = 0;


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
    this.loadModelos();
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  loadModelos() {
    this.productoService.getModeloAeronaveValues().subscribe({
      next: (data) => this.modelosAeronave = data,
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }

  loadData() {
    this.productoService.getAllProductos(this.page, this.size, this.modeloAeronaveId)
      .subscribe({
        next: (response) => {
          this.productos = response.content;
          this.totalItems = response.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.size); // <-- ESTA LÍNEA ES CLAVE
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }



    onFilterChange(newModeloAeronaveId: number) {
      this.modeloAeronaveId = newModeloAeronaveId;
      this.page = 0;
      this.loadData();
    }


    goToPage(page: number) {
      this.page = page;
      this.loadData();
    }

    nextPage(): void {
      if ((this.page + 1) < this.totalPages) {
        this.page++;
        this.loadData();
      }
    }

    previousPage(): void {
      if (this.page > 0) {
        this.page--;
        this.loadData();
      }
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
