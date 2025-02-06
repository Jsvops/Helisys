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
import java.time.LocalDate; // Importa LocalDate para manejar fechas
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
            .orElseThrow(() -> new NotFoundException("Transacción no encontrada con ID: " + tceId));
    }

    public Integer create(final TransaccionDTO transaccionDTO) {
        final Transaccion transaccion = new Transaccion();
        // Establece la fecha actual si no se proporciona
        if (transaccionDTO.getTceFechaTransaccion() == null) {
            transaccionDTO.setTceFechaTransaccion(LocalDate.now());
        }
        mapToEntity(transaccionDTO, transaccion);
        return transaccionRepository.save(transaccion).getTceId();
    }

    public void update(final Integer tceId, final TransaccionDTO transaccionDTO) {
        final Transaccion transaccion = transaccionRepository.findById(tceId)
            .orElseThrow(() -> new NotFoundException("Transacción no encontrada con ID: " + tceId));
        mapToEntity(transaccionDTO, transaccion);
        transaccionRepository.save(transaccion);
    }

    public void delete(final Integer tceId) {
        transaccionRepository.deleteById(tceId);
    }

    public TransaccionDTO getLastTransaccion() {
        Transaccion transaccion = transaccionRepository.findTopByOrderByTceIdDesc()
            .orElseThrow(() -> new NotFoundException("No se encontraron transacciones"));
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

        // Asignar el evento de transacción (tceTvo)
        if (transaccionDTO.getTceTvo() != null) {
            final TransaccionEvento tceTvo = transaccionEventoRepository.findById(transaccionDTO.getTceTvo())
                .orElseThrow(() -> new NotFoundException("Evento de transacción no encontrado con ID: " + transaccionDTO.getTceTvo()));
            transaccion.setTceTvo(tceTvo);
        } else {
            transaccion.setTceTvo(null);
        }

        // Asignar el usuario (tceUsr)
        if (transaccionDTO.getTceUsr() != null) {
            final Usuario tceUsr = usuarioRepository.findById(transaccionDTO.getTceUsr())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + transaccionDTO.getTceUsr()));
            transaccion.setTceUsr(tceUsr);
        } else {
            throw new IllegalArgumentException("El campo tceUsr no puede ser nulo");
        }

        return transaccion;
    }

    public ReferencedWarning getReferencedWarning(final Integer tceId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Transaccion transaccion = transaccionRepository.findById(tceId)
            .orElseThrow(() -> new NotFoundException("Transacción no encontrada con ID: " + tceId));
        final TransaccionesProducto tcoTceTransaccionesProducto = transaccionesProductoRepository.findFirstByTcoTce(transaccion);
        if (tcoTceTransaccionesProducto != null) {
            referencedWarning.setKey("transaccion.transaccionesProducto.tcoTce.referenced");
            referencedWarning.addParam(tcoTceTransaccionesProducto.getTcoId());
            return referencedWarning;
        }
        return null;
    }
}
