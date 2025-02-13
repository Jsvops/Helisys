package io.bootify.helisys.service;

import io.bootify.helisys.domain.Aeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.model.AeronaveDTO;
import io.bootify.helisys.repos.AeronaveRepository;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AeronaveService {

    private final AeronaveRepository aeronaveRepository;
    private final ModeloAeronaveRepository modeloAeronaveRepository;

    public AeronaveService(final AeronaveRepository aeronaveRepository,
                           final ModeloAeronaveRepository modeloAeronaveRepository) {
        this.aeronaveRepository = aeronaveRepository;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
    }

    // Método existente para obtener todas las aeronaves
    public List<AeronaveDTO> findAll() {
        final List<Aeronave> aeronaves = aeronaveRepository.findAll(Sort.by("anvId"));
        return aeronaves.stream()
            .map(aeronave -> mapToDTO(aeronave, new AeronaveDTO()))
            .collect(Collectors.toList());
    }

    // Método existente para obtener una aeronave por ID
    public AeronaveDTO get(final Integer anvId) {
        return aeronaveRepository.findById(anvId)
            .map(aeronave -> mapToDTO(aeronave, new AeronaveDTO()))
            .orElseThrow(NotFoundException::new);
    }

    // Método existente para crear una aeronave
    public Integer create(final AeronaveDTO aeronaveDTO) {
        final Aeronave aeronave = new Aeronave();
        mapToEntity(aeronaveDTO, aeronave);
        return aeronaveRepository.save(aeronave).getAnvId();
    }

    // Método existente para actualizar una aeronave
    public void update(final Integer anvId, final AeronaveDTO aeronaveDTO) {
        final Aeronave aeronave = aeronaveRepository.findById(anvId)
            .orElseThrow(NotFoundException::new);
        mapToEntity(aeronaveDTO, aeronave);
        aeronaveRepository.save(aeronave);
    }

    // Método existente para eliminar una aeronave
    public void delete(final Integer anvId) {
        aeronaveRepository.deleteById(anvId);
    }

    // Método existente para verificar si una matrícula existe
    public boolean anvMatriculaExists(final String anvMatricula) {
        return aeronaveRepository.existsByAnvMatriculaIgnoreCase(anvMatricula);
    }

    // Nuevo método para obtener aeronaves compatibles con un producto
    public List<AeronaveDTO> findAeronavesByProductoId(final Integer productoId) {
        final List<Aeronave> aeronaves = aeronaveRepository.findAeronavesByProductoId(productoId);
        if (aeronaves.isEmpty()) {
            throw new NotFoundException("No se encontraron aeronaves compatibles con el producto especificado.");
        }
        return aeronaves.stream()
            .map(aeronave -> mapToDTO(aeronave, new AeronaveDTO()))
            .collect(Collectors.toList());
    }

    // Método existente para mapear una entidad Aeronave a un DTO
    private AeronaveDTO mapToDTO(final Aeronave aeronave, final AeronaveDTO aeronaveDTO) {
        aeronaveDTO.setAnvId(aeronave.getAnvId());
        aeronaveDTO.setAnvMatricula(aeronave.getAnvMatricula());
        aeronaveDTO.setAnvNumeroSerie(aeronave.getAnvNumeroSerie());
        aeronaveDTO.setAnvFabricacion(aeronave.getAnvFabricacion());
        aeronaveDTO.setAnvMre(aeronave.getAnvMre() == null ? null : aeronave.getAnvMre().getMreId());
        return aeronaveDTO;
    }

    // Método existente para mapear un DTO a una entidad Aeronave
    private Aeronave mapToEntity(final AeronaveDTO aeronaveDTO, final Aeronave aeronave) {
        aeronave.setAnvMatricula(aeronaveDTO.getAnvMatricula());
        aeronave.setAnvNumeroSerie(aeronaveDTO.getAnvNumeroSerie());
        aeronave.setAnvFabricacion(aeronaveDTO.getAnvFabricacion());
        final ModeloAeronave anvMre = aeronaveDTO.getAnvMre() == null ? null : modeloAeronaveRepository.findById(aeronaveDTO.getAnvMre())
            .orElseThrow(() -> new NotFoundException("anvMre not found"));
        aeronave.setAnvMre(anvMre);
        return aeronave;
    }
}
