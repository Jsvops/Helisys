import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenContenedorService } from 'app/almacen-contenedor/almacen-contenedor.service';
import { AlmacenContenedorDTO } from 'app/almacen-contenedor/almacen-contenedor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-almacen-contenedor-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-contenedor-edit.component.html'
})
export class AlmacenContenedorEditComponent implements OnInit {

  almacenContenedorService = inject(AlmacenContenedorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  amcAmrValues?: Map<number,string>;
  currentAmcId?: number;

  editForm = new FormGroup({
    amcId: new FormControl({ value: null, disabled: true }),
    amcNumero: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    amcAmr: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@almacenContenedor.update.success:Almacen Contenedor was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentAmcId = +this.route.snapshot.params['amcId'];
    this.almacenContenedorService.getAmcAmrValues()
        .subscribe({
          next: (data) => this.amcAmrValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.almacenContenedorService.getAlmacenContenedor(this.currentAmcId!)
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
    const data = new AlmacenContenedorDTO(this.editForm.value);
    this.almacenContenedorService.updateAlmacenContenedor(this.currentAmcId!, data)
        .subscribe({
          next: () => this.router.navigate(['/almacenContenedores'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
