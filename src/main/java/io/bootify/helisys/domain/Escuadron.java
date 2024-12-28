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
public class Escuadron {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ednId;

    @Column(nullable = false, length = 45)
    private String ednNombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "edn_und_id", nullable = false)
    private Unidad ednUnd;

    @OneToMany(mappedBy = "usrEdn")
    private Set<Usuario> usrEdnUsuarios;

}
