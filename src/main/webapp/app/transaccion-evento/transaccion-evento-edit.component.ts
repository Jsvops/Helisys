import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionEventoService } from 'app/transaccion-evento/transaccion-evento.service';
import { TransaccionEventoDTO } from 'app/transaccion-evento/transaccion-evento.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-transaccion-evento-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-evento-edit.component.html'
})
export class TransaccionEventoEditComponent implements OnInit {

  transaccionEventoService = inject(TransaccionEventoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentTvoId?: number;

  editForm = new FormGroup({
    tvoId: new FormControl({ value: null, disabled: true }),
    tvoEvento: new FormControl(null, [Validators.required, Validators.maxLength(25)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@transaccionEvento.update.success:Transaccion Evento was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentTvoId = +this.route.snapshot.params['tvoId'];
    this.transaccionEventoService.getTransaccionEvento(this.currentTvoId!)
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
    const data = new TransaccionEventoDTO(this.editForm.value);
    this.transaccionEventoService.updateTransaccionEvento(this.currentTvoId!, data)
        .subscribe({
          next: () => this.router.navigate(['/transaccionEventos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
