import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionesProductoService } from 'app/transacciones-producto/transacciones-producto.service';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-transacciones-producto-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transacciones-producto-edit.component.html'
})
export class TransaccionesProductoEditComponent implements OnInit {

  transaccionesProductoService = inject(TransaccionesProductoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  tcoProValues?: Map<number,string>;
  tcoTceValues?: Map<number,string>;
  currentTcoId?: number;

  editForm = new FormGroup({
    tcoId: new FormControl({ value: null, disabled: true }),
    tcoUnidades: new FormControl(null, [Validators.required]),
    tcoPro: new FormControl(null, [Validators.required]),
    tcoTce: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@transaccionesProducto.update.success:Transacciones Producto was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentTcoId = +this.route.snapshot.params['tcoId'];
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
    this.transaccionesProductoService.getTransaccionesProducto(this.currentTcoId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new TransaccionesProductoDTO(this.editForm.value);
    this.transaccionesProductoService.updateTransaccionesProducto(this.currentTcoId!, data)
        .subscribe({
          next: () => this.router.navigate(['/transaccionesProductos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
