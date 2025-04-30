export class DetalleProductoModeloAeronaveDTO {

  constructor(data: Partial<DetalleProductoModeloAeronaveDTO>) {
    Object.assign(this, data);
  }

  dpmaId?: number | null;
  dpmaPro?: number | null; // ID del Producto
  dpmaMre?: number | null; // ID del ModeloAeronave
}
