package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AeronaveDTO {

    private Integer anvId;

    @NotNull
    @Size(max = 45)
    @AeronaveAnvMatriculaUnique
    private String anvMatricula;

    @NotNull
    @Size(max = 45)
    private String anvNumeroSerie;

    @NotNull
    @Size(max = 25)
    private String anvFabricacion;

    @NotNull
    private Integer anvMre;

}
