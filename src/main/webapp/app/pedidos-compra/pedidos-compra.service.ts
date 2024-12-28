import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PedidosCompraDTO } from 'app/pedidos-compra/pedidos-compra.model';


@Injectable({
  providedIn: 'root',
})
export class PedidosCompraService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/pedidosCompras';

  getAllPedidosCompras() {
    return this.http.get<PedidosCompraDTO[]>(this.resourcePath);
  }

  getPedidosCompra(pcaId: number) {
    return this.http.get<PedidosCompraDTO>(this.resourcePath + '/' + pcaId);
  }

  createPedidosCompra(pedidosCompraDTO: PedidosCompraDTO) {
    return this.http.post<number>(this.resourcePath, pedidosCompraDTO);
  }

  updatePedidosCompra(pcaId: number, pedidosCompraDTO: PedidosCompraDTO) {
    return this.http.put<number>(this.resourcePath + '/' + pcaId, pedidosCompraDTO);
  }

  deletePedidosCompra(pcaId: number) {
    return this.http.delete(this.resourcePath + '/' + pcaId);
  }

}
