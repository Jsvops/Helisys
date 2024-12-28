export class AlmacenContenedorDTO {

  constructor(data:Partial<AlmacenContenedorDTO>) {
    Object.assign(this, data);
  }

  amcId?: number|null;
  amcNumero?: string|null;
  amcAmr?: number|null;

}
