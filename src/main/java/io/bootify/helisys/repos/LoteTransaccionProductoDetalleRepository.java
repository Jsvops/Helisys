package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Lote;
import io.bootify.helisys.domain.LoteTransaccionProductoDetalle;
import io.bootify.helisys.model.ProductExpiredResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LoteTransaccionProductoDetalleRepository extends JpaRepository<LoteTransaccionProductoDetalle, Integer> {

    long countByLtpdLt(Lote lote);

    @Query("SELECT l, SUM(d.ltpdUnidades) " +
        "FROM Lote l " +
        "JOIN LoteTransaccionProductoDetalle d ON d.ltpdLt = l " +
        "JOIN TransaccionesProducto tp ON d.ltpdTco = tp " +
        "WHERE tp.tcoPro.proId = :productoId " +
        "GROUP BY l " +
        "HAVING SUM(d.ltpdUnidades) > 0 " +
        "ORDER BY l.ltFechaVencimiento ASC")
    List<Object[]> findLotesDisponiblesByProductoOrderByFecha(@Param("productoId") Integer productoId);

    @Query("""
    SELECT new io.bootify.helisys.model.ProductExpiredResponseDTO(
        p.proNumeroParte,
        p.proNombre,
        l.ltFechaVencimiento,
        SUM(cast(ltpd.ltpdUnidades as long)),
        0
    )
    FROM TransaccionesProducto tp
    JOIN tp.tcoPro p
    JOIN tp.ltpdTcos ltpd
    JOIN ltpd.ltpdLt l
    WHERE l.ltFechaVencimiento <= :maxDate
    GROUP BY p.proNumeroParte, p.proNombre, l.ltFechaVencimiento
    HAVING SUM(cast(ltpd.ltpdUnidades as long)) > 0
    ORDER BY l.ltFechaVencimiento ASC, p.proNombre ASC
    """)
    List<ProductExpiredResponseDTO> findExpiringProducts(@Param("maxDate") LocalDate maxDate);

}

