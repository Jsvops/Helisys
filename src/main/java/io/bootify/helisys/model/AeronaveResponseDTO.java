package io.bootify.helisys.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AeronaveResponseDTO {
    private Integer anvId;
    private String anvMatricula;
    private String anvNumeroSerie;
    private String anvFabricacion;
    private String modeloNombre;
}
