import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AeronaveService } from 'app/aeronave/aeronave.service';
import { AeronaveDTO } from 'app/aeronave/aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-aeronave-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './aeronave-add.component.html',
  styleUrls: ['./aeronave-add.component.scss']
})
export class AeronaveAddComponent implements OnInit {

  aeronaveService = inject(AeronaveService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);

  anvMreValues?: Map<number,string>;

  addForm = new FormGroup({
    anvMatricula: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    anvNumeroSerie: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    anvFabricacion: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    anvMre: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@aeronave.create.success:La aeronave fue creada con éxito ✅`,
      AERONAVE_ANV_MATRICULA_UNIQUE: $localize`:@@Exists.aeronave.anvMatricula:This Anv Matricula is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.aeronaveService.getAnvMreValues()
        .subscribe({
          next: (data) => this.anvMreValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AeronaveDTO(this.addForm.value);
    this.aeronaveService.createAeronave(data)
        .subscribe({
          next: () => {
                  this.snackBar.open(this.getMessage('created'),
                  undefined,
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    panelClass: ['snackbar-success']
                  });
                  this.router.navigate(['/aeronaves']);
                },
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
