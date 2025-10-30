import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PedidosCompraService } from 'app/pedidos-compra/pedidos-compra.service';
import { PedidosCompraDTO } from 'app/pedidos-compra/pedidos-compra.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pedidos-compra-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './pedidos-compra-add.component.html',
  styleUrls: ['./pedidos-compra-add.component.scss']
})
export class PedidosCompraAddComponent {

  pedidosCompraService = inject(PedidosCompraService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);
  addForm = new FormGroup({
    pcaDescripcion: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pcaFechaPedido: new FormControl(null, [Validators.required]),
    pcaFechaEnvio: new FormControl(null, [Validators.required]),
    pcaFechaEntrega: new FormControl(null, [Validators.required]),
    pcaFechaPrometida: new FormControl(null, [Validators.required]),
    pcaDireccionEnvio: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@pedidosCompra.create.success:El pedido de compra fue creado con éxito ✅`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new PedidosCompraDTO(this.addForm.value);
    this.pedidosCompraService.createPedidosCompra(data)
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
            this.router.navigate(['/pedidosCompras']);
          },
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
