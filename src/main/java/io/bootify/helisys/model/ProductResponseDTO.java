package io.bootify.helisys.model;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {

    private Integer proId;
    private String proNumeroParte;
    private String proNombre;
    private String proNumeroParteAlterno;
    private String proNumeroSerie;
    private Integer proUnidades;
    private String proTipoDocumento;
    private String proTpoNombre;
    private String proAmcNombre;
    private String proPveNombre;
    private List<String> modeloAeronaveNombres;
    private Integer proTpoId;
    private Integer proAmcId;
    private Integer proPveId;
    private List<Integer> modeloAeronaveIds;

}

