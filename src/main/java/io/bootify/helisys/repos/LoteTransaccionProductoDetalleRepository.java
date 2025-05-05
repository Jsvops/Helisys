package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Lote;
import io.bootify.helisys.domain.LoteTransaccionProductoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
