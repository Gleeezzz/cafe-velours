package com.cafevelours.order_service.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/**
 * ⚠️ JURY : Tests unitaires purs (sans Mockito) sur la logique métier
 * portée par l'entité Order — le calcul du montant final après remise.
 * Couvre les 4 branches de getFinalAmount() :
 *  1) finalAmount déjà calculé → retourné tel quel
 *  2) finalAmount null + totalAmount connu + discountRate connu → calcul
 *  3) finalAmount null + totalAmount connu + discountRate null → calcul avec 0.0 par défaut
 *  4) finalAmount null + totalAmount null → retourne null
 */
class OrderModelTest {

    @Test
    void getFinalAmount_shouldReturnStoredValue_whenAlreadySet() {
        Order order = new Order();
        order.setTotalAmount(100.0);
        order.setDiscountRate(0.20);
        order.setFinalAmount(75.0); // valeur déjà calculée/forcée

        assertEquals(75.0, order.getFinalAmount());
    }

    @Test
    void getFinalAmount_shouldCalculate_whenDiscountRateIsSet() {
        Order order = new Order();
        order.setTotalAmount(36.40);
        order.setDiscountRate(0.10);
        // finalAmount non défini (null) → calcul à la volée

        assertEquals(32.76, order.getFinalAmount(), 0.001);
    }

    @Test
    void getFinalAmount_shouldUseZeroDefault_whenDiscountRateIsNull() {
        Order order = new Order();
        order.setTotalAmount(50.0);
        order.setDiscountRate(null);

        assertEquals(50.0, order.getFinalAmount());
    }

    @Test
    void getFinalAmount_shouldReturnNull_whenTotalAmountIsNull() {
        Order order = new Order();
        order.setTotalAmount(null);
        order.setDiscountRate(0.10);

        assertNull(order.getFinalAmount());
    }

    @Test
    void constructor_shouldInitializeFieldsAndDefaultDiscountRate() {
        User user = new User();
        user.setName("Alice Dupont");

        Order order = new Order("#CV-2026-0099", java.time.LocalDate.of(2026, 3, 16), 45.0, "PENDING", user);

        assertEquals("#CV-2026-0099", order.getReference());
        assertEquals(45.0, order.getTotalAmount());
        assertEquals("PENDING", order.getStatus());
        assertEquals(user, order.getUser());
        assertEquals(0.0, order.getDiscountRate());
    }
}