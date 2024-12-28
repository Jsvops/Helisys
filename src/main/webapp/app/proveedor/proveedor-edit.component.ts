import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProveedorService } from 'app/proveedor/proveedor.service';
import { ProveedorDTO } from 'app/proveedor/proveedor.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-proveedor-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './proveedor-edit.component.html'
})
export class ProveedorEditComponent implements OnInit {

  proveedorService = inject(ProveedorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentPveId?: number;

  editForm = new FormGroup({
    pveId: new FormControl({ value: null, disabled: true }),
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
      updated: $localize`:@@proveedor.update.success:Proveedor was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentPveId = +this.route.snapshot.params['pveId'];
    this.proveedorService.getProveedor(this.currentPveId!)
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
    const data = new ProveedorDTO(this.editForm.value);
    this.proveedorService.updateProveedor(this.currentPveId!, data)
        .subscribe({
          next: () => this.router.navigate(['/proveedores'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
