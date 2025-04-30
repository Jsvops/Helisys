package io.bootify.helisys.service;

import io.bootify.helisys.domain.*;
import io.bootify.helisys.model.TransaccionDTO;
import io.bootify.helisys.repos.*;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final TransaccionEventoRepository transaccionEventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AeronaveRepository aeronaveRepository;
    private final TransaccionesProductoRepository transaccionesProductoRepository;

    public TransaccionService(final TransaccionRepository transaccionRepository,
                              final TransaccionEventoRepository transaccionEventoRepository,
                              final UsuarioRepository usuarioRepository,
                              final AeronaveRepository aeronaveRepository,
                              final TransaccionesProductoRepository transaccionesProductoRepository) {
        this.transaccionRepository = transaccionRepository;
        this.transaccionEventoRepository = transaccionEventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.aeronaveRepository = aeronaveRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
    }

    public List<TransaccionDTO> findAll() {
        final List<Transaccion> transacciones = transaccionRepository.findAll(Sort.by("tceId"));
        return transacciones.stream()
            .map(transaccion -> mapToDTO(transaccion, new TransaccionDTO()))
            .toList();
    }

    public List<Map<String, Object>> getTransaccionesByFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Map<String, Object>> transacciones = transaccionRepository.findTransaccionesCombinadasByFecha(fechaInicio, fechaFin);

        // Convertir LocalDate a Date
        transacciones.forEach(transaccion -> {
            LocalDate fechaLocalDate = (LocalDate) transaccion.get("tceFechaTransaccion");
            if (fechaLocalDate != null) {
                Date fechaDate = Date.from(fechaLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                transaccion.put("tceFechaTransaccion", fechaDate);
            }
        });

        return transacciones;
    }

    public TransaccionDTO get(final Integer tceId) {
        return transaccionRepository.findById(tceId)
            .map(transaccion -> mapToDTO(transaccion, new TransaccionDTO()))
            .orElseThrow(() -> new NotFoundException("Transacción no encontrada con ID: " + tceId));
    }

    public Integer create(final TransaccionDTO transaccionDTO) {
        final Transaccion transaccion = new Transaccion();
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
        transaccionDTO.setTceAnv(transaccion.getTceAnv() == null ? null : transaccion.getTceAnv().getAnvId());
        return transaccionDTO;
    }

    private Transaccion mapToEntity(final TransaccionDTO transaccionDTO, final Transaccion transaccion) {
        transaccion.setTceFechaTransaccion(transaccionDTO.getTceFechaTransaccion());
        transaccion.setTceObservaciones(transaccionDTO.getTceObservaciones());

        if (transaccionDTO.getTceTvo() != null) {
            final TransaccionEvento tceTvo = transaccionEventoRepository.findById(transaccionDTO.getTceTvo())
                .orElseThrow(() -> new NotFoundException("Evento de transacción no encontrado con ID: " + transaccionDTO.getTceTvo()));
            transaccion.setTceTvo(tceTvo);
        }

        if (transaccionDTO.getTceUsr() != null) {
            final Usuario tceUsr = usuarioRepository.findById(transaccionDTO.getTceUsr())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ID: " + transaccionDTO.getTceUsr()));
            transaccion.setTceUsr(tceUsr);
        } else {
            throw new IllegalArgumentException("El campo tceUsr no puede ser nulo");
        }

        if (transaccionDTO.getTceAnv() != null) {
            final Aeronave tceAnv = aeronaveRepository.findById(transaccionDTO.getTceAnv())
                .orElseThrow(() -> new NotFoundException("Aeronave no encontrada con ID: " + transaccionDTO.getTceAnv()));
            transaccion.setTceAnv(tceAnv);
        } else {
            transaccion.setTceAnv(null);
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
