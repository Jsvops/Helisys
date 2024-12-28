package io.bootify.helisys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class PedidosCompra {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pcaId;

    @Column(nullable = false, length = 45)
    private String pcaDescripcion;

    @Column(nullable = false)
    private LocalDate pcaFechaPedido;

    @Column(nullable = false)
    private LocalDate pcaFechaEnvio;

    @Column(nullable = false)
    private LocalDate pcaFechaEntrega;

    @Column(nullable = false)
    private LocalDate pcaFechaPrometida;

    @Column(nullable = false, length = 45)
    private String pcaDireccionEnvio;

    @OneToMany(mappedBy = "pptPca")
    private Set<PedidosProducto> pptPcaPedidosProductos;

}
