package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TransaccionDTO {

    private Integer tceId;

    @NotNull
    private LocalDate tceFechaTransaccion;

    @NotNull
    @Size(max = 500)
    private String tceObservaciones;

    @NotNull
    private Integer tceTvo;

    @NotNull
    private Integer tceUsr;

}
