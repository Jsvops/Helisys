package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Aeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import io.bootify.helisys.model.AeronaveResponseDTO;


import java.util.List;

public interface AeronaveRepository extends JpaRepository<Aeronave, Integer> {

    Aeronave findFirstByAnvMre(ModeloAeronave modeloAeronave);

    boolean existsByAnvMatriculaIgnoreCase(String anvMatricula);

    @Query("SELECT a FROM Aeronave a " +
        "JOIN a.anvMre m " +
        "JOIN m.dpmaMreDetalleProductoModeloAeronaves dpma " +
        "WHERE dpma.dpmaPro.proId = :productoId")
    List<Aeronave> findAeronavesByProductoId(@Param("productoId") Integer productoId);

    @Query("SELECT new io.bootify.helisys.model.AeronaveResponseDTO(" +
        "a.anvId, a.anvMatricula, a.anvNumeroSerie, a.anvFabricacion, m.mreNombre) " +
        "FROM Aeronave a " +
        "JOIN a.anvMre m")
    List<AeronaveResponseDTO> findAllForList();
}
