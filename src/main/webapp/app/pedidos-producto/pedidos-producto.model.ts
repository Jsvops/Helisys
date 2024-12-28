export class PedidosProductoDTO {

  constructor(data:Partial<PedidosProductoDTO>) {
    Object.assign(this, data);
  }

  pptId?: number|null;
  pptCantidad?: number|null;
  pptPrecioUnitario?: number|null;
  pptPro?: number|null;
  pptPca?: number|null;

}
