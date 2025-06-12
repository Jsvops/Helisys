package io.bootify.helisys.service;

import io.bootify.helisys.domain.*;
import io.bootify.helisys.mapper.ProductoMapper;
import io.bootify.helisys.model.*;
import io.bootify.helisys.repos.*;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


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
    private final TipoProductoService tipoProductoService;
    private final AlmacenContenedorService almacenContenedorService;
    private final ProveedorService proveedorService;
    private final ModeloAeronaveService modeloAeronaveService;
    private final ProductoMapper productoMapper;


    public ProductoService(
        final ProductoRepository productoRepository,
        final TipoProductoRepository tipoProductoRepository,
        final AlmacenContenedorRepository almacenContenedorRepository,
        final ProveedorRepository proveedorRepository,
        final PedidosProductoRepository pedidosProductoRepository,
        final TransaccionesProductoRepository transaccionesProductoRepository,
        final DetalleProductoModeloAeronaveRepository detalleProductoModeloAeronaveRepository,
        final ModeloAeronaveRepository modeloAeronaveRepository,
        final TipoProductoService tipoProductoService,
        final AlmacenContenedorService almacenContenedorService,
        final ProveedorService proveedorService,
        final ModeloAeronaveService modeloAeronaveService,
        final ProductoMapper productoMapper) {

        this.productoRepository = productoRepository;
        this.tipoProductoRepository = tipoProductoRepository;
        this.almacenContenedorRepository = almacenContenedorRepository;
        this.proveedorRepository = proveedorRepository;
        this.pedidosProductoRepository = pedidosProductoRepository;
        this.transaccionesProductoRepository = transaccionesProductoRepository;
        this.detalleProductoModeloAeronaveRepository = detalleProductoModeloAeronaveRepository;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
        this.tipoProductoService = tipoProductoService;
        this.almacenContenedorService = almacenContenedorService;
        this.proveedorService = proveedorService;
        this.modeloAeronaveService = modeloAeronaveService;
        this.productoMapper = productoMapper;
    }


    public List<ProductoDTO> findAll() {
        final List<Producto> productos = productoRepository.findAll(Sort.by("proId"));
        return productos.stream()
            .map(producto -> mapToDTO(producto, new ProductoDTO()))
            .collect(Collectors.toList());
    }

    public Integer create(final ProductoDTO productoDTO) {
        final Producto producto = new Producto();
        mapToEntity(productoDTO, producto);
        return productoRepository.save(producto).getProId();
    }

   ////////////////////////////////////////////////////////////////////
   @Transactional(readOnly = true)
   public ProductResponseDTO get(final Integer proId) {
       Producto producto = productoRepository.findById(proId)
           .orElseThrow(NotFoundException::new);
       return productoMapper.toDto(producto);
   }

    @Transactional
    public void update(final Integer proId, final ProductRequestDTO dto) {
        Producto producto = productoRepository.findById(proId)
            .orElseThrow(NotFoundException::new);

        productoMapper.updateFromDto(dto, producto);

        producto.setProTpo(tipoProductoService.getByIdOrThrow(dto.getProTpo()));
        producto.setProAmc(almacenContenedorService.getByIdOrThrow(dto.getProAmc()));
        producto.setProPve(proveedorService.getByIdOrThrow(dto.getProPve()));

        producto.getDpmaProDetalleProductoModeloAeronaves().clear();

        modeloAeronaveService.relacionarModelos(producto, dto.getModeloAeronaveIds());

        productoRepository.save(producto);
    }

    public void delete(final Integer proId) {
        productoRepository.deleteById(proId);
    }

    public List<ProductViewDTO> findFilteredProducts(String partNumber, String name, String alterPartNumber) {
        return productoRepository.findProducts(partNumber, name, alterPartNumber);
    }

    public List<AlmacenJerarquicoDTO> getAlmacenJerarquico() {
        return almacenContenedorRepository.findAllAlmacenJerarquico();
    }

    // Método para mapear un Producto a un DTO
    private ProductoDTO mapToDTO(final Producto producto, final ProductoDTO productoDTO) {
        productoDTO.setProId(producto.getProId());
        productoDTO.setProNumeroParte(producto.getProNumeroParte());
        productoDTO.setProNombre(producto.getProNombre());
        productoDTO.setProNumeroParteAlterno(producto.getProNumeroParteAlterno());
        productoDTO.setProNumeroSerie(producto.getProNumeroSerie());
        productoDTO.setProUnidades(producto.getProUnidades());

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


    private DetalleProductoModeloAeronaveDTO mapDetalleToDTO(
        final DetalleProductoModeloAeronave detalle,
        final DetalleProductoModeloAeronaveDTO detalleDTO) {
        detalleDTO.setDpmaId(detalle.getDpmaId());
        detalleDTO.setDpmaPro(detalle.getDpmaPro().getProId());
        detalleDTO.setDpmaMre(detalle.getDpmaMre().getMreId());
        return detalleDTO;
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

    @Transactional
    public Integer crearProductoConModelos(ProductRequestDTO dto) {
        if (productoRepository.existsByProNumeroParte(dto.getProNumeroParte())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con ese número de parte.");
        }

        Producto producto = productoMapper.toEntity(dto);
        producto.setProTpo(tipoProductoService.getByIdOrThrow(dto.getProTpo()));
        producto.setProAmc(almacenContenedorService.getByIdOrThrow(dto.getProAmc()));
        producto.setProPve(proveedorService.getByIdOrThrow(dto.getProPve()));
        productoRepository.save(producto);
        modeloAeronaveService.relacionarModelos(producto, dto.getModeloAeronaveIds());

        return producto.getProId();
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> listarProductos(Pageable pageable) {
        return productoRepository.findAll(pageable)
            .map(productoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> listarProductosPorModeloAeronave(Integer modeloAeronaveId, Pageable pageable) {
        return productoRepository.findByModeloAeronaveId(modeloAeronaveId, pageable)
            .map(productoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> listarTodosProductosPorModeloAeronave(Integer modeloAeronaveId) {
        return productoRepository.findByModeloAeronaveId(modeloAeronaveId, Pageable.unpaged())
            .map(productoMapper::toDto)
            .getContent();
    }

}
