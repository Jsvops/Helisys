export interface TransaccionRequestDTO {
tceTvo: number; // ID del tipo de evento
tcoPro: number; // ID del producto
tceObservaciones?: string;
unidades: number;
tceAnv?: number; // ID de la aeronave (opcional)
ltFechaVencimiento?: string; // fecha en formato ISO (opcional)
}
