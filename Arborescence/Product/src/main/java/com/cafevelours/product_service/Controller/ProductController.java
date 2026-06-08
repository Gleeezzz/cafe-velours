package com.cafevelours.product_service.Controller; // Exemple de package

import com.cafevelours.product_service.Repository.ProductRepository;
import com.cafevelours.product_service.model.Product;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products") // 🎯 AJOUTE LE PREFIXE ICI pour s'aligner sur la Gateway !
//@CrossOrigin(origins = "*")
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

    // 💡 Route pour AJOUTER un nouveau produit dans la base Docker !
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}