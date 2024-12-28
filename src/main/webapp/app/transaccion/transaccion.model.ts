export class TransaccionDTO {

  constructor(data:Partial<TransaccionDTO>) {
    Object.assign(this, data);
  }

  tceId?: number|null;
  tceFechaTransaccion?: string|null;
  tceObservaciones?: string|null;
  tceTvo?: number|null;
  tceUsr?: number|null;

}
