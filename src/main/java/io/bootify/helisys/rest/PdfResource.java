package io.bootify.helisys.rest;

import io.bootify.helisys.service.PdfService;
import io.bootify.helisys.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private PdfService pdfService;

    @Autowired
    private TransaccionService transaccionService;

    @GetMapping("/generar-pdf")
    public ResponseEntity<byte[]> generarPdf(
        @RequestParam String fechaInicio,
        @RequestParam String fechaFin) {

        // Convertir las fechas de String a LocalDate
        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);

        // Obtener las transacciones filtradas por rango de fechas
        List<Map<String, Object>> transacciones = transaccionService.getTransaccionesByFecha(inicio, fin);

        // Generar el PDF
        byte[] pdfBytes = pdfService.generatePdf(transacciones, fechaInicio, fechaFin);

        // Configurar las cabeceras de la respuesta
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "reporte-transacciones.pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
