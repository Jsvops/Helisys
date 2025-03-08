import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenEstanteService } from 'app/almacen-estante/almacen-estante.service';
import { AlmacenRepisaService } from 'app/almacen-repisa/almacen-repisa.service';
import { AlmacenContenedorService } from 'app/almacen-contenedor/almacen-contenedor.service';
import { AlmacenEstanteDTO } from 'app/almacen-estante/almacen-estante.model';
import { AlmacenRepisaDTO } from 'app/almacen-repisa/almacen-repisa.model';
import { AlmacenContenedorDTO } from 'app/almacen-contenedor/almacen-contenedor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-almacen-combinado-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-combinado-add.component.html'
})
export class AlmacenCombinadoAddComponent implements OnInit {

  almacenEstanteService = inject(AlmacenEstanteService);
  almacenRepisaService = inject(AlmacenRepisaService);
  almacenContenedorService = inject(AlmacenContenedorService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    amtDescripcion: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    amrNombre: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    amcNumero: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@almacenCombinado.create.success:Almacen Combinado was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    // Puedes inicializar cualquier dato necesario aquí
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }

    // Crear AlmacenEstante
    const amtData = new AlmacenEstanteDTO({ amtDescripcion: this.addForm.value.amtDescripcion });
    this.almacenEstanteService.createAlmacenEstante(amtData)
      .subscribe({
        next: (amtResponse) => {
          // Crear AlmacenRepisa con el ID de AlmacenEstante
          const amrData = new AlmacenRepisaDTO({
            amrNombre: this.addForm.value.amrNombre,
            amrAmt: amtResponse // amtResponse es el ID del AlmacenEstante creado
          });
          this.almacenRepisaService.createAlmacenRepisa(amrData)
            .subscribe({
              next: (amrResponse) => {
                // Crear AlmacenContenedor con el ID de AlmacenRepisa
                const amcData = new AlmacenContenedorDTO({
                  amcNumero: this.addForm.value.amcNumero,
                  amcAmr: amrResponse // amrResponse es el ID del AlmacenRepisa creado
                });
                this.almacenContenedorService.createAlmacenContenedor(amcData)
                  .subscribe({
                    next: () => this.router.navigate(['/almacenCombinados'], {
                      state: {
                        msgSuccess: this.getMessage('created')
                      }
                    }),
                    error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
                  });
              },
              error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
            });
        },
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }
}
