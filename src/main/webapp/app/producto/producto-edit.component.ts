import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProductoService } from 'app/producto/producto.service';
import { ProductoDTO } from 'app/producto/producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';

@Component({
  selector: 'app-producto-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './producto-edit.component.html'
})
export class ProductoEditComponent implements OnInit {

  productoService = inject(ProductoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  proTpoValues?: Map<number, string>;
  proAmcValues?: Map<number, string>;
  proPveValues?: Map<number, string>;
  currentProId?: number;

  editForm = new FormGroup({
    proId: new FormControl({ value: null, disabled: true }),
    proNumeroParte: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proNumeroParteAlterno: new FormControl(null, [Validators.maxLength(45)]),
    proNumeroSerie: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proUnidades: new FormControl(null, [Validators.required]),
    proFechaVencimiento: new FormControl(null),
    proTipoDocumento: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    proTpo: new FormControl(null, [Validators.required]),
    proAmc: new FormControl(null, [Validators.required]),
    proPve: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@producto.update.success:Producto was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentProId = +this.route.snapshot.params['proId'];
    this.productoService.getProTpoValues()
      .subscribe({
        next: (data) => this.proTpoValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.productoService.getProAmcValues()
      .subscribe({
        next: (data) => this.proAmcValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.productoService.getProPveValues()
      .subscribe({
        next: (data) => this.proPveValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.productoService.getProducto(this.currentProId!)
      .subscribe({
        next: (data) => updateForm(this.editForm, data),
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new ProductoDTO(this.editForm.value);
    this.productoService.updateProducto(this.currentProId!, data)
      .subscribe({
        next: () => this.router.navigate(['/productos'], {
          state: {
            msgSuccess: this.getMessage('updated')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
      });
  }
}
