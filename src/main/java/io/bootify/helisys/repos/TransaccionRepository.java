package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.TransaccionEvento;
import io.bootify.helisys.domain.Usuario;
import io.bootify.helisys.model.TransactionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {

    Transaccion findFirstByTceTvo(TransaccionEvento transaccionEvento);

    Transaccion findFirstByTceUsr(Usuario usuario);

    Optional<Transaccion> findTopByOrderByTceIdDesc();

    @Query("SELECT new map(" +
        "t.tceId as tceId, " +
        "p.proNumeroParte as tcoProNombre, " +
        "te.tvoEvento as tceTvoEvento, " +
        "tp.tcoUnidades as tcoUnidades, " +
        "u.usrNombre as tceUsrNombre, " +
        "t.tceFechaTransaccion as tceFechaTransaccion, " +
        "t.tceObservaciones as tceObservaciones, " +
        "a.anvMatricula as tceAnvMatricula) " +
        "FROM Transaccion t " +
        "LEFT JOIN t.tcoTceTransaccionesProductos tp " +
        "LEFT JOIN tp.tcoPro p " +
        "LEFT JOIN t.tceUsr u " +
        "LEFT JOIN t.tceAnv a " +
        "LEFT JOIN t.tceTvo te " +
        "WHERE t.tceFechaTransaccion BETWEEN :fechaInicio AND :fechaFin " +
        "ORDER BY t.tceFechaTransaccion ASC")
    List<Map<String, Object>> findTransaccionesCombinadasByFecha(
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin);

    @Query("""
    SELECT new io.bootify.helisys.model.TransactionResponseDTO(
        t.tceId,
        t.tceFechaTransaccion,
        t.tceObservaciones,
        te.tvoEvento,
        u.usrNombre,
        CASE WHEN a IS NULL THEN '' ELSE a.anvMatricula END,
        p.proNumeroParte,
        tp.tcoUnidades
    )
    FROM Transaccion t
    JOIN t.tceTvo te
    JOIN t.tceUsr u
    LEFT JOIN t.tceAnv a
    JOIN t.tcoTceTransaccionesProductos tp
    JOIN tp.tcoPro p
    WHERE (:fechaInicio IS NULL OR t.tceFechaTransaccion >= :fechaInicio)
      AND (:fechaFin IS NULL OR t.tceFechaTransaccion <= :fechaFin)
    ORDER BY t.tceId DESC
""")
    Page<TransactionResponseDTO> findAllTransactionResponses(
        Pageable pageable,
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin
    );

}


