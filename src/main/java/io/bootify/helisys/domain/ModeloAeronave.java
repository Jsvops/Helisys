package io.bootify.helisys.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ModeloAeronave {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mreId;

    @Column(nullable = false, length = 45)
    private String mreNombre;

    @OneToMany(mappedBy = "anvMre")
    private Set<Aeronave> anvMreAeronaves;

    @OneToMany(mappedBy = "dpmaMre")
    private Set<DetalleProductoModeloAeronave> dpmaMreDetalleProductoModeloAeronaves;

}
