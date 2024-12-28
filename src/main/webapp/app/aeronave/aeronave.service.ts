import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AeronaveDTO } from 'app/aeronave/aeronave.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class AeronaveService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/aeronaves';

  getAllAeronaves() {
    return this.http.get<AeronaveDTO[]>(this.resourcePath);
  }

  getAeronave(anvId: number) {
    return this.http.get<AeronaveDTO>(this.resourcePath + '/' + anvId);
  }

  createAeronave(aeronaveDTO: AeronaveDTO) {
    return this.http.post<number>(this.resourcePath, aeronaveDTO);
  }

  updateAeronave(anvId: number, aeronaveDTO: AeronaveDTO) {
    return this.http.put<number>(this.resourcePath + '/' + anvId, aeronaveDTO);
  }

  deleteAeronave(anvId: number) {
    return this.http.delete(this.resourcePath + '/' + anvId);
  }

  getAnvMreValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/anvMreValues')
        .pipe(map(transformRecordToMap));
  }

}
