package io.bootify.helisys.rest;

import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.model.AeronaveDTO;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.service.AeronaveService;
import io.bootify.helisys.util.CustomCollectors;
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
@RequestMapping(value = "/api/aeronaves", produces = MediaType.APPLICATION_JSON_VALUE)
public class AeronaveResource {

    private final AeronaveService aeronaveService;
    private final ModeloAeronaveRepository modeloAeronaveRepository;

    public AeronaveResource(final AeronaveService aeronaveService,
            final ModeloAeronaveRepository modeloAeronaveRepository) {
        this.aeronaveService = aeronaveService;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
    }

    @GetMapping
    public ResponseEntity<List<AeronaveDTO>> getAllAeronaves() {
        return ResponseEntity.ok(aeronaveService.findAll());
    }

    @GetMapping("/{anvId}")
    public ResponseEntity<AeronaveDTO> getAeronave(
            @PathVariable(name = "anvId") final Integer anvId) {
        return ResponseEntity.ok(aeronaveService.get(anvId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createAeronave(
            @RequestBody @Valid final AeronaveDTO aeronaveDTO) {
        final Integer createdAnvId = aeronaveService.create(aeronaveDTO);
        return new ResponseEntity<>(createdAnvId, HttpStatus.CREATED);
    }

    @PutMapping("/{anvId}")
    public ResponseEntity<Integer> updateAeronave(@PathVariable(name = "anvId") final Integer anvId,
            @RequestBody @Valid final AeronaveDTO aeronaveDTO) {
        aeronaveService.update(anvId, aeronaveDTO);
        return ResponseEntity.ok(anvId);
    }

    @DeleteMapping("/{anvId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteAeronave(@PathVariable(name = "anvId") final Integer anvId) {
        aeronaveService.delete(anvId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/anvMreValues")
    public ResponseEntity<Map<Integer, String>> getAnvMreValues() {
        return ResponseEntity.ok(modeloAeronaveRepository.findAll(Sort.by("mreId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ModeloAeronave::getMreId, ModeloAeronave::getMreNombre)));
    }

}
