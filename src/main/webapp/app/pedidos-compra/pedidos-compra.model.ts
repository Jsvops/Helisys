export class PedidosCompraDTO {

  constructor(data:Partial<PedidosCompraDTO>) {
    Object.assign(this, data);
  }

  pcaId?: number|null;
  pcaDescripcion?: string|null;
  pcaFechaPedido?: string|null;
  pcaFechaEnvio?: string|null;
  pcaFechaEntrega?: string|null;
  pcaFechaPrometida?: string|null;
  pcaDireccionEnvio?: string|null;

}
