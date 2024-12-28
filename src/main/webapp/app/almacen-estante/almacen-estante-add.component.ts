import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenEstanteService } from 'app/almacen-estante/almacen-estante.service';
import { AlmacenEstanteDTO } from 'app/almacen-estante/almacen-estante.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-almacen-estante-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-estante-add.component.html'
})
export class AlmacenEstanteAddComponent {

  almacenEstanteService = inject(AlmacenEstanteService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    amtDescripcion: new FormControl(null, [Validators.required, Validators.maxLength(25)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@almacenEstante.create.success:Almacen Estante was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AlmacenEstanteDTO(this.addForm.value);
    this.almacenEstanteService.createAlmacenEstante(data)
        .subscribe({
          next: () => this.router.navigate(['/almacenEstantes'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
