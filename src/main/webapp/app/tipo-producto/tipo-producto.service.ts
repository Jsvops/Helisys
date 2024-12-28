import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TipoProductoDTO } from 'app/tipo-producto/tipo-producto.model';


@Injectable({
  providedIn: 'root',
})
export class TipoProductoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/tipoProductos';

  getAllTipoProductos() {
    return this.http.get<TipoProductoDTO[]>(this.resourcePath);
  }

  getTipoProducto(tpoId: number) {
    return this.http.get<TipoProductoDTO>(this.resourcePath + '/' + tpoId);
  }

  createTipoProducto(tipoProductoDTO: TipoProductoDTO) {
    return this.http.post<number>(this.resourcePath, tipoProductoDTO);
  }

  updateTipoProducto(tpoId: number, tipoProductoDTO: TipoProductoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + tpoId, tipoProductoDTO);
  }

  deleteTipoProducto(tpoId: number) {
    return this.http.delete(this.resourcePath + '/' + tpoId);
  }

}
