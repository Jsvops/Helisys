package io.bootify.helisys.service;

import io.bootify.helisys.domain.Lote;
import io.bootify.helisys.domain.LoteTransaccionProductoDetalle;
import io.bootify.helisys.domain.TransaccionesProducto;
import io.bootify.helisys.model.LoteTransaccionProductoDetalleDTO;
import io.bootify.helisys.repos.LoteRepository;
import io.bootify.helisys.repos.LoteTransaccionProductoDetalleRepository;
import io.bootify.helisys.repos.TransaccionesProductoRepository;
import io.bootify.helisys.util.InsufficientStockException;
import io.bootify.helisys.util.NotFoundException;
import java.util.List;
import java.util.stream.Collectors;

import io.bootify.helisys.util.ReferencedWarning;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoteTransaccionProductoDetalleService {

    private final LoteTransaccionProductoDetalleRepository loteTransaccionProductoDetalleRepository;
    private final LoteRepository loteRepository;
    private final TransaccionesProductoRepository transaccionesProductoRepository;

    public LoteTransaccionProductoDetalleService(
            final LoteTransaccionProductoDetalleRepository loteTransaccionProductoDetalleRepository,
            final LoteRepository loteRepository,
            final TransaccionesProductoRepository transaccionesProductoRepository) {
        this.loteTransaccionProductoDetalleRepository = loteTransaccionProductoDetalleRepository;
        this.loteRepository = loteRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
    }

    public List<LoteTransaccionProductoDetalleDTO> findAll() {
        final List<LoteTransaccionProductoDetalle> loteTransaccionProductoDetalles = loteTransaccionProductoDetalleRepository.findAll(Sort.by("ltpdId"));
        return loteTransaccionProductoDetalles.stream()
                .map(loteTransaccionProductoDetalle -> mapToDTO(loteTransaccionProductoDetalle, new LoteTransaccionProductoDetalleDTO()))
                .toList();
    }

    public LoteTransaccionProductoDetalleDTO get(final Integer ltpdId) {
        return loteTransaccionProductoDetalleRepository.findById(ltpdId)
                .map(loteTransaccionProductoDetalle -> mapToDTO(loteTransaccionProductoDetalle, new LoteTransaccionProductoDetalleDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final LoteTransaccionProductoDetalleDTO loteTransaccionProductoDetalleDTO) {
        final LoteTransaccionProductoDetalle loteTransaccionProductoDetalle = new LoteTransaccionProductoDetalle();
        mapToEntity(loteTransaccionProductoDetalleDTO, loteTransaccionProductoDetalle);
        return loteTransaccionProductoDetalleRepository.save(loteTransaccionProductoDetalle).getLtpdId();
    }

    public void update(final Integer ltpdId, final LoteTransaccionProductoDetalleDTO loteTransaccionProductoDetalleDTO) {
        final LoteTransaccionProductoDetalle loteTransaccionProductoDetalle = loteTransaccionProductoDetalleRepository.findById(ltpdId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(loteTransaccionProductoDetalleDTO, loteTransaccionProductoDetalle);
        loteTransaccionProductoDetalleRepository.save(loteTransaccionProductoDetalle);
    }

    public void delete(final Integer ltpdId) {
        loteTransaccionProductoDetalleRepository.deleteById(ltpdId);
    }

    public ReferencedWarning getReferencedWarning(final Integer ltpdId) {
        return null;
    }

    private LoteTransaccionProductoDetalleDTO mapToDTO(
            final LoteTransaccionProductoDetalle loteTransaccionProductoDetalle,
            final LoteTransaccionProductoDetalleDTO loteTransaccionProductoDetalleDTO) {
        loteTransaccionProductoDetalleDTO.setLtpdId(loteTransaccionProductoDetalle.getLtpdId());
        loteTransaccionProductoDetalleDTO.setLtpdUnidades(loteTransaccionProductoDetalle.getLtpdUnidades());
        loteTransaccionProductoDetalleDTO.setLtpdLt(loteTransaccionProductoDetalle.getLtpdLt() == null ? null : loteTransaccionProductoDetalle.getLtpdLt().getLtId());
        loteTransaccionProductoDetalleDTO.setLtpdTco(loteTransaccionProductoDetalle.getLtpdTco() == null ? null : loteTransaccionProductoDetalle.getLtpdTco().getTcoId());
        return loteTransaccionProductoDetalleDTO;
    }

    private LoteTransaccionProductoDetalle mapToEntity(
            final LoteTransaccionProductoDetalleDTO loteTransaccionProductoDetalleDTO,
            final LoteTransaccionProductoDetalle loteTransaccionProductoDetalle) {
        loteTransaccionProductoDetalle.setLtpdUnidades(loteTransaccionProductoDetalleDTO.getLtpdUnidades());
        final Lote ltpdLt = loteTransaccionProductoDetalleDTO.getLtpdLt() == null ? null : loteRepository.findById(loteTransaccionProductoDetalleDTO.getLtpdLt())
                .orElseThrow(() -> new NotFoundException("ltpdLt not found"));
        loteTransaccionProductoDetalle.setLtpdLt(ltpdLt);
        final TransaccionesProducto ltpdTco = loteTransaccionProductoDetalleDTO.getLtpdTco() == null ? null : transaccionesProductoRepository.findById(loteTransaccionProductoDetalleDTO.getLtpdTco())
                .orElseThrow(() -> new NotFoundException("ltpdTco not found"));
        loteTransaccionProductoDetalle.setLtpdTco(ltpdTco);
        return loteTransaccionProductoDetalle;
    }

    public void crearDetalle(Lote lote, TransaccionesProducto transaccionProducto, Integer cantidad) {
        LoteTransaccionProductoDetalle detalle = new LoteTransaccionProductoDetalle();
        detalle.setLtpdLt(lote);
        detalle.setLtpdTco(transaccionProducto);
        detalle.setLtpdUnidades(cantidad);
        loteTransaccionProductoDetalleRepository.save(detalle);
    }

    @Transactional
    public void manejarBajaProducto(Integer productoId, TransaccionesProducto transaccionProducto, Integer cantidadRequerida) {
        List<LoteDisponible> lotesDisponibles = obtenerLotesDisponibles(productoId);
        Integer cantidadRestante = cantidadRequerida;

        int totalDisponible = lotesDisponibles.stream()
            .mapToInt(LoteDisponible::getCantidadDisponible)
            .sum();

        for (LoteDisponible lote : lotesDisponibles) {
            if (cantidadRestante <= 0) break;

            Integer cantidadADescontar = Math.min(lote.getCantidadDisponible(), cantidadRestante);
            registrarSalidaLote(lote.getLote(), transaccionProducto, cantidadADescontar);
            cantidadRestante -= cantidadADescontar;
        }

        if (cantidadRestante > 0) {
            throw new InsufficientStockException(totalDisponible, cantidadRequerida);
        }
    }

    private List<LoteDisponible> obtenerLotesDisponibles(Integer productoId) {
        return loteTransaccionProductoDetalleRepository
            .findLotesDisponiblesByProductoOrderByFecha(productoId)
            .stream()
            .map(result -> new LoteDisponible(
                (Lote) result[0],
                ((Number) result[1]).intValue()
            ))
            .collect(Collectors.toList());
    }

    private void registrarSalidaLote(Lote lote, TransaccionesProducto transaccionProducto, Integer cantidad) {
        LoteTransaccionProductoDetalle detalle = new LoteTransaccionProductoDetalle();
        detalle.setLtpdLt(lote);
        detalle.setLtpdTco(transaccionProducto);
        detalle.setLtpdUnidades(-cantidad);
        loteTransaccionProductoDetalleRepository.save(detalle);
    }

    @Getter
    @AllArgsConstructor
    private static class LoteDisponible {
        private final Lote lote;
        private final Integer cantidadDisponible;
    }
}

