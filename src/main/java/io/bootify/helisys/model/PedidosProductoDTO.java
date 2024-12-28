package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PedidosProductoDTO {

    private Integer pptId;

    @NotNull
    private Integer pptCantidad;

    @NotNull
    private Integer pptPrecioUnitario;

    @NotNull
    private Integer pptPro;

    @NotNull
    private Integer pptPca;

}
