package io.bootify.helisys.rest;

import io.bootify.helisys.domain.AlmacenRepisa;
import io.bootify.helisys.model.AlmacenContenedorDTO;
import io.bootify.helisys.repos.AlmacenRepisaRepository;
import io.bootify.helisys.service.AlmacenContenedorService;
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
@RequestMapping(value = "/api/almacenContenedores", produces = MediaType.APPLICATION_JSON_VALUE)
public class AlmacenContenedorResource {

    private final AlmacenContenedorService almacenContenedorService;
    private final AlmacenRepisaRepository almacenRepisaRepository;

    public AlmacenContenedorResource(final AlmacenContenedorService almacenContenedorService,
            final AlmacenRepisaRepository almacenRepisaRepository) {
        this.almacenContenedorService = almacenContenedorService;
        this.almacenRepisaRepository = almacenRepisaRepository;
    }

    @GetMapping
    public ResponseEntity<List<AlmacenContenedorDTO>> getAllAlmacenContenedores() {
        return ResponseEntity.ok(almacenContenedorService.findAll());
    }

    @GetMapping("/{amcId}")
    public ResponseEntity<AlmacenContenedorDTO> getAlmacenContenedor(
            @PathVariable(name = "amcId") final Integer amcId) {
        return ResponseEntity.ok(almacenContenedorService.get(amcId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createAlmacenContenedor(
            @RequestBody @Valid final AlmacenContenedorDTO almacenContenedorDTO) {
        final Integer createdAmcId = almacenContenedorService.create(almacenContenedorDTO);
        return new ResponseEntity<>(createdAmcId, HttpStatus.CREATED);
    }

    @PutMapping("/{amcId}")
    public ResponseEntity<Integer> updateAlmacenContenedor(
            @PathVariable(name = "amcId") final Integer amcId,
            @RequestBody @Valid final AlmacenContenedorDTO almacenContenedorDTO) {
        almacenContenedorService.update(amcId, almacenContenedorDTO);
        return ResponseEntity.ok(amcId);
    }

    @DeleteMapping("/{amcId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteAlmacenContenedor(
            @PathVariable(name = "amcId") final Integer amcId) {
        final ReferencedWarning referencedWarning = almacenContenedorService.getReferencedWarning(amcId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        almacenContenedorService.delete(amcId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/amcAmrValues")
    public ResponseEntity<Map<Integer, String>> getAmcAmrValues() {
        return ResponseEntity.ok(almacenRepisaRepository.findAll(Sort.by("amrId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(AlmacenRepisa::getAmrId, AlmacenRepisa::getAmrNombre)));
    }

}
