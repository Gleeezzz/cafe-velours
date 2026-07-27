package com.cafevelours.order_service.service;

import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Discount;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.repository.DiscountRepository;
import com.cafevelours.order_service.repository.OrderRepository;
import com.cafevelours.order_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

//  @Service:
//  → C'est un stéréotype Spring (comme @Controller, @Repository).
//   Il indique à Spring que cette classe contient de la logique métier
//   et doit être gérée comme un bean dans le conteneur IoC.
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final UserRepository userRepository;
    private final DiscountRepository discountRepository; //  Injecté

    public OrderService(OrderRepository orderRepository,
                        ProductClient productClient,
                        UserRepository userRepository,
                        DiscountRepository discountRepository) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
        this.userRepository = userRepository;
        this.discountRepository = discountRepository;
    }

    @Transactional
    public Order createOrder(List<Map<String, Object>> itemsFromFrontend, Long userId) {

        Order order = new Order();
        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;

        //  BOUCLE : Traitement de chaque article du panier
        for (Map<String, Object> itemMap : itemsFromFrontend) {
            Long productId = Long.valueOf(itemMap.get("productId").toString());
            int quantity = Integer.parseInt(itemMap.get("quantity").toString());

            ProductDTO product = productClient.getProductById(productId);

            if (product != null) {
                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(productId);
                orderItem.setQuantity(quantity);
                orderItem.setPrice(product.getPrice());
                orderItem.setOrder(order);

                orderItems.add(orderItem);

                // Accumulation du sous-total brut
                subtotal += product.getPrice() * quantity;
            }
        }

        //  ── LOGIQUE DE REMISE DYNAMIQUE VIA MONGOBD ──
        double finalAmount = subtotal;

        // Recherche du palier de remise applicable via la méthode dérivée de DiscountRepository
        Optional<Discount> applicableDiscount = discountRepository
                .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(subtotal);

        // Si une règle Mongo s'applique (ex: subtotal >= 50 €), on réduit le montant
        if (applicableDiscount.isPresent()) {
            Discount discount = applicableDiscount.get();
            double discountAmount = subtotal * discount.getDiscountRate();
            finalAmount = subtotal - discountAmount;
        }

        //  FINALISATION DE LA COMMANDE
        order.setItems(orderItems);
        order.setTotalAmount(finalAmount); //  Persiste le prix remisé final
        order.setStatus("PENDING");

        String generatedRef = "#CV-2026-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        order.setReference(generatedRef);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + userId));
        order.setUser(user);

        return orderRepository.save(order);
    }
}