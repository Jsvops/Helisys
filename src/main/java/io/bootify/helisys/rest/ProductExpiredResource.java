package io.bootify.helisys.rest;

import io.bootify.helisys.model.ProductExpiredResponseDTO;
import io.bootify.helisys.service.LoteTransaccionProductoDetalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/list")
@RequiredArgsConstructor
public class ProductExpiredResource {

    private final LoteTransaccionProductoDetalleService service;

    @GetMapping("/")
    public ResponseEntity<List<ProductExpiredResponseDTO>> ListProductsExpiringInTwoYears() {
        return ResponseEntity.ok(service.ListProductsExpiringInTwoYears());
    }
}



