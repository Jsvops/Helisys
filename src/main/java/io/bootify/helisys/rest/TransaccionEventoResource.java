package io.bootify.helisys.rest;

import io.bootify.helisys.model.TransaccionEventoDTO;
import io.bootify.helisys.service.TransaccionEventoService;
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
@RequestMapping(value = "/api/transaccionEventos", produces = MediaType.APPLICATION_JSON_VALUE)
public class TransaccionEventoResource {

    private final TransaccionEventoService transaccionEventoService;

    public TransaccionEventoResource(final TransaccionEventoService transaccionEventoService) {
        this.transaccionEventoService = transaccionEventoService;
    }

    @GetMapping
    public ResponseEntity<List<TransaccionEventoDTO>> getAllTransaccionEventos() {
        return ResponseEntity.ok(transaccionEventoService.findAll());
    }

    @GetMapping("/{tvoId}")
    public ResponseEntity<TransaccionEventoDTO> getTransaccionEvento(
            @PathVariable(name = "tvoId") final Integer tvoId) {
        return ResponseEntity.ok(transaccionEventoService.get(tvoId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createTransaccionEvento(
            @RequestBody @Valid final TransaccionEventoDTO transaccionEventoDTO) {
        final Integer createdTvoId = transaccionEventoService.create(transaccionEventoDTO);
        return new ResponseEntity<>(createdTvoId, HttpStatus.CREATED);
    }

    @PutMapping("/{tvoId}")
    public ResponseEntity<Integer> updateTransaccionEvento(
            @PathVariable(name = "tvoId") final Integer tvoId,
            @RequestBody @Valid final TransaccionEventoDTO transaccionEventoDTO) {
        transaccionEventoService.update(tvoId, transaccionEventoDTO);
        return ResponseEntity.ok(tvoId);
    }

    @DeleteMapping("/{tvoId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteTransaccionEvento(
            @PathVariable(name = "tvoId") final Integer tvoId) {
        final ReferencedWarning referencedWarning = transaccionEventoService.getReferencedWarning(tvoId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        transaccionEventoService.delete(tvoId);
        return ResponseEntity.noContent().build();
    }

}
