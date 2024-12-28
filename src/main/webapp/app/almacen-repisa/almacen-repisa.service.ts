import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AlmacenRepisaDTO } from 'app/almacen-repisa/almacen-repisa.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class AlmacenRepisaService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/almacenRepisas';

  getAllAlmacenRepisas() {
    return this.http.get<AlmacenRepisaDTO[]>(this.resourcePath);
  }

  getAlmacenRepisa(amrId: number) {
    return this.http.get<AlmacenRepisaDTO>(this.resourcePath + '/' + amrId);
  }

  createAlmacenRepisa(almacenRepisaDTO: AlmacenRepisaDTO) {
    return this.http.post<number>(this.resourcePath, almacenRepisaDTO);
  }

  updateAlmacenRepisa(amrId: number, almacenRepisaDTO: AlmacenRepisaDTO) {
    return this.http.put<number>(this.resourcePath + '/' + amrId, almacenRepisaDTO);
  }

  deleteAlmacenRepisa(amrId: number) {
    return this.http.delete(this.resourcePath + '/' + amrId);
  }

  getAmrAmtValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/amrAmtValues')
        .pipe(map(transformRecordToMap));
  }

}
