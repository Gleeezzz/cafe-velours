package com.cafevelours.order_service.controller;

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
    private final ProductClient productClient; // Injection du client Openfeign

    // Injection des repositories par constructeur
    public OrderController(OrderRepository orderRepository, UserRepository userRepository,  ProductClient productClient) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productClient = productClient;
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
            throw new RuntimeException("Utilisateur introuvable.");
        }

        // 2. On récupère toutes ses commandes
        List<Order> orders = orderRepository.findByUserId(userId);

        // 3. Magie d'OpenFeign : Pour chaque commande, on parcourt ses lignes (items)
        for (Order order : orders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    try {
                        // On appelle le microservice PRODUCT-SERVICE de manière transparente
                        ProductDTO product = productClient.getProductById(item.getProductId());

                        // On injecte le nom récupéré dans notre champ @Transient
                        item.setProductName(product.getName());
                    } catch (Exception e) {
                        // Sécurité : Si PRODUCT-SERVICE est en panne, l'historique s'affiche quand même !
                        item.setProductName("Produit Catalogue Indisponible");
                    }
                }
            }
        }

        return orders;
    }
}
