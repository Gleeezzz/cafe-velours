package com.cafevelours.order_service.controller;

import com.cafevelours.order_service.client.PaymentClient;
import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.repository.OrderRepository;
import com.cafevelours.order_service.repository.UserRepository;
import com.cafevelours.order_service.service.OrderService; // 💡 Import du service
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // 💡 Autorise React à appeler ce service !
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // --- 1. DÉCLARATIONS DES DÉPENDANCES (TOUJOURS AU DÉBUT) ---
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final OrderService orderService; // 💡 Ajout de notre service NoSQL

    // --- 2. LE CONSTRUCTEUR POUR INJECTER LES COMPOSANTS ---
    public OrderController(OrderRepository orderRepository, UserRepository userRepository,
                           ProductClient productClient, PaymentClient paymentClient,
                           OrderService orderService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productClient = productClient;
        this.paymentClient = paymentClient;
        this.orderService = orderService; // 💡 Initialisation
    }

    // --- 3. LES MÉTHODES DE REQUÊTES (GET, POST...) ---

    @GetMapping("/users/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

    @GetMapping("/user/{userId}") // 💡 Aligné exactement sur l'appel Axios de React !
    public List<Order> getUserOrderHistory(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utilisateur introuvable avec l'id : " + userId);
        }

        List<Order> orders = orderRepository.findByUserId(userId);

        for (Order order : orders) {
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

    // 2. Route de création de commande (AU FINAL DU CODE)
    @PostMapping
    public Order createOrder(@RequestBody Order order) {

        double totalAmount = 0.0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);

                if (item.getPrice() != null && item.getQuantity() != null) {
                    totalAmount += item.getPrice() * item.getQuantity();
                }
            }
        }

        // 🌟 MAGIE NOSQL : Application de la remise via le service MongoDB avant le paiement !
        totalAmount = orderService.applyNoSqlDiscount(totalAmount);

        // On affecte le montant final calculé (potentiellement réduit) à la commande
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        // Appel synchrone avec OpenFeign
        try {
            paymentClient.processPayment(savedOrder.getId(), totalAmount);
            savedOrder.setStatus("PAID");
        } catch (Exception e) {
            savedOrder.setStatus("PAYMENT_FAILED");
        }

        return orderRepository.save(savedOrder);
    }
}