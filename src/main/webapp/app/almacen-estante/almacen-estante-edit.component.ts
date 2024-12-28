import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AlmacenEstanteService } from 'app/almacen-estante/almacen-estante.service';
import { AlmacenEstanteDTO } from 'app/almacen-estante/almacen-estante.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-almacen-estante-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './almacen-estante-edit.component.html'
})
export class AlmacenEstanteEditComponent implements OnInit {

  almacenEstanteService = inject(AlmacenEstanteService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentAmtId?: number;

  editForm = new FormGroup({
    amtId: new FormControl({ value: null, disabled: true }),
    amtDescripcion: new FormControl(null, [Validators.required, Validators.maxLength(25)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@almacenEstante.update.success:Almacen Estante was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentAmtId = +this.route.snapshot.params['amtId'];
    this.almacenEstanteService.getAlmacenEstante(this.currentAmtId!)
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
    const data = new AlmacenEstanteDTO(this.editForm.value);
    this.almacenEstanteService.updateAlmacenEstante(this.currentAmtId!, data)
        .subscribe({
          next: () => this.router.navigate(['/almacenEstantes'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
