import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';
import { ProductoService } from 'app/producto/producto.service';
import { UsuarioService } from 'app/usuario/usuario.service';
import { AeronaveService } from 'app/aeronave/aeronave.service';
import { ProductoDTO } from 'app/producto/producto.model';
import { UsuarioDTO } from 'app/usuario/usuario.model';
import { AeronaveDTO } from 'app/aeronave/aeronave.model';
import { TransaccionEventoService } from 'app/transaccion-evento/transaccion-evento.service';
import { TransaccionEventoDTO } from 'app/transaccion-evento/transaccion-evento.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaccion-combinada-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
  templateUrl: './transaccion-combinada-list.component.html',
  styleUrls: ['./transaccion-combinada-list.component.css'],
})
export class TransaccionCombinadaListComponent implements OnInit, OnDestroy {
  transaccionService = inject(TransaccionService);
  transaccionesProductoService = inject(TransaccionesProductoService);
  productoService = inject(ProductoService);
  usuarioService = inject(UsuarioService);
  aeronaveService = inject(AeronaveService);
  transaccionEventoService = inject(TransaccionEventoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  http = inject(HttpClient);

  transaccionesCombinadas: (TransaccionDTO & TransaccionesProductoDTO & {
    tcoProNombre: string;
    tceUsrNombre: string;
    tceAnvMatricula: string;
    tcoUnidades: number;
    tceTvoEvento: string;
  })[] = [];

  transaccionesFiltradas: any[] = [];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  navigationSubscription?: Subscription;

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
    this.transaccionService.getAllTransacciones().subscribe({
      next: (transacciones) => {
        this.productoService.getAllProductos().subscribe({
          next: (productos) => {
            this.usuarioService.getAllUsuarios().subscribe({
              next: (usuarios) => {
                this.aeronaveService.getAllAeronaves().subscribe({
                  next: (aeronaves) => {
                    this.transaccionesProductoService.getAllTransaccionesProductos().subscribe({
                      next: (transaccionesProducto) => {
                        this.transaccionEventoService.getAllTransaccionEventos().subscribe({
                          next: (transaccionEventos) => {
                            // Combinar transacciones con sus valores asociados
                            this.transaccionesCombinadas = transacciones.map((transaccion) => {
                              const transaccionProducto = transaccionesProducto.find(
                                (tp) => tp.tcoTce === transaccion.tceId
                              );
                              const producto = productos.find(
                                (p) => p.proId === Number(transaccionProducto?.tcoPro)
                              );
                              const usuario = usuarios.find((u) => u.usrId === transaccion.tceUsr);
                              const aeronave = aeronaves.find((a) => a.anvId === transaccion.tceAnv);
                              const transaccionEvento = transaccionEventos.find(
                                (te) => te.tvoId === transaccion.tceTvo
                              );

                              return {
                                ...transaccion,
                                tcoProNombre: producto?.proNumeroParte || 'N/A',
                                tceUsrNombre: usuario?.usrNombre || 'N/A',
                                tceAnvMatricula: aeronave?.anvMatricula || 'N/A',
                                tcoUnidades: transaccionProducto?.tcoUnidades || 0,
                                tceTvoEvento: transaccionEvento?.tvoEvento || 'N/A',
                                tcoId: transaccionProducto?.tcoId,
                              };
                            });

                            // Ordenar de más reciente a más antiguo
                            this.transaccionesCombinadas.sort((a, b) => {
                              const fechaA = a.tceFechaTransaccion ? new Date(a.tceFechaTransaccion).getTime() : 0;
                              const fechaB = b.tceFechaTransaccion ? new Date(b.tceFechaTransaccion).getTime() : 0;
                              return fechaB - fechaA; // Orden descendente (más reciente primero)
                            });

                            // Inicializar la lista filtrada con todas las transacciones
                            this.transaccionesFiltradas = this.transaccionesCombinadas;
                            this.totalItems = this.transaccionesFiltradas.length;
                          },
                          error: (error) => this.errorHandler.handleServerError(error.error),
                        });
                      },
                      error: (error) => this.errorHandler.handleServerError(error.error),
                    });
                  },
                  error: (error) => this.errorHandler.handleServerError(error.error),
                });
              },
              error: (error) => this.errorHandler.handleServerError(error.error),
            });
          },
          error: (error) => this.errorHandler.handleServerError(error.error),
        });
      },
      error: (error) => this.errorHandler.handleServerError(error.error),
    });
  }

