// PdfResource.java
package io.bootify.helisys.rest;

import io.bootify.helisys.model.ProductResponseDTO;
import io.bootify.helisys.repos.ModeloAeronaveRepository;
import io.bootify.helisys.service.ModeloAeronaveService;
import io.bootify.helisys.service.ReportePdfService;
import io.bootify.helisys.service.ProductoService;
import io.bootify.helisys.service.TransaccionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
public class PdfResource {

    private final ReportePdfService reportePdfService;
    private final TransaccionService transaccionService;
    private final ProductoService productoService;
    private final ModeloAeronaveRepository modeloAeronaveRepository;

    public PdfResource(ReportePdfService reportePdfService,
                       TransaccionService transaccionService,
                       ProductoService productoService,
                       ModeloAeronaveRepository modeloAeronaveRepository) {
        this.reportePdfService = reportePdfService;
        this.transaccionService = transaccionService;
        this.productoService = productoService;
        this.modeloAeronaveRepository = modeloAeronaveRepository;
    }

    @GetMapping("/generar-pdf")
    public ResponseEntity<byte[]> generarReporteTransacciones(
        @RequestParam String fechaInicio,
        @RequestParam String fechaFin) {

        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);

        List<Map<String, Object>> transacciones = transaccionService.getTransaccionesByFecha(inicio, fin);
        byte[] reporteTransaccionesPdf = reportePdfService.generateReporteTransacciones(transacciones, fechaInicio, fechaFin);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "reporte-transacciones.pdf");

        return ResponseEntity.ok().headers(headers).body(reporteTransaccionesPdf);
    }

    @GetMapping("/generar-pdf-productos")
    public ResponseEntity<byte[]> generarReporteProductos(@RequestParam Integer modeloAeronaveId) {
        List<ProductResponseDTO> productos = productoService.listarTodosProductosPorModeloAeronave(modeloAeronaveId);
        String nombreModelo = modeloAeronaveRepository.findNombreById(modeloAeronaveId);
        byte[] reporteProductosPdf = reportePdfService.generateReporteProductos(productos, nombreModelo);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "reporte-productos-modelo.pdf");

        return ResponseEntity.ok().headers(headers).body(reporteProductosPdf);
    }

}
