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
import java.util.Set;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class AlmacenContenedor {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer amcId;

    @Column(nullable = false, length = 45)
    private String amcNumero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_amr_id", nullable = false)
    private AlmacenRepisa amcAmr;

    @OneToMany(mappedBy = "proAmc")
    private Set<Producto> proAmcProductos;

}
