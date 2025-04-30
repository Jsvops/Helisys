import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from 'app/producto/producto.service';
import { ModeloAeronaveService } from 'app/modelo-aeronave/modelo-aeronave.service';
import { DetalleProductoModeloAeronaveService } from './detalle-producto-modelo-aeronave.service';
import { ProductoDTO } from 'app/producto/producto.model';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-producto-aeronave-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-aeronave-list.component.html'
})
export class ProductoAeronaveListComponent implements OnInit {

  productoService = inject(ProductoService);
  modeloAeronaveService = inject(ModeloAeronaveService);
  detalleService = inject(DetalleProductoModeloAeronaveService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  productos: ProductoDTO[] = [];
  modelosAeronave: ModeloAeronaveDTO[] = [];
  detalles: DetalleProductoModeloAeronaveDTO[] = [];
  detallesCompletos: any[] = []; // Lista combinada con detalles completos

  proTpoValues?: Map<number, string>;
  proAmcValues?: Map<number, string>;
  proPveValues?: Map<number, string>;

  ngOnInit() {
    this.loadData();
  }

  loadData() {


    this.productoService.getAllProductos().subscribe({
      next: (productos) => {

        this.productos = productos;

        this.modeloAeronaveService.getAllModeloAeronaves().subscribe({
          next: (modelos) => {

            this.modelosAeronave = modelos;

            this.detalleService.getAllDetalles().subscribe({
              next: (detalles) => {

                this.detalles = detalles;

                // Cargar valores para los selects de Producto
                this.productoService.getProTpoValues().subscribe({
                  next: (proTpoValues) => {

                    this.proTpoValues = proTpoValues;

                    // Cargar valores de Almacén Combinado
                    this.productoService.getAlmacenCombinado().subscribe({
                      next: (proAmcValues) => {

                        this.proAmcValues = new Map(proAmcValues.map(item => [item.amcId, item.descripcionCombinada]));

                        this.productoService.getProPveValues().subscribe({
                          next: (proPveValues) => {

                            this.proPveValues = proPveValues;

                            this.combinarDetalles(); // Combinar detalles solo cuando todos los datos estén cargados
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

  combinarDetalles() {

    // Crear un Map para agrupar detalles por producto
    const detallesPorProducto = new Map<number, any>();

    this.detalles.forEach(detalle => {
      const producto = this.productos.find(p => p.proId === detalle.dpmaPro);
      const modelo = this.modelosAeronave.find(m => m.mreId === detalle.dpmaMre);

      if (producto && producto.proId !== null && producto.proId !== undefined) {


        // Si el producto ya está en el Map, agregar el modelo a la lista de modelos
        if (detallesPorProducto.has(producto.proId)) {
          const detalleExistente = detallesPorProducto.get(producto.proId);
          detalleExistente.mreNombre += ` / ${modelo?.mreNombre ?? 'N/A'}`;
        } else {
          // Si el producto no está en el Map, crear una nueva entrada
          detallesPorProducto.set(producto.proId, {
            ...detalle,
            proNumeroParte: producto.proNumeroParte ?? 'N/A',
            proNombre: producto.proNombre ?? 'N/A',
            proNumeroParteAlterno: producto.proNumeroParteAlterno ?? 'N/A',
            proNumeroSerie: producto.proNumeroSerie ?? 'N/A',
            proUnidades: producto.proUnidades ?? 'N/A',
            proFechaVencimiento: producto.proFechaVencimiento ?? null,
            proTipoDocumento: producto.proTipoDocumento ?? 'N/A',
            proTpo: this.getProTpoNombre(producto.proTpo),
            proAmc: this.getProAmcNombre(producto.proAmc), // Mapear el nombre del almacén combinado
            proPve: this.getProPveNombre(producto.proPve),
            mreNombre: modelo?.mreNombre ?? 'N/A'
          });
        }
      }
    });

    // Convertir el Map a una lista de detalles completos
    this.detallesCompletos = Array.from(detallesPorProducto.values());

  }

  getProTpoNombre(proTpoId: number | null | undefined): string {
    if (!proTpoId || !this.proTpoValues) return 'N/A';
    return this.proTpoValues.get(proTpoId) ?? 'N/A';
  }

  getProAmcNombre(proAmcId: number | null | undefined): string {
    if (!proAmcId || !this.proAmcValues) return 'N/A';
    return this.proAmcValues.get(proAmcId) ?? 'N/A';
  }

  getProPveNombre(proPveId: number | null | undefined): string {
    if (!proPveId || !this.proPveValues) return 'N/A';
    return this.proPveValues.get(proPveId) ?? 'N/A';
  }

  deleteDetalle(dpmaId: number) {
    if (confirm('¿Está seguro de eliminar esta relación?')) {
      this.detalleService.deleteDetalle(dpmaId).subscribe({
        next: () => this.loadData(),
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    }
  }
}
