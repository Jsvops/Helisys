package io.bootify.helisys.model;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductExpiredResponseDTO {

    private String numeroParte;
    private String nombre;
    private LocalDate fechaVencimiento;
    private Long saldoTotalFecha;
    private Integer diasParaVencer;
}
