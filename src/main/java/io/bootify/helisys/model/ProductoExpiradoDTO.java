package io.bootify.helisys.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Getter
@Setter
@AllArgsConstructor
public class ProductoExpiradoDTO {
    private Integer proId;
    private String proNumeroParte;
    private String proNombre;
    private Integer proUnidades;
    private LocalDate proFechaVencimiento;
    private String proTipoDocumento;
    private Long daysUntilExpiry; // Negativo para vencidos

    public ProductoExpiradoDTO(Integer proId, String proNumeroParte, String proNombre,
                               Integer proUnidades, LocalDate proFechaVencimiento,
                               String proTipoDocumento, LocalDate fechaActual) {
        this.proId = proId;
        this.proNumeroParte = proNumeroParte;
        this.proNombre = proNombre;
        this.proUnidades = proUnidades;
        this.proFechaVencimiento = proFechaVencimiento;
        this.proTipoDocumento = proTipoDocumento;
        this.daysUntilExpiry = fechaActual != null ?
            ChronoUnit.DAYS.between(fechaActual, proFechaVencimiento) : // Positivo=futuro, Negativo=vencido
            null;
    }
}
