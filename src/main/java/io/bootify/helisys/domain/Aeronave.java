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
public class Aeronave {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer anvId;

    @Column(nullable = false, unique = true, length = 45)
    private String anvMatricula;

    @Column(nullable = false, length = 45)
    private String anvNumeroSerie;

    @Column(nullable = false, length = 25)
    private String anvFabricacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anv_mre_id", nullable = false)
    private ModeloAeronave anvMre;

}

