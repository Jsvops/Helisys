export class ProductoDTO {

  constructor(data: Partial<ProductoDTO>) {
    Object.assign(this, data);
  }

  proId?: number | null;
  proNumeroParte?: string | null;
  proNombre?: string | null;
  proNumeroParteAlterno?: string | null;
  proNumeroSerie?: string | null;
  proUnidades?: number;
  proTipoDocumento?: string | null;
  proTpo?: number | null;
  proAmc?: number | null;
  proPve?: number | null;

}
