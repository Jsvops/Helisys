package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Aeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AeronaveRepository extends JpaRepository<Aeronave, Integer> {

    // Método existente
    Aeronave findFirstByAnvMre(ModeloAeronave modeloAeronave);

    // Método existente
    boolean existsByAnvMatriculaIgnoreCase(String anvMatricula);

    // Nueva consulta corregida
    @Query("SELECT a FROM Aeronave a " +
        "JOIN a.anvMre m " + // Unimos Aeronave con ModeloAeronave
        "JOIN m.dpmaMreDetalleProductoModeloAeronaves dpma " + // Unimos ModeloAeronave con DetalleProductoModeloAeronave
        "WHERE dpma.dpmaPro.proId = :productoId") // Filtramos por el ID del producto
    List<Aeronave> findAeronavesByProductoId(@Param("productoId") Integer productoId);
}
