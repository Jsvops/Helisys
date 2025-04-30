package io.bootify.helisys.repos;

import io.bootify.helisys.domain.DetalleProductoModeloAeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.domain.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DetalleProductoModeloAeronaveRepository extends JpaRepository<DetalleProductoModeloAeronave, Integer> {

    // Método para buscar detalles por producto
    List<DetalleProductoModeloAeronave> findByDpmaPro(Producto producto);

    // Método para buscar detalles por modelo de aeronave
    List<DetalleProductoModeloAeronave> findByDpmaMre(ModeloAeronave modeloAeronave);

    // Método para buscar el primer detalle asociado a un ModeloAeronave
    DetalleProductoModeloAeronave findFirstByDpmaMre(ModeloAeronave modeloAeronave);

    // Método para eliminar detalles por producto
    @Transactional
    void deleteByDpmaPro(Producto producto);
}
