package io.bootify.helisys.model;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoteDTO {

    private Integer ltId;

    @NotNull
    private LocalDate ltFechaVencimiento;

}
