package io.bootify.helisys.rest;

import io.bootify.helisys.model.PedidosCompraDTO;
import io.bootify.helisys.service.PedidosCompraService;
import io.bootify.helisys.util.ReferencedException;
import io.bootify.helisys.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping(value = "/api/pedidosCompras", produces = MediaType.APPLICATION_JSON_VALUE)
public class PedidosCompraResource {

    private final PedidosCompraService pedidosCompraService;

    public PedidosCompraResource(final PedidosCompraService pedidosCompraService) {
        this.pedidosCompraService = pedidosCompraService;
    }

    @GetMapping
    public ResponseEntity<List<PedidosCompraDTO>> getAllPedidosCompras() {
        return ResponseEntity.ok(pedidosCompraService.findAll());
    }

    @GetMapping("/{pcaId}")
    public ResponseEntity<PedidosCompraDTO> getPedidosCompra(
            @PathVariable(name = "pcaId") final Integer pcaId) {
        return ResponseEntity.ok(pedidosCompraService.get(pcaId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createPedidosCompra(
            @RequestBody @Valid final PedidosCompraDTO pedidosCompraDTO) {
        final Integer createdPcaId = pedidosCompraService.create(pedidosCompraDTO);
        return new ResponseEntity<>(createdPcaId, HttpStatus.CREATED);
    }

    @PutMapping("/{pcaId}")
    public ResponseEntity<Integer> updatePedidosCompra(
            @PathVariable(name = "pcaId") final Integer pcaId,
            @RequestBody @Valid final PedidosCompraDTO pedidosCompraDTO) {
        pedidosCompraService.update(pcaId, pedidosCompraDTO);
        return ResponseEntity.ok(pcaId);
    }

    @DeleteMapping("/{pcaId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deletePedidosCompra(
            @PathVariable(name = "pcaId") final Integer pcaId) {
        final ReferencedWarning referencedWarning = pedidosCompraService.getReferencedWarning(pcaId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        pedidosCompraService.delete(pcaId);
        return ResponseEntity.noContent().build();
    }

}
