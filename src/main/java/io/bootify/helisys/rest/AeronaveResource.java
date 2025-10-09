package io.bootify.helisys.rest;

import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.model.AeronaveDTO;
import io.bootify.helisys.model.AeronaveResponseDTO;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.service.AeronaveService;
import io.bootify.helisys.util.CustomCollectors;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    @Operation(summary = "Obtener todas las aeronaves")
    public ResponseEntity<List<AeronaveDTO>> getAllAeronaves() {
        return ResponseEntity.ok(aeronaveService.findAll());
    }

    @GetMapping("/{anvId}")
    @Operation(summary = "Obtener una aeronave por ID")
    public ResponseEntity<AeronaveDTO> getAeronave(
        @PathVariable(name = "anvId") final Integer anvId) {
        return ResponseEntity.ok(aeronaveService.get(anvId));
    }

    @PostMapping
    @Operation(summary = "Crear una nueva aeronave")
    @ApiResponse(responseCode = "201", description = "Aeronave creada exitosamente")
    public ResponseEntity<Integer> createAeronave(
        @RequestBody @Valid final AeronaveDTO aeronaveDTO) {
        final Integer createdAnvId = aeronaveService.create(aeronaveDTO);
        return new ResponseEntity<>(createdAnvId, HttpStatus.CREATED);
    }

    @PutMapping("/{anvId}")
    @Operation(summary = "Actualizar una aeronave existente")
    public ResponseEntity<Integer> updateAeronave(@PathVariable(name = "anvId") final Integer anvId,
                                                  @RequestBody @Valid final AeronaveDTO aeronaveDTO) {
        aeronaveService.update(anvId, aeronaveDTO);
        return ResponseEntity.ok(anvId);
    }

    @DeleteMapping("/{anvId}")
    @Operation(summary = "Eliminar una aeronave por ID")
    @ApiResponse(responseCode = "204", description = "Aeronave eliminada exitosamente")
    public ResponseEntity<Void> deleteAeronave(@PathVariable(name = "anvId") final Integer anvId) {
        aeronaveService.delete(anvId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/anvMreValues")
    @Operation(summary = "Obtener valores de modelos de aeronave")
    public ResponseEntity<Map<Integer, String>> getAnvMreValues() {
        return ResponseEntity.ok(modeloAeronaveRepository.findAll(Sort.by("mreId"))
            .stream()
            .collect(CustomCollectors.toSortedMap(ModeloAeronave::getMreId, ModeloAeronave::getMreNombre)));
    }

    @GetMapping("/compatibles")
    @Operation(summary = "Obtener aeronaves compatibles con un producto")
    @ApiResponse(responseCode = "200", description = "Aeronaves compatibles encontradas")
    @ApiResponse(responseCode = "404", description = "No se encontraron aeronaves compatibles")
    public ResponseEntity<List<AeronaveDTO>> getAeronavesCompatibles(
        @RequestParam(name = "productoId") final Integer productoId) {
        List<AeronaveDTO> aeronaves = aeronaveService.findAeronavesByProductoId(productoId);
        return ResponseEntity.ok(aeronaves);
    }

    @GetMapping("/list")
    public List<AeronaveResponseDTO> list() {
        return aeronaveService.findAllForList();
    }
}
