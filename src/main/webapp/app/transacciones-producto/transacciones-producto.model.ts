export class TransaccionesProductoDTO {

  constructor(data:Partial<TransaccionesProductoDTO>) {
    Object.assign(this, data);
  }

  tcoId?: number|null;
  tcoUnidades?: number|null;
  tcoPro?: number|null;
  tcoTce?: number|null;

}
