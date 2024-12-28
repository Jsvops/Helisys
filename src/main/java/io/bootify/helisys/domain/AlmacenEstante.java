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
public class AlmacenEstante {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer amtId;

    @Column(nullable = false, length = 25)
    private String amtDescripcion;

    @OneToMany(mappedBy = "amrAmt")
    private Set<AlmacenRepisa> amrAmtAlmacenRepisas;

}
