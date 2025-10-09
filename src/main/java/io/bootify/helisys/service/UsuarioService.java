package io.bootify.helisys.service;

import io.bootify.helisys.domain.Escuadron;
import io.bootify.helisys.domain.Grado;
import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.Usuario;
import io.bootify.helisys.model.UsuarioDTO;
import io.bootify.helisys.repos.EscuadronRepository;
import io.bootify.helisys.repos.GradoRepository;
import io.bootify.helisys.repos.TransaccionRepository;
import io.bootify.helisys.repos.UsuarioRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EscuadronRepository escuadronRepository;
    private final GradoRepository gradoRepository;
    private final TransaccionRepository transaccionRepository;

    public UsuarioService(final UsuarioRepository usuarioRepository,
            final EscuadronRepository escuadronRepository, final GradoRepository gradoRepository,
            final TransaccionRepository transaccionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.escuadronRepository = escuadronRepository;
        this.gradoRepository = gradoRepository;
        this.transaccionRepository = transaccionRepository;
    }

    public Integer findIdByUsername(String username) {
        return usuarioRepository.findByUsrNombre(username)
            .map(Usuario::getUsrId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<UsuarioDTO> findAll() {
        final List<Usuario> usuarios = usuarioRepository.findAll(Sort.by("usrId"));
        return usuarios.stream()
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                .toList();
    }

    public UsuarioDTO get(final Integer usrId) {
        return usuarioRepository.findById(usrId)
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UsuarioDTO usuarioDTO) {
        final Usuario usuario = new Usuario();
        mapToEntity(usuarioDTO, usuario);
        return usuarioRepository.save(usuario).getUsrId();
    }

    public void update(final Integer usrId, final UsuarioDTO usuarioDTO) {
        final Usuario usuario = usuarioRepository.findById(usrId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(usuarioDTO, usuario);
        usuarioRepository.save(usuario);
    }

    public void delete(final Integer usrId) {
        usuarioRepository.deleteById(usrId);
    }

    private UsuarioDTO mapToDTO(final Usuario usuario, final UsuarioDTO usuarioDTO) {
        usuarioDTO.setUsrId(usuario.getUsrId());
        usuarioDTO.setUsrCtIdentidad(usuario.getUsrCtIdentidad());
        usuarioDTO.setUsrCtMilitar(usuario.getUsrCtMilitar());
        usuarioDTO.setUsrNombre(usuario.getUsrNombre());
        usuarioDTO.setUsrApellido(usuario.getUsrApellido());
        usuarioDTO.setUsrDireccion(usuario.getUsrDireccion());
        usuarioDTO.setUsrTelefono(usuario.getUsrTelefono());
        usuarioDTO.setUsrCargo(usuario.getUsrCargo());
        usuarioDTO.setUsrFoto(usuario.getUsrFoto());
        usuarioDTO.setUsrLogin(usuario.getUsrLogin());
        usuarioDTO.setUsrPassword(usuario.getUsrPassword());
        usuarioDTO.setUsrEdn(usuario.getUsrEdn() == null ? null : usuario.getUsrEdn().getEdnId());
        usuarioDTO.setUsrGdo(usuario.getUsrGdo() == null ? null : usuario.getUsrGdo().getGdoId());
        return usuarioDTO;
    }

    private Usuario mapToEntity(final UsuarioDTO usuarioDTO, final Usuario usuario) {
        usuario.setUsrCtIdentidad(usuarioDTO.getUsrCtIdentidad());
        usuario.setUsrCtMilitar(usuarioDTO.getUsrCtMilitar());
        usuario.setUsrNombre(usuarioDTO.getUsrNombre());
        usuario.setUsrApellido(usuarioDTO.getUsrApellido());
        usuario.setUsrDireccion(usuarioDTO.getUsrDireccion());
        usuario.setUsrTelefono(usuarioDTO.getUsrTelefono());
        usuario.setUsrCargo(usuarioDTO.getUsrCargo());
        usuario.setUsrFoto(usuarioDTO.getUsrFoto());
        usuario.setUsrLogin(usuarioDTO.getUsrLogin());
        usuario.setUsrPassword(usuarioDTO.getUsrPassword());
        final Escuadron usrEdn = usuarioDTO.getUsrEdn() == null ? null : escuadronRepository.findById(usuarioDTO.getUsrEdn())
                .orElseThrow(() -> new NotFoundException("usrEdn not found"));
        usuario.setUsrEdn(usrEdn);
        final Grado usrGdo = usuarioDTO.getUsrGdo() == null ? null : gradoRepository.findById(usuarioDTO.getUsrGdo())
                .orElseThrow(() -> new NotFoundException("usrGdo not found"));
        usuario.setUsrGdo(usrGdo);
        return usuario;
    }

    public boolean usrCtIdentidadExists(final Integer usrCtIdentidad) {
        return usuarioRepository.existsByUsrCtIdentidad(usrCtIdentidad);
    }

    public boolean usrCtMilitarExists(final Integer usrCtMilitar) {
        return usuarioRepository.existsByUsrCtMilitar(usrCtMilitar);
    }

    public boolean usrLoginExists(final String usrLogin) {
        return usuarioRepository.existsByUsrLoginIgnoreCase(usrLogin);
    }

    public boolean usrPasswordExists(final String usrPassword) {
        return usuarioRepository.existsByUsrPasswordIgnoreCase(usrPassword);
    }

    public ReferencedWarning getReferencedWarning(final Integer usrId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Usuario usuario = usuarioRepository.findById(usrId)
                .orElseThrow(NotFoundException::new);
        final Transaccion tceUsrTransaccion = transaccionRepository.findFirstByTceUsr(usuario);
        if (tceUsrTransaccion != null) {
            referencedWarning.setKey("usuario.transaccion.tceUsr.referenced");
            referencedWarning.addParam(tceUsrTransaccion.getTceId());
            return referencedWarning;
        }
        return null;
    }

    public Usuario getUsuario(Integer usuarioId) {
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}

