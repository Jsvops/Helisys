package io.bootify.helisys.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
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

    @FutureOrPresent(message = "La fecha de vencimiento no puede ser anterior a hoy")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ltFechaVencimiento;

    private String tceObservaciones;
}


