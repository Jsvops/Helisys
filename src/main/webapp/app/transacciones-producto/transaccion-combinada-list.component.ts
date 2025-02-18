import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
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
  imports: [CommonModule, RouterLink],
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

  navigationSubscription?: Subscription;

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
    this.navigationSubscription!.unsubscribe();
  }

  loadData() {
    // Cargar todas las transacciones
    this.transaccionService.getAllTransacciones().subscribe({
      next: (transacciones) => {
        // Cargar todos los productos
        this.productoService.getAllProductos().subscribe({
          next: (productos) => {
            // Cargar todos los usuarios
            this.usuarioService.getAllUsuarios().subscribe({
              next: (usuarios) => {
                // Cargar todas las aeronaves
                this.aeronaveService.getAllAeronaves().subscribe({
                  next: (aeronaves) => {
                    // Cargar todas las transacciones de productos
                    this.transaccionesProductoService.getAllTransaccionesProductos().subscribe({
                      next: (transaccionesProducto) => {
                        // Cargar todos los eventos de transacción
                        this.transaccionEventoService.getAllTransaccionEventos().subscribe({
                          next: (transaccionEventos) => {
                            // Combinar transacciones con sus valores asociados
                            this.transaccionesCombinadas = transacciones.map(transaccion => {
                              const producto = productos.find(p => p.proId === transaccion.tceTvo); // Asumiendo que tceTvo es el ID del producto
                              const usuario = usuarios.find(u => u.usrId === transaccion.tceUsr);
                              const aeronave = aeronaves.find(a => a.anvId === transaccion.tceAnv);
                              const transaccionProducto = transaccionesProducto.find(tp => tp.tcoTce === transaccion.tceId);
                              const transaccionEvento = transaccionEventos.find(te => te.tvoId === transaccion.tceTvo);

                              return {
                                ...transaccion,
                                tcoProNombre: producto?.proNumeroParte || 'N/A', // Usar proNumeroParte en lugar de proNombre
                                tceUsrNombre: usuario?.usrNombre || 'N/A', // Nombre del usuario (o 'N/A' si no se encuentra)
                                tceAnvMatricula: aeronave?.anvMatricula || 'N/A', // Matrícula de la aeronave (o 'N/A' si no se encuentra)
                                tcoUnidades: transaccionProducto?.tcoUnidades || 0, // Unidades (o 0 si no se encuentra)
                                tceTvoEvento: transaccionEvento?.tvoEvento || 'N/A' // Evento de transacción (o 'N/A' si no se encuentra)
                              };
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
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
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
          this.errorHandler.handleServerError(error.error)
        }
      });
    }
  }
}
