package io.bootify.helisys.rest;

import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.model.TransaccionesProductoDTO;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.repos.TransaccionRepository;
import io.bootify.helisys.service.TransaccionesProductoService;
import io.bootify.helisys.util.CustomCollectors;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/transaccionesProductos", produces = MediaType.APPLICATION_JSON_VALUE)
public class TransaccionesProductoResource {

    private final TransaccionesProductoService transaccionesProductoService;
    private final ProductoRepository productoRepository;
    private final TransaccionRepository transaccionRepository;

    public TransaccionesProductoResource(
            final TransaccionesProductoService transaccionesProductoService,
            final ProductoRepository productoRepository,
            final TransaccionRepository transaccionRepository) {
        this.transaccionesProductoService = transaccionesProductoService;
        this.productoRepository = productoRepository;
        this.transaccionRepository = transaccionRepository;
    }

    @GetMapping
    public ResponseEntity<List<TransaccionesProductoDTO>> getAllTransaccionesProductos() {
        return ResponseEntity.ok(transaccionesProductoService.findAll());
    }

    @GetMapping("/{tcoId}")
    public ResponseEntity<TransaccionesProductoDTO> getTransaccionesProducto(
            @PathVariable(name = "tcoId") final Integer tcoId) {
        return ResponseEntity.ok(transaccionesProductoService.get(tcoId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createTransaccionesProducto(
            @RequestBody @Valid final TransaccionesProductoDTO transaccionesProductoDTO) {
        final Integer createdTcoId = transaccionesProductoService.create(transaccionesProductoDTO);
        return new ResponseEntity<>(createdTcoId, HttpStatus.CREATED);
    }

    @PutMapping("/{tcoId}")
    public ResponseEntity<Integer> updateTransaccionesProducto(
            @PathVariable(name = "tcoId") final Integer tcoId,
            @RequestBody @Valid final TransaccionesProductoDTO transaccionesProductoDTO) {
        transaccionesProductoService.update(tcoId, transaccionesProductoDTO);
        return ResponseEntity.ok(tcoId);
    }

    @DeleteMapping("/{tcoId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteTransaccionesProducto(
            @PathVariable(name = "tcoId") final Integer tcoId) {
        transaccionesProductoService.delete(tcoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tcoProValues")
    public ResponseEntity<Map<Integer, String>> getTcoProValues() {
        return ResponseEntity.ok(productoRepository.findAll(Sort.by("proId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Producto::getProId, Producto::getProNumeroParte)));
    }

    @GetMapping("/tcoTceValues")
    public ResponseEntity<Map<Integer, String>> getTcoTceValues() {
        List<Transaccion> transacciones = transaccionRepository.findAll(Sort.by("tceId"));
        Map<Integer, String> result = new HashMap<>();

        for (Transaccion transaccion : transacciones) {
            if (transaccion.getTceId() != null && transaccion.getTceObservaciones() != null) {
                result.put(transaccion.getTceId(), transaccion.getTceObservaciones());
            }
        }

        return ResponseEntity.ok(result);
    }
}
