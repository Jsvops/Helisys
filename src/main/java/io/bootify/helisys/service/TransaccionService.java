package io.bootify.helisys.service;

import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.TransaccionEvento;
import io.bootify.helisys.domain.TransaccionesProducto;
import io.bootify.helisys.domain.Usuario;
import io.bootify.helisys.model.TransaccionDTO;
import io.bootify.helisys.repos.TransaccionEventoRepository;
import io.bootify.helisys.repos.TransaccionRepository;
import io.bootify.helisys.repos.TransaccionesProductoRepository;
import io.bootify.helisys.repos.UsuarioRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final TransaccionEventoRepository transaccionEventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransaccionesProductoRepository transaccionesProductoRepository;

    public TransaccionService(final TransaccionRepository transaccionRepository,
                              final TransaccionEventoRepository transaccionEventoRepository,
                              final UsuarioRepository usuarioRepository,
                              final TransaccionesProductoRepository transaccionesProductoRepository) {
        this.transaccionRepository = transaccionRepository;
        this.transaccionEventoRepository = transaccionEventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
    }

    public List<TransaccionDTO> findAll() {
        final List<Transaccion> transacciones = transaccionRepository.findAll(Sort.by("tceId"));
        return transacciones.stream()
            .map(transaccion -> mapToDTO(transaccion, new TransaccionDTO()))
            .toList();
    }

    public TransaccionDTO get(final Integer tceId) {
        return transaccionRepository.findById(tceId)
            .map(transaccion -> mapToDTO(transaccion, new TransaccionDTO()))
            .orElseThrow(NotFoundException::new);
    }

    public Integer create(final TransaccionDTO transaccionDTO) {
        final Transaccion transaccion = new Transaccion();
        mapToEntity(transaccionDTO, transaccion);
        return transaccionRepository.save(transaccion).getTceId();
    }

    public void update(final Integer tceId, final TransaccionDTO transaccionDTO) {
        final Transaccion transaccion = transaccionRepository.findById(tceId)
            .orElseThrow(NotFoundException::new);
        mapToEntity(transaccionDTO, transaccion);
        transaccionRepository.save(transaccion);
    }

    public void delete(final Integer tceId) {
        transaccionRepository.deleteById(tceId);
    }

    public TransaccionDTO getLastTransaccion() {
        Transaccion transaccion = transaccionRepository.findTopByOrderByTceIdDesc()
            .orElseThrow(NotFoundException::new);
        return mapToDTO(transaccion, new TransaccionDTO());
    }


    private TransaccionDTO mapToDTO(final Transaccion transaccion, final TransaccionDTO transaccionDTO) {
        transaccionDTO.setTceId(transaccion.getTceId());
        transaccionDTO.setTceFechaTransaccion(transaccion.getTceFechaTransaccion());
        transaccionDTO.setTceObservaciones(transaccion.getTceObservaciones());
        transaccionDTO.setTceTvo(transaccion.getTceTvo() == null ? null : transaccion.getTceTvo().getTvoId());
        transaccionDTO.setTceUsr(transaccion.getTceUsr() == null ? null : transaccion.getTceUsr().getUsrId());
        return transaccionDTO;
    }

    private Transaccion mapToEntity(final TransaccionDTO transaccionDTO, final Transaccion transaccion) {
        transaccion.setTceFechaTransaccion(transaccionDTO.getTceFechaTransaccion());
        transaccion.setTceObservaciones(transaccionDTO.getTceObservaciones());
        final TransaccionEvento tceTvo = transaccionDTO.getTceTvo() == null ? null : transaccionEventoRepository.findById(transaccionDTO.getTceTvo())
            .orElseThrow(() -> new NotFoundException("tceTvo not found"));
        transaccion.setTceTvo(tceTvo);
        final Usuario tceUsr = transaccionDTO.getTceUsr() == null ? null : usuarioRepository.findById(transaccionDTO.getTceUsr())
            .orElseThrow(() -> new NotFoundException("tceUsr not found"));
        transaccion.setTceUsr(tceUsr);
        return transaccion;
    }

    public ReferencedWarning getReferencedWarning(final Integer tceId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Transaccion transaccion = transaccionRepository.findById(tceId)
            .orElseThrow(NotFoundException::new);
        final TransaccionesProducto tcoTceTransaccionesProducto = transaccionesProductoRepository.findFirstByTcoTce(transaccion);
        if (tcoTceTransaccionesProducto != null) {
            referencedWarning.setKey("transaccion.transaccionesProducto.tcoTce.referenced");
            referencedWarning.addParam(tcoTceTransaccionesProducto.getTcoId());
            return referencedWarning;
        }
        return null;
    }
}
