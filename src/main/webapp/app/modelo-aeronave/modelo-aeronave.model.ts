export class ModeloAeronaveDTO {

  constructor(data:Partial<ModeloAeronaveDTO>) {
    Object.assign(this, data);
  }

  mreId?: number|null;
  mreNombre?: string|null;

}
