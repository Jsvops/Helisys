package io.bootify.helisys.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Producto {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proId;

    @Column(nullable = false, unique = true, length = 45)
    private String proNumeroParte;

    @Column(nullable = false, length = 45)
    private String proNombre;

    @Column(length = 45)
    private String proNumeroParteAlterno;

    @Column(nullable = false, length = 45)
    private String proNumeroSerie;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer proUnidades = 0;

    @Column(nullable = false, length = 25)
    private String proTipoDocumento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_tpo_id", nullable = false)
    private TipoProducto proTpo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_amc_id", nullable = false)
    private AlmacenContenedor proAmc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_pve_id", nullable = false)
    private Proveedor proPve;

    @OneToMany(mappedBy = "pptPro")
    private Set<PedidosProducto> pptProPedidosProductos;

    @OneToMany(mappedBy = "tcoPro")
    private Set<TransaccionesProducto> tcoProTransaccionesProductos;

    @OneToMany(mappedBy = "dpmaPro", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DetalleProductoModeloAeronave> dpmaProDetalleProductoModeloAeronaves = new HashSet<>();


}
