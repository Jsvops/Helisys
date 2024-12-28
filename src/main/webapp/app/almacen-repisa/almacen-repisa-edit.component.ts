import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenRepisaService } from 'app/almacen-repisa/almacen-repisa.service';
import { AlmacenRepisaDTO } from 'app/almacen-repisa/almacen-repisa.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-almacen-repisa-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-repisa-edit.component.html'
})
export class AlmacenRepisaEditComponent implements OnInit {

  almacenRepisaService = inject(AlmacenRepisaService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  amrAmtValues?: Map<number,string>;
  currentAmrId?: number;

  editForm = new FormGroup({
    amrId: new FormControl({ value: null, disabled: true }),
    amrNombre: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    amrAmt: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@almacenRepisa.update.success:Almacen Repisa was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentAmrId = +this.route.snapshot.params['amrId'];
    this.almacenRepisaService.getAmrAmtValues()
        .subscribe({
          next: (data) => this.amrAmtValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.almacenRepisaService.getAlmacenRepisa(this.currentAmrId!)
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
    const data = new AlmacenRepisaDTO(this.editForm.value);
    this.almacenRepisaService.updateAlmacenRepisa(this.currentAmrId!, data)
        .subscribe({
          next: () => this.router.navigate(['/almacenRepisas'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
