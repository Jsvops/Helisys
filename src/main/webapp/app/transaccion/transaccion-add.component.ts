import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'app/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-transaccion-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-add.component.html'
})
export class TransaccionAddComponent implements OnInit {

  transaccionService = inject(TransaccionService);
  authService = inject(AuthService); // Inyecta el servicio de autenticación
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  currentUserId?: number;
  currentUserName?: string;

  addForm = new FormGroup({
    tceFechaTransaccion: new FormControl({ value: this.getCurrentDate(), disabled: true }, [Validators.required]), // Asigna la fecha actual y deshabilita el campo
    tceObservaciones: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    tceTvo: new FormControl(null, [Validators.required]),
    tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@transaccion.create.success:Transaccion was created successfully.`
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

    // Obtener los valores para tceTvo
    this.transaccionService.getTceTvoValues()
      .subscribe({
        next: (data) => this.tceTvoValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });

    // Obtener los valores para tceUsr (opcional, si aún necesitas cargar otros usuarios)
    this.transaccionService.getTceUsrValues()
      .subscribe({
        next: (data) => this.tceUsrValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    // Crear el objeto TransaccionDTO con el ID del usuario y la fecha actual
    const formValue = { ...this.addForm.getRawValue(), tceUsr: this.currentUserId, tceFechaTransaccion: this.getCurrentDate() };

    const data = new TransaccionDTO(formValue);
    this.transaccionService.createTransaccion(data)
      .subscribe({
        next: () => this.router.navigate(['/transacciones'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }
}
