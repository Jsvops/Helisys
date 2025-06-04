import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetalleProductoModeloAeronaveService } from './detalle-producto-modelo-aeronave.service';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';

@Component({
  selector: 'app-detalle-producto-modelo-aeronave-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detalle-producto-modelo-aeronave-edit.component.html'
})
export class DetalleProductoModeloAeronaveEditComponent implements OnInit {

  detalleService = inject(DetalleProductoModeloAeronaveService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  currentDpmaId?: number;

  editForm = new FormGroup({
    dpmaId: new FormControl({ value: null, disabled: true }),
    dpmaPro: new FormControl(null, [Validators.required]),
    dpmaMre: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@detalle.update.success:Detalle was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentDpmaId = +this.route.snapshot.params['dpmaId'];
    this.detalleService.getDetalleById(this.currentDpmaId!)
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
    const data = new DetalleProductoModeloAeronaveDTO(this.editForm.value);
    this.detalleService.updateDetalle(this.currentDpmaId!, data)
      .subscribe({
        next: () => this.router.navigate(['/detalle-producto-modelo-aeronave-list'], {
          state: {
            msgSuccess: this.getMessage('updated')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
      });
  }
}
