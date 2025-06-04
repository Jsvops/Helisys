package io.bootify.helisys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.Set;

import lombok.*;

@Entity
@Getter
@Setter

public class Lote {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ltId;

    @Column(nullable = false)
    private LocalDate ltFechaVencimiento;

    @OneToMany(mappedBy = "ltpdLt")
    private Set<LoteTransaccionProductoDetalle> ltpdLts;

}
