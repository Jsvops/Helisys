export class AlmacenRepisaDTO {

  constructor(data:Partial<AlmacenRepisaDTO>) {
    Object.assign(this, data);
  }

  amrId?: number|null;
  amrNombre?: string|null;
  amrAmt?: number|null;

}
