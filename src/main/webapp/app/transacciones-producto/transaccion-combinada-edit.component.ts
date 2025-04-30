import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from 'app/producto/producto.service';

@Component({
  selector: 'app-transaccion-combinada-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-combinada-edit.component.html'
})
export class TransaccionCombinadaEditComponent implements OnInit {

  transaccionService = inject(TransaccionService);
  transaccionesProductoService = inject(TransaccionesProductoService);
  authService = inject(AuthService);
  productoService = inject(ProductoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);

  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  tcoProValues?: Map<number, string>;
  aeronaves: { anvId: number, anvMatricula: string }[] = [];
  currentTceId?: number;
  currentTcoId?: number;
  showAeronaveField: boolean = false;

  editForm = new FormGroup({
    tceId: new FormControl<number | null>({ value: null, disabled: true }),
    tceFechaTransaccion: new FormControl<string | null>(null, [Validators.required]),
    tceObservaciones: new FormControl<string | null>(null, [Validators.maxLength(500)]),
    tceTvo: new FormControl<number | null>(null, [Validators.required]),
    tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
    tcoId: new FormControl<number | null>({ value: null, disabled: true }),
    tcoUnidades: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    tcoPro: new FormControl<string | null>(null, [Validators.required]), // Cambiado a string
    tcoTce: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
    tceAnv: new FormControl<number | null>(null)
  }, { updateOn: 'change' });

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentTceId = +params['tceId'];
      this.currentTcoId = +params['tcoId'];

      if (isNaN(this.currentTceId) || isNaN(this.currentTcoId)) {
        return;
      }

      // Obtener valores para los selectores
      this.transaccionService.getTceTvoValues()
        .subscribe({
          next: (data) => {
            this.tceTvoValues = data;
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });

      this.transaccionService.getTceUsrValues()
        .subscribe({
          next: (data) => {
            this.tceUsrValues = data;
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });

      // Obtener datos de la transacción y el producto de la transacción
      this.transaccionService.getTransaccion(this.currentTceId!)
        .subscribe({
          next: (transaccionData) => {
            this.transaccionesProductoService.getTransaccionesProducto(this.currentTcoId!)
              .subscribe({
                next: (transaccionProductoData) => {
                  // Obtener el número de parte del producto
                  this.transaccionesProductoService.getTcoProValues()
                    .subscribe({
                      next: (tcoProValues) => {
                        this.tcoProValues = tcoProValues;
                        const proNumeroParte = tcoProValues.get(transaccionProductoData.tcoPro!) || null;

                        // Combina los datos de la transacción y el producto de la transacción
                        const combinedData = {
                          tceId: transaccionData.tceId ?? null,
                          tceFechaTransaccion: transaccionData.tceFechaTransaccion ?? null,
                          tceObservaciones: transaccionData.tceObservaciones ?? null,
                          tceTvo: transaccionData.tceTvo ?? null,
                          tceUsr: transaccionData.tceUsr ?? null,
                          tcoId: transaccionProductoData.tcoId ?? null,
                          tcoUnidades: transaccionProductoData.tcoUnidades ?? null,
                          tcoPro: proNumeroParte, // Usar el número de parte
                          tcoTce: transaccionProductoData.tcoTce ?? null,
                          tceAnv: transaccionData.tceAnv ?? null
                        };

                        // Actualiza el formulario con los datos combinados
                        this.editForm.patchValue(combinedData);

                        // Verifica si se debe mostrar el campo de aeronave
                        this.checkAeronaveField(transaccionData.tceTvo ?? null);
                      },
                      error: (error) => this.errorHandler.handleServerError(error.error)
                    });
                },
                error: (error) => this.errorHandler.handleServerError(error.error)
              });
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    });

    // Escuchar cambios en el campo tcoPro (producto)
    this.editForm.get('tcoPro')?.valueChanges.subscribe((proNumeroParte: string | null) => {
      if (proNumeroParte !== null) {
        const productoId = this.getProIdFromNumeroParte(proNumeroParte);
        if (productoId) {
          this.transaccionService.getAeronavesCompatibles(productoId).subscribe({
            next: (aeronaves) => {
              this.aeronaves = aeronaves;
            },
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
        }
      }
    });

    // Escuchar cambios en el campo tceTvo
    this.editForm.get('tceTvo')?.valueChanges.subscribe(value => {
      this.checkAeronaveField(value ?? null);
    });
  }

  checkAeronaveField(tceTvoValue: number | null) {
    this.showAeronaveField = tceTvoValue === 9; // Asegúrate de que el ID sea correcto (9 en este caso)
    const tceAnvControl = this.editForm.get('tceAnv');
    if (this.showAeronaveField) {
      tceAnvControl?.setValidators([Validators.required]);
    } else {
      tceAnvControl?.clearValidators();
      tceAnvControl?.setValue(null);
    }
    tceAnvControl?.updateValueAndValidity();
  }

  getProIdFromNumeroParte(proNumeroParte: string): number | null {
    if (!this.tcoProValues) return null;
    for (const [proId, numeroParte] of this.tcoProValues.entries()) {
      if (numeroParte === proNumeroParte) return proId;
    }
    return null;
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();

    if (!this.editForm.valid) {
      return;
    }

    const proNumeroParte = this.editForm.get('tcoPro')?.value!;
    const productoId = this.getProIdFromNumeroParte(proNumeroParte);

    if (!productoId) {
      return;
    }

    const tceUsrValue = this.editForm.get('tceUsr')?.value;
    if (tceUsrValue == null) {
      return;
    }

    const tcoTceValue = this.currentTceId;
    if (tcoTceValue == null) {
      return;
    }

    // Crear instancias de los DTOs con los valores del formulario
    const transaccionData = new TransaccionDTO({
      tceId: this.editForm.value.tceId ?? null,
      tceFechaTransaccion: this.editForm.value.tceFechaTransaccion ?? null,
      tceObservaciones: this.editForm.value.tceObservaciones ?? null,
      tceTvo: this.editForm.value.tceTvo ?? null,
      tceUsr: tceUsrValue,
      tceAnv: this.editForm.value.tceAnv ?? null
    });

    const transaccionProductoData = new TransaccionesProductoDTO({
      tcoId: this.editForm.value.tcoId ?? null,
      tcoUnidades: this.editForm.value.tcoUnidades ?? null,
      tcoPro: productoId, // Usar el productoId obtenido
      tcoTce: tcoTceValue // Usar el valor de currentTceId manualmente
    });

    // Actualizar la transacción y el producto de la transacción
    this.transaccionService.updateTransaccion(this.currentTceId!, transaccionData)
      .subscribe({
        next: () => {
          this.transaccionesProductoService.updateTransaccionesProducto(this.currentTcoId!, transaccionProductoData)
            .subscribe({
              next: () => this.router.navigate(['/transaccion-combinada-list'], {
                state: { msgSuccess: 'Transacción combinada actualizada exitosamente.' }
              }),
              error: (error) => this.errorHandler.handleServerError(error.error)
            });
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }
}
