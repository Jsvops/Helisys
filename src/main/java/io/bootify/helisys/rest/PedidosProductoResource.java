package io.bootify.helisys.rest;

import io.bootify.helisys.domain.PedidosCompra;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.model.PedidosProductoDTO;
import io.bootify.helisys.repos.PedidosCompraRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.service.PedidosProductoService;
import io.bootify.helisys.util.CustomCollectors;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
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
@RequestMapping(value = "/api/pedidosProductos", produces = MediaType.APPLICATION_JSON_VALUE)
public class PedidosProductoResource {

    private final PedidosProductoService pedidosProductoService;
    private final ProductoRepository productoRepository;
    private final PedidosCompraRepository pedidosCompraRepository;

    public PedidosProductoResource(final PedidosProductoService pedidosProductoService,
            final ProductoRepository productoRepository,
            final PedidosCompraRepository pedidosCompraRepository) {
        this.pedidosProductoService = pedidosProductoService;
        this.productoRepository = productoRepository;
        this.pedidosCompraRepository = pedidosCompraRepository;
    }

    @GetMapping
    public ResponseEntity<List<PedidosProductoDTO>> getAllPedidosProductos() {
        return ResponseEntity.ok(pedidosProductoService.findAll());
    }

    @GetMapping("/{pptId}")
    public ResponseEntity<PedidosProductoDTO> getPedidosProducto(
            @PathVariable(name = "pptId") final Integer pptId) {
        return ResponseEntity.ok(pedidosProductoService.get(pptId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createPedidosProducto(
            @RequestBody @Valid final PedidosProductoDTO pedidosProductoDTO) {
        final Integer createdPptId = pedidosProductoService.create(pedidosProductoDTO);
        return new ResponseEntity<>(createdPptId, HttpStatus.CREATED);
    }

    @PutMapping("/{pptId}")
    public ResponseEntity<Integer> updatePedidosProducto(
            @PathVariable(name = "pptId") final Integer pptId,
            @RequestBody @Valid final PedidosProductoDTO pedidosProductoDTO) {
        pedidosProductoService.update(pptId, pedidosProductoDTO);
        return ResponseEntity.ok(pptId);
    }

    @DeleteMapping("/{pptId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deletePedidosProducto(
            @PathVariable(name = "pptId") final Integer pptId) {
        pedidosProductoService.delete(pptId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pptProValues")
    public ResponseEntity<Map<Integer, String>> getPptProValues() {
        return ResponseEntity.ok(productoRepository.findAll(Sort.by("proId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Producto::getProId, Producto::getProNumeroParte)));
    }

    @GetMapping("/pptPcaValues")
    public ResponseEntity<Map<Integer, String>> getPptPcaValues() {
        return ResponseEntity.ok(pedidosCompraRepository.findAll(Sort.by("pcaId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(PedidosCompra::getPcaId, PedidosCompra::getPcaDescripcion)));
    }

}
