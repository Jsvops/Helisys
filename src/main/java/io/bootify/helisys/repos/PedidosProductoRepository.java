package io.bootify.helisys.repos;

import io.bootify.helisys.domain.PedidosCompra;
import io.bootify.helisys.domain.PedidosProducto;
import io.bootify.helisys.domain.Producto;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PedidosProductoRepository extends JpaRepository<PedidosProducto, Integer> {

    PedidosProducto findFirstByPptPro(Producto producto);

    PedidosProducto findFirstByPptPca(PedidosCompra pedidosCompra);

}
