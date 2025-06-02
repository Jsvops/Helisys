export interface ProductRequestDTO {
  proNumeroParte: string;
  proNombre: string;
  proNumeroParteAlterno?: string;
  proNumeroSerie?: string;
  proUnidades?: number;
  proTipoDocumento?: string;
  proTpo: number; // ID de tipo producto
  proAmc: number; // ID de almacen/contenedor
  proPve: number; // ID de proveedor
  modeloAeronaveIds: number[]; // o Set<number> si lo manejas así
}
