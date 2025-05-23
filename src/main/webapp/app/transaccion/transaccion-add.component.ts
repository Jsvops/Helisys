import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'app/auth.service';
import { TransaccionRequestDTO } from 'app/transaccion/transaccion-request.dto'
import { ProductoService } from 'app/producto/producto.service';
import { ProductoDTO } from 'app/producto/producto.model';



@Component({
  selector: 'app-transaccion-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-add.component.html'
})

export class TransaccionAddComponent implements OnInit {

  transaccionService = inject(TransaccionService);
  authService = inject(AuthService);
  productoService = inject(ProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);


  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  currentUserId?: number;
  currentUserName?: string;
  showFechaVencimiento = false;
  showAeronave = false;


      addForm = new FormGroup({
        tceFechaTransaccion: new FormControl({ value: this.getCurrentDate(), disabled: true }, [Validators.required]),
        tceObservaciones: new FormControl(null, [Validators.maxLength(500)]),
        tceTvo: new FormControl(null, [Validators.required]),
        tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
        tcoProNumeroParte: new FormControl(null, [Validators.required]),
        unidades: new FormControl(null, [Validators.required, Validators.min(1)]),
        tceAnv: new FormControl(null),
        ltFechaVencimiento: new FormControl(null)
      }, { updateOn: 'change' });

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
      const formValue = this.addForm.getRawValue();

      const numeroParte = formValue.tcoProNumeroParte!;
      this.productoService.searchByPartNumber(numeroParte).subscribe({
        next: (productos) => {
          if (!productos.length) {
            alert('No se encontró un producto con ese número de parte.');
            return;
          }

      const producto = productos[0];

      const dto: TransaccionRequestDTO = {
        tceTvo: formValue.tceTvo!,
        tcoPro: producto.proId!,
        unidades: formValue.unidades!,
        tceObservaciones: formValue.tceObservaciones || '',
        tceAnv: formValue.tceAnv ?? undefined,
        ltFechaVencimiento: formValue.ltFechaVencimiento ?? undefined
      };

      this.transaccionService.executeTransaction(dto).subscribe({
        next: (id) => {
          this.router.navigate(['/transacciones'], {
            state: { msgSuccess: 'Transacción ejecutada correctamente.' }
          });
        },
        error: (err) => this.errorHandler.handleServerError(err.error)
      });
    },
    error: (err) => {
      console.error('Error al buscar producto', err);
      this.errorHandler.handleServerError(err.error);
    }
  });
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
        this.addForm.get('tceTvo')?.valueChanges.subscribe((value: number | null) => {
          if (value !== null) {
            this.updateFieldVisibility(value);
          }
        });

      }

      getCurrentDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
      }

     updateFieldVisibility(tceTvoValue: number) {
       const fechaVencimientoControl = this.addForm.get('ltFechaVencimiento');
       const aeronaveControl = this.addForm.get('tceAnv');

       this.showFechaVencimiento = [1, 2, 3].includes(tceTvoValue);
       this.showAeronave = [4, 5, 6, 7, 8, 9].includes(tceTvoValue);

       // Manejo dinámico de fecha de vencimiento
       if (this.showFechaVencimiento) {
         fechaVencimientoControl?.setValidators([Validators.required]);
       } else {
         fechaVencimientoControl?.clearValidators();
         fechaVencimientoControl?.setValue(null);
       }

       // Manejo dinámico de aeronave
       if (this.showAeronave) {
         aeronaveControl?.setValidators([Validators.required]);
       } else {
         aeronaveControl?.clearValidators();
         aeronaveControl?.setValue(null);
       }

       // Recalcular validez
       fechaVencimientoControl?.updateValueAndValidity();
       aeronaveControl?.updateValueAndValidity();
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
