package com.cafevelours.order_service.service;

import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    public OrderService(OrderRepository orderRepository, ProductClient productClient) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
    }

    @Transactional
    public Order createOrder(List<Map<String, Object>> itemsFromFrontend) {
        Order order = new Order();
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

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
                totalAmount += product.getPrice() * quantity;
            }
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");

        // Génération automatique d'une référence unique
        String generatedRef = "#CV-2026-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        order.setReference(generatedRef);

        // 🌟 Version propre utilisant l'import de la ligne 7
        User user = new User();
        user.setId(1L);
        order.setUser(user);

        return orderRepository.save(order);
    }
}