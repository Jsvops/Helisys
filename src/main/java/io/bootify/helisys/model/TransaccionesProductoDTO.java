package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransaccionesProductoDTO {

    private Integer tcoId;

    @NotNull
    private Integer tcoUnidades;

    @NotNull
    private String tcoPro; // Cambiado de Integer a String para aceptar números y letras

    @NotNull
    private Integer tcoTce;

    public void setTcoPro(String tcoPro) {
        try {
            Integer.parseInt(tcoPro); // Intentar convertirlo a número
        } catch (NumberFormatException e) {
            // Si falla, significa que es alfanumérico, lo dejamos como está
        }
        this.tcoPro = tcoPro;
    }

    public String getTcoPro() {
        return this.tcoPro;
    }
}
