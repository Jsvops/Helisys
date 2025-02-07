package io.bootify.helisys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Transaccion {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tceId;

    @Column(nullable = false)
    private LocalDate tceFechaTransaccion;

    //cambio de false a true porque el campo tceObservaciones es opcional
    @Column(nullable = true, length = 500)
    private String tceObservaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tce_tvo_id", nullable = false)
    private TransaccionEvento tceTvo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tce_usr_id", nullable = false)
    private Usuario tceUsr;

    @OneToMany(mappedBy = "tcoTce")
    private Set<TransaccionesProducto> tcoTceTransaccionesProductos;

}
