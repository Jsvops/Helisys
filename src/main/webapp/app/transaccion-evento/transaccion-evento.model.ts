export class TransaccionEventoDTO {

  constructor(data:Partial<TransaccionEventoDTO>) {
    Object.assign(this, data);
  }

  tvoId?: number|null;
  tvoEvento?: string|null;

}
