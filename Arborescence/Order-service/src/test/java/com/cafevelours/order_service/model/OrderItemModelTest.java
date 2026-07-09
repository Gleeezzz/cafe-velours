package com.cafevelours.order_service.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * ⚠️ JURY : Test unitaire simple sur OrderItem (POJO JPA sans logique métier).
 * Couvre le constructeur paramétré et la relation bidirectionnelle avec Order,
 * non exercés par les tests du controller (qui utilisent le constructeur vide + setters).
 */
class OrderItemModelTest {

    @Test
    void parameterizedConstructor_shouldInitializeAllFields() {
        Order order = new Order();
        order.setId(1L);

        OrderItem item = new OrderItem(10L, 2, 18.90, order);

        assertEquals(10L, item.getProductId());
        assertEquals(2, item.getQuantity());
        assertEquals(18.90, item.getPrice());
        assertEquals(order, item.getOrder());
    }

    @Test
    void setOrder_shouldEstablishBidirectionalLink() {
        OrderItem item = new OrderItem();
        Order order = new Order();
        order.setReference("#CV-2026-0001");

        item.setOrder(order);

        assertEquals("#CV-2026-0001", item.getOrder().getReference());
    }
}
