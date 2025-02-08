package io.bootify.helisys.service;

import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Transaccion;
import io.bootify.helisys.domain.TransaccionesProducto;
import io.bootify.helisys.model.TransaccionesProductoDTO;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.repos.TransaccionRepository;
import io.bootify.helisys.repos.TransaccionesProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TransaccionesProductoService {

    private final TransaccionesProductoRepository transaccionesProductoRepository;
    private final ProductoRepository productoRepository;
    private final TransaccionRepository transaccionRepository;

    public TransaccionesProductoService(
        final TransaccionesProductoRepository transaccionesProductoRepository,
        final ProductoRepository productoRepository,
        final TransaccionRepository transaccionRepository) {
        this.transaccionesProductoRepository = transaccionesProductoRepository;
        this.productoRepository = productoRepository;
        this.transaccionRepository = transaccionRepository;
    }

    public List<TransaccionesProductoDTO> findAll() {
        final List<TransaccionesProducto> transaccionesProductos = transaccionesProductoRepository.findAll(Sort.by("tcoId"));
        return transaccionesProductos.stream()
            .map(transaccionesProducto -> mapToDTO(transaccionesProducto, new TransaccionesProductoDTO()))
            .toList();
    }

    public TransaccionesProductoDTO get(final Integer tcoId) {
        return transaccionesProductoRepository.findById(tcoId)
            .map(transaccionesProducto -> mapToDTO(transaccionesProducto, new TransaccionesProductoDTO()))
            .orElseThrow(NotFoundException::new);
    }

    public Integer create(final TransaccionesProductoDTO transaccionesProductoDTO) {
        final TransaccionesProducto transaccionesProducto = new TransaccionesProducto();
        mapToEntity(transaccionesProductoDTO, transaccionesProducto);
        return transaccionesProductoRepository.save(transaccionesProducto).getTcoId();
    }

    public void update(final Integer tcoId, final TransaccionesProductoDTO transaccionesProductoDTO) {
        final TransaccionesProducto transaccionesProducto = transaccionesProductoRepository.findById(tcoId)
            .orElseThrow(NotFoundException::new);
        mapToEntity(transaccionesProductoDTO, transaccionesProducto);
        transaccionesProductoRepository.save(transaccionesProducto);
    }

    public void delete(final Integer tcoId) {
        transaccionesProductoRepository.deleteById(tcoId);
    }

    private TransaccionesProductoDTO mapToDTO(final TransaccionesProducto transaccionesProducto,
                                              final TransaccionesProductoDTO transaccionesProductoDTO) {
        transaccionesProductoDTO.setTcoId(transaccionesProducto.getTcoId());
        transaccionesProductoDTO.setTcoUnidades(transaccionesProducto.getTcoUnidades());
        // Convertimos el id del producto a String para el DTO
        transaccionesProductoDTO.setTcoPro(transaccionesProducto.getTcoPro() == null
            ? null
            : String.valueOf(transaccionesProducto.getTcoPro().getProId()));
        transaccionesProductoDTO.setTcoTce(transaccionesProducto.getTcoTce() == null
            ? null
            : transaccionesProducto.getTcoTce().getTceId());
        return transaccionesProductoDTO;
    }

    private TransaccionesProducto mapToEntity(
        final TransaccionesProductoDTO transaccionesProductoDTO,
        final TransaccionesProducto transaccionesProducto) {
        transaccionesProducto.setTcoUnidades(transaccionesProductoDTO.getTcoUnidades());

        // Se convierte el campo tcoPro de String a Producto utilizando casting
        Producto tcoPro = null;
        if (transaccionesProductoDTO.getTcoPro() != null) {
            try {
                // Se intenta convertir el String a Integer (id numérico)
                Integer proId = Integer.valueOf(transaccionesProductoDTO.getTcoPro());
                tcoPro = productoRepository.findById(proId)
                    .orElseThrow(() -> new NotFoundException("Producto not found with id " + proId));
            } catch (NumberFormatException e) {
                // Si el valor no es numérico, se asume que es un código alfanumérico y se busca por dicho código.
                tcoPro = productoRepository.findByProNumeroParte(transaccionesProductoDTO.getTcoPro())
                    .orElseThrow(() -> new NotFoundException("Producto not found with part number " + transaccionesProductoDTO.getTcoPro()));

            }
        }
        transaccionesProducto.setTcoPro(tcoPro);

        final Transaccion tcoTce = transaccionesProductoDTO.getTcoTce() == null
            ? null
            : transaccionRepository.findById(transaccionesProductoDTO.getTcoTce())
            .orElseThrow(() -> new NotFoundException("tcoTce not found"));
        transaccionesProducto.setTcoTce(tcoTce);

        return transaccionesProducto;
    }
}
