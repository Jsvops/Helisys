package io.bootify.helisys.service;

import io.bootify.helisys.domain.Lote;
import io.bootify.helisys.model.LoteDTO;
import io.bootify.helisys.repos.LoteRepository;
import io.bootify.helisys.repos.LoteTransaccionProductoDetalleRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class LoteService {

    private final LoteRepository loteRepository;
    private final LoteTransaccionProductoDetalleRepository loteTransaccionProductoDetalleRepository;

    public LoteService(final LoteRepository loteRepository,
                       final LoteTransaccionProductoDetalleRepository loteTransaccionProductoDetalleRepository) {
        this.loteRepository = loteRepository;
        this.loteTransaccionProductoDetalleRepository = loteTransaccionProductoDetalleRepository;
    }

    public List<LoteDTO> findAll() {
        final List<Lote> lotes = loteRepository.findAll(Sort.by("ltId"));
        return lotes.stream()
            .map(lote -> mapToDTO(lote, new LoteDTO()))
            .toList();
    }

    public LoteDTO get(final Integer ltId) {
        return loteRepository.findById(ltId)
            .map(lote -> mapToDTO(lote, new LoteDTO()))
            .orElseThrow(NotFoundException::new);
    }

    public Integer create(final LoteDTO loteDTO) {
        final Lote lote = new Lote();
        mapToEntity(loteDTO, lote);
        return loteRepository.save(lote).getLtId();
    }

    public void update(final Integer ltId, final LoteDTO loteDTO) {
        final Lote lote = loteRepository.findById(ltId)
            .orElseThrow(NotFoundException::new);
        mapToEntity(loteDTO, lote);
        loteRepository.save(lote);
    }

    public void delete(final Integer ltId) {
        loteRepository.deleteById(ltId);
    }

    public ReferencedWarning getReferencedWarning(final Integer ltId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Lote lote = loteRepository.findById(ltId)
            .orElseThrow(NotFoundException::new);
        final long loteTransaccionProductoDetalleCount = loteTransaccionProductoDetalleRepository.countByLtpdLt(lote);
        if (loteTransaccionProductoDetalleCount > 0) {
            referencedWarning.setKey("lote.loteTransaccionProductoDetalle.referenced");
            referencedWarning.addParam(loteTransaccionProductoDetalleCount);
            return referencedWarning;
        }
        return null;
    }

    private LoteDTO mapToDTO(final Lote lote, final LoteDTO loteDTO) {
        loteDTO.setLtId(lote.getLtId());
        loteDTO.setLtFechaVencimiento(lote.getLtFechaVencimiento());
        return loteDTO;
    }

    private Lote mapToEntity(final LoteDTO loteDTO, final Lote lote) {
        lote.setLtFechaVencimiento(loteDTO.getLtFechaVencimiento());
        return lote;
    }

    public Lote crear(LocalDate fechaVencimiento) {
        if (fechaVencimiento == null) {
            throw new IllegalArgumentException("ltFechaVencimiento es obligatorio para crear un lote.");
        }
        LocalDate hoy = LocalDate.now();
        if (fechaVencimiento.isBefore(hoy)) {
            throw new IllegalArgumentException("ltFechaVencimiento no puede ser anterior a hoy");
        }
        Lote lote = new Lote();
        lote.setLtFechaVencimiento(fechaVencimiento);
        return loteRepository.save(lote);
    }

}
