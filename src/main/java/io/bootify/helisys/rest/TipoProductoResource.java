package io.bootify.helisys.rest;

import io.bootify.helisys.model.TipoProductoDTO;
import io.bootify.helisys.service.TipoProductoService;
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
@RequestMapping(value = "/api/tipoProductos", produces = MediaType.APPLICATION_JSON_VALUE)
public class TipoProductoResource {

    private final TipoProductoService tipoProductoService;

    public TipoProductoResource(final TipoProductoService tipoProductoService) {
        this.tipoProductoService = tipoProductoService;
    }

    @GetMapping
    public ResponseEntity<List<TipoProductoDTO>> getAllTipoProductos() {
        return ResponseEntity.ok(tipoProductoService.findAll());
    }

    @GetMapping("/{tpoId}")
    public ResponseEntity<TipoProductoDTO> getTipoProducto(
            @PathVariable(name = "tpoId") final Integer tpoId) {
        return ResponseEntity.ok(tipoProductoService.get(tpoId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createTipoProducto(
            @RequestBody @Valid final TipoProductoDTO tipoProductoDTO) {
        final Integer createdTpoId = tipoProductoService.create(tipoProductoDTO);
        return new ResponseEntity<>(createdTpoId, HttpStatus.CREATED);
    }

    @PutMapping("/{tpoId}")
    public ResponseEntity<Integer> updateTipoProducto(
            @PathVariable(name = "tpoId") final Integer tpoId,
            @RequestBody @Valid final TipoProductoDTO tipoProductoDTO) {
        tipoProductoService.update(tpoId, tipoProductoDTO);
        return ResponseEntity.ok(tpoId);
    }

    @DeleteMapping("/{tpoId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteTipoProducto(
            @PathVariable(name = "tpoId") final Integer tpoId) {
        final ReferencedWarning referencedWarning = tipoProductoService.getReferencedWarning(tpoId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        tipoProductoService.delete(tpoId);
        return ResponseEntity.noContent().build();
    }

}
