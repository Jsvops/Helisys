package io.bootify.helisys.repos;

import io.bootify.helisys.domain.DetalleProductoModeloAeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.domain.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DetalleProductoModeloAeronaveRepository extends JpaRepository<DetalleProductoModeloAeronave, Integer> {

    List<DetalleProductoModeloAeronave> findByDpmaPro(Producto producto);

    List<DetalleProductoModeloAeronave> findByDpmaMre(ModeloAeronave modeloAeronave);

    DetalleProductoModeloAeronave findFirstByDpmaMre(ModeloAeronave modeloAeronave);

    @Transactional
    void deleteByDpmaPro(Producto producto);
}
