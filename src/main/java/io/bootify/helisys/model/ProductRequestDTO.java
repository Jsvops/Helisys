package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestDTO {

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
    private Integer proUnidades = 0;

    @NotNull
    @Size(max = 25)
    private String proTipoDocumento;

    @NotNull
    private Integer proTpo;

    @NotNull
    private Integer proAmc;

    @NotNull
    private Integer proPve;

    private Set<Integer> modeloAeronaveIds;
}
