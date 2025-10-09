import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'app/auth.service';
import { TransaccionRequestDTO } from 'app/transaccion/transaccion-request.dto';
import { ProductoService } from 'app/producto/producto.service';
import { ProductoDTO } from 'app/producto/producto.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SearchComponent } from 'app/search/search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transaccion-add',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputRowComponent,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './transaccion-add.component.html',
  styleUrls: ['./transaccion-add.component.scss']
})
export class TransaccionAddComponent implements OnInit {
  transaccionService = inject(TransaccionService);
  authService = inject(AuthService);
  productoService = inject(ProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  tceAnvValues?: Map<number, string>;
  currentUserId?: number;
  currentUserName?: string;
  showFechaVencimiento = false;
  showAeronave = false;

  todayStr: string = this.toIsoDate(new Date());

  addForm = new FormGroup(
    {
      tceFechaTransaccion: new FormControl(
        { value: this.getCurrentDate(), disabled: true },
        [Validators.required]
      ),
      tceObservaciones: new FormControl<string | null>(null, [Validators.maxLength(500)]),
      tceTvo: new FormControl<number | null>(null, [Validators.required]),
      tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [
        Validators.required
      ]),
      tcoProNumeroParte: new FormControl<string | null>(null, [Validators.required]),
      unidades: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
      tceAnv: new FormControl<number | null>(null),

      ltFechaVencimiento: new FormControl<string | Date | null>(null)
    },
    { updateOn: 'change' }
  );

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@transaccion.create.success:Transaccion was created successfully.`
    };
    return messages[key];
  }

  executeSampleTransaction() {
    this.addForm.markAllAsTouched();

    if (!this.addForm.valid || !this.currentUserId) {
      console.error('Formulario inválido o usuario no autenticado');
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        title: 'Confirmar transacción',
        message: '¿Está seguro de realizar esta transacción? Esta acción no se podrá deshacer',
        confirmText: 'Continuar',
        cancelText: 'Cancelar'
      },
      panelClass: 'confirm-dialog-panel'
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      const formValue = this.addForm.getRawValue();
      const numeroParte = formValue.tcoProNumeroParte!;

      this.productoService.searchByPartNumber(numeroParte).subscribe({
        next: (productos) => {
          if (!productos.length) {
            this.dialog.open(ConfirmDialogComponent, {
              width: '360px',
              data: {
                title: 'Aviso',
                message: 'No se encontró un producto con ese número de parte.',
                confirmText: 'Aceptar'
              }
            });
            return;
          }

          const producto = productos[0];

          const rawFecha = (this.addForm.get('ltFechaVencimiento') as FormControl<string | Date | null>).value;
          const fechaISO = this.normalizeToIso(rawFecha);

          const dto: TransaccionRequestDTO = {
            tceTvo: formValue.tceTvo!,
            tcoPro: producto.proId!,
            unidades: formValue.unidades!,
            tceObservaciones: formValue.tceObservaciones || '',
            tceAnv: formValue.tceAnv ?? undefined,
            ltFechaVencimiento: fechaISO
          };

          this.transaccionService.executeTransaction(dto).subscribe({
            next: () => {
              this.snackBar.open('Transacción ejecutada correctamente ✅', '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ['snackbar-success', 'snackbar-offset']
              });
              this.router.navigate(['/transacciones']);
            },
            error: (err) => this.errorHandler.handleServerError(err)
          });
        },
        error: (err) => {
          console.error('Error al buscar producto', err);
          this.errorHandler.handleServerError(err);
        }
      });
    });
  }

  abrirBuscadorProductos(): void {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '70vw',
      maxWidth: '100vw'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Producto seleccionado:', result);
      }
    });
  }

  ngOnInit() {
    this.authService.getCurrentUserInfo().subscribe({
      next: (userInfo) => {
        this.currentUserId = userInfo.usrId;
        this.currentUserName = userInfo.usrNombre;
        this.addForm.patchValue({ tceUsr: this.currentUserId });
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.transaccionService.getTceTvoValues().subscribe({
      next: (data) => (this.tceTvoValues = data),
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.transaccionService.getTceUsrValues().subscribe({
      next: (data) => (this.tceUsrValues = data),
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.addForm.get('tceTvo')?.valueChanges.subscribe((value: number | null) => {
      if (value !== null) {
        this.updateFieldVisibility(value);
      }
    });

    this.transaccionService.getTceAnvValues().subscribe({
      next: (data) => (this.tceAnvValues = data),
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.addForm.get('tcoProNumeroParte')?.valueChanges.subscribe((numeroParte) => {
      if (numeroParte) {
        this.productoService.searchByPartNumber(numeroParte).subscribe({
          next: (productos) => {
            if (productos.length === 0) {
              this.tceAnvValues = new Map();
              this.addForm.patchValue({ tceAnv: null });
              return;
            }
            const producto = productos[0];
            const productoId = producto.proId;

            this.transaccionService.getAeronavesCompatibles(productoId!).subscribe({
              next: (aeronaves) => {
                this.tceAnvValues = new Map(aeronaves.map((a) => [a.anvId, a.anvMatricula]));
                this.addForm.patchValue({ tceAnv: null });
              },
              error: (err) => {
                console.error('Error al obtener aeronaves compatibles', err);
                this.tceAnvValues = new Map();
                this.addForm.patchValue({ tceAnv: null });
              }
            });
          },
          error: (err) => {
            console.error('Error al buscar producto por número de parte', err);
            this.tceAnvValues = new Map();
            this.addForm.patchValue({ tceAnv: null });
          }
        });
      } else {
        this.tceAnvValues = new Map();
        this.addForm.patchValue({ tceAnv: null });
      }
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private parseLocalDate(raw: string | Date): Date | null {
    if (raw instanceof Date) {
      const d = new Date(raw.getTime());
      d.setHours(0, 0, 0, 0);
      return d;
    }
    if (typeof raw === 'string') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
      if (!m) return null;
      const y = +m[1], mon = +m[2], day = +m[3];
      const d = new Date(y, mon - 1, day); // ← crea fecha LOCAL
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return null;
  }

  private notPastDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const raw = control.value as string | Date | null;
      if (!raw) return null;

      const d = this.parseLocalDate(raw);
      if (!d || isNaN(d.getTime())) return { invalidDate: true };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return d < today ? { pastDate: true } : null;
    };
  }

  updateFieldVisibility(tceTvoValue: number) {
    const fechaCtrl = this.addForm.get('ltFechaVencimiento') as FormControl<string | Date | null>;
    const aeronaveCtrl = this.addForm.get('tceAnv') as FormControl<number | null>;

    this.showFechaVencimiento = [1, 2, 3].includes(tceTvoValue); // STOCKIN
    this.showAeronave = [4, 5, 6, 7, 8, 9].includes(tceTvoValue); // STOCKOUT

    if (this.showFechaVencimiento) {

      fechaCtrl.setValidators([Validators.required, this.notPastDateValidator()]);

    } else {
      fechaCtrl.clearValidators();
      fechaCtrl.setValue(null);
    }
    fechaCtrl.updateValueAndValidity({ emitEvent: false });

    if (this.showAeronave) {
      aeronaveCtrl.setValidators([Validators.required]);
    } else {
      aeronaveCtrl.clearValidators();
      aeronaveCtrl.setValue(null);
    }
    aeronaveCtrl.updateValueAndValidity({ emitEvent: false });
  }

  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private normalizeToIso(raw: string | Date | null): string | undefined {
    if (!raw) return undefined;
    if (raw instanceof Date) return this.toIsoDate(raw);
    if (typeof raw === 'string') return raw;
    return undefined;
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    const formValue = {
      ...this.addForm.getRawValue(),
      tceUsr: this.currentUserId,
      tceFechaTransaccion: this.getCurrentDate()
    };

    const data = new TransaccionDTO(formValue as any);
    this.transaccionService
      .createTransaccion(data)
      .subscribe({
        next: () =>
          this.router.navigate(['/transacciones'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
        error: (error) =>
          this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }
}
