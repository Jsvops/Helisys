package io.bootify.helisys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generatePdf(List<Map<String, Object>> transacciones, String fechaInicio, String fechaFin) {
        try {
            // Dividir la lista de transacciones en grupos de 8
            List<List<Map<String, Object>>> transaccionesPaginadas = dividirEnBloques(transacciones, 8);

            // Crear el contexto de Thymeleaf
            Context context = new Context();
            context.setVariable("transaccionesPaginadas", transaccionesPaginadas);
            context.setVariable("fechaInicio", fechaInicio);
            context.setVariable("fechaFin", fechaFin);

            // Procesar la plantilla Thymeleaf
            String htmlContent = templateEngine.process("reporte-transacciones", context);

            // Generar el PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream, true); // Cierra el documento automáticamente

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage(), e);
        }
    }

    private List<List<Map<String, Object>>> dividirEnBloques(List<Map<String, Object>> lista, int tamañoBloque) {
        List<List<Map<String, Object>>> bloques = new ArrayList<>();
        for (int i = 0; i < lista.size(); i += tamañoBloque) {
            bloques.add(lista.subList(i, Math.min(i + tamañoBloque, lista.size())));
        }
        return bloques;
    }
}
