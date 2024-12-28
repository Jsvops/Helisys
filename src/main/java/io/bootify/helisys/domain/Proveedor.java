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
public class Proveedor {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pveId;

    @Column(nullable = false, length = 45)
    private String pveNombre;

    @Column(nullable = false, length = 45)
    private String pveTelefono;

    @Column(nullable = false, length = 45)
    private String pveFax;

    @Column(nullable = false, length = 45)
    private String pveEmail;

    @Column(nullable = false, length = 60)
    private String pveDireccion;

    @Column(nullable = false, length = 45)
    private String pveCiudad;

    @Column(nullable = false, length = 45)
    private String pvePais;

    @OneToMany(mappedBy = "cpePve")
    private Set<ContactoProveedor> cpePveContactoProveedores;

    @OneToMany(mappedBy = "proPve")
    private Set<Producto> proPveProductos;

}
