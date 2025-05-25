package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModeloAeronaveDTO {

    private Integer mreId;

    @NotNull
    @Size(max = 45)
    private String mreNombre;

    private List<DetalleProductoModeloAeronaveDTO> detallesProducto;

}
