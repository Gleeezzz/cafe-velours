package com.cafevelours.order_service.controller;

import com.cafevelours.order_service.client.PaymentClient;
import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.model.Discount;
import com.cafevelours.order_service.repository.OrderRepository;
import com.cafevelours.order_service.repository.UserRepository;
import com.cafevelours.order_service.repository.DiscountRepository;
import com.cafevelours.order_service.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // INJECTIONS DE DÉPENDANCES SÉCURISÉES
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductClient productClient;  // Client OpenFeign vers Product-Service
    private final PaymentClient paymentClient; // Client OpenFeign vers Payment-Service
    private final DiscountRepository discountRepository; // Dépôt NoSQL (MongoDB) pour les règles de remises
    private final OrderService orderService;
    private final PasswordEncoder passwordEncoder; // BCrypt pour sécuriser les mots de passe

    // UN SEUL CONSTRUCTEUR UNIQUE ET PROPRE
    public OrderController(OrderRepository orderRepository, UserRepository userRepository,
                           ProductClient productClient, PaymentClient paymentClient,
                           DiscountRepository discountRepository, OrderService orderService,
                           PasswordEncoder passwordEncoder) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productClient = productClient;
        this.paymentClient = paymentClient;
        this.discountRepository = discountRepository;
        this.orderService = orderService;
        this.passwordEncoder = passwordEncoder;
    }


    // SIGN UP : Inscription unique avec hachage du mot de passe (RGPD & Sécurité)
    // → Pour respecter les directives de la CNIL et du RGPD.
    // Stocker un mot de passe en clair dans une base de données est une faille de sécurité majeure. `passwordEncoder.encode()`
    // utilise l'algorithme BCrypt, qui génère un sel aléatoire et un hachage à sens unique (impossible à inverser en cas de fuite de la base de données SQL).
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String rawPassword = body.get("password");
        // Vérification d'unicité de l'identifiant pour éviter les doublons de comptes/
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setMemberSince(LocalDate.now());

        // Hachage à sens unique avant insertion SQL
        String hashedPassword = passwordEncoder.encode(rawPassword);
        newUser.setPassword(hashedPassword);

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // SIGN IN : Connexion unique sécurisée avec comparaison de Hash
    // → On utilise `passwordEncoder.matches(en_clair, hash_bdd)`.
    // On ne décrypte jamais le hash. À la place, l'algorithme prend le mot de passe en clair saisi par l'utilisateur,
    // lui applique le même algorithme (avec le sel extrait du hash de la BDD), et compare si les empreintes numériques finales concordent.
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String rawPassword = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Comparaison sécurisée du password en clair fourni avec le hash SQL
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // GET /api/orders/users/{id} → Extraction des informations du profil utilisateur    @GetMapping("/users/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

    // GET /api/orders/user/{userId} → Historique commandes
    // → C'est un mécanisme d'enrichissement de DTO ou d'hydratation asynchrone client-serveur.
    // La table de commande SQL ne stocke que les identifiants techniques des produits (`productId`).
    // Pour afficher un historique lisible à l'utilisateur, l'Order-Service appelle dynamiquement le client OpenFeign
    // `productClient.getProductById()` pour récupérer le nom réel du produit depuis la base du `Product-Service`.
    @GetMapping("/user/{userId}")
    public List<Order> getUserOrderHistory(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utilisateur introuvable avec l'id : " + userId);
        }

        List<Order> orders = orderRepository.findByUser_Id(userId);

        for (Order order : orders) {
            // Partie 1 : Application dynamique de la remise lue depuis MongoDB
            if (order.getTotalAmount() != null) {
                Optional<Discount> discountOpt = discountRepository
                        .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(order.getTotalAmount());

                if (discountOpt.isPresent()) {
                    System.out.println("Discount");
                    double rate = discountOpt.get().getDiscountRate();
                    order.setDiscountRate(rate);
                    order.setFinalAmount(order.getTotalAmount() * (1 - rate));
                } else {
                    System.out.println("No Discount");
                    order.setDiscountRate(0.0);
                    order.setFinalAmount(order.getTotalAmount());
                }
            }

            // Partie 2 : Hydratation OpenFeign avec gestion de la résilience
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    try {
                        ProductDTO product = productClient.getProductById(item.getProductId());
                        item.setProductName(product.getName());
                    } catch (Exception e) {
                        item.setProductName("Produit Catalogue Indisponible");
                    }
                }
            }
        }
        return orders;
    }

    // GET /api/orders/discount-preview?amount=X → Prévisualisation de la remise applicable
