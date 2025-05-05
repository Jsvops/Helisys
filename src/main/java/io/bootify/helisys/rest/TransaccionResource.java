package io.bootify.helisys.rest;

import io.bootify.helisys.domain.TransaccionEvento;
import io.bootify.helisys.domain.Usuario;
import io.bootify.helisys.model.TransaccionCompletaDTO;
import io.bootify.helisys.model.TransaccionDTO;
import io.bootify.helisys.repos.TransaccionEventoRepository;
import io.bootify.helisys.repos.UsuarioRepository;
import io.bootify.helisys.service.TransaccionService;
import io.bootify.helisys.util.CustomCollectors;
import io.bootify.helisys.util.ReferencedException;
import io.bootify.helisys.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/transacciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class TransaccionResource {

    private final TransaccionService transaccionService;
    private final TransaccionEventoRepository transaccionEventoRepository;
    private final UsuarioRepository usuarioRepository;

    public TransaccionResource(final TransaccionService transaccionService,
                               final TransaccionEventoRepository transaccionEventoRepository,
                               final UsuarioRepository usuarioRepository) {
        this.transaccionService = transaccionService;
        this.transaccionEventoRepository = transaccionEventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<TransaccionDTO>> getAllTransacciones() {
        return ResponseEntity.ok(transaccionService.findAll());
    }

    @GetMapping("/{tceId}")
    public ResponseEntity<TransaccionDTO> getTransaccion(
        @PathVariable(name = "tceId") final Integer tceId) {
        return ResponseEntity.ok(transaccionService.get(tceId));
    }


    @PostMapping("/completa")
    @Operation(summary = "Crear una transacción completa con todos sus componentes")
    @ApiResponse(responseCode = "201", description = "Transacción completa creada exitosamente")
    public ResponseEntity<Integer> createTransaccionCompleta(
        @RequestBody @Valid final TransaccionCompletaDTO transaccionCompletaDTO) {

        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Busca el ID del usuario
        Usuario usuario = usuarioRepository.findByUsrNombre(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Procesa la transacción completa
        final Integer createdTceId = transaccionService.procesarTransaccionCompleta(
            transaccionCompletaDTO, usuario.getUsrId());

        return new ResponseEntity<>(createdTceId, HttpStatus.CREATED);
    }

    @PutMapping("/{tceId}")
    public ResponseEntity<Integer> updateTransaccion(
        @PathVariable(name = "tceId") final Integer tceId,
        @RequestBody @Valid final TransaccionDTO transaccionDTO) {
        transaccionService.update(tceId, transaccionDTO);
        return ResponseEntity.ok(tceId);
    }

    @DeleteMapping("/{tceId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteTransaccion(
        @PathVariable(name = "tceId") final Integer tceId) {
        final ReferencedWarning referencedWarning = transaccionService.getReferencedWarning(tceId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        transaccionService.delete(tceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tceTvoValues")
    public ResponseEntity<Map<Integer, String>> getTceTvoValues() {
        return ResponseEntity.ok(transaccionEventoRepository.findAll(Sort.by("tvoId"))
            .stream()
            .collect(CustomCollectors.toSortedMap(TransaccionEvento::getTvoId, TransaccionEvento::getTvoEvento)));
    }

    @GetMapping("/tceUsrValues")
    public ResponseEntity<Map<Integer, String>> getTceUsrValues() {
        return ResponseEntity.ok(usuarioRepository.findAll(Sort.by("usrId"))
            .stream()
            .collect(CustomCollectors.toSortedMap(Usuario::getUsrId, Usuario::getUsrNombre)));
    }

    @GetMapping("/last")
    public ResponseEntity<TransaccionDTO> getLastTransaccion() {
        TransaccionDTO lastTransaccion = transaccionService.getLastTransaccion();
        return ResponseEntity.ok(lastTransaccion);
    }
}
