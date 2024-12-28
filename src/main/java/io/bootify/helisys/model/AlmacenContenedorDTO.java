package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AlmacenContenedorDTO {

    private Integer amcId;

    @NotNull
    @Size(max = 45)
    private String amcNumero;

    @NotNull
    private Integer amcAmr;

}
