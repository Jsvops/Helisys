package io.bootify.helisys.service;

import io.bootify.helisys.model.ProductResponseDTO;
import io.bootify.helisys.util.PaginadorUtil;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Service
public class ReportePdfService {

    private final TemplateEngine templateEngine;

    public ReportePdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateReporteTransacciones(List<Map<String, Object>> transacciones, String fechaInicio, String fechaFin) {
        List<List<Map<String, Object>>> transaccionesPaginadas = PaginadorUtil.dividirBloques(transacciones, 11);

        Context context = new Context();
        context.setVariable("transaccionesPaginadas", transaccionesPaginadas);
        context.setVariable("fechaInicio", fechaInicio);
        context.setVariable("fechaFin", fechaFin);

        return generarPdfDesdeTemplate("reporte-transacciones", context);
    }

    public byte[] generateReporteProductos(List<ProductResponseDTO> productos, String nombreModelo) {
        List<List<ProductResponseDTO>> productosPaginados = PaginadorUtil.dividirBloques(productos, 10);

        Context context = new Context();
        context.setVariable("productosPaginados", productosPaginados);
        context.setVariable("nombreModeloAeronave", nombreModelo);

        return generarPdfDesdeTemplate("reporte-productos-modelo", context);
    }


    private byte[] generarPdfDesdeTemplate(String templateName, Context context) {
        try {
            String htmlContent = templateEngine.process(templateName, context);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream, true);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage(), e);
        }
    }
}
