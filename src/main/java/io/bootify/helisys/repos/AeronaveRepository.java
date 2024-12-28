package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Aeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AeronaveRepository extends JpaRepository<Aeronave, Integer> {

    Aeronave findFirstByAnvMre(ModeloAeronave modeloAeronave);

    boolean existsByAnvMatriculaIgnoreCase(String anvMatricula);

}
