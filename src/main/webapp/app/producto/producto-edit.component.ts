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
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import {AlmacenJerarquicoDTO} from "../almacen-jerarquico/almacen-jerarquico.model";
import {HttpErrorResponse} from "@angular/common/http";
import { startWith, tap } from 'rxjs/operators';



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
    MatSnackBarModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './producto-edit.component.html',
  styleUrls: ['./producto-edit.component.scss']
})
export class ProductoEditComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);
  amcInputCtrl = new FormControl<string>('', { nonNullable: true });
  amcOptions$!: Observable<AlmacenJerarquicoDTO[]>;


  proId?: number;
  proUnidades = 0;

  proTpoValues?: Map<number, string>;
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
    this.initAmcAutocomplete(); // <-- NUEVO
    this.loadProTpoValues();
    this.loadProPveValues();
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

  private loadAmcLabel(amcId: number | null | undefined) {
    if (amcId == null) return;

    this.productoService.getAlmacenJerarquicoById(amcId).subscribe({
      next: (dto: AlmacenJerarquicoDTO) => {
        this.amcInputCtrl.setValue(dto.descripcionJerarquica, { emitEvent: false });
      },
      error: (error: HttpErrorResponse) => this.errorHandler.handleServerError(error.error)
    });
  }



  private initAmcAutocomplete() {
    this.amcOptions$ = this.amcInputCtrl.valueChanges.pipe(
      startWith(this.amcInputCtrl.value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(text => {
        const q = (text ?? '').trim();

        // ✅ Si el usuario borró o hay menos de 3 letras:
        // - vaciamos opciones
        // - y limpiamos el ID porque ya no hay selección válida
        if (q.length < 3) {
          this.editForm.get('proAmc')?.setValue(null);
          return of([]);
        }

        return this.productoService.suggestAlmacenJerarquico(q).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  onAmcSelected(event: MatAutocompleteSelectedEvent) {
    const selected = event.option.value as AlmacenJerarquicoDTO;

    // guarda el ID real para backend
    this.editForm.get('proAmc')?.setValue(selected.amcId);

    // muestra solo el label
    this.amcInputCtrl.setValue(selected.descripcionJerarquica, { emitEvent: false });
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

        this.loadAmcLabel(producto.proAmcId);

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
