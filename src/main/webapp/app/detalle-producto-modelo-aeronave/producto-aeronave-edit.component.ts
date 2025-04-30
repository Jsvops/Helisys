import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProductoService } from 'app/producto/producto.service';
import { ModeloAeronaveService } from 'app/modelo-aeronave/modelo-aeronave.service';
import { DetalleProductoModeloAeronaveService } from './detalle-producto-modelo-aeronave.service';
import { ProductoDTO } from 'app/producto/producto.model';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-producto-aeronave-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './producto-aeronave-edit.component.html'
})
export class ProductoAeronaveEditComponent implements OnInit {

  productoService = inject(ProductoService);
  modeloAeronaveService = inject(ModeloAeronaveService);
  detalleService = inject(DetalleProductoModeloAeronaveService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  fb = inject(FormBuilder);

  proTpoValues?: Map<number, string>;
  proPveValues?: Map<number, string>;
  proAmcValues?: Map<number, string>;
  modelosAeronave: ModeloAeronaveDTO[] = [];
  currentProId?: number;
  currentDpmaId?: number;

  editForm = this.fb.group({
    proId: new FormControl<number | null>({ value: null, disabled: true }),
    proNumeroParte: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(45)]),
    proNombre: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(45)]),
    proNumeroParteAlterno: new FormControl<string | null>(null, [Validators.maxLength(45)]),
    proNumeroSerie: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(45)]),
    proUnidades: new FormControl<number | null>(null, [Validators.required]),
    proFechaVencimiento: new FormControl<string | null>(null),
    proTipoDocumento: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(25)]),
    proTpo: new FormControl<number | null>(null, [Validators.required]),
    proPve: new FormControl<number | null>(null, [Validators.required]),
    proAmc: new FormControl<number | null>(null, [Validators.required]),
    mreIds: this.fb.array<boolean>([])
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentProId = +params['proId'];
      this.currentDpmaId = +params['dpmaId'];

      if (isNaN(this.currentProId)) {
        return;
      }

      // Cargar valores para los selects antes de inicializar el formulario
      this.loadSelectValues().then(() => {
        // Verificar que currentProId es un número válido
        if (this.currentProId !== undefined) {
          // Cargar datos del producto
          this.productoService.getProducto(this.currentProId).subscribe({
            next: (producto) => {
              this.editForm.patchValue(producto);
            },
            error: (error) => this.errorHandler.handleServerError(error.error)
          });

          // Cargar modelos de aeronave
          this.modeloAeronaveService.getAllModeloAeronaves().subscribe({
            next: (modelos) => {
              this.modelosAeronave = modelos;
              this.initializeCheckboxes();

              // Cargar relaciones existentes entre el producto y los modelos de aeronave
              if (this.currentProId !== undefined) {
                this.detalleService.getDetallesByProductoId(this.currentProId).subscribe({
                  next: (detalles) => {
                    const mreIds = this.editForm.get('mreIds') as FormArray;
                    detalles.forEach(detalle => {
                      const index = this.modelosAeronave.findIndex(m => m.mreId === detalle.dpmaMre);
                      if (index !== -1) {
                        mreIds.at(index).setValue(true); // Marcar los checkboxes correspondientes
                      }
                    });
                  },
                  error: (error) => this.errorHandler.handleServerError(error.error)
                });
              }
            },
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
        }
      });
    });
  }

  async loadSelectValues() {
    // Cargar valores para los selects
    this.proTpoValues = await this.productoService.getProTpoValues().toPromise();
    this.proPveValues = await this.productoService.getProPveValues().toPromise();

    // Cargar valores de Almacén Combinado
    this.productoService.getAlmacenCombinado().subscribe({
      next: (data) => {
        this.proAmcValues = new Map(data.map(item => [item.amcId, item.descripcionCombinada]));
      },
      error: (error) => {
        this.errorHandler.handleServerError(error.error);
      }
    });
  }

  initializeCheckboxes() {
    const mreIds = this.editForm.get('mreIds') as FormArray;
    this.modelosAeronave.forEach(() => {
      mreIds.push(this.fb.control(false));
    });
  }

  handleSubmit() {
    if (!this.editForm.valid) {
      return;
    }

    const productoData = new ProductoDTO(this.editForm.value);
    const modelosSeleccionados = this.editForm.value.mreIds
      ?.map((checked, index) => checked ? this.modelosAeronave[index].mreId : null)
      .filter((mreId): mreId is number => mreId !== null && mreId !== undefined);

    // Actualizar producto
    this.productoService.updateProducto(this.currentProId!, productoData).subscribe({
      next: () => {
        // Actualizar relaciones producto-modelo aeronave
        if (modelosSeleccionados && this.currentProId !== undefined) {
          this.detalleService.updateDetallesByProductoId(this.currentProId, modelosSeleccionados).subscribe({
           next: () => {
                         // Redirigir con mensaje de éxito
                         this.router.navigate(['/producto-aeronave-list'], {
                           state: { msgSuccess: 'Pieza editada exitosamente' }
                         });
                       },
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
        }
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }
}
