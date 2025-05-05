package io.bootify.helisys.service;

import io.bootify.helisys.domain.*;
import io.bootify.helisys.model.TransaccionCompletaDTO;
import io.bootify.helisys.model.TransaccionDTO;
import io.bootify.helisys.repos.*;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import jakarta.transaction.Transactional;
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
    private final ProductoRepository productoRepository;
    private final LoteRepository loteRepository;
    private final LoteTransaccionProductoDetalleRepository loteTransaccionProductoDetalleRepository;


    public TransaccionService(final TransaccionRepository transaccionRepository,
                              final TransaccionEventoRepository transaccionEventoRepository,
                              final UsuarioRepository usuarioRepository,
                              final AeronaveRepository aeronaveRepository,
                              final ProductoRepository productoRepository,
                              final TransaccionesProductoRepository transaccionesProductoRepository,
                              final LoteRepository loteRepository,
                              final LoteTransaccionProductoDetalleRepository loteTransaccionProductoDetalleRepository) {
        this.transaccionRepository = transaccionRepository;
        this.transaccionEventoRepository = transaccionEventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.aeronaveRepository = aeronaveRepository;
        this.productoRepository = productoRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
        this.loteRepository = loteRepository;
        this.loteTransaccionProductoDetalleRepository = loteTransaccionProductoDetalleRepository;
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

    @Transactional
    public Integer procesarTransaccionCompleta(TransaccionCompletaDTO dto, Integer usuarioId) {
        // 1. Verificar y obtener el tipo de evento
        TransaccionEvento evento = transaccionEventoRepository.findById(dto.getTceTvo())
            .orElseThrow(() -> new RuntimeException("Tipo de evento no válido"));

        // 2. Verificar el producto
        Producto producto = productoRepository.findById(dto.getTcoPro())
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // 3. Verificar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 4. Verificar aeronave si fue proporcionada
        Aeronave aeronave = null;
        if (dto.getTceAnv() != null) {
            aeronave = aeronaveRepository.findById(dto.getTceAnv())
                .orElseThrow(() -> new RuntimeException("Aeronave no encontrada"));
        }

        // 5. Validar stock para bajas
        if (dto.getTceTvo() >= 4 && dto.getTceTvo() <= 9) { // Eventos de BAJA
            if (producto.getProUnidades() < dto.getCantidad()) {
                throw new RuntimeException(String.format(
                    "No hay suficiente stock para realizar la baja. Disponible: %d, Solicitado: %d",
                    producto.getProUnidades(), dto.getCantidad()));
            }
        }

        // 6. Crear y guardar la transacción principal
        Transaccion transaccion = new Transaccion();
        transaccion.setTceFechaTransaccion(LocalDate.now());
        transaccion.setTceObservaciones(dto.getTceObservaciones());
        transaccion.setTceTvo(evento);
        transaccion.setTceUsr(usuario);
        transaccion.setTceAnv(aeronave);
        transaccion = transaccionRepository.save(transaccion);

        // 7. Crear relación transacción-producto
        TransaccionesProducto transaccionProducto = new TransaccionesProducto();
        transaccionProducto.setTcoTce(transaccion);
        transaccionProducto.setTcoPro(producto);
        transaccionProducto.setTcoUnidades(dto.getCantidad());
        transaccionProducto = transaccionesProductoRepository.save(transaccionProducto);

        // 8. Manejar lógica diferente para altas y bajas
        if (dto.getTceTvo() <= 3) { // Eventos de ALTA (1, 2, 3)
            // Crear nuevo lote para la entrada
            if (dto.getLtFechaVencimiento() != null) {
                Lote lote = new Lote();
                lote.setLtFechaVencimiento(dto.getLtFechaVencimiento());
                lote = loteRepository.save(lote);

                // Registrar detalle del lote
                LoteTransaccionProductoDetalle detalle = new LoteTransaccionProductoDetalle();
                detalle.setLtpdLt(lote);
                detalle.setLtpdTco(transaccionProducto);
                detalle.setLtpdUnidades(dto.getCantidad());
                loteTransaccionProductoDetalleRepository.save(detalle);
            }

            // Actualizar stock
            producto.setProUnidades(producto.getProUnidades() + dto.getCantidad());
        } else { // Eventos de BAJA (4-9)
            // Manejar la baja con lógica FIFO
            manejarBajaProducto(producto, transaccionProducto, dto.getCantidad());
        }

        productoRepository.save(producto);
        return transaccion.getTceId();
    }

    private void manejarBajaProducto(Producto producto, TransaccionesProducto transaccionProducto, Integer cantidadRequerida) {
        // Obtener lotes ordenados por fecha de vencimiento (más antiguos primero)
        List<Object[]> lotesDisponibles = loteTransaccionProductoDetalleRepository
            .findLotesDisponiblesByProductoOrderByFecha(producto.getProId());

        Integer cantidadRestante = cantidadRequerida;

        for (Object[] loteInfo : lotesDisponibles) {
            Lote lote = (Lote) loteInfo[0];
            Integer disponibleEnLote = ((Number) loteInfo[1]).intValue();

            if (disponibleEnLote <= 0) continue;

            // Calcular cuánto tomar de este lote
            Integer cantidadADescontar = Math.min(disponibleEnLote, cantidadRestante);

            // Registrar la salida (detalle con cantidad negativa)
            LoteTransaccionProductoDetalle detalleSalida = new LoteTransaccionProductoDetalle();
            detalleSalida.setLtpdLt(lote);
            detalleSalida.setLtpdTco(transaccionProducto);
            detalleSalida.setLtpdUnidades(-cantidadADescontar);
            loteTransaccionProductoDetalleRepository.save(detalleSalida);

            cantidadRestante -= cantidadADescontar;

            if (cantidadRestante <= 0) break;
        }

        if (cantidadRestante > 0) {
            throw new RuntimeException("Error inesperado al procesar bajas: no se pudo completar la transacción");
        }

        // Actualizar stock del producto
        producto.setProUnidades(producto.getProUnidades() - cantidadRequerida);
    }
}
