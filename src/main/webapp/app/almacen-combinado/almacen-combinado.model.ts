export class AlmacenCombinadoDTO {
  amcId: number;          // ID del contenedor
  descripcionCombinada: string; // Valor combinado, ej: "01A001"

  constructor(data: Partial<AlmacenCombinadoDTO> = {}) {
    this.amcId = data.amcId || 0; // Inicializa con un valor por defecto
    this.descripcionCombinada = data.descripcionCombinada || ''; // Inicializa con un valor por defecto
  }
}
