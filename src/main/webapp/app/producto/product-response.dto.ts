export interface ProductResponseDTO {
  proId: number;
  proNombre: string;
  proNumeroParte: string;
  proNumeroParteAlterno: string;
  proNumeroSerie: string;
  proUnidades: number;
  proTipoDocumento: string;
  proTpoNombre: string;
  proAmcNombre: string; // Aquí estará la descripción combinada del almacén
  proPveNombre: string;
  modeloAeronaveNombres: string[];
}
