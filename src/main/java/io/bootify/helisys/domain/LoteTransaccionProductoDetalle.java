package io.bootify.helisys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class LoteTransaccionProductoDetalle {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ltpdId;

    @Column(nullable = false)
    private Integer ltpdUnidades;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ltpd_lt_id", nullable = false)
    private Lote ltpdLt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ltpd_tco_id", nullable = false)
    private TransaccionesProducto ltpdTco;

}
