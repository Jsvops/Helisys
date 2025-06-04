package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransactionRequestDTO {

    @NotNull
    private Integer tceTvo;

    @NotNull
    private Integer tcoPro;

    private Integer tceAnv;

    @NotNull
    private Integer unidades;

    private LocalDate ltFechaVencimiento;

    private String tceObservaciones;
}


