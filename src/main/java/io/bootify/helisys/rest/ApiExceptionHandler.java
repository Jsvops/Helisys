package io.bootify.helisys.rest;

import io.bootify.helisys.util.InsufficientStockException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiExceptionHandler {

    @ExceptionHandler(InsufficientStockException.class)
    public ProblemDetail handleInsufficientStock(InsufficientStockException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        pd.setTitle("Stock insuficiente");
        pd.setDetail(ex.getMessage());
        pd.setProperty("code", "INSUFFICIENT_STOCK");
        pd.setProperty("disponible", ex.getDisponible());
        pd.setProperty("solicitado", ex.getSolicitado());
        return pd;
    }
}
