import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetalleProductoModeloAeronaveService } from './detalle-producto-modelo-aeronave.service';
import { ProductoService } from 'app/producto/producto.service';
import { ModeloAeronaveService } from 'app/modelo-aeronave/modelo-aeronave.service';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';
import { ProductoDTO } from 'app/producto/producto.model';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-producto-aeronave-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './producto-aeronave-add.component.html'
})
export class ProductoAeronaveAddComponent implements OnInit {

  detalleService = inject(DetalleProductoModeloAeronaveService);
  productoService = inject(ProductoService);
  modeloAeronaveService = inject(ModeloAeronaveService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  fb = inject(FormBuilder);

  proTpoValues?: Map<number, string>;
  proPveValues?: Map<number, string>;
  proAmcValues?: Map<number, string>;
  modelosAeronave: ModeloAeronaveDTO[] = []; // Lista de modelos de aeronaves

  addForm = this.fb.group({
    // Campos de Producto
    proNumeroParte: [null, [Validators.required, Validators.maxLength(45)]],
    proNombre: [null, [Validators.required, Validators.maxLength(45)]],
    proNumeroParteAlterno: [null, [Validators.maxLength(45)]],
    proNumeroSerie: [null, [Validators.required, Validators.maxLength(45)]],
    proUnidades: [null, [Validators.required]],
    proFechaVencimiento: [null],
    proTipoDocumento: [null, [Validators.required, Validators.maxLength(25)]],
    proTpo: [null, [Validators.required]],
    proPve: [null, [Validators.required]],
    proAmc: [null, [Validators.required]],

    // Campo de Modelo Aeronave (checkboxes)
    mreIds: this.fb.array([]) // Usamos un FormArray para los checkboxes
  });

  // Getter para acceder al FormArray de checkboxes
  get mreIds(): FormArray {
    return this.addForm.get('mreIds') as FormArray;
  }

  ngOnInit() {
    // Cargar valores para los selects de Producto
    this.productoService.getProTpoValues()
      .subscribe({
        next: (data) => this.proTpoValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });

    this.productoService.getProPveValues()
      .subscribe({
        next: (data) => this.proPveValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });

    this.productoService.getAlmacenCombinado()
      .subscribe({
        next: (data) => {
          this.proAmcValues = new Map(data.map(item => [item.amcId, item.descripcionCombinada]));
        },
        error: (error) => {
          this.errorHandler.handleServerError(error.error);
        }
      });

    // Cargar la lista de modelos de aeronaves
    this.modeloAeronaveService.getAllModeloAeronaves()
      .subscribe({
        next: (data) => {
          this.modelosAeronave = data;
          this.initializeCheckboxes(); // Inicializar checkboxes
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  // Inicializar checkboxes
  initializeCheckboxes() {
    this.modelosAeronave.forEach(() => {
      this.mreIds.push(this.fb.control(false)); // Inicializar cada checkbox como false
    });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    // Crear Producto
    const productoData = new ProductoDTO({
      proNumeroParte: this.addForm.get('proNumeroParte')?.value!,
      proNombre: this.addForm.get('proNombre')?.value!,
      proNumeroParteAlterno: this.addForm.get('proNumeroParteAlterno')?.value!,
      proNumeroSerie: this.addForm.get('proNumeroSerie')?.value!,
      proUnidades: this.addForm.get('proUnidades')?.value!,
      proFechaVencimiento: this.addForm.get('proFechaVencimiento')?.value!,
      proTipoDocumento: this.addForm.get('proTipoDocumento')?.value!,
      proTpo: this.addForm.get('proTpo')?.value!,
      proPve: this.addForm.get('proPve')?.value!,
      proAmc: this.addForm.get('proAmc')?.value!
    });

    this.productoService.createProducto(productoData)
      .subscribe({
        next: (productoId: number) => { // productoId es un número
          // Obtener los IDs de los modelos de aeronave seleccionados
          const modelosSeleccionados = this.mreIds.controls
            .map((control, index) => control.value ? this.modelosAeronave[index].mreId : null)
            .filter(mreId => mreId !== null);

          // Crear un detalle por cada modelo de aeronave seleccionado
          modelosSeleccionados.forEach(modeloAeronaveId => {
            const detalleData = new DetalleProductoModeloAeronaveDTO({
              dpmaPro: productoId, // Asignar el ID del producto creado
              dpmaMre: modeloAeronaveId // Asignar el ID del modelo de aeronave seleccionado
            });

            this.detalleService.createDetalle(detalleData)
              .subscribe({
                next: () => {
                  // Redirigir después de crear todos los detalles
                  if (modelosSeleccionados.indexOf(modeloAeronaveId) === modelosSeleccionados.length - 1) {
                    this.router.navigate(['/producto-aeronave-list'], {
                      state: {
                        msgSuccess: 'Pieza agregada exitosamente'
                      }
                    });
                  }
                },
                error: (error) => this.errorHandler.handleServerError(error.error)
              });
          });
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }
}
