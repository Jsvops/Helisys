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
public class Unidad {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer undId;

    @Column(nullable = false, length = 45)
    private String undNombre;

    @Column(nullable = false, length = 45)
    private String undTelefono;

    @Column(nullable = false, length = 45)
    private String undFax;

    @Column(nullable = false, length = 45)
    private String undComandanteNombre;

    @Column(nullable = false, length = 200)
    private String undDireccion;

    @Column(nullable = false, length = 45)
    private String undDepartamento;

    @Column(nullable = false, length = 45)
    private String undProvincia;

    @Column(nullable = false, length = 45)
    private String undCiudad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "und_bga_id", nullable = false)
    private Brigada undBga;

    @OneToMany(mappedBy = "ednUnd")
    private Set<Escuadron> ednUndEscuadrons;

}
