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
public class DetalleProductoModeloAeronave {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dpmaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dpma_pro_id", nullable = false)
    private Producto dpmaPro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dpma_mre_id", nullable = false)
    private ModeloAeronave dpmaMre;

}
