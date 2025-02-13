import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { map, Observable, catchError, tap } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/transacciones';

  getAllTransacciones(): Observable<TransaccionDTO[]> {
    return this.http.get<TransaccionDTO[]>(this.resourcePath);
  }

  getTransaccion(tceId: number): Observable<TransaccionDTO> {
    return this.http.get<TransaccionDTO>(this.resourcePath + '/' + tceId);
  }

  createTransaccion(transaccionDTO: TransaccionDTO): Observable<number> {
    return this.http.post<number>(this.resourcePath, transaccionDTO);
  }

  updateTransaccion(tceId: number, transaccionDTO: TransaccionDTO): Observable<number> {
    return this.http.put<number>(this.resourcePath + '/' + tceId, transaccionDTO);
  }

  deleteTransaccion(tceId: number): Observable<void> {
    return this.http.delete<void>(this.resourcePath + '/' + tceId);
  }

  getTceTvoValues(): Observable<Map<number, string>> {
    return this.http.get<Record<string,string>>(this.resourcePath + '/tceTvoValues')
        .pipe(map(transformRecordToMap));
  }

  getTceUsrValues(): Observable<Map<number, string>> {
    return this.http.get<Record<string,string>>(this.resourcePath + '/tceUsrValues')
        .pipe(map(transformRecordToMap));
  }

  // Método para obtener la última transacción
  getLastTransaccion(): Observable<TransaccionDTO> {
    return this.http.get<TransaccionDTO>(`${this.resourcePath}/last`);
  }

  // Nuevo método para obtener las aeronaves
  getAeronaves(): Observable<{ anv_id: number, anv_matricula: string }[]> {
    return this.http.get<{ anv_id: number, anv_matricula: string }[]>(`${environment.apiPath}/api/aeronaves`);
  }

  // Método para obtener aeronaves compatibles con un producto
  getAeronavesCompatibles(productoId: number): Observable<{ anvId: number, anvMatricula: string }[]> {
    console.log('Solicitando aeronaves compatibles para productoId:', productoId);
    return this.http.get<{ anvId: number, anvMatricula: string }[]>(
      `${environment.apiPath}/api/aeronaves/compatibles?productoId=${productoId}`
    ).pipe(
      tap((response) => {
        console.log('Respuesta del backend:', response);
      }),
      catchError((error) => {
        console.error('Error al obtener aeronaves compatibles:', error);
        throw error; // Propagar el error
      })
    );
  }
}
