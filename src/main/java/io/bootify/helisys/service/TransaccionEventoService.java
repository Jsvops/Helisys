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

    //Metodo que esta siendo llamado en el TransaccionService.java para la obtencion de la entidad
    public TransaccionEvento getEvento(Integer id) {
        return transaccionEventoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tipo de evento no válido"));
    }

    public boolean isStockIn(int tvoId) {
        return InventoryEventType.isSTOCKIN(tvoId);
    }

    public boolean isStockOut(int tvoId) {
        return !isStockIn(tvoId);
    }

    public enum InventoryEventType {
        STOCKIN(new int[]{1, 2, 3}),
        STOCKOUT(new int[]{4, 5, 6, 7, 8, 9});

        private final int[] ids;

        InventoryEventType(int[] ids) {
            this.ids = ids;
        }

        public boolean containsId(int id) {
            for (int value : ids) {
                if (value == id) {
                    return true;
                }
            }
            return false;
        }

        public static boolean isSTOCKIN(int id) {
            return STOCKIN.containsId(id);
        }
    }
}

