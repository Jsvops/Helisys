import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para usar ngModel
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

@Component({
  selector: 'app-transaccion-combinada-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // Agregar FormsModule
  templateUrl: './transaccion-combinada-list.component.html'
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

  transaccionesCombinadas: (TransaccionDTO & TransaccionesProductoDTO & {
    tcoProNombre: string,
    tceUsrNombre: string,
    tceAnvMatricula: string,
    tcoUnidades: number,
    tceTvoEvento: string
  })[] = [];

  transaccionesFiltradas: any[] = []; // Lista filtrada
  filtroAnio: number | null = null;
  filtroMes: number | null = null;
  filtroDia: number | null = null;

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
                            this.transaccionesCombinadas = transacciones.map(transaccion => {
                              const producto = productos.find(p => p.proId === transaccion.tceTvo);
                              const usuario = usuarios.find(u => u.usrId === transaccion.tceUsr);
                              const aeronave = aeronaves.find(a => a.anvId === transaccion.tceAnv);
                              const transaccionProducto = transaccionesProducto.find(tp => tp.tcoTce === transaccion.tceId);
                              const transaccionEvento = transaccionEventos.find(te => te.tvoId === transaccion.tceTvo);

                              return {
                                ...transaccion,
                                tcoProNombre: producto?.proNumeroParte || 'N/A',
                                tceUsrNombre: usuario?.usrNombre || 'N/A',
                                tceAnvMatricula: aeronave?.anvMatricula || 'N/A',
                                tcoUnidades: transaccionProducto?.tcoUnidades || 0,
                                tceTvoEvento: transaccionEvento?.tvoEvento || 'N/A',
                                tcoId: transaccionProducto?.tcoId
                              };
                            });

                            // Inicializar la lista filtrada con todas las transacciones
                            this.transaccionesFiltradas = this.transaccionesCombinadas;
                          },
                          error: (error) => this.errorHandler.handleServerError(error.error)
                        });
                      },
                      error: (error) => this.errorHandler.handleServerError(error.error)
                    });
                  },
                  error: (error) => this.errorHandler.handleServerError(error.error)
                });
              },
              error: (error) => this.errorHandler.handleServerError(error.error)
            });
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  aplicarFiltro() {
    this.transaccionesFiltradas = this.transaccionesCombinadas.filter(transaccion => {
      // Validar que tceFechaTransaccion no sea null o undefined
      if (!transaccion.tceFechaTransaccion) {
        return false; // Omitir transacciones sin fecha
      }

      // Crear un objeto Date en UTC
      const fechaTransaccion = new Date(transaccion.tceFechaTransaccion + 'T00:00:00Z'); // Asegurar que sea UTC

      // Obtener año, mes y día en UTC
      const anioTransaccion = fechaTransaccion.getUTCFullYear();
      const mesTransaccion = fechaTransaccion.getUTCMonth() + 1; // getUTCMonth() devuelve 0-11
      const diaTransaccion = fechaTransaccion.getUTCDate();

      // Comparar con los filtros
      const coincideAnio = this.filtroAnio ? anioTransaccion === this.filtroAnio : true;
      const coincideMes = this.filtroMes ? mesTransaccion === this.filtroMes : true;
      const coincideDia = this.filtroDia ? diaTransaccion === this.filtroDia : true;

      return coincideAnio && coincideMes && coincideDia;
    });
  }

  limpiarFiltro() {
    this.filtroAnio = null;
    this.filtroMes = null;
    this.filtroDia = null;
    this.transaccionesFiltradas = this.transaccionesCombinadas;
  }

  confirmDelete(tceId: number) {
    if (confirm('¿Está seguro de eliminar esta transacción?')) {
      this.transaccionService.deleteTransaccion(tceId).subscribe({
        next: () => this.router.navigate(['/transaccion-combinada-list'], {
          state: { msgInfo: 'Transacción eliminada correctamente.' }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    }
  }

  logIds(tceId: number | null | undefined, tcoId: number | null | undefined) {
    if (tceId != null && tcoId != null) {
      console.log('Navigating to edit with tceId:', tceId, 'and tcoId:', tcoId);
    } else {
      console.error('Invalid IDs:', tceId, tcoId);
    }
  }
}
