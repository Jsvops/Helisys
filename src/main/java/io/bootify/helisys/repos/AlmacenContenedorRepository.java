package io.bootify.helisys.repos;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.AlmacenRepisa;
import io.bootify.helisys.model.AlmacenCombinadoDTO; // Asegúrate de que esta importación sea correcta
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlmacenContenedorRepository extends JpaRepository<AlmacenContenedor, Integer> {

    AlmacenContenedor findFirstByAmcAmr(AlmacenRepisa almacenRepisa);

    @Query("SELECT new io.bootify.helisys.model.AlmacenCombinadoDTO(c.amcId, CONCAT(e.amtDescripcion, r.amrNombre, c.amcNumero)) " +
        "FROM AlmacenContenedor c " +
        "JOIN c.amcAmr r " +
        "JOIN r.amrAmt e")
    List<AlmacenCombinadoDTO> findAllAlmacenCombinado();
}
