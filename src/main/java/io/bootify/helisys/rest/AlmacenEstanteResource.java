package io.bootify.helisys.rest;

import io.bootify.helisys.model.AlmacenEstanteDTO;
import io.bootify.helisys.service.AlmacenEstanteService;
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
@RequestMapping(value = "/api/almacenEstantes", produces = MediaType.APPLICATION_JSON_VALUE)
public class AlmacenEstanteResource {

    private final AlmacenEstanteService almacenEstanteService;

    public AlmacenEstanteResource(final AlmacenEstanteService almacenEstanteService) {
        this.almacenEstanteService = almacenEstanteService;
    }

    @GetMapping
    public ResponseEntity<List<AlmacenEstanteDTO>> getAllAlmacenEstantes() {
        return ResponseEntity.ok(almacenEstanteService.findAll());
    }

    @GetMapping("/{amtId}")
    public ResponseEntity<AlmacenEstanteDTO> getAlmacenEstante(
            @PathVariable(name = "amtId") final Integer amtId) {
        return ResponseEntity.ok(almacenEstanteService.get(amtId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createAlmacenEstante(
            @RequestBody @Valid final AlmacenEstanteDTO almacenEstanteDTO) {
        final Integer createdAmtId = almacenEstanteService.create(almacenEstanteDTO);
        return new ResponseEntity<>(createdAmtId, HttpStatus.CREATED);
    }

    @PutMapping("/{amtId}")
    public ResponseEntity<Integer> updateAlmacenEstante(
            @PathVariable(name = "amtId") final Integer amtId,
            @RequestBody @Valid final AlmacenEstanteDTO almacenEstanteDTO) {
        almacenEstanteService.update(amtId, almacenEstanteDTO);
        return ResponseEntity.ok(amtId);
    }

    @DeleteMapping("/{amtId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteAlmacenEstante(
            @PathVariable(name = "amtId") final Integer amtId) {
        final ReferencedWarning referencedWarning = almacenEstanteService.getReferencedWarning(amtId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        almacenEstanteService.delete(amtId);
        return ResponseEntity.noContent().build();
    }

}
