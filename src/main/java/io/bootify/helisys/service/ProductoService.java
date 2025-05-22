package io.bootify.helisys.service;

import io.bootify.helisys.domain.*;
import io.bootify.helisys.model.*;
import io.bootify.helisys.repos.*;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final AlmacenContenedorRepository almacenContenedorRepository;
    private final ProveedorRepository proveedorRepository;
    private final PedidosProductoRepository pedidosProductoRepository;
    private final TransaccionesProductoRepository transaccionesProductoRepository;
    private final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository;
    private final ModeloAeronaveRepository modeloAeronaveRepository;

    public ProductoService(
        final ProductoRepository productoRepository,
        final TipoProductoRepository tipoProductoRepository,
        final AlmacenContenedorRepository almacenContenedorRepository,
        final ProveedorRepository proveedorRepository,
        final PedidosProductoRepository pedidosProductoRepository,
        final TransaccionesProductoRepository transaccionesProductoRepository,
        final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository,
        final ModeloAeronaveRepository modeloAeronaveRepository) {
        this.productoRepository = productoRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.almacenContenedorRepository = almacenContenedorRepository;
        this.proveedorRepository = proveedorRepository;
        this.pedidosProductoRepository = pedidosProductoRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
        this.detalleProductoModeloAeronaveRepository = detalleProductoModeloAeronaveRepository;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
    }

    // Método para obtener todos los productos
    public List<ProductoDTO> findAll() {
        final List<Producto> productos = productoRepository.findAll(Sort.by("proId"));
        return productos.stream()
            .map(producto -> mapToDTO(producto, new ProductoDTO()))
            .collect(Collectors.toList());
    }

    // Método para obtener un producto por ID
    public ProductoDTO get(final Integer proId) {
        return productoRepository.findById(proId)
            .map(producto -> mapToDTO(producto, new ProductoDTO()))
            .orElseThrow(NotFoundException::new);
    }

    // Método para crear un producto
    public Integer create(final ProductoDTO productoDTO) {
        final Producto producto = new Producto();
        mapToEntity(productoDTO, producto);
        return productoRepository.save(producto).getProId();
    }

    // Método para actualizar un producto
    public void update(final Integer proId, final ProductoDTO productoDTO) {
        final Producto producto = productoRepository.findById(proId)
            .orElseThrow(NotFoundException::new);
        mapToEntity(productoDTO, producto);
        productoRepository.save(producto);
    }

    // Método para eliminar un producto
    public void delete(final Integer proId) {
        productoRepository.deleteById(proId);
    }

    // Método para obtener las unidades disponibles de un producto
    public int getUnidadesDisponibles(final Integer productoId) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado con ID: " + productoId));
        return producto.getProUnidades();
    }

    // Método para obtener los modelos de aeronave asociados a un producto
    public List<DetalleProductoModeloAeronaveDTO> getModelosByProductoId(final Integer proId) {
        // Buscar el producto por ID
        Producto producto = productoRepository.findById(proId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado con ID: " + proId));

        // Obtener los detalles de la relación producto-modelo aeronave
        List<DetalleProductoModeloAeronave> detalles = detalleProductoModeloAeronaveRepository.findByDpmaPro(producto);

        // Mapear los detalles a DTOs
        return detalles.stream()
            .map(detalle -> mapDetalleToDTO(detalle, new DetalleProductoModeloAeronaveDTO()))
            .collect(Collectors.toList());
    }

    // Método para actualizar los modelos de aeronave asociados a un producto
    @Transactional // Añadir esta anotación
    public void updateModelosByProductoId(final Integer proId, final List<Integer> mreIds) {
        // Buscar el producto por ID
        Producto producto = productoRepository.findById(proId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado con ID: " + proId));

        // Eliminar las relaciones existentes para este producto
        detalleProductoModeloAeronaveRepository.deleteByDpmaPro(producto);

        // Crear nuevas relaciones con los modelos de aeronave seleccionados
        for (Integer mreId : mreIds) {
            // Buscar el modelo de aeronave por ID
            ModeloAeronave modeloAeronave = modeloAeronaveRepository.findById(mreId)
                .orElseThrow(() -> new NotFoundException("Modelo de aeronave no encontrado con ID: " + mreId));

            // Crear la nueva relación
            DetalleProductoModeloAeronave detalle = new DetalleProductoModeloAeronave();
            detalle.setDpmaPro(producto);
            detalle.setDpmaMre(modeloAeronave);

            // Guardar la relación
            detalleProductoModeloAeronaveRepository.save(detalle);
        }
    }

    // Método para buscar productos filtrados
    public List<ProductViewDTO> findFilteredProducts(String partNumber, String name, String alterPartNumber) {
        return productoRepository.findProducts(partNumber, name, alterPartNumber);
    }

    // Método para obtener datos combinados de almacén
    public List<AlmacenCombinadoDTO> getAlmacenCombinado() {
        return almacenContenedorRepository.findAllAlmacenCombinado();
    }

    // Método para mapear un Producto a un DTO
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
        productoDTO.setProPve(producto.getProPve() == null ? null : producto.getProPve().getPveId());
        return productoDTO;
    }

    // Método para mapear un DTO a un Producto
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
        final Proveedor proPve = productoDTO.getProPve() == null ? null : proveedorRepository.findById(productoDTO.getProPve())
            .orElseThrow(() -> new NotFoundException("proPve not found"));
        producto.setProPve(proPve);
        return producto;
    }

    // Método para mapear un DetalleProductoModeloAeronave a un DTO
    private DetalleProductoModeloAeronaveDTO mapDetalleToDTO(
        final DetalleProductoModeloAeronave detalle,
        final DetalleProductoModeloAeronaveDTO detalleDTO) {
        detalleDTO.setDpmaId(detalle.getDpmaId());
        detalleDTO.setDpmaPro(detalle.getDpmaPro().getProId());
        detalleDTO.setDpmaMre(detalle.getDpmaMre().getMreId());
        return detalleDTO;
    }

    // Método para obtener advertencias de referencia
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


    public List<ProductoExpiradoDTO> findProductosVencidosYPorVencer() {
        LocalDate hoy = LocalDate.now();
        LocalDate enUnAnio = hoy.plusYears(1);
        return productoRepository.findProductosVencidosYPorVencer(hoy, enUnAnio);
    }
    //Metodo que esta siendo llamado en el TransaccionService.java para la obtencion de la entidad
    public Producto getProducto(Integer id) {
        return productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public void StockDisponible(Integer productoId, Integer cantidad) {
        Producto producto = getProducto(productoId);
        if (producto.getProUnidades() < cantidad) {
            throw new RuntimeException(String.format(
                "No hay suficiente stock para realizar la baja. Disponible: %d, Solicitado: %d",
                producto.getProUnidades(), cantidad));
        }
    }

    public void aumentarStock(Integer productoId, Integer cantidad) {
        Producto producto = getProducto(productoId);
        producto.setProUnidades(producto.getProUnidades() + cantidad);
        productoRepository.save(producto);
    }

    public void reducirStock(Integer productoId, Integer cantidad) {
        Producto producto = getProducto(productoId);
        producto.setProUnidades(producto.getProUnidades() - cantidad);
        productoRepository.save(producto);
    }
}
