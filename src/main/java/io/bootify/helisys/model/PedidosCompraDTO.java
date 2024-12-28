package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PedidosCompraDTO {

    private Integer pcaId;

    @NotNull
    @Size(max = 45)
    private String pcaDescripcion;

    @NotNull
    private LocalDate pcaFechaPedido;

    @NotNull
    private LocalDate pcaFechaEnvio;

    @NotNull
    private LocalDate pcaFechaEntrega;

    @NotNull
    private LocalDate pcaFechaPrometida;

    @NotNull
    @Size(max = 45)
    private String pcaDireccionEnvio;

}
