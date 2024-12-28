package io.bootify.helisys.service;

import io.bootify.helisys.domain.PedidosCompra;
import io.bootify.helisys.domain.PedidosProducto;
import io.bootify.helisys.model.PedidosCompraDTO;
import io.bootify.helisys.repos.PedidosCompraRepository;
import io.bootify.helisys.repos.PedidosProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PedidosCompraService {

    private final PedidosCompraRepository pedidosCompraRepository;
    private final PedidosProductoRepository pedidosProductoRepository;

    public PedidosCompraService(final PedidosCompraRepository pedidosCompraRepository,
            final PedidosProductoRepository pedidosProductoRepository) {
        this.pedidosCompraRepository = pedidosCompraRepository;
        this.pedidosProductoRepository = pedidosProductoRepository;
    }

    public List<PedidosCompraDTO> findAll() {
        final List<PedidosCompra> pedidosCompras = pedidosCompraRepository.findAll(Sort.by("pcaId"));
        return pedidosCompras.stream()
                .map(pedidosCompra -> mapToDTO(pedidosCompra, new PedidosCompraDTO()))
                .toList();
    }

    public PedidosCompraDTO get(final Integer pcaId) {
        return pedidosCompraRepository.findById(pcaId)
                .map(pedidosCompra -> mapToDTO(pedidosCompra, new PedidosCompraDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final PedidosCompraDTO pedidosCompraDTO) {
        final PedidosCompra pedidosCompra = new PedidosCompra();
        mapToEntity(pedidosCompraDTO, pedidosCompra);
        return pedidosCompraRepository.save(pedidosCompra).getPcaId();
    }

    public void update(final Integer pcaId, final PedidosCompraDTO pedidosCompraDTO) {
        final PedidosCompra pedidosCompra = pedidosCompraRepository.findById(pcaId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(pedidosCompraDTO, pedidosCompra);
        pedidosCompraRepository.save(pedidosCompra);
    }

    public void delete(final Integer pcaId) {
        pedidosCompraRepository.deleteById(pcaId);
    }

    private PedidosCompraDTO mapToDTO(final PedidosCompra pedidosCompra,
            final PedidosCompraDTO pedidosCompraDTO) {
        pedidosCompraDTO.setPcaId(pedidosCompra.getPcaId());
        pedidosCompraDTO.setPcaDescripcion(pedidosCompra.getPcaDescripcion());
        pedidosCompraDTO.setPcaFechaPedido(pedidosCompra.getPcaFechaPedido());
        pedidosCompraDTO.setPcaFechaEnvio(pedidosCompra.getPcaFechaEnvio());
        pedidosCompraDTO.setPcaFechaEntrega(pedidosCompra.getPcaFechaEntrega());
        pedidosCompraDTO.setPcaFechaPrometida(pedidosCompra.getPcaFechaPrometida());
        pedidosCompraDTO.setPcaDireccionEnvio(pedidosCompra.getPcaDireccionEnvio());
        return pedidosCompraDTO;
    }

    private PedidosCompra mapToEntity(final PedidosCompraDTO pedidosCompraDTO,
            final PedidosCompra pedidosCompra) {
        pedidosCompra.setPcaDescripcion(pedidosCompraDTO.getPcaDescripcion());
        pedidosCompra.setPcaFechaPedido(pedidosCompraDTO.getPcaFechaPedido());
        pedidosCompra.setPcaFechaEnvio(pedidosCompraDTO.getPcaFechaEnvio());
        pedidosCompra.setPcaFechaEntrega(pedidosCompraDTO.getPcaFechaEntrega());
        pedidosCompra.setPcaFechaPrometida(pedidosCompraDTO.getPcaFechaPrometida());
        pedidosCompra.setPcaDireccionEnvio(pedidosCompraDTO.getPcaDireccionEnvio());
        return pedidosCompra;
    }

    public ReferencedWarning getReferencedWarning(final Integer pcaId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final PedidosCompra pedidosCompra = pedidosCompraRepository.findById(pcaId)
                .orElseThrow(NotFoundException::new);
        final PedidosProducto pptPcaPedidosProducto = pedidosProductoRepository.findFirstByPptPca(pedidosCompra);
        if (pptPcaPedidosProducto != null) {
            referencedWarning.setKey("pedidosCompra.pedidosProducto.pptPca.referenced");
            referencedWarning.addParam(pptPcaPedidosProducto.getPptId());
            return referencedWarning;
        }
        return null;
    }

}
