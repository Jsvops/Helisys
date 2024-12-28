export class UsuarioDTO {

  constructor(data:Partial<UsuarioDTO>) {
    Object.assign(this, data);
  }

  usrId?: number|null;
  usrCtIdentidad?: number|null;
  usrCtMilitar?: number|null;
  usrNombre?: string|null;
  usrApellido?: string|null;
  usrDireccion?: string|null;
  usrTelefono?: string|null;
  usrCargo?: string|null;
  usrFoto?: string|null;
  usrLogin?: string|null;
  usrPassword?: string|null;
  usrEdn?: number|null;
  usrGdo?: number|null;

}
