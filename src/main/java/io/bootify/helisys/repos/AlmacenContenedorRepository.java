package io.bootify.helisys.repos;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.AlmacenRepisa;
import io.bootify.helisys.model.AlmacenJerarquicoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlmacenContenedorRepository extends JpaRepository<AlmacenContenedor, Integer> {

    AlmacenContenedor findFirstByAmcAmr(AlmacenRepisa almacenRepisa);

    @Query("""
        SELECT new io.bootify.helisys.model.AlmacenJerarquicoDTO(
            c.amcId,
            CONCAT(e.amtDescripcion, r.amrNombre, c.amcNumero)
        )
        FROM AlmacenContenedor c
        JOIN c.amcAmr r
        JOIN r.amrAmt e
        WHERE c.amcId = :amcId
    """)
    java.util.Optional<AlmacenJerarquicoDTO> findJerarquicoById(@org.springframework.data.repository.query.Param("amcId") Integer amcId);

    @Query("""
    SELECT new io.bootify.helisys.model.AlmacenJerarquicoDTO(
        c.amcId,
        CONCAT(e.amtDescripcion, r.amrNombre, c.amcNumero)
    )
    FROM AlmacenContenedor c
    JOIN c.amcAmr r
    JOIN r.amrAmt e
    WHERE LOWER(CONCAT(e.amtDescripcion, r.amrNombre, c.amcNumero))
          LIKE LOWER(CONCAT('%', :q, '%'))
    ORDER BY e.amtDescripcion, r.amrNombre, c.amcNumero
""")
    List<AlmacenJerarquicoDTO> suggest(@org.springframework.data.repository.query.Param("q") String q);

}
