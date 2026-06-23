package com.cafevelours.product_service.Controller;  // Contrôleur REST — expose les endpoints HTTP du Product-Service
//            Reçoit les requêtes HTTP → appelle le repository → retourne du JSON

import com.cafevelours.product_service.Repository.ProductRepository;
// → C'est une combinaison de @Controller + @ResponseBody.
//   @Controller = composant Spring qui gère les requêtes HTTP.
//   @ResponseBody = les valeurs retournées par les méthodes sont
//   automatiquement sérialisées en JSON par Jackson et mises dans le body HTTP.
import com.cafevelours.product_service.model.Product;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
// → Déclare cette classe comme contrôleur REST Spring.
//   Toutes les méthodes retournent du JSON automatiquement.

@RequestMapping("/api/products") // 🎯 AJOUTE LE PREFIXE ICI pour s'aligner sur la Gateway !
//@CrossOrigin(origins = "*")// Note : @CrossOrigin est commenté car la Gateway gère déjà les CORS.
public class ProductController {
    // → final garantit que la référence ne peut pas être réassignée après
    //   l'injection. C'est une bonne pratique pour les dépendances injectées :
    //   on s'assure qu'elles ne changent pas pendant la vie de l'objet.

    private final ProductRepository productRepository;  // C'est aussi appelé INJECTION DE DÉPENDANCES (DI - Dependency Injection).

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {// → Mappe les requêtes HTTP GET sur /api/products vers cette méthode.
        //   Équivalent de @RequestMapping(method = RequestMethod.GET).
        //   Le GET est le verbe HTTP pour LIRE des données (sans modifier).
        return productRepository.findAll();
    }  // → JpaRepository génère : SELECT * FROM products
    //   Retourne tous les produits avec leurs tastingNotes (JOIN automatique
    //   sur product_tasting_notes grâce à @ElementCollection).
    //   Jackson sérialise la List<Product> en tableau JSON [{ ... }, { ... }].

    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        // Appelle la méthode personnalisée du repository
        // → génère : SELECT * FROM products WHERE category = ?
        return productRepository.findByCategory(category);
    }
    // → Extrait la valeur dynamique de l'URL.
    //   Ex : GET /api/products/category/Chocolats
    //   → category = "Chocolats" est injecté dans le paramètre String category.
    //   Spring fait le mapping automatiquement entre {category} dans l'URL
    //   et le paramètre @PathVariable String category.

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)// → findById() retourne un Optional<Product> car le produit
                //   peut ne pas exister en base (id inconnu).
                //   Optional est un conteneur Java qui force à gérer explicitement
                //   le cas "valeur absente" → évite les NullPointerException.
                .orElseThrow(() -> new RuntimeException("Produit introuvable avec l'id : " + id));  //→ Si l'Optional est vide (produit introuvable),
        //   on lève une RuntimeException avec un message explicite.
        //   Spring retourne alors une réponse HTTP 500.
        //   En production, on utiliserait une exception personnalisée
    }

    // 💡 Route pour AJOUTER un nouveau produit dans la base Docker !
    @PostMapping
    // → Mappe les requêtes HTTP POST sur /api/products.
    //   POST est le verbe HTTP pour CRÉER une nouvelle ressource.
    //   Le corps de la requête (body) contient le JSON du produit à créer.
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }// → Indique à Spring de désérialiser le corps JSON de la requête HTTP
    //   en objet Java Product. C'est Jackson qui fait la conversion.

     //→ Si product.id == null  → INSERT INTO products (...)
    //   Si product.id != null  → UPDATE products SET ... WHERE id = ?
    //   Spring Data JPA détecte automatiquement si c'est un insert ou update.
    //   Retourne le produit sauvegardé avec son id généré par MySQL.

}