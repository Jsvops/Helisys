package io.bootify.helisys.service;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.AlmacenEstante;
import io.bootify.helisys.domain.AlmacenRepisa;
import io.bootify.helisys.model.AlmacenRepisaDTO;
import io.bootify.helisys.repos.AlmacenContenedorRepository;
import io.bootify.helisys.repos.AlmacenEstanteRepository;
import io.bootify.helisys.repos.AlmacenRepisaRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class AlmacenRepisaService {

    private final AlmacenRepisaRepository almacenRepisaRepository;
    private final AlmacenEstanteRepository almacenEstanteRepository;
    private final AlmacenContenedorRepository almacenContenedorRepository;

    public AlmacenRepisaService(final AlmacenRepisaRepository almacenRepisaRepository,
            final AlmacenEstanteRepository almacenEstanteRepository,
            final AlmacenContenedorRepository almacenContenedorRepository) {
        this.almacenRepisaRepository = almacenRepisaRepository;
        this.almacenEstanteRepository = almacenEstanteRepository;
        this.almacenContenedorRepository = almacenContenedorRepository;
    }

    public List<AlmacenRepisaDTO> findAll() {
        final List<AlmacenRepisa> almacenRepisas = almacenRepisaRepository.findAll(Sort.by("amrId"));
        return almacenRepisas.stream()
                .map(almacenRepisa -> mapToDTO(almacenRepisa, new AlmacenRepisaDTO()))
                .toList();
    }

    public AlmacenRepisaDTO get(final Integer amrId) {
        return almacenRepisaRepository.findById(amrId)
                .map(almacenRepisa -> mapToDTO(almacenRepisa, new AlmacenRepisaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final AlmacenRepisaDTO almacenRepisaDTO) {
        final AlmacenRepisa almacenRepisa = new AlmacenRepisa();
        mapToEntity(almacenRepisaDTO, almacenRepisa);
        return almacenRepisaRepository.save(almacenRepisa).getAmrId();
    }

    public void update(final Integer amrId, final AlmacenRepisaDTO almacenRepisaDTO) {
        final AlmacenRepisa almacenRepisa = almacenRepisaRepository.findById(amrId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(almacenRepisaDTO, almacenRepisa);
        almacenRepisaRepository.save(almacenRepisa);
    }

    public void delete(final Integer amrId) {
        almacenRepisaRepository.deleteById(amrId);
    }

    private AlmacenRepisaDTO mapToDTO(final AlmacenRepisa almacenRepisa,
            final AlmacenRepisaDTO almacenRepisaDTO) {
        almacenRepisaDTO.setAmrId(almacenRepisa.getAmrId());
        almacenRepisaDTO.setAmrNombre(almacenRepisa.getAmrNombre());
        almacenRepisaDTO.setAmrAmt(almacenRepisa.getAmrAmt() == null ? null : almacenRepisa.getAmrAmt().getAmtId());
        return almacenRepisaDTO;
    }

    private AlmacenRepisa mapToEntity(final AlmacenRepisaDTO almacenRepisaDTO,
            final AlmacenRepisa almacenRepisa) {
        almacenRepisa.setAmrNombre(almacenRepisaDTO.getAmrNombre());
        final AlmacenEstante amrAmt = almacenRepisaDTO.getAmrAmt() == null ? null : almacenEstanteRepository.findById(almacenRepisaDTO.getAmrAmt())
                .orElseThrow(() -> new NotFoundException("amrAmt not found"));
        almacenRepisa.setAmrAmt(amrAmt);
        return almacenRepisa;
    }

    public ReferencedWarning getReferencedWarning(final Integer amrId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final AlmacenRepisa almacenRepisa = almacenRepisaRepository.findById(amrId)
                .orElseThrow(NotFoundException::new);
        final AlmacenContenedor amcAmrAlmacenContenedor = almacenContenedorRepository.findFirstByAmcAmr(almacenRepisa);
        if (amcAmrAlmacenContenedor != null) {
            referencedWarning.setKey("almacenRepisa.almacenContenedor.amcAmr.referenced");
            referencedWarning.addParam(amcAmrAlmacenContenedor.getAmcId());
            return referencedWarning;
        }
        return null;
    }

}
