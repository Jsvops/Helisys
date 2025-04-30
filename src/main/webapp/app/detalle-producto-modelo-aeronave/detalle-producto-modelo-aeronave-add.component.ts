import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetalleProductoModeloAeronaveService } from './detalle-producto-modelo-aeronave.service';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-detalle-producto-modelo-aeronave-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detalle-producto-modelo-aeronave-add.component.html'
})
export class DetalleProductoModeloAeronaveAddComponent implements OnInit {

  detalleService = inject(DetalleProductoModeloAeronaveService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    dpmaPro: new FormControl(null, [Validators.required]),
    dpmaMre: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@detalle.create.success:Detalle was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {}

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new DetalleProductoModeloAeronaveDTO(this.addForm.value);
    this.detalleService.createDetalle(data)
      .subscribe({
        next: () => this.router.navigate(['/detalle-producto-modelo-aeronave-list'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }
}
