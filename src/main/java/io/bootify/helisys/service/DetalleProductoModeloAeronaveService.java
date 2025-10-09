package io.bootify.helisys.service;

import io.bootify.helisys.domain.DetalleProductoModeloAeronave;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.model.DetalleProductoModeloAeronaveDTO;
import io.bootify.helisys.repos.DetalleProductoModeloAeronaveRepository;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DetalleProductoModeloAeronaveService {

    private final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository;
    private final ProductoRepository productoRepository;
    private final ModeloAeronaveRepository modeloAeronaveRepository;

    public DetalleProductoModeloAeronaveService(
        final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository,
        final ProductoRepository productoRepository,
        final ModeloAeronaveRepository modeloAeronaveRepository) {

        this.detalleProductoModeloAeronaveRepository = detalleProductoModeloAeronaveRepository;
        this.productoRepository = productoRepository;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
    }

    public List<DetalleProductoModeloAeronaveDTO> findAll() {
        final List<DetalleProductoModeloAeronave> detalles = detalleProductoModeloAeronaveRepository.findAll(Sort.by("dpmaId"));
        return detalles.stream()
            .map(detalle -> mapToDTO(detalle, new DetalleProductoModeloAeronaveDTO()))
            .collect(Collectors.toList());
    }

    public DetalleProductoModeloAeronaveDTO get(final Integer dpmaId) {
        return detalleProductoModeloAeronaveRepository.findById(dpmaId)
            .map(detalle -> mapToDTO(detalle, new DetalleProductoModeloAeronaveDTO()))
            .orElseThrow(NotFoundException::new);
    }

    public Integer create(final DetalleProductoModeloAeronaveDTO detalleProductoModeloAeronaveDTO) {
        final DetalleProductoModeloAeronave detalle = new DetalleProductoModeloAeronave();
        mapToEntity(detalleProductoModeloAeronaveDTO, detalle);
        return detalleProductoModeloAeronaveRepository.save(detalle).getDpmaId();
    }

    public void update(final Integer dpmaId, final DetalleProductoModeloAeronaveDTO detalleProductoModeloAeronaveDTO) {
        final DetalleProductoModeloAeronave detalle = detalleProductoModeloAeronaveRepository.findById(dpmaId)
            .orElseThrow(NotFoundException::new);
        mapToEntity(detalleProductoModeloAeronaveDTO, detalle);
        detalleProductoModeloAeronaveRepository.save(detalle);
    }

    public void delete(final Integer dpmaId) {
        detalleProductoModeloAeronaveRepository.deleteById(dpmaId);
    }

    private DetalleProductoModeloAeronaveDTO mapToDTO(
        final DetalleProductoModeloAeronave detalle, final DetalleProductoModeloAeronaveDTO detalleDTO) {
        detalleDTO.setDpmaId(detalle.getDpmaId());
        detalleDTO.setDpmaPro(detalle.getDpmaPro() == null ? null : detalle.getDpmaPro().getProId());
        detalleDTO.setDpmaMre(detalle.getDpmaMre() == null ? null : detalle.getDpmaMre().getMreId());
        return detalleDTO;
    }

    private DetalleProductoModeloAeronave mapToEntity(
        final DetalleProductoModeloAeronaveDTO detalleDTO, final DetalleProductoModeloAeronave detalle) {
        final Producto dpmaPro = detalleDTO.getDpmaPro() == null ? null : productoRepository.findById(detalleDTO.getDpmaPro())
            .orElseThrow(() -> new NotFoundException("dpmaPro not found"));
        detalle.setDpmaPro(dpmaPro);

        final ModeloAeronave dpmaMre = detalleDTO.getDpmaMre() == null ? null : modeloAeronaveRepository.findById(detalleDTO.getDpmaMre())
            .orElseThrow(() -> new NotFoundException("dpmaMre not found"));
        detalle.setDpmaMre(dpmaMre);

        return detalle;
    }

    public ReferencedWarning getReferencedWarning(final Integer dpmaId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final DetalleProductoModeloAeronave detalle = detalleProductoModeloAeronaveRepository.findById(dpmaId)
            .orElseThrow(NotFoundException::new);
        return referencedWarning;
    }
}
