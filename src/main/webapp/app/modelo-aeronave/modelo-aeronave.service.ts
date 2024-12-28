import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';


@Injectable({
  providedIn: 'root',
})
export class ModeloAeronaveService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/modeloAeronaves';

  getAllModeloAeronaves() {
    return this.http.get<ModeloAeronaveDTO[]>(this.resourcePath);
  }

  getModeloAeronave(mreId: number) {
    return this.http.get<ModeloAeronaveDTO>(this.resourcePath + '/' + mreId);
  }

  createModeloAeronave(modeloAeronaveDTO: ModeloAeronaveDTO) {
    return this.http.post<number>(this.resourcePath, modeloAeronaveDTO);
  }

  updateModeloAeronave(mreId: number, modeloAeronaveDTO: ModeloAeronaveDTO) {
    return this.http.put<number>(this.resourcePath + '/' + mreId, modeloAeronaveDTO);
  }

  deleteModeloAeronave(mreId: number) {
    return this.http.delete(this.resourcePath + '/' + mreId);
  }

}
