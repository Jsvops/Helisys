package io.bootify.helisys.service;

import io.bootify.helisys.domain.Aeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.model.ModeloAeronaveDTO;
import io.bootify.helisys.repos.AeronaveRepository;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ModeloAeronaveService {

    private final ModeloAeronaveRepository modeloAeronaveRepository;
    private final AeronaveRepository aeronaveRepository;
    private final ProductoRepository productoRepository;

    public ModeloAeronaveService(final ModeloAeronaveRepository modeloAeronaveRepository,
            final AeronaveRepository aeronaveRepository,
            final ProductoRepository productoRepository) {
        this.modeloAeronaveRepository = modeloAeronaveRepository;
        this.aeronaveRepository = aeronaveRepository;
        this.productoRepository = productoRepository;
    }

    public List<ModeloAeronaveDTO> findAll() {
        final List<ModeloAeronave> modeloAeronaves = modeloAeronaveRepository.findAll(Sort.by("mreId"));
        return modeloAeronaves.stream()
                .map(modeloAeronave -> mapToDTO(modeloAeronave, new ModeloAeronaveDTO()))
                .toList();
    }

    public ModeloAeronaveDTO get(final Integer mreId) {
        return modeloAeronaveRepository.findById(mreId)
                .map(modeloAeronave -> mapToDTO(modeloAeronave, new ModeloAeronaveDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ModeloAeronaveDTO modeloAeronaveDTO) {
        final ModeloAeronave modeloAeronave = new ModeloAeronave();
        mapToEntity(modeloAeronaveDTO, modeloAeronave);
        return modeloAeronaveRepository.save(modeloAeronave).getMreId();
    }

    public void update(final Integer mreId, final ModeloAeronaveDTO modeloAeronaveDTO) {
        final ModeloAeronave modeloAeronave = modeloAeronaveRepository.findById(mreId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(modeloAeronaveDTO, modeloAeronave);
        modeloAeronaveRepository.save(modeloAeronave);
    }

    public void delete(final Integer mreId) {
        modeloAeronaveRepository.deleteById(mreId);
    }

    private ModeloAeronaveDTO mapToDTO(final ModeloAeronave modeloAeronave,
            final ModeloAeronaveDTO modeloAeronaveDTO) {
        modeloAeronaveDTO.setMreId(modeloAeronave.getMreId());
        modeloAeronaveDTO.setMreNombre(modeloAeronave.getMreNombre());
        return modeloAeronaveDTO;
    }

    private ModeloAeronave mapToEntity(final ModeloAeronaveDTO modeloAeronaveDTO,
            final ModeloAeronave modeloAeronave) {
        modeloAeronave.setMreNombre(modeloAeronaveDTO.getMreNombre());
        return modeloAeronave;
    }

    public ReferencedWarning getReferencedWarning(final Integer mreId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ModeloAeronave modeloAeronave = modeloAeronaveRepository.findById(mreId)
                .orElseThrow(NotFoundException::new);
        final Aeronave anvMreAeronave = aeronaveRepository.findFirstByAnvMre(modeloAeronave);
        if (anvMreAeronave != null) {
            referencedWarning.setKey("modeloAeronave.aeronave.anvMre.referenced");
            referencedWarning.addParam(anvMreAeronave.getAnvId());
            return referencedWarning;
        }
        final Producto proMreProducto = productoRepository.findFirstByProMre(modeloAeronave);
        if (proMreProducto != null) {
            referencedWarning.setKey("modeloAeronave.producto.proMre.referenced");
            referencedWarning.addParam(proMreProducto.getProId());
            return referencedWarning;
        }
        return null;
    }

}
