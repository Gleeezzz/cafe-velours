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

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // INJECTIONS DE DÉPENDANCES SÉCURISÉES
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final DiscountRepository discountRepository;
    private final OrderService orderService;
    private final PasswordEncoder passwordEncoder; // Injection de l'encodeur BCrypt

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

    // 🔐 SIGN UP : Inscription unique avec hachage du mot de passe (RGPD & Sécurité)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String rawPassword = body.get("password");

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

    // 🔑 SIGN IN : Connexion unique sécurisée avec comparaison de Hash
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

    // GET /api/orders/users/{id} → Profil utilisateur
    @GetMapping("/users/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

    // GET /api/orders/user/{userId} → Historique commandes
    @GetMapping("/user/{userId}")
    public List<Order> getUserOrderHistory(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utilisateur introuvable avec l'id : " + userId);
        }

        List<Order> orders = orderRepository.findByUser_Id(userId);

        for (Order order : orders) {
            if (order.getTotalAmount() != null) {
                Optional<Discount> discountOpt = discountRepository
                        .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(order.getTotalAmount());

                if (discountOpt.isPresent()) {
                    double rate = discountOpt.get().getDiscountRate();
                    order.setDiscountRate(rate);
                    order.setFinalAmount(order.getTotalAmount() * (1 - rate));
                } else {
                    order.setDiscountRate(0.0);
                    order.setFinalAmount(order.getTotalAmount());
                }
            }

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

    // POST /api/orders → Passer une commande
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) body.get("items");

            Order order = orderService.createOrder(cartItems, userId);
            double finalAmountCalculated = order.getTotalAmount() != null ? order.getTotalAmount() : 45.40;
            order.setDiscountRate(0.0);

            try {
                if (discountRepository != null) {
                    Optional<Discount> discountOpt = discountRepository
                            .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(finalAmountCalculated);

                    if (discountOpt.isPresent()) {
                        double rate = discountOpt.get().getDiscountRate();
                        order.setDiscountRate(rate);
                        finalAmountCalculated = finalAmountCalculated * (1 - rate);
                    }
                }
            } catch (Exception mongoEx) {
                System.out.println("⚠️ MongoDB indisponible, on continue sans remise : " + mongoEx.getMessage());
            }

            order.setFinalAmount(finalAmountCalculated);
            order = orderRepository.save(order);

            try {
                paymentClient.processPayment(order.getId(), finalAmountCalculated);
                order.setStatus("PAID");
            } catch (Exception paymentEx) {
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
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserAccount(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur introuvable avec l'id : " + id);
            }

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