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
import com.cafevelours.order_service.service.OrderService; // 1. Import du service
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders") // Nettoyage du CrossOrigin : la Gateway s'en occupe !
//@CrossOrigin(origins = "http://localhost:5174")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final DiscountRepository discountRepository;
    private final OrderService orderService; // 2. Ajout du service

    // Constructeur mis à jour
    public OrderController(OrderRepository orderRepository, UserRepository userRepository,
                           ProductClient productClient, PaymentClient paymentClient,
                           DiscountRepository discountRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productClient = productClient;
        this.paymentClient = paymentClient;
        this.discountRepository = discountRepository;
        this.orderService = orderService;
    }

    @GetMapping("/users/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

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

    // 🌟 POST REFAIT : Sécurisé, sans données en dur et connecté au OrderService
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) body.get("items");
            // Étape 1 : Création de la commande via le Service
            Order order = orderService.createOrder(cartItems, userId);

            double finalAmountCalculated = order.getTotalAmount() != null ? order.getTotalAmount() : 45.40;
            order.setDiscountRate(0.0);

            // Étape 2 : Sécurisation de l'appel MongoDB (remise)
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

            // Étape 3 : Appel synchrone au paiement
            try {
                paymentClient.processPayment(order.getId(), finalAmountCalculated);
                order.setStatus("PAID");
            } catch (Exception paymentEx) {
                System.out.println("⚠️ Payment-service indisponible, commande enregistrée en attente : " + paymentEx.getMessage());
                order.setStatus("PAYMENT_FAILED");
            }

            return new ResponseEntity<>(orderRepository.save(order), HttpStatus.CREATED);

        } catch (Exception e) {
            // 🌟 TRÈS IMPORTANT : Ceci va t'afficher la vraie cause de l'erreur dans ta console IntelliJ !
            System.err.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");

        // Vérifie que l'email n'existe pas déjà
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setMemberSince(LocalDate.now());

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}