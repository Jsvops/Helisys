package io.bootify.helisys.service;

import io.bootify.helisys.domain.*;
import io.bootify.helisys.model.ModeloAeronaveDTO;
import io.bootify.helisys.repos.*;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ModeloAeronaveService {

    private final ModeloAeronaveRepository modeloAeronaveRepository;
    private final AeronaveRepository aeronaveRepository;
    private final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository; // Nuevo repositorio

    public ModeloAeronaveService(
        final ModeloAeronaveRepository modeloAeronaveRepository,
        final AeronaveRepository aeronaveRepository,
        final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository) { // Inyectamos el nuevo repositorio
        this.modeloAeronaveRepository = modeloAeronaveRepository;
        this.aeronaveRepository = aeronaveRepository;
        this.detalleProductoModeloAeronaveRepository = detalleProductoModeloAeronaveRepository;
    }

    public List<ModeloAeronaveDTO> findAll() {
        final List<ModeloAeronave> modeloAeronaves = modeloAeronaveRepository.findAll(Sort.by("mreId"));
        return modeloAeronaves.stream()
            .map(modeloAeronave -> mapToDTO(modeloAeronave, new ModeloAeronaveDTO()))
            .collect(Collectors.toList());
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

    private ModeloAeronaveDTO mapToDTO(final ModeloAeronave modeloAeronave, final ModeloAeronaveDTO modeloAeronaveDTO) {
        modeloAeronaveDTO.setMreId(modeloAeronave.getMreId());
        modeloAeronaveDTO.setMreNombre(modeloAeronave.getMreNombre());
        return modeloAeronaveDTO;
    }

    private ModeloAeronave mapToEntity(final ModeloAeronaveDTO modeloAeronaveDTO, final ModeloAeronave modeloAeronave) {
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
        final DetalleProductoModeloAeronave dpmaMreDetalle = detalleProductoModeloAeronaveRepository.findFirstByDpmaMre(modeloAeronave);
        if (dpmaMreDetalle != null) {
            referencedWarning.setKey("modeloAeronave.detalleProductoModeloAeronave.dpmaMre.referenced");
            referencedWarning.addParam(dpmaMreDetalle.getDpmaId());
            return referencedWarning;
        }
        return null;
    }


    public void relacionarModelos(Producto producto, Set<Integer> modeloIds) {
        if (modeloIds != null) {
            modeloIds.stream().distinct().forEach(id -> {
                ModeloAeronave modelo = modeloAeronaveRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("ModeloAeronave con ID " + id + " no encontrado"));

                DetalleProductoModeloAeronave detalle = new DetalleProductoModeloAeronave();
                detalle.setDpmaPro(producto);
                detalle.setDpmaMre(modelo);
                detalleProductoModeloAeronaveRepository.save(detalle);
            });
        }
    }
}
