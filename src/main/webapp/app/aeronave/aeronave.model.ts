export class AeronaveDTO {

  constructor(data:Partial<AeronaveDTO>) {
    Object.assign(this, data);
  }

  anvId?: number|null;
  anvMatricula?: string|null;
  anvNumeroSerie?: string|null;
  anvFabricacion?: string|null;
  anvMre?: number|null;
  modeloNombre?: string | null;


}
