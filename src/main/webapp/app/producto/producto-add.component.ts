import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProductoService } from 'app/producto/producto.service';
import { ProductoDTO } from 'app/producto/producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AlmacenCombinadoDTO } from 'app/almacen-combinado/almacen-combinado.model'; // Importa el modelo

@Component({
  selector: 'app-producto-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './producto-add.component.html'
})
export class ProductoAddComponent implements OnInit {

  productoService = inject(ProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  proTpoValues?: Map<number, string>;
  proAmcValues?: Map<number, string>; // Mantenemos el tipo Map
  proMreValues?: Map<number, string>;
  proPveValues?: Map<number, string>;

  addForm = new FormGroup({
    proNumeroParte: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proNumeroParteAlterno: new FormControl(null, [Validators.maxLength(45)]),
    proNumeroSerie: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proUnidades: new FormControl(null, [Validators.required]),
    proFechaVencimiento: new FormControl(null),
    proTipoDocumento: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    proTpo: new FormControl(null, [Validators.required]),
    proAmc: new FormControl(null, [Validators.required]),
    proMre: new FormControl(null, [Validators.required]),
    proPve: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@producto.create.success:Producto was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.productoService.getProTpoValues()
      .subscribe({
        next: (data) => this.proTpoValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });

    this.productoService.getProMreValues()
      .subscribe({
        next: (data) => this.proMreValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });

    this.productoService.getProPveValues()
      .subscribe({
        next: (data) => this.proPveValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });

    // Cargar los datos combinados para proAmc
    this.productoService.getAlmacenCombinado()
      .subscribe({
        next: (data) => {
          console.log('Datos combinados recibidos:', data);

          // Convertir los datos a un Map
          this.proAmcValues = new Map(data.map(item => [item.amcId, item.descripcionCombinada]));

          console.log('Valores de proAmcValues:', this.proAmcValues);
        },
        error: (error) => {
          console.error('Error al cargar datos combinados:', error);
          this.errorHandler.handleServerError(error.error);
        }
      });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ProductoDTO(this.addForm.value);
    this.productoService.createProducto(data)
      .subscribe({
        next: () => this.router.navigate(['/productos'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }
}
