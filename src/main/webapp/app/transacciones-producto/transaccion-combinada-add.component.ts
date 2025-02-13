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
  authService = inject(AuthService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  dialog = inject(MatDialog);

  tceTvoValues?: Map<number, string>;
  tceUsrValues?: Map<number, string>;
  tcoProValues?: Map<number, string>;
  aeronaves: { anvId: number, anvMatricula: string }[] = [];
  currentUserId?: number;
  currentUserName?: string;
  currentTransactionId?: number;
  showAeronaveField: boolean = false;

  addForm = new FormGroup({
    tceFechaTransaccion: new FormControl({ value: this.getCurrentDate(), disabled: true }, [Validators.required]),
    tceObservaciones: new FormControl(null, [Validators.maxLength(500)]),
    tceTvo: new FormControl(null, [Validators.required]),
    tceUsr: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
    tcoUnidades: new FormControl(null, [Validators.required]),
    tcoPro: new FormControl(null, [Validators.required]),
    tcoTce: new FormControl({ value: null as number | null, disabled: true }, [Validators.required]),
    tceAnv: new FormControl(null) // Se agregará validador dinámicamente
  }, { updateOn: 'change' }); // Cambia 'submit' por 'change'

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

    // Cargar la lista de productos al iniciar el componente
    this.actualizarListaProductos();

    // Escuchar cambios en el campo tcoPro (producto)
    this.addForm.get('tcoPro')?.valueChanges.subscribe((proNumeroParte: string | null) => {
      if (proNumeroParte) {
        // Obtener el pro_id correspondiente al pro_numero_parte
        const productoId = this.getProIdFromNumeroParte(proNumeroParte);

        if (productoId) {
          // Obtener aeronaves compatibles usando el pro_id
          this.transaccionService.getAeronavesCompatibles(productoId).subscribe({
            next: (aeronaves: { anvId: number, anvMatricula: string }[]) => {
              console.log('Aeronaves compatibles:', aeronaves);
              this.aeronaves = aeronaves; // Actualizar la lista de aeronaves
            },
            error: (error: any) => this.errorHandler.handleServerError(error)
          });
        } else {
          console.error('No se encontró el ID del producto para el número de parte:', proNumeroParte);
          this.aeronaves = []; // Limpiar la lista si no se encuentra el ID
        }
      } else {
        this.aeronaves = []; // Limpiar la lista si no hay producto seleccionado
      }
    });

    // Manejo dinámico del campo tceAnv según tceTvo
    this.addForm.get('tceTvo')?.valueChanges.subscribe(value => {
      console.log('Valor de tceTvo cambiado a:', value);
      this.showAeronaveField = value === 9; // Asegúrate de que el ID sea correcto (9 en este caso)

      const tceAnvControl = this.addForm.get('tceAnv');
      if (this.showAeronaveField) {
        tceAnvControl?.setValidators([Validators.required]);
      } else {
        tceAnvControl?.clearValidators();
        tceAnvControl?.setValue(null); // Reiniciar valor si ya no es requerido
      }
      tceAnvControl?.updateValueAndValidity();
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  }

  // Método para obtener el pro_id desde el pro_numero_parte
  getProIdFromNumeroParte(proNumeroParte: string): number | null {
    if (!this.tcoProValues) {
      console.error('tcoProValues no está definido');
      return null;
    }

    for (const [proId, numeroParte] of this.tcoProValues.entries()) {
      if (numeroParte === proNumeroParte) {
        console.log(`Encontrado proId: ${proId} para proNumeroParte: ${proNumeroParte}`);
        return proId;
      }
    }

    console.error(`No se encontró proId para proNumeroParte: ${proNumeroParte}`);
    return null;
  }

  // Método para actualizar la lista de productos
  actualizarListaProductos() {
    this.transaccionesProductoService.getTcoProValues().subscribe({
      next: (data: Map<number, string>) => {
        this.tcoProValues = data; // Actualizar la lista de productos
        console.log('Lista de productos actualizada:', this.tcoProValues);
      },
      error: (error: any) => this.errorHandler.handleServerError(error)
    });
  }

  // Método handleSubmit con logs adicionales
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
      tceUsr: this.addForm.get('tceUsr')?.value!,
      tceAnv: this.showAeronaveField ? this.addForm.get('tceAnv')?.value! : null
    };

    console.log('Datos de transacción:', transaccionData);

    this.transaccionService.createTransaccion(transaccionData).subscribe({
      next: (response: any) => {
        this.currentTransactionId = response;
        this.addForm.patchValue({ tcoTce: this.currentTransactionId });

        const proNumeroParte = this.addForm.get('tcoPro')?.value!;
        const productoId = this.getProIdFromNumeroParte(proNumeroParte);

        if (!productoId) {
          console.error('No se pudo obtener el ID del producto');
          return;
        }

        const transaccionesProductoData = {
          tcoUnidades: this.addForm.get('tcoUnidades')?.value!,
          tcoPro: productoId, // Usar el ID del producto obtenido
          tcoTce: this.currentTransactionId
        };

        console.log('Datos de transacción de producto:', transaccionesProductoData);

        this.transaccionesProductoService.createTransaccionesProducto(transaccionesProductoData).subscribe({
          next: () => {
            this.router.navigate(['/transaccionesProductos'], {
              state: { msgSuccess: 'Transacciones Producto fue creada exitosamente.' }
            });
          },
          error: (error: any) => {
            console.error('Error en createTransaccionesProducto:', error);
            this.errorHandler.handleServerError(error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error en createTransaccion:', error);
        this.errorHandler.handleServerError(error);
      }
    });
  }

  openSearchModal() {
    const dialogRef = this.dialog.open(SearchComponent, { width: '600px', data: {} });
    dialogRef.afterClosed().subscribe();
  }
}
