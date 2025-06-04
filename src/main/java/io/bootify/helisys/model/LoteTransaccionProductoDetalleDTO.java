package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoteTransaccionProductoDetalleDTO {

    private Integer ltpdId;

    @NotNull
    private Integer ltpdUnidades;

    @NotNull
    private Integer ltpdLt;

    @NotNull
    private Integer ltpdTco;

}