// → Expose la même source de vérité (MongoDB) que celle utilisée lors de la création réelle
//   de la commande. Le frontend n'a plus à deviner ou dupliquer la règle métier : il interroge
//   ce endpoint pour savoir exactement quel taux s'appliquera au moment du paiement.
    @GetMapping("/discount-preview")
    public ResponseEntity<Map<String, Object>> getDiscountPreview(@RequestParam double amount) {
        Optional<Discount> discountOpt = discountRepository
                .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(amount);

        double rate = discountOpt.map(Discount::getDiscountRate).orElse(0.0);
        double discountAmount = amount * rate;
        double finalAmount = amount - discountAmount;

        Map<String, Object> response = new HashMap<>();
        response.put("subtotal", amount);
        response.put("discountRate", rate);
        response.put("discountAmount", discountAmount);
        response.put("finalAmount", finalAmount);

        return ResponseEntity.ok(response);
    }

    // POST /api/orders → Passer une commande
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) body.get("items");

            // Étape 1 : Initialisation de la commande (MySQL)
            Order order = orderService.createOrder(cartItems, userId);
            double finalAmountCalculated = order.getTotalAmount() != null ? order.getTotalAmount() : 0.0;

            // Étape 2 : Recherche de réduction (MongoDB) avec gestion de panne isolée
            try {
                Optional<Discount> discountOpt = discountRepository
                        .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(finalAmountCalculated);

                if (discountOpt.isPresent()) {
                    double rate = discountOpt.get().getDiscountRate();
                    order.setDiscountRate(rate);
                    finalAmountCalculated = finalAmountCalculated * (1 - rate);
                }
            } catch (Exception mongoEx) {
                // 🛡️ Si le serveur MongoDB est inaccessible, le client peut quand même commander !
                // L'application ignore la remise mais valide le panier.
                System.out.println("⚠️ MongoDB indisponible, on continue sans remise : " + mongoEx.getMessage());
            }

            order.setFinalAmount(finalAmountCalculated);
            order = orderRepository.save(order);

            // Étape 3 : Traitement du paiement synchrone via OpenFeign
            try {
                paymentClient.processPayment(order.getId(), finalAmountCalculated);
                order.setStatus("PAID");
            } catch (Exception paymentEx) {
                // Si le service de paiement échoue ou subit un timeout réseau, la commande n'est pas perdue ! Elle est sauvegardée avec le statut 'PAYMENT_FAILED'
                // afin d'être re-traitée ultérieurement sans forcer l'utilisateur à refaire son panier.
                System.out.println("⚠️ Payment-service indisponible, commande enregistrée en attente : " + paymentEx.getMessage());
                order.setStatus("PAYMENT_FAILED");
            }

            return new ResponseEntity<>(orderRepository.save(order), HttpStatus.CREATED);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE /api/orders/users/{id} → Suppression de compte (RGPD)
    // → Pour respecter le Règlement Général sur la Protection des Données (RGPD), l'utilisateur doit pouvoir supprimer ses données personnelles.
    // Techniquement, pour éviter de violer les contraintes de clés étrangères (Foreign Keys SQL),
    // la méthode supprime d'abord en cascade toutes les commandes rattachées à cet identifiant (`orderRepository.deleteAll(userOrders)`)
    // avant de supprimer définitivement la ligne de l'utilisateur de la table `User`.
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserAccount(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur introuvable avec l'id : " + id);
            }

            // Suppression en cascade manuelle pour préserver la cohérence transactionnelle de la BDD
            List<Order> userOrders = orderRepository.findByUser_Id(id);
            if (userOrders != null && !userOrders.isEmpty()) {
                orderRepository.deleteAll(userOrders);
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok().body(Map.of("message", "Compte supprimé avec succès"));

        } catch (Exception e) {
            System.err.println("Erreur lors de la suppression du compte : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur lors de la suppression.");
        }
    }
}