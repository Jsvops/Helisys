import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProveedorDTO } from 'app/proveedor/proveedor.model';


@Injectable({
  providedIn: 'root',
})
export class ProveedorService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/proveedores';

  getAllProveedores() {
    return this.http.get<ProveedorDTO[]>(this.resourcePath);
  }

  getProveedor(pveId: number) {
    return this.http.get<ProveedorDTO>(this.resourcePath + '/' + pveId);
  }

  createProveedor(proveedorDTO: ProveedorDTO) {
    return this.http.post<number>(this.resourcePath, proveedorDTO);
  }

  updateProveedor(pveId: number, proveedorDTO: ProveedorDTO) {
    return this.http.put<number>(this.resourcePath + '/' + pveId, proveedorDTO);
  }

  deleteProveedor(pveId: number) {
    return this.http.delete(this.resourcePath + '/' + pveId);
  }

}
