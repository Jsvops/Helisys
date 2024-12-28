package io.bootify.helisys.rest;

import io.bootify.helisys.domain.Escuadron;
import io.bootify.helisys.domain.Grado;
import io.bootify.helisys.model.UsuarioDTO;
import io.bootify.helisys.repos.EscuadronRepository;
import io.bootify.helisys.repos.GradoRepository;
import io.bootify.helisys.service.UsuarioService;
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
@RequestMapping(value = "/api/usuarios", produces = MediaType.APPLICATION_JSON_VALUE)
public class UsuarioResource {

    private final UsuarioService usuarioService;
    private final EscuadronRepository escuadronRepository;
    private final GradoRepository gradoRepository;

    public UsuarioResource(final UsuarioService usuarioService,
            final EscuadronRepository escuadronRepository, final GradoRepository gradoRepository) {
        this.usuarioService = usuarioService;
        this.escuadronRepository = escuadronRepository;
        this.gradoRepository = gradoRepository;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{usrId}")
    public ResponseEntity<UsuarioDTO> getUsuario(
            @PathVariable(name = "usrId") final Integer usrId) {
        return ResponseEntity.ok(usuarioService.get(usrId));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Integer> createUsuario(@RequestBody @Valid final UsuarioDTO usuarioDTO) {
        final Integer createdUsrId = usuarioService.create(usuarioDTO);
        return new ResponseEntity<>(createdUsrId, HttpStatus.CREATED);
    }

    @PutMapping("/{usrId}")
    public ResponseEntity<Integer> updateUsuario(@PathVariable(name = "usrId") final Integer usrId,
            @RequestBody @Valid final UsuarioDTO usuarioDTO) {
        usuarioService.update(usrId, usuarioDTO);
        return ResponseEntity.ok(usrId);
    }

    @DeleteMapping("/{usrId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteUsuario(@PathVariable(name = "usrId") final Integer usrId) {
        final ReferencedWarning referencedWarning = usuarioService.getReferencedWarning(usrId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        usuarioService.delete(usrId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usrEdnValues")
    public ResponseEntity<Map<Integer, String>> getUsrEdnValues() {
        return ResponseEntity.ok(escuadronRepository.findAll(Sort.by("ednId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Escuadron::getEdnId, Escuadron::getEdnNombre)));
    }

    @GetMapping("/usrGdoValues")
    public ResponseEntity<Map<Integer, String>> getUsrGdoValues() {
        return ResponseEntity.ok(gradoRepository.findAll(Sort.by("gdoId"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Grado::getGdoId, Grado::getGdoNombre)));
    }

}
