import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TransaccionDTO } from 'app/transaccion/transaccion.model';
import { map, Observable } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';
import { TransaccionRequestDTO } from './transaccion-request.dto';
import { TransactionResponseDTO } from './transaction-response.dto';

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

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
    return this.http.get<TransaccionDTO>(`${this.resourcePath}/${tceId}`);
  }

  createTransaccion(transaccionDTO: TransaccionDTO): Observable<number> {
    return this.http.post<number>(this.resourcePath, transaccionDTO);
  }

  updateTransaccion(tceId: number, transaccionDTO: TransaccionDTO): Observable<number> {
    return this.http.put<number>(`${this.resourcePath}/${tceId}`, transaccionDTO);
  }

  deleteTransaccion(tceId: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath}/${tceId}`);
  }

  getTceTvoValues(): Observable<Map<number, string>> {
    return this.http.get<Record<string, string>>(`${this.resourcePath}/tceTvoValues`)
      .pipe(map(transformRecordToMap));
  }

  getTceAnvValues(): Observable<Map<number, string>> {
    return this.http.get<Record<string, string>>(`${this.resourcePath}/tceAnvValues`)
      .pipe(map(transformRecordToMap));
  }

  getTceUsrValues(): Observable<Map<number, string>> {
    return this.http.get<Record<string, string>>(`${this.resourcePath}/tceUsrValues`)
      .pipe(map(transformRecordToMap));
  }

  getLastTransaccion(): Observable<TransaccionDTO> {
    return this.http.get<TransaccionDTO>(`${this.resourcePath}/last`);
  }

  getAeronaves(): Observable<{ anv_id: number, anv_matricula: string }[]> {
    return this.http.get<{ anv_id: number, anv_matricula: string }[]>(`${environment.apiPath}/api/aeronaves`);
  }

  getAeronavesCompatibles(productoId: number): Observable<{ anvId: number, anvMatricula: string }[]> {
    return this.http.get<{ anvId: number, anvMatricula: string }[]>(
      `${environment.apiPath}/api/aeronaves/compatibles?productoId=${productoId}`
    );
  }

  executeTransaction(dto: TransaccionRequestDTO): Observable<number> {
    return this.http.post<number>(this.resourcePath + '/', dto);
  }

  getResumenTransacciones(
    page = 0,
    size = 10,
    fechaInicio?: string | null,
    fechaFin?: string | null
  ): Observable<Page<TransactionResponseDTO>> {
    const params: any = {
      page,
      size,
      sort: 'tceId,desc'

    };

    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;

    return this.http.get<Page<TransactionResponseDTO>>(`${this.resourcePath}/lista`, { params });
  }


}
