package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductoDTO {

    private Integer proId;

    @NotNull
    @Size(max = 45)
    private String proNumeroParte;

    @NotNull
    @Size(max = 45)
    private String proNombre;

    @Size(max = 45)
    private String proNumeroParteAlterno;

    @NotNull
    @Size(max = 45)
    private String proNumeroSerie;

    @NotNull
    private Integer proUnidades;

    private LocalDate proFechaVencimiento;

    @NotNull
    @Size(max = 25)
    private String proTipoDocumento;

    @NotNull
    private Integer proTpo; // ID del TipoProducto

    @NotNull
    private Integer proAmc; // ID del AlmacenContenedor

    @NotNull
    private Integer proPve; // ID del Proveedor

    // Lista de DetalleProductoModeloAeronaveDTO para representar la relación
    private List<DetalleProductoModeloAeronaveDTO> detallesModeloAeronave;

}
