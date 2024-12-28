package io.bootify.helisys.service;

import io.bootify.helisys.domain.PedidosCompra;
import io.bootify.helisys.domain.PedidosProducto;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.model.PedidosProductoDTO;
import io.bootify.helisys.repos.PedidosCompraRepository;
import io.bootify.helisys.repos.PedidosProductoRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PedidosProductoService {

    private final PedidosProductoRepository pedidosProductoRepository;
    private final ProductoRepository productoRepository;
    private final PedidosCompraRepository pedidosCompraRepository;

    public PedidosProductoService(final PedidosProductoRepository pedidosProductoRepository,
            final ProductoRepository productoRepository,
            final PedidosCompraRepository pedidosCompraRepository) {
        this.pedidosProductoRepository = pedidosProductoRepository;
        this.productoRepository = productoRepository;
        this.pedidosCompraRepository = pedidosCompraRepository;
    }

    public List<PedidosProductoDTO> findAll() {
        final List<PedidosProducto> pedidosProductos = pedidosProductoRepository.findAll(Sort.by("pptId"));
        return pedidosProductos.stream()
                .map(pedidosProducto -> mapToDTO(pedidosProducto, new PedidosProductoDTO()))
                .toList();
    }

    public PedidosProductoDTO get(final Integer pptId) {
        return pedidosProductoRepository.findById(pptId)
                .map(pedidosProducto -> mapToDTO(pedidosProducto, new PedidosProductoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final PedidosProductoDTO pedidosProductoDTO) {
        final PedidosProducto pedidosProducto = new PedidosProducto();
        mapToEntity(pedidosProductoDTO, pedidosProducto);
        return pedidosProductoRepository.save(pedidosProducto).getPptId();
    }

    public void update(final Integer pptId, final PedidosProductoDTO pedidosProductoDTO) {
        final PedidosProducto pedidosProducto = pedidosProductoRepository.findById(pptId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(pedidosProductoDTO, pedidosProducto);
        pedidosProductoRepository.save(pedidosProducto);
    }

    public void delete(final Integer pptId) {
        pedidosProductoRepository.deleteById(pptId);
    }

    private PedidosProductoDTO mapToDTO(final PedidosProducto pedidosProducto,
            final PedidosProductoDTO pedidosProductoDTO) {
        pedidosProductoDTO.setPptId(pedidosProducto.getPptId());
        pedidosProductoDTO.setPptCantidad(pedidosProducto.getPptCantidad());
        pedidosProductoDTO.setPptPrecioUnitario(pedidosProducto.getPptPrecioUnitario());
        pedidosProductoDTO.setPptPro(pedidosProducto.getPptPro() == null ? null : pedidosProducto.getPptPro().getProId());
        pedidosProductoDTO.setPptPca(pedidosProducto.getPptPca() == null ? null : pedidosProducto.getPptPca().getPcaId());
        return pedidosProductoDTO;
    }

    private PedidosProducto mapToEntity(final PedidosProductoDTO pedidosProductoDTO,
            final PedidosProducto pedidosProducto) {
        pedidosProducto.setPptCantidad(pedidosProductoDTO.getPptCantidad());
        pedidosProducto.setPptPrecioUnitario(pedidosProductoDTO.getPptPrecioUnitario());
        final Producto pptPro = pedidosProductoDTO.getPptPro() == null ? null : productoRepository.findById(pedidosProductoDTO.getPptPro())
                .orElseThrow(() -> new NotFoundException("pptPro not found"));
        pedidosProducto.setPptPro(pptPro);
        final PedidosCompra pptPca = pedidosProductoDTO.getPptPca() == null ? null : pedidosCompraRepository.findById(pedidosProductoDTO.getPptPca())
                .orElseThrow(() -> new NotFoundException("pptPca not found"));
        pedidosProducto.setPptPca(pptPca);
        return pedidosProducto;
    }

}
