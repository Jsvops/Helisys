import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'app/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchComponent } from 'app/search/search.component';
import { ProductoService } from 'app/producto/producto.service';
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transaccion-combinada-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-combinada-add.component.html'
})
export class TransaccionCombinadaAddComponent implements OnInit {

  transaccionesProductoService = inject(TransaccionesProductoService);
  transaccionService = inject(TransaccionService);
  authService = inject(AuthService);
  productoService = inject(ProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  tcoProValues?: Map<number, string>;
  aeronaves: { anvId: number, anvMatricula: string }[] = [];
  currentUserId?: number;
  currentUserName?: string;
  currentTransactionId?: number;
  showAeronaveField: boolean = false;
  partNumberNotFound = false; // Nueva propiedad para controlar el mensaje de error

  addForm = new FormGroup({
    tceFechaTransaccion: new FormControl({ value: this.getCurrentDate(), disabled: true }, [Validators.required]),
    tceObservaciones: new FormControl(null, [Validators.maxLength(500)]),
    tceTvo: new FormControl(null, [Validators.required]),
    tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
    tcoUnidades: new FormControl(null, [Validators.required, Validators.min(1)]),
    tcoPro: new FormControl(null, [Validators.required]),
    tcoTce: new FormControl({ value: null as number | null, disabled: true }, [Validators.required]),
    tceAnv: new FormControl(null)
  }, { updateOn: 'change' });

  ngOnInit() {
    this.authService.getCurrentUserInfo().subscribe({
      next: (userInfo) => {
        this.currentUserId = userInfo.usrId;
        this.currentUserName = userInfo.usrNombre;
        this.addForm.patchValue({ tceUsr: this.currentUserId });
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.transaccionService.getTceTvoValues()
      .subscribe({
        next: (data: Map<number, string>) => this.tceTvoValues = data,
        error: (error: any) => this.errorHandler.handleServerError(error)
      });

    this.transaccionService.getTceUsrValues()
      .subscribe({
        next: (data: Map<number, string>) => this.tceUsrValues = data,
        error: (error: any) => this.errorHandler.handleServerError(error)
      });

    this.actualizarListaProductos();

    this.addForm.get('tcoPro')?.valueChanges.subscribe((proNumeroParte: string | null) => {
      this.partNumberNotFound = false; // Resetear el estado al cambiar el valor

      if (proNumeroParte) {
        const productoId = this.getProIdFromNumeroParte(proNumeroParte);

        if (productoId) {
          this.transaccionService.getAeronavesCompatibles(productoId).subscribe({
            next: (aeronaves: { anvId: number, anvMatricula: string }[]) => {
              this.aeronaves = aeronaves;
            },
            error: (error: any) => this.errorHandler.handleServerError(error)
          });
        } else {
          this.aeronaves = [];
        }
      } else {
        this.aeronaves = [];
      }
    });

    this.addForm.get('tceTvo')?.valueChanges.subscribe(value => {
      this.showAeronaveField = value === 9; // Ajusta el valor según tu lógica
      const tceAnvControl = this.addForm.get('tceAnv');
      if (this.showAeronaveField) {
        tceAnvControl?.setValidators([Validators.required]);
      } else {
        tceAnvControl?.clearValidators();
        tceAnvControl?.setValue(null);
      }
      tceAnvControl?.updateValueAndValidity();
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  }

  getProIdFromNumeroParte(proNumeroParte: string): number | null {
    if (!this.tcoProValues) {
      this.partNumberNotFound = true;
      return null;
    }

    for (const [proId, numeroParte] of this.tcoProValues.entries()) {
      if (numeroParte === proNumeroParte) {
        this.partNumberNotFound = false;
        return proId;
      }
    }

    this.partNumberNotFound = true;
    return null;
  }

  actualizarListaProductos() {
    this.transaccionesProductoService.getTcoProValues().subscribe({
      next: (data: Map<number, string>) => {
        this.tcoProValues = data;
      },
      error: (error: any) => this.errorHandler.handleServerError(error)
    });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    // Abrir el diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const proNumeroParte = this.addForm.get('tcoPro')?.value!;
        const productoId = this.getProIdFromNumeroParte(proNumeroParte);
        const unidadesSolicitadas = this.addForm.get('tcoUnidades')?.value!;
        const tipoTransaccion = this.addForm.get('tceTvo')?.value!;

        if (!productoId) {
          return;
        }

        const esBaja = this.esTransaccionDeBaja(tipoTransaccion);

        if (esBaja) {
          this.productoService.getUnidadesDisponibles(productoId).subscribe({
            next: (unidadesDisponibles: number) => {
              if (unidadesDisponibles < unidadesSolicitadas) {
                this.snackBar.open(`No hay suficientes unidades disponibles. Unidades disponibles: ${unidadesDisponibles}`, 'Cerrar', {
                  duration: 5000,
                });
                return;
              }

              this.procesarTransaccion(productoId, unidadesSolicitadas);
            },
            error: (error: any) => {
              this.errorHandler.handleServerError(error);
            }
          });
        } else {
          this.procesarTransaccion(productoId, unidadesSolicitadas);
        }
      }
    });
  }

  esTransaccionDeBaja(tipoTransaccion: number): boolean {
    const bajas = [4, 5, 6, 7, 8, 9]; // Ajusta según tus valores
    return bajas.includes(tipoTransaccion);
  }

  procesarTransaccion(productoId: number, unidadesSolicitadas: number) {
    const transaccionData = {
      tceFechaTransaccion: this.addForm.get('tceFechaTransaccion')?.value!,
      tceObservaciones: this.addForm.get('tceObservaciones')?.value!,
      tceTvo: this.addForm.get('tceTvo')?.value!,
      tceUsr: this.addForm.get('tceUsr')?.value!,
      tceAnv: this.showAeronaveField ? this.addForm.get('tceAnv')?.value! : null
    };

    this.transaccionService.createTransaccion(transaccionData).subscribe({
      next: (response: any) => {
        this.currentTransactionId = response;
        this.addForm.patchValue({ tcoTce: this.currentTransactionId });

        const transaccionesProductoData = {
          tcoUnidades: unidadesSolicitadas,
          tcoPro: productoId,
          tcoTce: this.currentTransactionId
        };

        this.transaccionesProductoService.createTransaccionesProducto(transaccionesProductoData).subscribe({
          next: () => {
            this.router.navigate(['/transaccion-combinada-list'], {
              state: { msgSuccess: 'Transacción agregada exitosamente' }
            });
          },
          error: (error: any) => {
            this.errorHandler.handleServerError(error);
          }
        });
      },
      error: (error: any) => {
        this.errorHandler.handleServerError(error);
      }
    });
  }

  openSearchModal() {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '80vw',
      height: '50vh',
      data: {}
    });
    dialogRef.afterClosed().subscribe();
  }
}
