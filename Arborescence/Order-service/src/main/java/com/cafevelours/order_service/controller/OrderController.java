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
import com.cafevelours.order_service.repository.DiscountRepository; // ✨ Notre lien direct avec MongoDB
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final DiscountRepository discountRepository; // ✅ Injecté, plus besoin d'OrderService !

    // Constructeur mis à jour et nettoyé
    public OrderController(OrderRepository orderRepository, UserRepository userRepository,
                           ProductClient productClient, PaymentClient paymentClient,
                           DiscountRepository discountRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productClient = productClient;
        this.paymentClient = paymentClient;
        this.discountRepository = discountRepository;
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

        List<Order> orders = orderRepository.findByUserId(userId);

        for (Order order : orders) {
            // 🌟 Récupération de la remise dans MongoDB pour l'historique
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

            // Récupération des noms des produits via OpenFeign
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

        order.setTotalAmount(totalAmount);

        // 🌟 Logique NoSQL directe via DiscountRepository (Plus besoin de la classe manquante !)
        Optional<Discount> discountOpt = discountRepository
                .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(totalAmount);

        double finalAmountCalculated = totalAmount;

        if (discountOpt.isPresent()) {
            double rate = discountOpt.get().getDiscountRate();
            order.setDiscountRate(rate);
            finalAmountCalculated = totalAmount * (1 - rate); // On applique la réduction
        } else {
            order.setDiscountRate(0.0);
        }

        order.setFinalAmount(finalAmountCalculated);
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        // Appel synchrone au service de paiement avec le montant final après calcul NoSQL
        try {
            paymentClient.processPayment(savedOrder.getId(), finalAmountCalculated);
            savedOrder.setStatus("PAID");
        } catch (Exception e) {
            savedOrder.setStatus("PAYMENT_FAILED");
        }

        return orderRepository.save(savedOrder);
    }
}