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

  getAllAeronavesForList() {
      return this.http.get<AeronaveDTO[]>(`${this.resourcePath}/list`);
    }

//   getAllAeronaves() {
//     return this.http.get<AeronaveDTO[]>(this.resourcePath);
//   }

  getAeronave(anvId: number) {
    return this.http.get<AeronaveDTO>(this.resourcePath + '/' + anvId);
  }

  createAeronave(aeronaveDTO: AeronaveDTO) {
      const payload = this.toPayload(aeronaveDTO);
      return this.http.post<number>(this.resourcePath, payload);
    }

  updateAeronave(anvId: number, aeronaveDTO: AeronaveDTO) {
      const payload = this.toPayload(aeronaveDTO);
      return this.http.put<number>(`${this.resourcePath}/${anvId}`, payload);
    }

    deleteAeronave(anvId: number) {
      return this.http.delete(`${this.resourcePath}/${anvId}`);
    }

  getAnvMreValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/anvMreValues')
        .pipe(map(transformRecordToMap));
  }

  private toPayload(dto: AeronaveDTO): AeronavePayload {
      return {
        anvMatricula: dto.anvMatricula ?? null,
        anvNumeroSerie: dto.anvNumeroSerie ?? null,
        anvFabricacion: dto.anvFabricacion ?? null,
        anvMre: dto.anvMre ?? null
      };
    }

}

interface AeronavePayload {
  anvMatricula: string | null;
  anvNumeroSerie: string | null;
  anvFabricacion: string | null;
  anvMre: number | null;
}
