export interface ProductRequestDTO {
  proNumeroParte: string;
  proNombre: string;
  proNumeroParteAlterno?: string;
  proNumeroSerie?: string;
  proUnidades?: number;
  proTipoDocumento?: string;
  proTpo: number;
  proAmc: number;
  proPve: number;
  modeloAeronaveIds: number[];
}
