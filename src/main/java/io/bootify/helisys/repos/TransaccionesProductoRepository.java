package io.bootify.helisys.repos;

import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.TransaccionesProducto;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TransaccionesProductoRepository extends JpaRepository<TransaccionesProducto, Integer> {

    TransaccionesProducto findFirstByTcoPro(Producto producto);

    TransaccionesProducto findFirstByTcoTce(Transaccion transaccion);

}
