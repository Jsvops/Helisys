import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PedidosProductoService } from 'app/pedidos-producto/pedidos-producto.service';
import { PedidosProductoDTO } from 'app/pedidos-producto/pedidos-producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-pedidos-producto-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './pedidos-producto-edit.component.html'
})
export class PedidosProductoEditComponent implements OnInit {

  pedidosProductoService = inject(PedidosProductoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  pptProValues?: Map<number,string>;
  pptPcaValues?: Map<number,string>;
  currentPptId?: number;

  editForm = new FormGroup({
    pptId: new FormControl({ value: null, disabled: true }),
    pptCantidad: new FormControl(null, [Validators.required]),
    pptPrecioUnitario: new FormControl(null, [Validators.required]),
    pptPro: new FormControl(null, [Validators.required]),
    pptPca: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@pedidosProducto.update.success:Pedidos Producto was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentPptId = +this.route.snapshot.params['pptId'];
    this.pedidosProductoService.getPptProValues()
        .subscribe({
          next: (data) => this.pptProValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.pedidosProductoService.getPptPcaValues()
        .subscribe({
          next: (data) => this.pptPcaValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.pedidosProductoService.getPedidosProducto(this.currentPptId!)
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
    const data = new PedidosProductoDTO(this.editForm.value);
    this.pedidosProductoService.updatePedidosProducto(this.currentPptId!, data)
        .subscribe({
          next: () => this.router.navigate(['/pedidosProductos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
