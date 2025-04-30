package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DetalleProductoModeloAeronaveDTO {

    private Integer dpmaId;

    @NotNull
    private Integer dpmaPro; // Representa el ID del Producto

    @NotNull
    private Integer dpmaMre; // Representa el ID del ModeloAeronave

}
