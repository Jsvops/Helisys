package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.TransaccionEvento;
import io.bootify.helisys.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {

    Transaccion findFirstByTceTvo(TransaccionEvento transaccionEvento);

    Transaccion findFirstByTceUsr(Usuario usuario);

    Optional<Transaccion> findTopByOrderByTceIdDesc();  // Asegúrate de que este método retorne Optional
}

