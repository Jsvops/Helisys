import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UsuarioDTO } from 'app/usuario/usuario.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/usuarios';

  getAllUsuarios() {
    return this.http.get<UsuarioDTO[]>(this.resourcePath);
  }

  getUsuario(usrId: number) {
    return this.http.get<UsuarioDTO>(this.resourcePath + '/' + usrId);
  }

  createUsuario(usuarioDTO: UsuarioDTO) {
    return this.http.post<number>(this.resourcePath, usuarioDTO);
  }

  updateUsuario(usrId: number, usuarioDTO: UsuarioDTO) {
    return this.http.put<number>(this.resourcePath + '/' + usrId, usuarioDTO);
  }

  deleteUsuario(usrId: number) {
    return this.http.delete(this.resourcePath + '/' + usrId);
  }

  getUsrEdnValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/usrEdnValues')
        .pipe(map(transformRecordToMap));
  }

  getUsrGdoValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/usrGdoValues')
        .pipe(map(transformRecordToMap));
  }

}
