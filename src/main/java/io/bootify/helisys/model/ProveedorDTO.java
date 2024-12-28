package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProveedorDTO {

    private Integer pveId;

    @NotNull
    @Size(max = 45)
    private String pveNombre;

    @NotNull
    @Size(max = 45)
    private String pveTelefono;

    @NotNull
    @Size(max = 45)
    private String pveFax;

    @NotNull
    @Size(max = 45)
    private String pveEmail;

    @NotNull
    @Size(max = 60)
    private String pveDireccion;

    @NotNull
    @Size(max = 45)
    private String pveCiudad;

    @NotNull
    @Size(max = 45)
    private String pvePais;

}
