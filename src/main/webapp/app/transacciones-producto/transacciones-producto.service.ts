import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TransaccionesProductoDTO } from 'app/transacciones-producto/transacciones-producto.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class TransaccionesProductoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/transaccionesProductos';

  getAllTransaccionesProductos() {
    return this.http.get<TransaccionesProductoDTO[]>(this.resourcePath);
  }

  getTransaccionesProducto(tcoId: number) {
    return this.http.get<TransaccionesProductoDTO>(this.resourcePath + '/' + tcoId);
  }

  createTransaccionesProducto(transaccionesProductoDTO: TransaccionesProductoDTO) {
    return this.http.post<number>(this.resourcePath, transaccionesProductoDTO);
  }

  updateTransaccionesProducto(tcoId: number, transaccionesProductoDTO: TransaccionesProductoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + tcoId, transaccionesProductoDTO);
  }

  deleteTransaccionesProducto(tcoId: number) {
    return this.http.delete(this.resourcePath + '/' + tcoId);
  }

  getTcoProValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/tcoProValues')
        .pipe(map(transformRecordToMap));
  }

  getTcoTceValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/tcoTceValues')
        .pipe(map(transformRecordToMap));
  }

}
