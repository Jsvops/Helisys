import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DetalleProductoModeloAeronaveDTO } from './detalle-producto-modelo-aeronave.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetalleProductoModeloAeronaveService {
  private productoPath = environment.apiPath + '/api/productos';
  private modeloAeronavePath = environment.apiPath + '/api/modeloAeronaves';
  private detallePath = environment.apiPath + '/api/detalle-producto-modelo-aeronave';

  constructor(private http: HttpClient) {}

  // Obtener todos los detalles
  getAllDetalles(): Observable<DetalleProductoModeloAeronaveDTO[]> {
    return this.http.get<DetalleProductoModeloAeronaveDTO[]>(this.detallePath)
      .pipe(catchError(this.handleError));
  }

  // Obtener un detalle por su ID
  getDetalleById(dpmaId: number): Observable<DetalleProductoModeloAeronaveDTO> {
    return this.http.get<DetalleProductoModeloAeronaveDTO>(`${this.detallePath}/${dpmaId}`)
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo detalle
  createDetalle(detalleDTO: DetalleProductoModeloAeronaveDTO): Observable<number> {
    return this.http.post<number>(this.detallePath, detalleDTO)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un detalle existente
  updateDetalle(dpmaId: number, detalleDTO: DetalleProductoModeloAeronaveDTO): Observable<void> {
    return this.http.put<void>(`${this.detallePath}/${dpmaId}`, detalleDTO)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un detalle por su ID
  deleteDetalle(dpmaId: number): Observable<void> {
    return this.http.delete<void>(`${this.detallePath}/${dpmaId}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener detalles por ID de producto
  getDetallesByProductoId(proId: number): Observable<DetalleProductoModeloAeronaveDTO[]> {
    return this.http.get<DetalleProductoModeloAeronaveDTO[]>(`${this.productoPath}/${proId}/modelos`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar relaciones entre producto y modelos de aeronave
  updateDetallesByProductoId(proId: number, mreIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.productoPath}/${proId}/modelos`, mreIds)
      .pipe(catchError(this.handleError));
  }

  // Obtener todos los productos
  getAllProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.productoPath)
      .pipe(catchError(this.handleError));
  }

  // Obtener todos los modelos de aeronave
  getAllModeloAeronaves(): Observable<any[]> {
    return this.http.get<any[]>(this.modeloAeronavePath)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    return throwError(() => new Error('Error en el servicio. Por favor, inténtelo de nuevo más tarde.'));
  }
}
