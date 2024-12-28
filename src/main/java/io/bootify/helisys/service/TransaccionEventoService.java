package io.bootify.helisys.service;

import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.TransaccionEvento;
import io.bootify.helisys.model.TransaccionEventoDTO;
import io.bootify.helisys.repos.TransaccionEventoRepository;
import io.bootify.helisys.repos.TransaccionRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TransaccionEventoService {

    private final TransaccionEventoRepository transaccionEventoRepository;
    private final TransaccionRepository transaccionRepository;

    public TransaccionEventoService(final TransaccionEventoRepository transaccionEventoRepository,
            final TransaccionRepository transaccionRepository) {
        this.transaccionEventoRepository = transaccionEventoRepository;
        this.transaccionRepository = transaccionRepository;
    }

    public List<TransaccionEventoDTO> findAll() {
        final List<TransaccionEvento> transaccionEventos = transaccionEventoRepository.findAll(Sort.by("tvoId"));
        return transaccionEventos.stream()
                .map(transaccionEvento -> mapToDTO(transaccionEvento, new TransaccionEventoDTO()))
                .toList();
    }

    public TransaccionEventoDTO get(final Integer tvoId) {
        return transaccionEventoRepository.findById(tvoId)
                .map(transaccionEvento -> mapToDTO(transaccionEvento, new TransaccionEventoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final TransaccionEventoDTO transaccionEventoDTO) {
        final TransaccionEvento transaccionEvento = new TransaccionEvento();
        mapToEntity(transaccionEventoDTO, transaccionEvento);
        return transaccionEventoRepository.save(transaccionEvento).getTvoId();
    }

    public void update(final Integer tvoId, final TransaccionEventoDTO transaccionEventoDTO) {
        final TransaccionEvento transaccionEvento = transaccionEventoRepository.findById(tvoId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(transaccionEventoDTO, transaccionEvento);
        transaccionEventoRepository.save(transaccionEvento);
    }

    public void delete(final Integer tvoId) {
        transaccionEventoRepository.deleteById(tvoId);
    }

    private TransaccionEventoDTO mapToDTO(final TransaccionEvento transaccionEvento,
            final TransaccionEventoDTO transaccionEventoDTO) {
        transaccionEventoDTO.setTvoId(transaccionEvento.getTvoId());
        transaccionEventoDTO.setTvoEvento(transaccionEvento.getTvoEvento());
        return transaccionEventoDTO;
    }

    private TransaccionEvento mapToEntity(final TransaccionEventoDTO transaccionEventoDTO,
            final TransaccionEvento transaccionEvento) {
        transaccionEvento.setTvoEvento(transaccionEventoDTO.getTvoEvento());
        return transaccionEvento;
    }

    public ReferencedWarning getReferencedWarning(final Integer tvoId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final TransaccionEvento transaccionEvento = transaccionEventoRepository.findById(tvoId)
                .orElseThrow(NotFoundException::new);
        final Transaccion tceTvoTransaccion = transaccionRepository.findFirstByTceTvo(transaccionEvento);
        if (tceTvoTransaccion != null) {
            referencedWarning.setKey("transaccionEvento.transaccion.tceTvo.referenced");
            referencedWarning.addParam(tceTvoTransaccion.getTceId());
            return referencedWarning;
        }
        return null;
    }

}
