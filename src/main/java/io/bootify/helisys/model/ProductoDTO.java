package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


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
    private Integer proTpo;

    @NotNull
    private Integer proAmc;

    @NotNull
    private Integer proMre;

    @NotNull
    private Integer proPve;

}
