export interface TransactionResponseDTO {
  tceId: number;
  tceFechaTransaccion: string;
  tceObservaciones: string | null;
  eventoNombre: string;
  usuarioNombre: string;
  aeronaveMatricula: string | null;
  productoNumeroParte: string;
  unidades: number;
}
