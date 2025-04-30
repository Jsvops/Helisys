import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProductoDTO } from 'app/producto/producto.model';
import { map, Observable } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';
import { ProductViewDTO } from 'app/producto/product-view.dto';
import { AlmacenCombinadoDTO } from 'app/almacen-combinado/almacen-combinado.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/productos';

  getUnidadesDisponibles(productoId: number): Observable<number> {
    const url = `${this.resourcePath}/${productoId}/unidades-disponibles`;
    return this.http.get<number>(url);
  }

  getAllProductos() {
    return this.http.get<ProductoDTO[]>(this.resourcePath);
  }

  getProducto(proId: number) {
    return this.http.get<ProductoDTO>(this.resourcePath + '/' + proId);
  }

  createProducto(productoDTO: ProductoDTO) {
    return this.http.post<number>(this.resourcePath, productoDTO);
  }

  updateProducto(proId: number, productoDTO: ProductoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + proId, productoDTO);
  }

  deleteProducto(proId: number) {
    return this.http.delete(this.resourcePath + '/' + proId);
  }

  getProTpoValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/proTpoValues')
      .pipe(map(transformRecordToMap));
  }

  getProAmcValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/proAmcValues')
      .pipe(map(transformRecordToMap));
  }

  // Eliminamos getProMreValues ya que la relación directa ya no existe
  // getProMreValues() {
  //   return this.http.get<Record<string, string>>(this.resourcePath + '/proMreValues')
  //     .pipe(map(transformRecordToMap));
  // }

  getProPveValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/proPveValues')
      .pipe(map(transformRecordToMap));
  }

  findFilteredProducts(partNumber?: string, name?: string, alterPartNumber?: string): Observable<ProductViewDTO[]> {
    let params = new HttpParams();
    if (partNumber) {
      params = params.append('partNumber', partNumber);
    }
    if (name) {
      params = params.append('name', name);
    }
    if (alterPartNumber) {
      params = params.append('alterPartNumber', alterPartNumber);
    }
    return this.http.get<ProductViewDTO[]>(`${this.resourcePath}/search`, { params });
  }

  getAlmacenCombinado(): Observable<AlmacenCombinadoDTO[]> {
    return this.http.get<AlmacenCombinadoDTO[]>('/api/productos/almacen-combinado');
  }
}
