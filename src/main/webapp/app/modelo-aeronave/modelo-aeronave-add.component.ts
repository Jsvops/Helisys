import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ModeloAeronaveService } from 'app/modelo-aeronave/modelo-aeronave.service';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-modelo-aeronave-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './modelo-aeronave-add.component.html',
  styleUrls: ['./modelo-aeronave-add.component.scss'],
})
export class ModeloAeronaveAddComponent {

  modeloAeronaveService = inject(ModeloAeronaveService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);


  addForm = new FormGroup({
    mreNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@modeloAeronave.create.success:Modelo de aeronave añadido correctamente ✅`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ModeloAeronaveDTO(this.addForm.value);
    this.modeloAeronaveService.createModeloAeronave(data).subscribe({
      next: () => {
        this.snackBar.open(this.getMessage('created'),
        undefined,
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/modeloAeronaves']);
      },
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
