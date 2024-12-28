package io.bootify.helisys.repos;

import io.bootify.helisys.domain.AlmacenEstante;
import io.bootify.helisys.domain.AlmacenRepisa;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AlmacenRepisaRepository extends JpaRepository<AlmacenRepisa, Integer> {

    AlmacenRepisa findFirstByAmrAmt(AlmacenEstante almacenEstante);

}
