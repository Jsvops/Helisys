import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from 'app/producto/producto.service';
import { ProductRequestDTO } from 'app/producto/product-request.dto';
import { ProductResponseDTO } from 'app/producto/product-response.dto';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producto-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRowComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './producto-edit.component.html',
  styleUrls: ['./producto-edit.component.css']
})
export class ProductoEditComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);

  proId?: number;
  proUnidades = 0;

  proTpoValues?: Map<number, string>;
  proAmcValues?: Map<number, string>;
  proPveValues?: Map<number, string>;
  modeloAeronaveValues?: Map<number, string>;
  modeloAeronaveArray: { value: number, label: string }[] = [];

  editForm = new FormGroup({
      proNumeroParte: new FormControl<string | null>(null, [Validators.required]),
      proNombre: new FormControl<string | null>(null, [Validators.required]),
      proNumeroParteAlterno: new FormControl<string | null>(null),
      proNumeroSerie: new FormControl<string | null>(null, [Validators.required]),
      proTipoDocumento: new FormControl<string | null>(null, [Validators.required]),
      proTpo: new FormControl<number | null>(null, [Validators.required]),
      proAmc: new FormControl<number | null>(null, [Validators.required]),
      proPve: new FormControl<number | null>(null, [Validators.required]),
      modeloAeronaveIds: new FormControl<number[] | null>(null,[Validators.required]),
    }, { updateOn: 'submit' });

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('proId');
    console.log('ID recibido en ruta:', param);

    this.proId = Number(param);

    if (!this.proId || isNaN(this.proId)) {
      console.warn('ID inválido:', this.proId);
      return;
    }

    this.loadAllData();
  }


  private loadAllData() {
    this.loadProTpoValues();
    this.loadProPveValues();
    this.loadProAmcValues();
    this.loadModeloAeronaveValues();
    this.loadProducto();
  }

  private loadProTpoValues() {
    this.productoService.getProTpoValues().subscribe({
      next: (data) => this.proTpoValues = data,
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  private loadProPveValues() {
    this.productoService.getProPveValues().subscribe({
      next: (data) => this.proPveValues = data,
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  private loadProAmcValues() {
    this.productoService.getAlmacenJerarquico().subscribe({
      next: (data) => {
        this.proAmcValues = new Map(data.map(item => [item.amcId, item.descripcionJerarquica]));
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  private loadModeloAeronaveValues() {
    this.productoService.getModeloAeronaveValues().subscribe({
      next: (data) => {
        const filtered = data.filter(item => item.mreId && item.mreNombre);
        this.modeloAeronaveValues = new Map(filtered.map(item => [item.mreId!, item.mreNombre!]));
        this.modeloAeronaveArray = filtered.map(item => ({
          value: item.mreId!,
          label: item.mreNombre!
        }));
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  private loadProducto() {
    console.log('loadProducto llamado con ID:', this.proId);

    if (!this.proId) return;

    this.productoService.getProducto(this.proId).subscribe({
      next: (producto: ProductResponseDTO) => {
        this.proUnidades = producto.proUnidades ?? 0;
        this.editForm.setValue({
          proNumeroParte: producto.proNumeroParte,
          proNombre: producto.proNombre,
          proNumeroParteAlterno: producto.proNumeroParteAlterno ?? null,
          proNumeroSerie: producto.proNumeroSerie,
          proTipoDocumento: producto.proTipoDocumento,
          proTpo: producto.proTpoId,
          proAmc: producto.proAmcId,
          proPve: producto.proPveId,
          modeloAeronaveIds: producto.modeloAeronaveIds ?? []
        });
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid || !this.proId) return;

    const formData = this.editForm.value;
    const data: ProductRequestDTO = {
      proNumeroParte: formData.proNumeroParte!,
      proNombre: formData.proNombre!,
      proNumeroParteAlterno: formData.proNumeroParteAlterno || undefined,
      proNumeroSerie: formData.proNumeroSerie!,
      proTipoDocumento: formData.proTipoDocumento!,
      proTpo: formData.proTpo!,
      proAmc: formData.proAmc!,
      proPve: formData.proPve!,
      proUnidades: this.proUnidades,
      modeloAeronaveIds: formData.modeloAeronaveIds || []
    };

    this.productoService.updateProducto(this.proId, data).subscribe({
      next: () => {
        this.snackBar.open('Pieza actualizada correctamente ✅', '',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success', 'snackbar-offset'],
          }
        );

        this.router.navigate(['/productos']);
      },
      error: (error) => this.errorHandler.handleServerError(error.error, this.editForm)
    });
  }

}
