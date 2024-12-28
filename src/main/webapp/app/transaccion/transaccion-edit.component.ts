import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-transaccion-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-edit.component.html'
})
export class TransaccionEditComponent implements OnInit {

  transaccionService = inject(TransaccionService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  tceTvoValues?: Map<number,string>;
  tceUsrValues?: Map<number,string>;
  currentTceId?: number;

  editForm = new FormGroup({
    tceId: new FormControl({ value: null, disabled: true }),
    tceFechaTransaccion: new FormControl(null, [Validators.required]),
    tceObservaciones: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    tceTvo: new FormControl(null, [Validators.required]),
    tceUsr: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@transaccion.update.success:Transaccion was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentTceId = +this.route.snapshot.params['tceId'];
    this.transaccionService.getTceTvoValues()
        .subscribe({
          next: (data) => this.tceTvoValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.transaccionService.getTceUsrValues()
        .subscribe({
          next: (data) => this.tceUsrValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.transaccionService.getTransaccion(this.currentTceId!)
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
    const data = new TransaccionDTO(this.editForm.value);
    this.transaccionService.updateTransaccion(this.currentTceId!, data)
        .subscribe({
          next: () => this.router.navigate(['/transacciones'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
