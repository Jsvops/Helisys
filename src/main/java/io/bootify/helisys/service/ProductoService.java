package io.bootify.helisys.service;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.domain.PedidosProducto;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Proveedor;
import io.bootify.helisys.domain.TipoProducto;
import io.bootify.helisys.domain.TransaccionesProducto;
import io.bootify.helisys.model.AlmacenCombinadoDTO;
import io.bootify.helisys.model.ProductViewDTO;
import io.bootify.helisys.model.ProductoDTO;
import io.bootify.helisys.repos.AlmacenContenedorRepository;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.repos.PedidosProductoRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.repos.ProveedorRepository;
import io.bootify.helisys.repos.TipoProductoRepository;
import io.bootify.helisys.repos.TransaccionesProductoRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final AlmacenContenedorRepository almacenContenedorRepository;
    private final ModeloAeronaveRepository modeloAeronaveRepository;
    private final ProveedorRepository proveedorRepository;
    private final PedidosProductoRepository pedidosProductoRepository;
    private final TransaccionesProductoRepository transaccionesProductoRepository;

    public ProductoService(final ProductoRepository productoRepository,
            final TipoProductoRepository tipoProductoRepository,
            final AlmacenContenedorRepository almacenContenedorRepository,
            final ModeloAeronaveRepository modeloAeronaveRepository,
            final ProveedorRepository proveedorRepository,
            final PedidosProductoRepository pedidosProductoRepository,
            final TransaccionesProductoRepository transaccionesProductoRepository) {
        this.productoRepository = productoRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.almacenContenedorRepository = almacenContenedorRepository;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
        this.proveedorRepository = proveedorRepository;
        this.pedidosProductoRepository = pedidosProductoRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
    }

    public List<ProductoDTO> findAll() {
        final List<Producto> productos = productoRepository.findAll(Sort.by("proId"));
        return productos.stream()
                .map(producto -> mapToDTO(producto, new ProductoDTO()))
                .toList();
    }

    public ProductoDTO get(final Integer proId) {
        return productoRepository.findById(proId)
                .map(producto -> mapToDTO(producto, new ProductoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ProductoDTO productoDTO) {
        final Producto producto = new Producto();
        mapToEntity(productoDTO, producto);
        return productoRepository.save(producto).getProId();
    }

    public void update(final Integer proId, final ProductoDTO productoDTO) {
        final Producto producto = productoRepository.findById(proId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(productoDTO, producto);
        productoRepository.save(producto);
    }

    public void delete(final Integer proId) {
        productoRepository.deleteById(proId);
    }

    private ProductoDTO mapToDTO(final Producto producto, final ProductoDTO productoDTO) {
        productoDTO.setProId(producto.getProId());
        productoDTO.setProNumeroParte(producto.getProNumeroParte());
        productoDTO.setProNombre(producto.getProNombre());
        productoDTO.setProNumeroParteAlterno(producto.getProNumeroParteAlterno());
        productoDTO.setProNumeroSerie(producto.getProNumeroSerie());
        productoDTO.setProUnidades(producto.getProUnidades());
        productoDTO.setProFechaVencimiento(producto.getProFechaVencimiento());
        productoDTO.setProTipoDocumento(producto.getProTipoDocumento());
        productoDTO.setProTpo(producto.getProTpo() == null ? null : producto.getProTpo().getTpoId());
        productoDTO.setProAmc(producto.getProAmc() == null ? null : producto.getProAmc().getAmcId());
        productoDTO.setProMre(producto.getProMre() == null ? null : producto.getProMre().getMreId());
        productoDTO.setProPve(producto.getProPve() == null ? null : producto.getProPve().getPveId());
        return productoDTO;
    }

    private Producto mapToEntity(final ProductoDTO productoDTO, final Producto producto) {
        producto.setProNumeroParte(productoDTO.getProNumeroParte());
        producto.setProNombre(productoDTO.getProNombre());
        producto.setProNumeroParteAlterno(productoDTO.getProNumeroParteAlterno());
        producto.setProNumeroSerie(productoDTO.getProNumeroSerie());
        producto.setProUnidades(productoDTO.getProUnidades());
        producto.setProFechaVencimiento(productoDTO.getProFechaVencimiento());
        producto.setProTipoDocumento(productoDTO.getProTipoDocumento());
        final TipoProducto proTpo = productoDTO.getProTpo() == null ? null : tipoProductoRepository.findById(productoDTO.getProTpo())
                .orElseThrow(() -> new NotFoundException("proTpo not found"));
        producto.setProTpo(proTpo);
        final AlmacenContenedor proAmc = productoDTO.getProAmc() == null ? null : almacenContenedorRepository.findById(productoDTO.getProAmc())
                .orElseThrow(() -> new NotFoundException("proAmc not found"));
        producto.setProAmc(proAmc);
        final ModeloAeronave proMre = productoDTO.getProMre() == null ? null : modeloAeronaveRepository.findById(productoDTO.getProMre())
                .orElseThrow(() -> new NotFoundException("proMre not found"));
        producto.setProMre(proMre);
        final Proveedor proPve = productoDTO.getProPve() == null ? null : proveedorRepository.findById(productoDTO.getProPve())
                .orElseThrow(() -> new NotFoundException("proPve not found"));
        producto.setProPve(proPve);
        return producto;
    }

    public ReferencedWarning getReferencedWarning(final Integer proId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Producto producto = productoRepository.findById(proId)
                .orElseThrow(NotFoundException::new);
        final PedidosProducto pptProPedidosProducto = pedidosProductoRepository.findFirstByPptPro(producto);
        if (pptProPedidosProducto != null) {
            referencedWarning.setKey("producto.pedidosProducto.pptPro.referenced");
            referencedWarning.addParam(pptProPedidosProducto.getPptId());
            return referencedWarning;
        }
        final TransaccionesProducto tcoProTransaccionesProducto = transaccionesProductoRepository.findFirstByTcoPro(producto);
        if (tcoProTransaccionesProducto != null) {
            referencedWarning.setKey("producto.transaccionesProducto.tcoPro.referenced");
            referencedWarning.addParam(tcoProTransaccionesProducto.getTcoId());
            return referencedWarning;
        }
        return null;
    }
    // Metodo para buscar con filtros

    public List<ProductViewDTO> findFilteredProducts(String partNumber, String name, String alterPartNumber) {
        return productoRepository.findProducts(partNumber, name, alterPartNumber);
    }

    // Método para obtener las unidades disponibles de un producto
    public int getUnidadesDisponibles(final Integer productoId) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado con ID: " + productoId));
        return producto.getProUnidades(); // Usamos el campo proUnidades
    }

    public List<AlmacenCombinadoDTO> getAlmacenCombinado() {
        return almacenContenedorRepository.findAllAlmacenCombinado();
    }
}
