package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter


public class TransaccionesProductoDTO {

    private Integer tcoId;

    @NotNull
    private Integer tcoUnidades;

    @NotNull
    private Integer tcoPro;

    @NotNull
    private Integer tcoTce;

}
