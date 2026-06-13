import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProductoService } from 'app/producto/producto.service';
import { ProductRequestDTO } from 'app/producto/product-request.dto';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {AlmacenJerarquicoDTO} from "../almacen-jerarquico/almacen-jerarquico.model";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { startWith, tap } from 'rxjs/operators';




@Component({
  selector: 'app-producto-add',
  imports: [CommonModule,
    ReactiveFormsModule,
    InputRowComponent,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './producto-add.component.html',
  styleUrls: ['./producto-add.component.scss'],
})
export class ProductoAddComponent implements OnInit {

  productoService = inject(ProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);
  amcInputCtrl = new FormControl<string>('', { nonNullable: true, updateOn: 'change' });
  amcOptions$!: Observable<AlmacenJerarquicoDTO[]>;


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
    proAmc: new FormControl<number | null>(null, [Validators.required]),
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
    this.initAmcAutocomplete();
    this.loadModeloAeronaveValues();
  }

  private initAmcAutocomplete() {
    this.amcOptions$ = this.amcInputCtrl.valueChanges.pipe(
      startWith(this.amcInputCtrl.value),
      debounceTime(300),
      distinctUntilChanged(),
      tap(text => {
        // Si el usuario modifica/borra el texto, el ID seleccionado ya no es confiable
        const trimmed = (text ?? '').trim();
        if (trimmed.length < 3) {
          this.addForm.get('proAmc')?.setValue(null); // en Add: this.addForm.get('proAmc')...
        }
      }),
      switchMap(text => {
        const q = (text ?? '').trim();

        // ✅ clave: emitir lista vacía cuando hay < 3 letras
        if (q.length < 3) return of([]);

        return this.productoService.suggestAlmacenJerarquico(q).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  onAmcSelected(event: MatAutocompleteSelectedEvent) {
    const selected = event.option.value as AlmacenJerarquicoDTO;

    // Guarda el ID en el formulario (lo que se envía al backend)
    this.addForm.get('proAmc')?.setValue(selected.amcId);

    // Deja en el input solo el label
    this.amcInputCtrl.setValue(selected.descripcionJerarquica, { emitEvent: false });
  }

  clearAmcSelection() {
    this.amcInputCtrl.setValue('', { emitEvent: true }); // importante: true para que limpie opciones
    this.addForm.get('proAmc')?.setValue(null);
    this.addForm.get('proAmc')?.markAsTouched();
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
  /*
  private loadAlmacenJerarquico() {
    this.productoService.getAlmacenJerarquico()
      .subscribe({
        next: (data) => {
          this.proAmcValues = new Map(data.map(item => [item.amcId, item.descripcionJerarquica]));
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }
   */

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

  navigateToProductos(): void {
      this.router.navigate(['/productos']);
    }

  trackByValue = (_: number, item: { value: number }) => item.value;

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
      proUnidades: 0,
      modeloAeronaveIds: formData.modeloAeronaveIds || []

    };

    this.productoService.crearProducto(data).subscribe({
      next: () => {
        this.snackBar.open('Pieza añadida correctamente ✅', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success', 'snackbar-offset']
        });
        this.router.navigate(['/productos']);
      },
      error: (err: HttpErrorResponse) => {
        if (err?.status === 409) {
          this.snackBar.open('Ya existe una pieza con ese número de parte ℹ️', '', {
            duration: 7000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error', 'snackbar-offset']
          });
          return;
        }
        this.errorHandler.handleServerError(err.error, this.addForm, this.getMessage);
      }
    });
    }

}
