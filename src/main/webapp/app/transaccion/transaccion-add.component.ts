import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TransaccionService } from 'app/transaccion/transaccion.service';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-transaccion-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './transaccion-add.component.html'
})
export class TransaccionAddComponent implements OnInit {

  transaccionService = inject(TransaccionService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  tceTvoValues?: Map<number,string>;
  tceUsrValues?: Map<number,string>;

  addForm = new FormGroup({
    tceFechaTransaccion: new FormControl(null, [Validators.required]),
    tceObservaciones: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    tceTvo: new FormControl(null, [Validators.required]),
    tceUsr: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@transaccion.create.success:Transaccion was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new TransaccionDTO(this.addForm.value);
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
