package com.cafevelours.order_service.client;

import com.cafevelours.order_service.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Le nom doit correspondre EXACTEMENT au "spring.application.name" de ton product-service dans Eureka
@FeignClient(name = "product-service")
public interface ProductClient {

    // On calque la route exacte du contrôleur de ton Product-Service
    @GetMapping("/api/products/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);
}
