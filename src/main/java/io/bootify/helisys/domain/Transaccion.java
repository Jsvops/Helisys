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

import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaccion {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tceId;

    @Column(nullable = false)
    private LocalDate tceFechaTransaccion;


    @Column(nullable = true, length = 500)
    private String tceObservaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tce_tvo_id", nullable = false)
    private TransaccionEvento tceTvo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tce_usr_id", nullable = false)
    private Usuario tceUsr;

    // Relación discontinua con Aeronave (opcional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tce_anv_id", nullable = true) // Permitir valores nulos
    private Aeronave tceAnv;

    @OneToMany(mappedBy = "tcoTce")
    private Set<TransaccionesProducto> tcoTceTransaccionesProductos;

}
