package com.cafevelours.order_service.client;

import com.cafevelours.order_service.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
// → Déclare cette interface comme un client Feign qui cible le service
//   nommé "product-service". Ce nom doit correspondre EXACTEMENT à la
//   propriété spring.application.name dans le application.properties
//   du Product-Service.
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Le nom doit correspondre EXACTEMENT au "spring.application.name" de ton product-service dans Eureka
@FeignClient(name = "product-service")
// → On calque exactement le mapping du ProductController côté Product-Service.
//   @GetMapping("/api/products/{id}") ici → correspond à
//   @GetMapping("/{id}") dans ProductController avec @RequestMapping("/api/products").
//   Feign construit l'URL complète : http://product-service/api/products/{id}
//   et remplace {id} par la valeur du paramètre @PathVariable.
public interface ProductClient {

    // On calque la route exacte du contrôleur de ton Product-Service
    @GetMapping("/api/products/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);
}
// → Feign lève une FeignException (ou ConnectException).
//   Dans l'OrderController et l'OrderService, on gère ça avec un try-catch
//   pour afficher "Produit Catalogue Indisponible" en fallback.
//   En production, on ajouterait un @FeignClient avec fallback class
//   (pattern Circuit Breaker avec Resilience4j) pour gérer ça proprement.
