package io.bootify.helisys.rest;

import io.bootify.helisys.domain.AlmacenEstante;
import io.bootify.helisys.model.AlmacenRepisaDTO;
import io.bootify.helisys.repos.AlmacenEstanteRepository;
import io.bootify.helisys.service.AlmacenRepisaService;
import io.bootify.helisys.util.CustomCollectors;
import io.bootify.helisys.util.ReferencedException;
import io.bootify.helisys.util.ReferencedWarning;
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
@RequestMapping(value = "/api/almacenRepisas", produces = MediaType.APPLICATION_JSON_VALUE)
public class AlmacenRepisaResource {

    private final AlmacenRepisaService almacenRepisaService;
    private final AlmacenEstanteRepository almacenEstanteRepository;

    public AlmacenRepisaResource(final AlmacenRepisaService almacenRepisaService,
            final AlmacenEstanteRepository almacenEstanteRepository) {
        this.almacenRepisaService = almacenRepisaService;
        this.almacenEstanteRepository = almacenEstanteRepository;
    }

    @GetMapping
    public ResponseEntity<List<AlmacenRepisaDTO>> getAllAlmacenRepisas() {
        return ResponseEntity.ok(almacenRepisaService.findAll());
    }

    @GetMapping("/{amrId}")
    public ResponseEntity<AlmacenRepisaDTO> getAlmacenRepisa(
            @PathVariable(name = "amrId") final Integer amrId) {
        return ResponseEntity.ok(almacenRepisaService.get(amrId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createAlmacenRepisa(
            @RequestBody @Valid final AlmacenRepisaDTO almacenRepisaDTO) {
        final Integer createdAmrId = almacenRepisaService.create(almacenRepisaDTO);
        return new ResponseEntity<>(createdAmrId, HttpStatus.CREATED);
    }

    @PutMapping("/{amrId}")
    public ResponseEntity<Integer> updateAlmacenRepisa(
            @PathVariable(name = "amrId") final Integer amrId,
            @RequestBody @Valid final AlmacenRepisaDTO almacenRepisaDTO) {
        almacenRepisaService.update(amrId, almacenRepisaDTO);
        return ResponseEntity.ok(amrId);
    }

    @DeleteMapping("/{amrId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteAlmacenRepisa(
            @PathVariable(name = "amrId") final Integer amrId) {
        final ReferencedWarning referencedWarning = almacenRepisaService.getReferencedWarning(amrId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        almacenRepisaService.delete(amrId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/amrAmtValues")
    public ResponseEntity<Map<Integer, String>> getAmrAmtValues() {
        return ResponseEntity.ok(almacenEstanteRepository.findAll(Sort.by("amtId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(AlmacenEstante::getAmtId, AlmacenEstante::getAmtDescripcion)));
    }

}
