package io.bootify.helisys.service;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.AlmacenRepisa;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.model.AlmacenContenedorDTO;
import io.bootify.helisys.repos.AlmacenContenedorRepository;
import io.bootify.helisys.repos.AlmacenRepisaRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class AlmacenContenedorService {

    private final AlmacenContenedorRepository almacenContenedorRepository;
    private final AlmacenRepisaRepository almacenRepisaRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public AlmacenContenedorService(final AlmacenContenedorRepository almacenContenedorRepository,
    @Lazy
            final AlmacenRepisaRepository almacenRepisaRepository,
            final ProductoRepository productoRepository) {
        this.almacenContenedorRepository = almacenContenedorRepository;
        this.almacenRepisaRepository = almacenRepisaRepository;
        this.productoRepository = productoRepository;
    }

    public List<AlmacenContenedorDTO> findAll() {
        final List<AlmacenContenedor> almacenContenedores = almacenContenedorRepository.findAll(Sort.by("amcId"));
        return almacenContenedores.stream()
                .map(almacenContenedor -> mapToDTO(almacenContenedor, new AlmacenContenedorDTO()))
                .toList();
    }

    public AlmacenContenedorDTO get(final Integer amcId) {
        return almacenContenedorRepository.findById(amcId)
                .map(almacenContenedor -> mapToDTO(almacenContenedor, new AlmacenContenedorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final AlmacenContenedorDTO almacenContenedorDTO) {
        final AlmacenContenedor almacenContenedor = new AlmacenContenedor();
        mapToEntity(almacenContenedorDTO, almacenContenedor);
        return almacenContenedorRepository.save(almacenContenedor).getAmcId();
    }

    public void update(final Integer amcId, final AlmacenContenedorDTO almacenContenedorDTO) {
        final AlmacenContenedor almacenContenedor = almacenContenedorRepository.findById(amcId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(almacenContenedorDTO, almacenContenedor);
        almacenContenedorRepository.save(almacenContenedor);
    }

    public void delete(final Integer amcId) {
        almacenContenedorRepository.deleteById(amcId);
    }

    private AlmacenContenedorDTO mapToDTO(final AlmacenContenedor almacenContenedor,
            final AlmacenContenedorDTO almacenContenedorDTO) {
        almacenContenedorDTO.setAmcId(almacenContenedor.getAmcId());
        almacenContenedorDTO.setAmcNumero(almacenContenedor.getAmcNumero());
        almacenContenedorDTO.setAmcAmr(almacenContenedor.getAmcAmr() == null ? null : almacenContenedor.getAmcAmr().getAmrId());
        return almacenContenedorDTO;
    }

    private AlmacenContenedor mapToEntity(final AlmacenContenedorDTO almacenContenedorDTO,
            final AlmacenContenedor almacenContenedor) {
        almacenContenedor.setAmcNumero(almacenContenedorDTO.getAmcNumero());
        final AlmacenRepisa amcAmr = almacenContenedorDTO.getAmcAmr() == null ? null : almacenRepisaRepository.findById(almacenContenedorDTO.getAmcAmr())
                .orElseThrow(() -> new NotFoundException("amcAmr not found"));
        almacenContenedor.setAmcAmr(amcAmr);
        return almacenContenedor;
    }

    public ReferencedWarning getReferencedWarning(final Integer amcId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final AlmacenContenedor almacenContenedor = almacenContenedorRepository.findById(amcId)
                .orElseThrow(NotFoundException::new);
        final Producto proAmcProducto = productoRepository.findFirstByProAmc(almacenContenedor);
        if (proAmcProducto != null) {
            referencedWarning.setKey("almacenContenedor.producto.proAmc.referenced");
            referencedWarning.addParam(proAmcProducto.getProId());
            return referencedWarning;
        }
        return null;
    }

}
