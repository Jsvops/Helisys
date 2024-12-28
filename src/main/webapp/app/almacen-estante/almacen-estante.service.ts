import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AlmacenEstanteDTO } from 'app/almacen-estante/almacen-estante.model';


@Injectable({
  providedIn: 'root',
})
export class AlmacenEstanteService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/almacenEstantes';

  getAllAlmacenEstantes() {
    return this.http.get<AlmacenEstanteDTO[]>(this.resourcePath);
  }

  getAlmacenEstante(amtId: number) {
    return this.http.get<AlmacenEstanteDTO>(this.resourcePath + '/' + amtId);
  }

  createAlmacenEstante(almacenEstanteDTO: AlmacenEstanteDTO) {
    return this.http.post<number>(this.resourcePath, almacenEstanteDTO);
  }

  updateAlmacenEstante(amtId: number, almacenEstanteDTO: AlmacenEstanteDTO) {
    return this.http.put<number>(this.resourcePath + '/' + amtId, almacenEstanteDTO);
  }

  deleteAlmacenEstante(amtId: number) {
    return this.http.delete(this.resourcePath + '/' + amtId);
  }

}
