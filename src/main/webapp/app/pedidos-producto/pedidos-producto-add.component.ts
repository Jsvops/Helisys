import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { PedidosProductoService } from 'app/pedidos-producto/pedidos-producto.service';
import { PedidosProductoDTO } from 'app/pedidos-producto/pedidos-producto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-pedidos-producto-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './pedidos-producto-add.component.html'
})
export class PedidosProductoAddComponent implements OnInit {

  pedidosProductoService = inject(PedidosProductoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  pptProValues?: Map<number,string>;
  pptPcaValues?: Map<number,string>;

  addForm = new FormGroup({
    pptCantidad: new FormControl(null, [Validators.required]),
    pptPrecioUnitario: new FormControl(null, [Validators.required]),
    pptPro: new FormControl(null, [Validators.required]),
    pptPca: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@pedidosProducto.create.success:Pedidos Producto was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new PedidosProductoDTO(this.addForm.value);
    this.pedidosProductoService.createPedidosProducto(data)
        .subscribe({
          next: () => this.router.navigate(['/pedidosProductos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
