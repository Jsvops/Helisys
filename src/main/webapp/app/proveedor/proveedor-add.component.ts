import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProveedorService } from 'app/proveedor/proveedor.service';
import { ProveedorDTO } from 'app/proveedor/proveedor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-proveedor-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './proveedor-add.component.html',
  styleUrls: ['./proveedor-add.component.scss']
})
export class ProveedorAddComponent {

  proveedorService = inject(ProveedorService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);

  addForm = new FormGroup({
    pveNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pveTelefono: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pveFax: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pveEmail: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pveDireccion: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
    pveCiudad: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pvePais: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@proveedor.create.success:El proveedor fue creado con éxito ✅`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ProveedorDTO(this.addForm.value);
    this.proveedorService.createProveedor(data)
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
            this.router.navigate(['/proveedores']);
          },
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
