import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenContenedorService } from 'app/almacen-contenedor/almacen-contenedor.service';
import { AlmacenContenedorDTO } from 'app/almacen-contenedor/almacen-contenedor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-almacen-contenedor-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-contenedor-add.component.html'
})
export class AlmacenContenedorAddComponent implements OnInit {

  almacenContenedorService = inject(AlmacenContenedorService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  amcAmrValues?: Map<number,string>;

  addForm = new FormGroup({
    amcNumero: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    amcAmr: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@almacenContenedor.create.success:Almacen Contenedor was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.almacenContenedorService.getAmcAmrValues()
        .subscribe({
          next: (data) => this.amcAmrValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AlmacenContenedorDTO(this.addForm.value);
    this.almacenContenedorService.createAlmacenContenedor(data)
        .subscribe({
          next: () => this.router.navigate(['/almacenContenedores'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
