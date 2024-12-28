import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-transacciones-producto-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transacciones-producto-add.component.html'
})
export class TransaccionesProductoAddComponent implements OnInit {

  transaccionesProductoService = inject(TransaccionesProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  tcoProValues?: Map<number,string>;
  tcoTceValues?: Map<number,string>;

  addForm = new FormGroup({
    tcoUnidades: new FormControl(null, [Validators.required]),
    tcoPro: new FormControl(null, [Validators.required]),
    tcoTce: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@transaccionesProducto.create.success:Transacciones Producto was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.transaccionesProductoService.getTcoProValues()
        .subscribe({
          next: (data) => this.tcoProValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.transaccionesProductoService.getTcoTceValues()
        .subscribe({
          next: (data) => this.tcoTceValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new TransaccionesProductoDTO(this.addForm.value);
    this.transaccionesProductoService.createTransaccionesProducto(data)
        .subscribe({
          next: () => this.router.navigate(['/transaccionesProductos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
