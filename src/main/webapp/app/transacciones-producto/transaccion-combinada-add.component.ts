import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'app/auth.service'; // Importa el servicio de autenticación
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from 'app/search/search.component';

@Component({
  selector: 'app-transaccion-combinada-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-combinada-add.component.html'
})
export class TransaccionCombinadaAddComponent implements OnInit {

  transaccionesProductoService = inject(TransaccionesProductoService);
  transaccionService = inject(TransaccionService);
  authService = inject(AuthService); // Inyecta el servicio de autenticación
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  dialog = inject(MatDialog); // Inyectar MatDialog

  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  tcoProValues?: Map<number, string>;
  currentUserId?: number;
  currentUserName?: string;
  currentTransactionId?: number;

  addForm = new FormGroup({
    tceFechaTransaccion: new FormControl({ value: this.getCurrentDate(), disabled: true }, [Validators.required]), // Asigna la fecha actual y deshabilita el campo
    tceObservaciones: new FormControl(null, [Validators.maxLength(500)]), // Eliminando Validators.required para que sea opcional
    tceTvo: new FormControl(null, [Validators.required]),
    tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
    tcoUnidades: new FormControl(null, [Validators.required]),
    tcoPro: new FormControl(null, [Validators.required]),
    tcoTce: new FormControl({ value: null as number | null, disabled: true }, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any): string {
    const messages: Record<string, string> = {
      created: $localize`:@@transaccionesProducto.create.success:Transacciones Producto was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    // Obtener la información del usuario autenticado y asignar el ID al campo tceUsr
    this.authService.getCurrentUserInfo().subscribe({
      next: (userInfo) => {
        this.currentUserId = userInfo.usrId;
        this.currentUserName = userInfo.usrNombre;
        this.addForm.patchValue({ tceUsr: this.currentUserId }); // Asigna el ID del usuario
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.transaccionService.getTceTvoValues()
      .subscribe({
        next: (data: Map<number, string>) => this.tceTvoValues = data,
        error: (error: any) => this.errorHandler.handleServerError(error)
      });

    // Obtener los valores para tceUsr
    this.transaccionService.getTceUsrValues()
      .subscribe({
        next: (data: Map<number, string>) => this.tceUsrValues = data,
        error: (error: any) => this.errorHandler.handleServerError(error)
      });

    this.transaccionesProductoService.getTcoProValues()
      .subscribe({
        next: (data: Map<number, string>) => this.tcoProValues = data,
        error: (error: any) => this.errorHandler.handleServerError(error)
      });
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Ajusta a la zona horaria local
    return today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    const transaccionData = {
      tceFechaTransaccion: this.addForm.get('tceFechaTransaccion')?.value!,
      tceObservaciones: this.addForm.get('tceObservaciones')?.value!,
      tceTvo: this.addForm.get('tceTvo')?.value!,
      tceUsr: this.addForm.get('tceUsr')?.value!
    };

    this.transaccionService.createTransaccion(transaccionData).subscribe({
      next: (response: any) => {
        this.currentTransactionId = response; // Asigna el ID de la transacción recién creada
        this.addForm.patchValue({ tcoTce: this.currentTransactionId });

        const transaccionesProductoData = {
          tcoUnidades: this.addForm.get('tcoUnidades')?.value!,
          tcoPro: this.addForm.get('tcoPro')?.value!,
          tcoTce: this.currentTransactionId // Usa el ID de la transacción actual
        };

        this.transaccionesProductoService.createTransaccionesProducto(transaccionesProductoData).subscribe({
          next: () => {
            this.router.navigate(['/transaccionesProductos'], {
              state: {
                msgSuccess: this.getMessage('created')
              }
            });
          },
          error: (error: any) => this.errorHandler.handleServerError(error)
        });
      },
      error: (error: any) => this.errorHandler.handleServerError(error)
    });
  }

  openSearchModal() {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '600px', // Ancho de la ventana emergente
      data: {} // Puedes pasar datos si es necesario
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // Lógica después de cerrar la ventana emergente
    });
  }
}
