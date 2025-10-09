package io.bootify.helisys.rest;

import io.bootify.helisys.model.ModeloAeronaveDTO;
import io.bootify.helisys.service.ModeloAeronaveService;
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
@RequestMapping(value = "/api/modeloAeronaves", produces = MediaType.APPLICATION_JSON_VALUE)
public class ModeloAeronaveResource {

    private final ModeloAeronaveService modeloAeronaveService;

    public ModeloAeronaveResource(final ModeloAeronaveService modeloAeronaveService) {
        this.modeloAeronaveService = modeloAeronaveService;
    }

    @GetMapping
    public ResponseEntity<List<ModeloAeronaveDTO>> getAllModeloAeronaves() {
        return ResponseEntity.ok(modeloAeronaveService.findAll());
    }

    @GetMapping("/{mreId}")
    public ResponseEntity<ModeloAeronaveDTO> getModeloAeronave(
        @PathVariable(name = "mreId") final Integer mreId) {
        return ResponseEntity.ok(modeloAeronaveService.get(mreId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createModeloAeronave(
        @RequestBody @Valid final ModeloAeronaveDTO modeloAeronaveDTO) {
        final Integer createdMreId = modeloAeronaveService.create(modeloAeronaveDTO);
        return new ResponseEntity<>(createdMreId, HttpStatus.CREATED);
    }

    @PutMapping("/{mreId}")
    public ResponseEntity<Integer> updateModeloAeronave(
        @PathVariable(name = "mreId") final Integer mreId,
        @RequestBody @Valid final ModeloAeronaveDTO modeloAeronaveDTO) {
        modeloAeronaveService.update(mreId, modeloAeronaveDTO);
        return ResponseEntity.ok(mreId);
    }

    @DeleteMapping("/{mreId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteModeloAeronave(
        @PathVariable(name = "mreId") final Integer mreId) {
        final ReferencedWarning referencedWarning = modeloAeronaveService.getReferencedWarning(mreId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        modeloAeronaveService.delete(mreId);
        return ResponseEntity.noContent().build();
    }
}
