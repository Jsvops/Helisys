package io.bootify.helisys.rest;

import io.bootify.helisys.model.ProveedorDTO;
import io.bootify.helisys.service.ProveedorService;
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
@RequestMapping(value = "/api/proveedores", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProveedorResource {

    private final ProveedorService proveedorService;

    public ProveedorResource(final ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> getAllProveedores() {
        return ResponseEntity.ok(proveedorService.findAll());
    }

    @GetMapping("/{pveId}")
    public ResponseEntity<ProveedorDTO> getProveedor(
            @PathVariable(name = "pveId") final Integer pveId) {
        return ResponseEntity.ok(proveedorService.get(pveId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createProveedor(
            @RequestBody @Valid final ProveedorDTO proveedorDTO) {
        final Integer createdPveId = proveedorService.create(proveedorDTO);
        return new ResponseEntity<>(createdPveId, HttpStatus.CREATED);
    }

    @PutMapping("/{pveId}")
    public ResponseEntity<Integer> updateProveedor(
            @PathVariable(name = "pveId") final Integer pveId,
            @RequestBody @Valid final ProveedorDTO proveedorDTO) {
        proveedorService.update(pveId, proveedorDTO);
        return ResponseEntity.ok(pveId);
    }

    @DeleteMapping("/{pveId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteProveedor(@PathVariable(name = "pveId") final Integer pveId) {
        final ReferencedWarning referencedWarning = proveedorService.getReferencedWarning(pveId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        proveedorService.delete(pveId);
        return ResponseEntity.noContent().build();
    }

}
