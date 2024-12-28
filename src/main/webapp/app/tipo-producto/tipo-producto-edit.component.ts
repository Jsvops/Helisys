import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TipoProductoService } from 'app/tipo-producto/tipo-producto.service';
import { TipoProductoDTO } from 'app/tipo-producto/tipo-producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-tipo-producto-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './tipo-producto-edit.component.html'
})
export class TipoProductoEditComponent implements OnInit {

  tipoProductoService = inject(TipoProductoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentTpoId?: number;

  editForm = new FormGroup({
    tpoId: new FormControl({ value: null, disabled: true }),
    tpoNombreTipo: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@tipoProducto.update.success:Tipo Producto was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentTpoId = +this.route.snapshot.params['tpoId'];
    this.tipoProductoService.getTipoProducto(this.currentTpoId!)
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
    const data = new TipoProductoDTO(this.editForm.value);
    this.tipoProductoService.updateTipoProducto(this.currentTpoId!, data)
        .subscribe({
          next: () => this.router.navigate(['/tipoProductos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
