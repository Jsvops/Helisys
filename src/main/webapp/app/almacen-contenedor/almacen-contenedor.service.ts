import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AlmacenContenedorDTO } from 'app/almacen-contenedor/almacen-contenedor.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class AlmacenContenedorService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/almacenContenedores';

  getAllAlmacenContenedores() {
    return this.http.get<AlmacenContenedorDTO[]>(this.resourcePath);
  }

  getAlmacenContenedor(amcId: number) {
    return this.http.get<AlmacenContenedorDTO>(this.resourcePath + '/' + amcId);
  }

  createAlmacenContenedor(almacenContenedorDTO: AlmacenContenedorDTO) {
    return this.http.post<number>(this.resourcePath, almacenContenedorDTO);
  }

  updateAlmacenContenedor(amcId: number, almacenContenedorDTO: AlmacenContenedorDTO) {
    return this.http.put<number>(this.resourcePath + '/' + amcId, almacenContenedorDTO);
  }

  deleteAlmacenContenedor(amcId: number) {
    return this.http.delete(this.resourcePath + '/' + amcId);
  }

  getAmcAmrValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/amcAmrValues')
        .pipe(map(transformRecordToMap));
  }

}
