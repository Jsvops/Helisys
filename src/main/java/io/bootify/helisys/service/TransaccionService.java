package io.bootify.helisys.service;

import io.bootify.helisys.domain.*;
import io.bootify.helisys.mapper.TransaccionesProductoMapper;
import io.bootify.helisys.model.TransaccionDTO;
import io.bootify.helisys.model.TransaccionesProductoDTO;
import io.bootify.helisys.model.TransactionRequestDTO;
import io.bootify.helisys.model.TransactionResponseDTO;
import io.bootify.helisys.repos.*;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
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
    private final TransaccionEventoService transaccionEventoService;
    private final ProductoService productoService;
    private final UsuarioService usuarioService;
    private final AeronaveService aeronaveService;
    private final TransaccionesProductoService transaccionesProductoService;
    private final LoteService loteService;
    private final LoteTransaccionProductoDetalleService loteTransaccionProductoDetalleService;
    private final TransaccionesProductoMapper transaccionesProductoMapper;

    public TransaccionService(final TransaccionRepository transaccionRepository,
                              final TransaccionEventoRepository transaccionEventoRepository,
                              final UsuarioRepository usuarioRepository,
                              final AeronaveRepository aeronaveRepository,
                              final TransaccionesProductoRepository transaccionesProductoRepository,
                              final TransaccionEventoService transaccionEventoService,
                              final ProductoService productoService,
                              final UsuarioService usuarioService,
                              final AeronaveService aeronaveService,
                              final TransaccionesProductoService transaccionesProductoService,
                              final LoteService loteService,
                              final LoteTransaccionProductoDetalleService loteTransaccionProductoDetalleService, TransaccionesProductoMapper transaccionesProductoMapper) {
        this.transaccionRepository = transaccionRepository;
        this.transaccionEventoRepository = transaccionEventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.aeronaveRepository = aeronaveRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
        this.transaccionEventoService = transaccionEventoService;
        this.productoService = productoService;
        this.usuarioService = usuarioService;
        this.aeronaveService = aeronaveService;
        this.transaccionesProductoService = transaccionesProductoService;
        this.loteService = loteService;
        this.loteTransaccionProductoDetalleService = loteTransaccionProductoDetalleService;
        this.transaccionesProductoMapper = transaccionesProductoMapper;
    }

    public List<TransaccionDTO> findAll() {
        final List<Transaccion> transacciones = transaccionRepository.findAll(Sort.by("tceId"));
        return transacciones.stream()
            .map(transaccion -> mapToDTO(transaccion, new TransaccionDTO()))
            .toList();
    }

    public List<Map<String, Object>> getTransaccionesByFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Map<String, Object>> transacciones = transaccionRepository.findTransaccionesCombinadasByFecha(fechaInicio, fechaFin);

        for (Map<String, Object> transaccion : transacciones) {
            Object fecha = transaccion.get("tceFechaTransaccion");
            if (fecha instanceof LocalDate fechaLocalDate) {
                Date fechaDate = Date.from(fechaLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                transaccion.put("tceFechaTransaccion", fechaDate);
            }
        }

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
    public Integer executeTransaction(@Valid TransactionRequestDTO dto, Integer usuarioId) {

        // Obtener entidades relacionadas
        TransaccionEvento evento = transaccionEventoService.getEvento(dto.getTceTvo());
        Producto producto = productoService.getProducto(dto.getTcoPro());
        Usuario usuario = usuarioService.getUsuario(usuarioId);/*duda: como se obtuvo el id del "usuarioId" para pasarlo como metodo*/
        Aeronave aeronave = dto.getTceAnv() != null ? aeronaveService.getAeronave(dto.getTceAnv()) : null;
        // != "no igual a" o "distinto de"

        //Metodo que devuelve true si el tipo de evento es bajaA
        if (transaccionEventoService.isStockOut(dto.getTceTvo())) {
            //Metodo que valida si hay suficiente stock
            productoService.StockDisponible(producto.getProId(), dto.getUnidades());
        }

        // Crear y guardar la transacción principal
        Transaccion transaccion = Transaccion.builder()
            .tceFechaTransaccion(LocalDate.now())
            .tceObservaciones(dto.getTceObservaciones())
            .tceTvo(evento)
            .tceUsr(usuario)
            .tceAnv(aeronave)
            .build(); //construye y devuelve la instancia Transaccion.
        Transaccion savedTransaccion = transaccionRepository.save(transaccion); //método de spring data JPA que persiste la entidad y devuelve la version "gestionada (con IDs y campos generados por la BD)


        // Crear relación transacción-producto
        TransaccionesProductoDTO transaccionesProductoDTO = new TransaccionesProductoDTO();
        transaccionesProductoDTO.setTcoTce(savedTransaccion.getTceId());
        transaccionesProductoDTO.setTcoPro(producto.getProId());
        transaccionesProductoDTO.setTcoUnidades(dto.getUnidades());

        TransaccionesProductoDTO savedDto =
            transaccionesProductoService.createProductTransaction(transaccionesProductoDTO);


        // Procesar la lógica adicional según el tipo de transacción
        procesarTransaccion(
            transaccionEventoService.isStockIn(dto.getTceTvo()),
            dto,
            savedDto.getTcoId() // ID recién creado de la transacción-producto
        );

        return savedTransaccion.getTceId();
    }

    private void procesarTransaccion(boolean isStockIn, TransactionRequestDTO transactionRequestDTO, Integer transaccionesProductoId) {
        TransaccionesProducto transProdEntity = transaccionesProductoMapper.toEntity(
            transaccionesProductoService.get(transaccionesProductoId));

        if (isStockIn) {
            if (transactionRequestDTO.getLtFechaVencimiento() != null) {
                Lote lote = loteService.crear(transactionRequestDTO.getLtFechaVencimiento());
                //Vincula el lote con la transaccion-producto
                loteTransaccionProductoDetalleService.crearDetalle(
                    lote,
                    transProdEntity,
                    transactionRequestDTO.getUnidades()
                );
            }
            productoService.aumentarStock(transactionRequestDTO.getTcoPro(), transactionRequestDTO.getUnidades());
        }

        else {
            loteTransaccionProductoDetalleService.manejarBajaProducto(
                transactionRequestDTO.getTcoPro(),
                transProdEntity,
                transactionRequestDTO.getUnidades()
            );
            productoService.reducirStock(transactionRequestDTO.getTcoPro(), transactionRequestDTO.getUnidades());
        }
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponseDTO> getAllTransactions(Pageable pageable, LocalDate fechaInicio, LocalDate fechaFin) {
        return transaccionRepository.findAllTransactionResponses(pageable, fechaInicio, fechaFin);
    }



}

