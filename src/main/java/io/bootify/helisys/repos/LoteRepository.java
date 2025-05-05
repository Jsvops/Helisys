package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Lote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoteRepository extends JpaRepository<Lote, Integer> {

    // Se puede agregar métodos personalizados aquí si los necesitas
    // Por ejemplo:
    // List<Lote> findByLtFechaVencimientoBefore(LocalDate fecha);

}
