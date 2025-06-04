package io.bootify.helisys.rest;

import io.bootify.helisys.model.LoteTransaccionProductoDetalleDTO;
import io.bootify.helisys.service.LoteTransaccionProductoDetalleService;
import io.bootify.helisys.util.ReferencedException;
import io.bootify.helisys.util.ReferencedWarning;
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
@RequestMapping(value = "/api/lote-transaccion-producto-detalles", produces = MediaType.APPLICATION_JSON_VALUE)
public class LoteTransaccionProductoDetalleResource {

    private final LoteTransaccionProductoDetalleService loteTransaccionProductoDetalleService;

    public LoteTransaccionProductoDetalleResource(
        final LoteTransaccionProductoDetalleService loteTransaccionProductoDetalleService) {
        this.loteTransaccionProductoDetalleService = loteTransaccionProductoDetalleService;
    }

    @GetMapping
    public ResponseEntity<List<LoteTransaccionProductoDetalleDTO>> getAllLoteTransaccionProductoDetalles() {
        return ResponseEntity.ok(loteTransaccionProductoDetalleService.findAll());
    }

    @GetMapping("/{ltpdId}")
    public ResponseEntity<LoteTransaccionProductoDetalleDTO> getLoteTransaccionProductoDetalle(
        @PathVariable(name = "ltpdId") final Integer ltpdId) {
        return ResponseEntity.ok(loteTransaccionProductoDetalleService.get(ltpdId));
    }

    @PostMapping
    public ResponseEntity<Integer> createLoteTransaccionProductoDetalle(
        @RequestBody @Valid final LoteTransaccionProductoDetalleDTO loteTransaccionProductoDetalleDTO) {
        final Integer createdLtpdId = loteTransaccionProductoDetalleService.create(loteTransaccionProductoDetalleDTO);
        return new ResponseEntity<>(createdLtpdId, HttpStatus.CREATED);
    }

    @PutMapping("/{ltpdId}")
    public ResponseEntity<Integer> updateLoteTransaccionProductoDetalle(
        @PathVariable(name = "ltpdId") final Integer ltpdId,
        @RequestBody @Valid final LoteTransaccionProductoDetalleDTO loteTransaccionProductoDetalleDTO) {
        loteTransaccionProductoDetalleService.update(ltpdId, loteTransaccionProductoDetalleDTO);
        return ResponseEntity.ok(ltpdId);
    }

    @DeleteMapping("/{ltpdId}")
    public ResponseEntity<Void> deleteLoteTransaccionProductoDetalle(
        @PathVariable(name = "ltpdId") final Integer ltpdId) {
        final ReferencedWarning referencedWarning = loteTransaccionProductoDetalleService.getReferencedWarning(ltpdId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        loteTransaccionProductoDetalleService.delete(ltpdId);
        return ResponseEntity.noContent().build();
    }

}
