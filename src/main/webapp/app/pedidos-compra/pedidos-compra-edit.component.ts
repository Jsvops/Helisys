import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PedidosCompraService } from 'app/pedidos-compra/pedidos-compra.service';
import { PedidosCompraDTO } from 'app/pedidos-compra/pedidos-compra.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-pedidos-compra-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './pedidos-compra-edit.component.html'
})
export class PedidosCompraEditComponent implements OnInit {

  pedidosCompraService = inject(PedidosCompraService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentPcaId?: number;

  editForm = new FormGroup({
    pcaId: new FormControl({ value: null, disabled: true }),
    pcaDescripcion: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    pcaFechaPedido: new FormControl(null, [Validators.required]),
    pcaFechaEnvio: new FormControl(null, [Validators.required]),
    pcaFechaEntrega: new FormControl(null, [Validators.required]),
    pcaFechaPrometida: new FormControl(null, [Validators.required]),
    pcaDireccionEnvio: new FormControl(null, [Validators.required, Validators.maxLength(45)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@pedidosCompra.update.success:Pedidos Compra was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentPcaId = +this.route.snapshot.params['pcaId'];
    this.pedidosCompraService.getPedidosCompra(this.currentPcaId!)
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
    const data = new PedidosCompraDTO(this.editForm.value);
    this.pedidosCompraService.updatePedidosCompra(this.currentPcaId!, data)
        .subscribe({
          next: () => this.router.navigate(['/pedidosCompras'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
