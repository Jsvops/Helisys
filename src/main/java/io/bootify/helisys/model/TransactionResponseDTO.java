package io.bootify.helisys.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransactionResponseDTO {

    private Integer tceId;
    private LocalDate tceFechaTransaccion;
    private String tceObservaciones;
    private String eventoNombre;
    private String usuarioNombre;
    private String aeronaveMatricula;
    private String productoNumeroParte;
    private Integer unidades;

    public TransactionResponseDTO(final Integer tceId,
                                  final LocalDate tceFechaTransaccion,
                                  final String tceObservaciones,
                                  final String eventoNombre,
                                  final String usuarioNombre,
                                  final String aeronaveMatricula,
                                  final String productoNumeroParte,
                                  final Integer unidades) {
        this.tceId = tceId;
        this.tceFechaTransaccion = tceFechaTransaccion;
        this.tceObservaciones = tceObservaciones;
        this.eventoNombre = eventoNombre;
        this.usuarioNombre = usuarioNombre;
        this.aeronaveMatricula = aeronaveMatricula;
        this.productoNumeroParte = productoNumeroParte;
        this.unidades = unidades;
    }
}
