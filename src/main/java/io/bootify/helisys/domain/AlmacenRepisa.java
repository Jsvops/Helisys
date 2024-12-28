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
public class AlmacenRepisa {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer amrId;

    @Column(nullable = false, length = 25)
    private String amrNombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amr_amt_id", nullable = false)
    private AlmacenEstante amrAmt;

    @OneToMany(mappedBy = "amcAmr")
    private Set<AlmacenContenedor> amcAmrAlmacenContenedores;

}
