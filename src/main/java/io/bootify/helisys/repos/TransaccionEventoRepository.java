package io.bootify.helisys.repos;

import io.bootify.helisys.domain.TransaccionEvento;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TransaccionEventoRepository extends JpaRepository<TransaccionEvento, Integer> {
}
