package io.bootify.helisys.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // Genera: public AlmacenCombinadoDTO() {}
@AllArgsConstructor // Genera: public AlmacenCombinadoDTO(Integer amcId, String descripcionCombinada) { ... }
public class AlmacenCombinadoDTO {
    private Integer amcId;
    private String descripcionCombinada;
}
