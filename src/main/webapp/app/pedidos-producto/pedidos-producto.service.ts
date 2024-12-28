import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PedidosProductoDTO } from 'app/pedidos-producto/pedidos-producto.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class PedidosProductoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/pedidosProductos';

  getAllPedidosProductos() {
    return this.http.get<PedidosProductoDTO[]>(this.resourcePath);
  }

  getPedidosProducto(pptId: number) {
    return this.http.get<PedidosProductoDTO>(this.resourcePath + '/' + pptId);
  }

  createPedidosProducto(pedidosProductoDTO: PedidosProductoDTO) {
    return this.http.post<number>(this.resourcePath, pedidosProductoDTO);
  }

  updatePedidosProducto(pptId: number, pedidosProductoDTO: PedidosProductoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + pptId, pedidosProductoDTO);
  }

  deletePedidosProducto(pptId: number) {
    return this.http.delete(this.resourcePath + '/' + pptId);
  }

  getPptProValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/pptProValues')
        .pipe(map(transformRecordToMap));
  }

  getPptPcaValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/pptPcaValues')
        .pipe(map(transformRecordToMap));
  }

}
