import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProductoService } from 'app/producto/producto.service';
import { ProductResponseDTO } from 'app/producto/product-response.dto';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { ElementRef, ViewChild } from '@angular/core';




@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, MatTooltipModule, MatSelectModule, MatOptionModule, MatButtonModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
  animations: [
      trigger('fadeSlide', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-6px) scale(0.98)' }),
          animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
        ]),
        transition(':leave', [
          animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-6px) scale(0.98)' }))
        ])
      ])
    ]
  })

export class ProductoListComponent implements OnInit, OnDestroy {


  @ViewChild('scrollRegion') scrollRegion!: ElementRef<HTMLDivElement>;

  productoService = inject(ProductoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);

  productos: ProductResponseDTO[] = [];
  totalItems = 0;
  page = 0;
  size = 10;
  modeloAeronaveId?: number;
  modelosAeronave: ModeloAeronaveDTO[] = [];
  Math = Math;
  totalPages = 0;

  isFilterVisible: boolean = false;

  navigationSubscription?: Subscription;

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
    this.productoService
      .getAllProductos(this.page, this.size, this.modeloAeronaveId, 'proId,desc')
      .subscribe({
        next: (response) => {
          this.productos = response.content;
          this.totalItems = response.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.size);
        },
        error: (error) => this.errorHandler.handleServerError(error.error),
      });
  }


  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  onFilterChange(newModeloAeronaveId: number | undefined) {
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

  generarReporte() {
    if (!this.modeloAeronaveId) return;

    this.productoService.generarReporteProductos(this.modeloAeronaveId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-productos-modelo.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

    onWheelX(ev: WheelEvent) {
      const el = this.scrollRegion?.nativeElement;
      if (!el) return;

      const canScrollX = el.scrollWidth > el.clientWidth;
      if (!canScrollX) return;

      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
        ev.preventDefault();
        el.scrollLeft += ev.deltaY;
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

  getMessage(key: string, details?: any): string {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@producto.delete.success:Producto was removed successfully.`,
      'producto.pedidosProducto.pptPro.referenced': $localize`:@@producto.pedidosProducto.pptPro.referenced:This entity is still referenced by Pedidos Producto ${details?.id} via field Ppt Pro.`,
      'producto.transaccionesProducto.tcoPro.referenced': $localize`:@@producto.transaccionesProducto.tcoPro.referenced:This entity is still referenced by Transacciones Producto ${details?.id} via field Tco Pro.`
    };
    return messages[key];
  }

  trackByProducto(index: number, producto: ProductResponseDTO): number {
    return producto.proId;
  }
}
