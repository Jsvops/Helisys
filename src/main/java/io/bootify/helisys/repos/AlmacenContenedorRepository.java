package io.bootify.helisys.repos;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.AlmacenRepisa;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AlmacenContenedorRepository extends JpaRepository<AlmacenContenedor, Integer> {

    AlmacenContenedor findFirstByAmcAmr(AlmacenRepisa almacenRepisa);

}
