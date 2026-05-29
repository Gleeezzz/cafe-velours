package com.cafevelours.order_service.controller;

import com.cafevelours.order_service.client.PaymentClient;
import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.repository.OrderRepository;
import com.cafevelours.order_service.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository,
                           ProductClient productClient, PaymentClient paymentClient) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productClient = productClient;
        this.paymentClient = paymentClient;
    }

    // 1. Route pour récupérer les infos profil d'un utilisateur (Sophie Martin)
    @GetMapping("/users/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

    @GetMapping("/users/{userId}/history")
    public List<Order> getUserOrderHistory(@PathVariable Long userId) {
        // 1. On vérifie si l'utilisateur existe en base
        if (!userRepository.existsById(userId)) {
            // 🟢 Correction ici : On affiche la variable locale "userId" au lieu de l'import jpa
            throw new RuntimeException("Utilisateur introuvable avec l'id : " + userId);
        }

        // 2. On récupère toutes ses commandes
        List<Order> orders = orderRepository.findByUserId(userId);

        // 3. Magie d'OpenFeign : Pour chaque commande, on parcourt ses lignes (items)
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

    // 2. Route de création de commande connectée au cycle de paiement synchrone
    @PostMapping
    public Order createOrder(@RequestBody Order order) {

        double totalAmount = 0.0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);

                // Calcul du montant cumulé (Prix unitaire * Quantité)
                if (item.getPrice() != null && item.getQuantity() != null) {
                    totalAmount += item.getPrice() * item.getQuantity();
                }
            }
        }

        // On donne un statut temporaire à la commande avant de l'enregistrer une première fois
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        // Appel de communication inter-microservices synchrone avec OpenFeign !
        try {
            paymentClient.processPayment(savedOrder.getId(), totalAmount);
            savedOrder.setStatus("PAID");

        } catch (Exception e) {
            savedOrder.setStatus("PAYMENT_FAILED");
        }

        // Mise à jour finale du statut de la commande en base de données
        return orderRepository.save(savedOrder);
    }
}