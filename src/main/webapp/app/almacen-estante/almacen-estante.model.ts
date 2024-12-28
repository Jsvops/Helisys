export class AlmacenEstanteDTO {

  constructor(data:Partial<AlmacenEstanteDTO>) {
    Object.assign(this, data);
  }

  amtId?: number|null;
  amtDescripcion?: string|null;

}
