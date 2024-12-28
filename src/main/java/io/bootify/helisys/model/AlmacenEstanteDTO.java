package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AlmacenEstanteDTO {

    private Integer amtId;

    @NotNull
    @Size(max = 25)
    private String amtDescripcion;

}
