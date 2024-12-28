package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UsuarioDTO {

    private Integer usrId;

    @NotNull
    @UsuarioUsrCtIdentidadUnique
    private Integer usrCtIdentidad;

    @NotNull
    @UsuarioUsrCtMilitarUnique
    private Integer usrCtMilitar;

    @NotNull
    @Size(max = 45)
    private String usrNombre;

    @NotNull
    @Size(max = 45)
    private String usrApellido;

    @NotNull
    @Size(max = 225)
    private String usrDireccion;

    @NotNull
    @Size(max = 45)
    private String usrTelefono;

    @NotNull
    @Size(max = 45)
    private String usrCargo;

    @NotNull
    @Size(max = 225)
    private String usrFoto;

    @NotNull
    @Size(max = 45)
    @UsuarioUsrLoginUnique
    private String usrLogin;

    @NotNull
    @Size(max = 45)
    @UsuarioUsrPasswordUnique
    private String usrPassword;

    @NotNull
    private Integer usrEdn;

    @NotNull
    private Integer usrGdo;

}
