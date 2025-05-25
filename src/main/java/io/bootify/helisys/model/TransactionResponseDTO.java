package io.bootify.helisys.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransactionResponseDTO {


    private LocalDate tceFechaTransaccion;
    private String tceObservaciones;
    private Integer tceTvo;
    private Integer tceUsr;
    private Integer tceAnv;
    private Integer tcoPro;
    private Integer unidades;
}
