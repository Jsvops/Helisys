package io.bootify.helisys.rest;

import io.bootify.helisys.model.DetalleProductoModeloAeronaveDTO;
import io.bootify.helisys.service.DetalleProductoModeloAeronaveService;
import io.bootify.helisys.util.ReferencedException;
import io.bootify.helisys.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/detalle-producto-modelo-aeronave", produces = MediaType.APPLICATION_JSON_VALUE)
public class DetalleProductoModeloAeronaveResource {

    private final DetalleProductoModeloAeronaveService detalleProductoModeloAeronaveService;

    // Inyectamos el servicio en el constructor
    public DetalleProductoModeloAeronaveResource(
        final DetalleProductoModeloAeronaveService detalleProductoModeloAeronaveService) {
        this.detalleProductoModeloAeronaveService = detalleProductoModeloAeronaveService;
    }

    // Endpoint para obtener todos los detalles
    @GetMapping
    public ResponseEntity<List<DetalleProductoModeloAeronaveDTO>> getAllDetalleProductoModeloAeronaves() {
        return ResponseEntity.ok(detalleProductoModeloAeronaveService.findAll());
    }

    // Endpoint para obtener un detalle por ID
    @GetMapping("/{dpmaId}")
    public ResponseEntity<DetalleProductoModeloAeronaveDTO> getDetalleProductoModeloAeronave(
        @PathVariable(name = "dpmaId") final Integer dpmaId) {
        return ResponseEntity.ok(detalleProductoModeloAeronaveService.get(dpmaId));
    }

    // Endpoint para crear un nuevo detalle
    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createDetalleProductoModeloAeronave(
        @RequestBody @Valid final DetalleProductoModeloAeronaveDTO detalleProductoModeloAeronaveDTO) {
        final Integer createdDpmaId = detalleProductoModeloAeronaveService.create(detalleProductoModeloAeronaveDTO);
        return new ResponseEntity<>(createdDpmaId, HttpStatus.CREATED);
    }

    // Endpoint para actualizar un detalle existente
    @PutMapping("/{dpmaId}")
    public ResponseEntity<Integer> updateDetalleProductoModeloAeronave(
        @PathVariable(name = "dpmaId") final Integer dpmaId,
        @RequestBody @Valid final DetalleProductoModeloAeronaveDTO detalleProductoModeloAeronaveDTO) {
        detalleProductoModeloAeronaveService.update(dpmaId, detalleProductoModeloAeronaveDTO);
        return ResponseEntity.ok(dpmaId);
    }

    // Endpoint para eliminar un detalle
    @DeleteMapping("/{dpmaId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteDetalleProductoModeloAeronave(
        @PathVariable(name = "dpmaId") final Integer dpmaId) {
        // Verificamos si el detalle está siendo referenciado en otras entidades
        final ReferencedWarning referencedWarning = detalleProductoModeloAeronaveService.getReferencedWarning(dpmaId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        detalleProductoModeloAeronaveService.delete(dpmaId);
        return ResponseEntity.noContent().build();
    }
}
