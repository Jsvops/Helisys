package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    boolean existsByUsrCtIdentidad(Integer usrCtIdentidad);

    boolean existsByUsrCtMilitar(Integer usrCtMilitar);

    boolean existsByUsrLoginIgnoreCase(String usrLogin);

    boolean existsByUsrPasswordIgnoreCase(String usrPassword);

    Optional<Usuario> findByUsrNombre(String usrNombre);

}

