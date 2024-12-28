import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ModeloAeronaveService } from 'app/modelo-aeronave/modelo-aeronave.service';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-modelo-aeronave-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './modelo-aeronave-edit.component.html'
})
export class ModeloAeronaveEditComponent implements OnInit {

  modeloAeronaveService = inject(ModeloAeronaveService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentMreId?: number;

  editForm = new FormGroup({
    mreId: new FormControl({ value: null, disabled: true }),
    mreNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@modeloAeronave.update.success:Modelo Aeronave was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentMreId = +this.route.snapshot.params['mreId'];
    this.modeloAeronaveService.getModeloAeronave(this.currentMreId!)
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
    const data = new ModeloAeronaveDTO(this.editForm.value);
    this.modeloAeronaveService.updateModeloAeronave(this.currentMreId!, data)
        .subscribe({
          next: () => this.router.navigate(['/modeloAeronaves'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
