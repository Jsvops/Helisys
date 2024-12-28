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
import java.time.LocalDate;
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

    @Column(nullable = false, length = 45)
    private String proNumeroParte;

    @Column(nullable = false, length = 45)
    private String proNombre;

    @Column(length = 45)
    private String proNumeroParteAlterno;

    @Column(nullable = false, length = 45)
    private String proNumeroSerie;

    @Column(nullable = false)
    private Integer proUnidades;

    @Column
    private LocalDate proFechaVencimiento;

    @Column(nullable = false, length = 25)
    private String proTipoDocumento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_tpo_id", nullable = false)
    private TipoProducto proTpo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_amc_id", nullable = false)
    private AlmacenContenedor proAmc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_mre_id", nullable = false)
    private ModeloAeronave proMre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pro_pve_id", nullable = false)
    private Proveedor proPve;

    @OneToMany(mappedBy = "pptPro")
    private Set<PedidosProducto> pptProPedidosProductos;

    @OneToMany(mappedBy = "tcoPro")
    private Set<TransaccionesProducto> tcoProTransaccionesProductos;

}
