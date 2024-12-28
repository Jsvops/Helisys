export class TipoProductoDTO {

  constructor(data:Partial<TipoProductoDTO>) {
    Object.assign(this, data);
  }

  tpoId?: number|null;
  tpoNombreTipo?: string|null;

}
