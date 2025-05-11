package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransactionRequestDTO {

    @NotNull
    private Integer tceTvo; // ID del tipo de evento (1-9)

    @NotNull
    private Integer tcoPro; // ID del producto

    private Integer tceAnv; // ID de aeronave (opcional)

    @NotNull
    private Integer unidades;

    private LocalDate ltFechaVencimiento; // Obligatorio para productos perecederos

    private String tceObservaciones;
}


