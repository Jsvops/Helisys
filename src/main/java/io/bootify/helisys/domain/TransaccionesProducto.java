package io.bootify.helisys.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;


@Entity
@Getter
@Setter
public class TransaccionesProducto {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tcoId;

    @Column(nullable = false)
    private Integer tcoUnidades;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tco_pro_id", nullable = false)
    private Producto tcoPro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tco_tce_id", nullable = false)
    private Transaccion tcoTce;

    @OneToMany(mappedBy = "ltpdTco")
    private Set<LoteTransaccionProductoDetalle> ltpdTcos;

}
