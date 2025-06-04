import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransactionResponseDTO } from './transaction-response.dto';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-transaccion-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './transaccion-list.component.html'
})
export class TransaccionListComponent implements OnInit, OnDestroy {

  transaccionService = inject(TransaccionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  http = inject(HttpClient);


  transacciones: TransactionResponseDTO[] = [];
  navigationSubscription?: Subscription;
  page = 0;
  size = 10;
  total = 0;
  totalPages = 0;
  fechaInicio: string | null = null;
  fechaFin: string | null = null;


  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@transaccion.delete.success:Transaccion was removed successfully.`,
      'transaccion.transaccionesProducto.tcoTce.referenced': $localize`:@@transaccion.transaccionesProducto.tcoTce.referenced:This entity is still referenced by Transacciones Producto ${details?.id} via field Tco Tce.`
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
    this.navigationSubscription?.unsubscribe();
  }

  loadData(): void {
    this.transaccionService.getResumenTransacciones(this.page, this.size, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          this.transacciones = data.content;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Error al cargar transacciones', err);
        }
      });
  }

  filtrarPorFechas() {
    this.page = 0;
    this.loadData();
  }

  limpiarFiltro() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.page = 0;
    this.loadData();
  }


  nextPage() {
    if ((this.page + 1) < this.totalPages) {
      this.page++;
      this.loadData();
    }
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  generarReporte(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      alert("Por favor seleccione una fecha de inicio y fin.");
      return;
    }

    const url = `/generar-pdf?fechaInicio=${this.fechaInicio}&fechaFin=${this.fechaFin}`;

    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const file = new Blob([blob], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = 'reporte-transacciones.pdf';
      link.click();
    }, (error: any) => {
      console.error('Error al generar el reporte', error);
      alert('Hubo un error al generar el reporte.');
    });
  }

  confirmDelete(tceId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.transaccionService.deleteTransaccion(tceId).subscribe({
        next: () => this.router.navigate(['/transacciones'], {
          state: {
            msgInfo: this.getMessage('deleted')
          }
        }),
        error: (error) => {
          if (error.error?.code === 'REFERENCED') {
            const messageParts = error.error.message.split(',');
            this.router.navigate(['/transacciones'], {
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
