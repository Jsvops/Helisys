package io.bootify.helisys.repos;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Proveedor;
import io.bootify.helisys.domain.TipoProducto;
import io.bootify.helisys.model.ProductViewDTO;
import io.bootify.helisys.model.ProductoExpiradoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    Producto findFirstByProTpo(TipoProducto tipoProducto);

    Producto findFirstByProAmc(AlmacenContenedor almacenContenedor);

    Producto findFirstByProPve(Proveedor proveedor);

    @Query("SELECT new io.bootify.helisys.model.ProductViewDTO( " +
        "p.proId, " +
        "p.proNumeroParte, " +
        "p.proNombre, " +
        "p.proNumeroParteAlterno, " +
        "p.proNumeroSerie, " +
        "p.proUnidades, " +
        "p.proFechaVencimiento, " +
        "p.proTipoDocumento, " +
        "tpo.tpoNombreTipo, " +
        "CONCAT(amt.amtDescripcion, amr.amrNombre, amc.amcNumero), " +
        "mre.mreNombre, " +
        "pve.pveNombre) " +
        "FROM Producto p " +
        "JOIN p.proTpo tpo " +
        "JOIN p.proAmc amc " +
        "JOIN amc.amcAmr amr " +
        "JOIN amr.amrAmt amt " +
        "JOIN p.dpmaProDetalleProductoModeloAeronaves dpma " + // Nueva relación
        "JOIN dpma.dpmaMre mre " + // Relación con ModeloAeronave a través de DetalleProductoModeloAeronave
        "JOIN p.proPve pve " +
        "WHERE p.proNumeroParte = :partNumber " +
        "   OR p.proNombre LIKE %:name% " +
        "   OR p.proNumeroParteAlterno = :alterPartNumber")
    List<ProductViewDTO> findProducts(@Param("partNumber") String partNumber,
                                      @Param("name") String name,
                                      @Param("alterPartNumber") String alterPartNumber);

    // Método para buscar por código alfanumérico
    Optional<Producto> findByProNumeroParte(String proNumeroParte);


    @Query("SELECT new io.bootify.helisys.model.ProductoExpiradoDTO(" +
        "p.proId, p.proNumeroParte, p.proNombre, p.proUnidades, " +
        "p.proFechaVencimiento, p.proTipoDocumento, :fechaActual) " +
        "FROM Producto p " +
        "WHERE p.proFechaVencimiento IS NOT NULL " +
        "AND (p.proFechaVencimiento < :fechaActual OR p.proFechaVencimiento BETWEEN :fechaActual AND :fechaFin) " +
        "ORDER BY p.proFechaVencimiento ASC")
    List<ProductoExpiradoDTO> findProductosVencidosYPorVencer(
        @Param("fechaActual") LocalDate fechaActual,
        @Param("fechaFin") LocalDate fechaFin);


}
