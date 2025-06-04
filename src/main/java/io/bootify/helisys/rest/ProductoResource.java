package io.bootify.helisys.rest;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.Proveedor;
import io.bootify.helisys.domain.TipoProducto;
import io.bootify.helisys.model.*;
import io.bootify.helisys.repos.AlmacenContenedorRepository;
import io.bootify.helisys.repos.ProveedorRepository;
import io.bootify.helisys.repos.TipoProductoRepository;
import io.bootify.helisys.service.ProductoService;
import io.bootify.helisys.util.CustomCollectors;
import io.bootify.helisys.util.ReferencedException;
import io.bootify.helisys.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/productos", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductoResource {

    private final ProductoService productoService;
    private final TipoProductoRepository tipoProductoRepository;
    private final AlmacenContenedorRepository almacenContenedorRepository;
    private final ProveedorRepository proveedorRepository;

    public ProductoResource(
        final ProductoService productoService,
        final TipoProductoRepository tipoProductoRepository,
        final AlmacenContenedorRepository almacenContenedorRepository,
        final ProveedorRepository proveedorRepository) {
        this.productoService = productoService;
        this.tipoProductoRepository = tipoProductoRepository;
        this.almacenContenedorRepository = almacenContenedorRepository;
        this.proveedorRepository = proveedorRepository;
    }


    // Endpoint para obtener todos los productos
    @GetMapping
    public Page<ProductResponseDTO> listarProductos(Pageable pageable) {
        return productoService.listarProductos(pageable);
    }

    @GetMapping("/filtrar-por-modelo")
    public Page<ProductResponseDTO> listarPorModeloAeronave(
        @RequestParam Integer modeloAeronaveId,
        Pageable pageable) {
        return productoService.listarProductosPorModeloAeronave(modeloAeronaveId, pageable);
    }


    // Endpoint para obtener un producto por ID
    @GetMapping("/{proId}")
    public ResponseEntity<ProductoDTO> getProducto(
        @PathVariable(name = "proId") final Integer proId) {
        return ResponseEntity.ok(productoService.get(proId));
    }

    // Endpoint para crear un producto
    @PostMapping("/")
    public ResponseEntity<Integer> crearProducto(@RequestBody @Valid ProductRequestDTO requestDTO) {
        Integer productoId = productoService.crearProductoConModelos(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoId);
    }

    // Endpoint para actualizar un producto
    @PutMapping("/{proId}")
    public ResponseEntity<Integer> updateProducto(
        @PathVariable(name = "proId") final Integer proId,
        @RequestBody @Valid final ProductoDTO productoDTO) {
        productoService.update(proId, productoDTO);
        return ResponseEntity.ok(proId);
    }

    // Endpoint para eliminar un producto
    @DeleteMapping("/{proId}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteProducto(
        @PathVariable(name = "proId") final Integer proId) {
        final ReferencedWarning referencedWarning = productoService.getReferencedWarning(proId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        productoService.delete(proId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para obtener valores de TipoProducto
    @GetMapping("/proTpoValues")
    public ResponseEntity<Map<Integer, String>> getProTpoValues() {
        return ResponseEntity.ok(tipoProductoRepository.findAll(Sort.by("tpoId"))
            .stream()
            .collect(CustomCollectors.toSortedMap(TipoProducto::getTpoId, TipoProducto::getTpoNombreTipo)));
    }

    // Endpoint para obtener valores de AlmacenContenedor
    @GetMapping("/proAmcValues")
    public ResponseEntity<Map<Integer, String>> getProAmcValues() {
        return ResponseEntity.ok(almacenContenedorRepository.findAll(Sort.by("amcId"))
            .stream()
            .collect(CustomCollectors.toSortedMap(AlmacenContenedor::getAmcId, AlmacenContenedor::getAmcNumero)));
    }

    // Endpoint para obtener valores de Proveedor
    @GetMapping("/proPveValues")
    public ResponseEntity<Map<Integer, String>> getProPveValues() {
        return ResponseEntity.ok(proveedorRepository.findAll(Sort.by("pveId"))
            .stream()
            .collect(CustomCollectors.toSortedMap(Proveedor::getPveId, Proveedor::getPveNombre)));
    }

    // Endpoint para obtener datos combinados de almacén
    @GetMapping("/almacen-combinado")
    public ResponseEntity<List<AlmacenCombinadoDTO>> getAlmacenCombinado() {
        List<AlmacenCombinadoDTO> datosCombinados = productoService.getAlmacenCombinado();
        return ResponseEntity.ok(datosCombinados);
    }

    @GetMapping("/{proId}/modelos")
    public ResponseEntity<List<DetalleProductoModeloAeronaveDTO>> getModelosByProductoId(
        @PathVariable(name = "proId") final Integer proId) {
        List<DetalleProductoModeloAeronaveDTO> detalles = productoService.getModelosByProductoId(proId);
        return ResponseEntity.ok(detalles);
    }

    @PutMapping("/{proId}/modelos")
    public ResponseEntity<Void> updateModelosByProductoId(
        @PathVariable(name = "proId") final Integer proId,
        @RequestBody List<Integer> mreIds) {
        productoService.updateModelosByProductoId(proId, mreIds);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para buscar productos filtrados
    @GetMapping("/search")
    public ResponseEntity<List<ProductViewDTO>> findFilteredProducts(
        @RequestParam(name = "partNumber", required = false) String partNumber,
        @RequestParam(name = "name", required = false) String name,
        @RequestParam(name = "alterPartNumber", required = false) String alterPartNumber) {
        List<ProductViewDTO> products = productoService.findFilteredProducts(partNumber, name, alterPartNumber);
        return ResponseEntity.ok(products);
    }

    // Endpoint para obtener unidades disponibles
    @GetMapping("/{id}/unidades-disponibles")
    public ResponseEntity<Integer> getUnidadesDisponibles(@PathVariable(name = "id") final Integer id) {
        int unidadesDisponibles = productoService.getUnidadesDisponibles(id);
        return ResponseEntity.ok(unidadesDisponibles);
    }
}



