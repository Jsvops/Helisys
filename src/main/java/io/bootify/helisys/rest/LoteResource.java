package io.bootify.helisys.rest;

import io.bootify.helisys.model.LoteDTO;
import io.bootify.helisys.service.LoteService;
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
@RequestMapping(value = "/api/lotes", produces = MediaType.APPLICATION_JSON_VALUE)
public class LoteResource {

    private final LoteService loteService;

    public LoteResource(final LoteService loteService) {
        this.loteService = loteService;
    }

    @GetMapping
    public ResponseEntity<List<LoteDTO>> getAllLotes() {
        return ResponseEntity.ok(loteService.findAll());
    }

    @GetMapping("/{ltId}")
    public ResponseEntity<LoteDTO> getLote(@PathVariable(name = "ltId") final Integer ltId) {
        return ResponseEntity.ok(loteService.get(ltId));
    }

    @PostMapping
    public ResponseEntity<Integer> createLote(@RequestBody @Valid final LoteDTO loteDTO) {
        final Integer createdLtId = loteService.create(loteDTO);
        return new ResponseEntity<>(createdLtId, HttpStatus.CREATED);
    }

    @PutMapping("/{ltId}")
    public ResponseEntity<Integer> updateLote(@PathVariable(name = "ltId") final Integer ltId,
                                              @RequestBody @Valid final LoteDTO loteDTO) {
        loteService.update(ltId, loteDTO);
        return ResponseEntity.ok(ltId);
    }

    @DeleteMapping("/{ltId}")
    public ResponseEntity<Void> deleteLote(@PathVariable(name = "ltId") final Integer ltId) {
        final ReferencedWarning referencedWarning = loteService.getReferencedWarning(ltId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        loteService.delete(ltId);
        return ResponseEntity.noContent().build();
    }

}
