import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProductoService } from 'app/producto/producto.service';
import { ProductRequestDTO } from 'app/producto/product-request.dto';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AlmacenJerarquicoDTO } from 'app/almacen-jerarquico/almacen-jerarquico.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-producto-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent, MatFormFieldModule,MatSelectModule, MatOptionModule],
  templateUrl: './producto-add.component.html',
  styleUrls: ['./producto-add.component.css'],
})
export class ProductoAddComponent implements OnInit {

  productoService = inject(ProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  proTpoValues?: Map<number, string>;
  proAmcValues?: Map<number, string>;
  proPveValues?: Map<number, string>;
  modeloAeronaveValues?: Map<number, string>;
  modeloAeronaveArray: { value: number, label: string }[] = [];



  addForm = new FormGroup({
    proNumeroParte: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proNumeroParteAlterno: new FormControl(null, [Validators.maxLength(45)]),
    proNumeroSerie: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    proTipoDocumento: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    proTpo: new FormControl(null, [Validators.required]),
    proAmc: new FormControl(null, [Validators.required]),
    proPve: new FormControl(null, [Validators.required]),
    modeloAeronaveIds: new FormControl([], [Validators.required])

  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@producto.create.success:Producto was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadProTpoValues();
    this.loadProPveValues();
    this.loadAlmacenJerarquico();
    this.loadModeloAeronaveValues(); // <-- Agrega esto

  }

  private loadProTpoValues() {
    this.productoService.getProTpoValues()
      .subscribe({
        next: (data) => this.proTpoValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  private loadProPveValues() {
    this.productoService.getProPveValues()
      .subscribe({
        next: (data) => this.proPveValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  private loadAlmacenJerarquico() {
    this.productoService.getAlmacenJerarquico()
      .subscribe({
        next: (data) => {
          this.proAmcValues = new Map(data.map(item => [item.amcId, item.descripcionJerarquica]));
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  private loadModeloAeronaveValues() {
    this.productoService.getModeloAeronaveValues()
      .subscribe({
        next: (data) => {
          const filtered = data.filter(item => item.mreId != null && item.mreNombre != null);
          this.modeloAeronaveValues = new Map(filtered.map(item => [item.mreId!, item.mreNombre!]));
          this.modeloAeronaveArray = filtered.map(item => ({
            value: item.mreId!,
            label: item.mreNombre!
          }));
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    const formData = this.addForm.value;
    const data: ProductRequestDTO = {
      proNumeroParte: formData.proNumeroParte!,
      proNombre: formData.proNombre!,
      proNumeroParteAlterno: formData.proNumeroParteAlterno || undefined,
      proNumeroSerie: formData.proNumeroSerie!,
      proTipoDocumento: formData.proTipoDocumento!,
      proTpo: formData.proTpo!,
      proAmc: formData.proAmc!,
      proPve: formData.proPve!,
      proUnidades: 0, // valor por defecto (puede omitirse si el backend lo asigna)
      modeloAeronaveIds: formData.modeloAeronaveIds || []

    };

    this.productoService.crearProducto(data)
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
