export class ProveedorDTO {

  constructor(data:Partial<ProveedorDTO>) {
    Object.assign(this, data);
  }

  pveId?: number|null;
  pveNombre?: string|null;
  pveTelefono?: string|null;
  pveFax?: string|null;
  pveEmail?: string|null;
  pveDireccion?: string|null;
  pveCiudad?: string|null;
  pvePais?: string|null;

}
