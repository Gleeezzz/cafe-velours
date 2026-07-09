package com.cafevelours.order_service.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * ⚠️ JURY : Test unitaire simple sur ProductDTO (POJO de désérialisation
 * Jackson pour les reponses OpenFeign du Product-Service). Couvre le
 * constructeur paramétré et les accesseurs id/price, non exerces par
 * les tests du controller (qui n'utilisent que setName/getName).
 */
class ProductDTOTest {

    @Test
    void parameterizedConstructor_shouldInitializeAllFields() {
        ProductDTO product = new ProductDTO(1L, "Café Guatemala", 12.90);

        assertEquals(1L, product.getId());
        assertEquals("Café Guatemala", product.getName());
        assertEquals(12.90, product.getPrice());
    }

    @Test
    void settersAndGetters_shouldWorkForIdAndPrice() {
        ProductDTO product = new ProductDTO();
        product.setId(42L);
        product.setPrice(7.50);

        assertEquals(42L, product.getId());
        assertEquals(7.50, product.getPrice());
    }
}
