import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AeronaveService } from 'app/aeronave/aeronave.service';
import { AeronaveDTO } from 'app/aeronave/aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-aeronave-edit',
  imports: [CommonModule, ReactiveFormsModule, InputRowComponent, MatIconModule, MatTooltipModule, MatButtonModule,  MatSnackBarModule],
  templateUrl: './aeronave-edit.component.html',
  styleUrls: ['./aeronave-edit.component.scss']
})
export class AeronaveEditComponent implements OnInit {

  aeronaveService = inject(AeronaveService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);

  anvMreValues?: Map<number,string>;
  currentAnvId?: number;

  editForm = new FormGroup({
    anvId: new FormControl({ value: null, disabled: true }),
    anvMatricula: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    anvNumeroSerie: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    anvFabricacion: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    anvMre: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@aeronave.update.success:La aeronave se actualizó correctamente ✅`,
      AERONAVE_ANV_MATRICULA_UNIQUE: $localize`:@@Exists.aeronave.anvMatricula:This Anv Matricula is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentAnvId = +this.route.snapshot.params['anvId'];
    this.aeronaveService.getAnvMreValues()
        .subscribe({
          next: (data) => this.anvMreValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.aeronaveService.getAeronave(this.currentAnvId!)
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
    const data = new AeronaveDTO(this.editForm.value);
    this.aeronaveService.updateAeronave(this.currentAnvId!, data)
        .subscribe({
          next: () => {
           this.snackBar.open(this.getMessage('updated'),
           undefined,
           {
             duration: 3000,
             verticalPosition: 'top',
             horizontalPosition: 'center',
              panelClass: ['snackbar-success']
              });
            this.router.navigate(['/aeronaves']);
           },
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
