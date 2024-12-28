package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TransaccionEventoDTO {

    private Integer tvoId;

    @NotNull
    @Size(max = 25)
    private String tvoEvento;

}
