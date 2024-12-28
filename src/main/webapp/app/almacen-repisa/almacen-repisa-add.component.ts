import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenRepisaService } from 'app/almacen-repisa/almacen-repisa.service';
import { AlmacenRepisaDTO } from 'app/almacen-repisa/almacen-repisa.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-almacen-repisa-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-repisa-add.component.html'
})
export class AlmacenRepisaAddComponent implements OnInit {

  almacenRepisaService = inject(AlmacenRepisaService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  amrAmtValues?: Map<number,string>;

  addForm = new FormGroup({
    amrNombre: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    amrAmt: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@almacenRepisa.create.success:Almacen Repisa was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.almacenRepisaService.getAmrAmtValues()
        .subscribe({
          next: (data) => this.amrAmtValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AlmacenRepisaDTO(this.addForm.value);
    this.almacenRepisaService.createAlmacenRepisa(data)
        .subscribe({
          next: () => this.router.navigate(['/almacenRepisas'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
