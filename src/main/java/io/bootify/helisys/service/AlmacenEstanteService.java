package io.bootify.helisys.service;

import io.bootify.helisys.domain.AlmacenEstante;
import io.bootify.helisys.domain.AlmacenRepisa;
import io.bootify.helisys.model.AlmacenEstanteDTO;
import io.bootify.helisys.repos.AlmacenEstanteRepository;
import io.bootify.helisys.repos.AlmacenRepisaRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class AlmacenEstanteService {

    private final AlmacenEstanteRepository almacenEstanteRepository;
    private final AlmacenRepisaRepository almacenRepisaRepository;

    public AlmacenEstanteService(final AlmacenEstanteRepository almacenEstanteRepository,
            final AlmacenRepisaRepository almacenRepisaRepository) {
        this.almacenEstanteRepository = almacenEstanteRepository;
        this.almacenRepisaRepository = almacenRepisaRepository;
    }

    public List<AlmacenEstanteDTO> findAll() {
        final List<AlmacenEstante> almacenEstantes = almacenEstanteRepository.findAll(Sort.by("amtId"));
        return almacenEstantes.stream()
                .map(almacenEstante -> mapToDTO(almacenEstante, new AlmacenEstanteDTO()))
                .toList();
    }

    public AlmacenEstanteDTO get(final Integer amtId) {
        return almacenEstanteRepository.findById(amtId)
                .map(almacenEstante -> mapToDTO(almacenEstante, new AlmacenEstanteDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final AlmacenEstanteDTO almacenEstanteDTO) {
        final AlmacenEstante almacenEstante = new AlmacenEstante();
        mapToEntity(almacenEstanteDTO, almacenEstante);
        return almacenEstanteRepository.save(almacenEstante).getAmtId();
    }

    public void update(final Integer amtId, final AlmacenEstanteDTO almacenEstanteDTO) {
        final AlmacenEstante almacenEstante = almacenEstanteRepository.findById(amtId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(almacenEstanteDTO, almacenEstante);
        almacenEstanteRepository.save(almacenEstante);
    }

    public void delete(final Integer amtId) {
        almacenEstanteRepository.deleteById(amtId);
    }

    private AlmacenEstanteDTO mapToDTO(final AlmacenEstante almacenEstante,
            final AlmacenEstanteDTO almacenEstanteDTO) {
        almacenEstanteDTO.setAmtId(almacenEstante.getAmtId());
        almacenEstanteDTO.setAmtDescripcion(almacenEstante.getAmtDescripcion());
        return almacenEstanteDTO;
    }

    private AlmacenEstante mapToEntity(final AlmacenEstanteDTO almacenEstanteDTO,
            final AlmacenEstante almacenEstante) {
        almacenEstante.setAmtDescripcion(almacenEstanteDTO.getAmtDescripcion());
        return almacenEstante;
    }

    public ReferencedWarning getReferencedWarning(final Integer amtId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final AlmacenEstante almacenEstante = almacenEstanteRepository.findById(amtId)
                .orElseThrow(NotFoundException::new);
        final AlmacenRepisa amrAmtAlmacenRepisa = almacenRepisaRepository.findFirstByAmrAmt(almacenEstante);
        if (amrAmtAlmacenRepisa != null) {
            referencedWarning.setKey("almacenEstante.almacenRepisa.amrAmt.referenced");
            referencedWarning.addParam(amrAmtAlmacenRepisa.getAmrId());
            return referencedWarning;
        }
        return null;
    }

}