  aplicarFiltroPorRango() {
    if (this.fechaInicio && this.fechaFin) {
      this.transaccionesFiltradas = this.transaccionesCombinadas.filter((transaccion) => {
        if (!transaccion.tceFechaTransaccion) {
          return false; // Omitir transacciones sin fecha
        }
        const fechaTransaccion = new Date(transaccion.tceFechaTransaccion);
        return fechaTransaccion >= this.fechaInicio! && fechaTransaccion <= this.fechaFin!;
      });

      // Ordenar de más reciente a más antiguo
      this.transaccionesFiltradas.sort((a, b) => {
        const fechaA = a.tceFechaTransaccion ? new Date(a.tceFechaTransaccion).getTime() : 0;
        const fechaB = b.tceFechaTransaccion ? new Date(b.tceFechaTransaccion).getTime() : 0;
        return fechaB - fechaA; // Orden descendente (más reciente primero)
      });

      this.totalItems = this.transaccionesFiltradas.length;
      this.currentPage = 1; // Reiniciar a la primera página
    } else {
      this.transaccionesFiltradas = this.transaccionesCombinadas;

      // Ordenar de más reciente a más antiguo
      this.transaccionesFiltradas.sort((a, b) => {
        const fechaA = a.tceFechaTransaccion ? new Date(a.tceFechaTransaccion).getTime() : 0;
        const fechaB = b.tceFechaTransaccion ? new Date(b.tceFechaTransaccion).getTime() : 0;
        return fechaB - fechaA; // Orden descendente (más reciente primero)
      });

      this.totalItems = this.transaccionesFiltradas.length;
      this.currentPage = 1; // Reiniciar a la primera página
    }
  }

  limpiarFiltro() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.transaccionesFiltradas = this.transaccionesCombinadas;

    // Ordenar de más reciente a más antiguo
    this.transaccionesFiltradas.sort((a, b) => {
      const fechaA = a.tceFechaTransaccion ? new Date(a.tceFechaTransaccion).getTime() : 0;
      const fechaB = b.tceFechaTransaccion ? new Date(b.tceFechaTransaccion).getTime() : 0;
      return fechaB - fechaA; // Orden descendente (más reciente primero)
    });

    this.totalItems = this.transaccionesFiltradas.length;
    this.currentPage = 1; // Reiniciar a la primera página
  }

  confirmDelete(tceId: number) {
    if (confirm('¿Está seguro de eliminar esta transacción?')) {
      this.transaccionService.deleteTransaccion(tceId).subscribe({
        next: () =>
          this.router.navigate(['/transaccion-combinada-list'], {
            state: { msgInfo: 'Transacción eliminada correctamente.' },
          }),
        error: (error) => this.errorHandler.handleServerError(error.error),
      });
    }
  }

  generarReportePdf() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor, seleccione un rango de fechas.');
      return;
    }

    const fechaInicio = this.fechaInicio.toISOString().split('T')[0];
    const fechaFin = this.fechaFin.toISOString().split('T')[0];

    this.http.get('/generar-pdf', {
      params: { fechaInicio, fechaFin },
      responseType: 'blob' as 'json'
    }).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  // Métodos de paginación
  get paginatedTransacciones() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.transaccionesFiltradas.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages() {
    return Math.ceil(this.transaccionesFiltradas.length / this.itemsPerPage);
  }
}
