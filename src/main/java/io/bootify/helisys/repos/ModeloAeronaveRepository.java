package io.bootify.helisys.repos;

import io.bootify.helisys.domain.ModeloAeronave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface ModeloAeronaveRepository extends JpaRepository<ModeloAeronave, Integer> {

    @Query("SELECT m.mreNombre FROM ModeloAeronave m WHERE m.id = :id")
    String findNombreById(@Param("id") Integer id);



}
