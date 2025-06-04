package io.bootify.helisys.service;

import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.TipoProducto;
import io.bootify.helisys.model.TipoProductoDTO;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.repos.TipoProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TipoProductoService {

    private final TipoProductoRepository tipoProductoRepository;
    private final ProductoRepository productoRepository;

    public TipoProductoService(final TipoProductoRepository tipoProductoRepository,
            final ProductoRepository productoRepository) {
        this.tipoProductoRepository = tipoProductoRepository;
        this.productoRepository = productoRepository;
    }

    public List<TipoProductoDTO> findAll() {
        final List<TipoProducto> tipoProductos = tipoProductoRepository.findAll(Sort.by("tpoId"));
        return tipoProductos.stream()
                .map(tipoProducto -> mapToDTO(tipoProducto, new TipoProductoDTO()))
                .toList();
    }

    public TipoProductoDTO get(final Integer tpoId) {
        return tipoProductoRepository.findById(tpoId)
                .map(tipoProducto -> mapToDTO(tipoProducto, new TipoProductoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final TipoProductoDTO tipoProductoDTO) {
        final TipoProducto tipoProducto = new TipoProducto();
        mapToEntity(tipoProductoDTO, tipoProducto);
        return tipoProductoRepository.save(tipoProducto).getTpoId();
    }

    public void update(final Integer tpoId, final TipoProductoDTO tipoProductoDTO) {
        final TipoProducto tipoProducto = tipoProductoRepository.findById(tpoId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(tipoProductoDTO, tipoProducto);
        tipoProductoRepository.save(tipoProducto);
    }

    public void delete(final Integer tpoId) {
        tipoProductoRepository.deleteById(tpoId);
    }

    private TipoProductoDTO mapToDTO(final TipoProducto tipoProducto,
            final TipoProductoDTO tipoProductoDTO) {
        tipoProductoDTO.setTpoId(tipoProducto.getTpoId());
        tipoProductoDTO.setTpoNombreTipo(tipoProducto.getTpoNombreTipo());
        return tipoProductoDTO;
    }

    private TipoProducto mapToEntity(final TipoProductoDTO tipoProductoDTO,
            final TipoProducto tipoProducto) {
        tipoProducto.setTpoNombreTipo(tipoProductoDTO.getTpoNombreTipo());
        return tipoProducto;
    }

    public ReferencedWarning getReferencedWarning(final Integer tpoId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final TipoProducto tipoProducto = tipoProductoRepository.findById(tpoId)
                .orElseThrow(NotFoundException::new);
        final Producto proTpoProducto = productoRepository.findFirstByProTpo(tipoProducto);
        if (proTpoProducto != null) {
            referencedWarning.setKey("tipoProducto.producto.proTpo.referenced");
            referencedWarning.addParam(proTpoProducto.getProId());
            return referencedWarning;
        }
        return null;
    }


    public TipoProducto getByIdOrThrow(Integer id) {
        return tipoProductoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TipoProducto con ID " + id + " no encontrado"));
    }

}
