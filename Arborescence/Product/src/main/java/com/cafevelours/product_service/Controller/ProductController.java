package com.cafevelours.product_service.Controller;

import com.cafevelours.product_service.model.Product;
import com.cafevelours.product_service.Repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Route pour avoir TOUT le catalogue (Avec un G majuscule !)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Route pour filtrer par catégorie (Avec un G majuscule !)
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productRepository.findByCategory(category);
    }

    // Route pour voir les détails d'un seul produit (Avec un G majuscule !)
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable avec l'id : " + id));
    }
}