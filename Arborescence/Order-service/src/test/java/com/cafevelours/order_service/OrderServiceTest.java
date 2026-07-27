package com.cafevelours.order_service;

import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.repository.DiscountRepository;
import com.cafevelours.order_service.repository.OrderRepository;
import com.cafevelours.order_service.repository.UserRepository;
import com.cafevelours.order_service.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductClient productClient;

    @Mock
    private UserRepository userRepository;

    // 1. Déclaration du mock DiscountRepository
    @Mock
    private DiscountRepository discountRepository;

    @InjectMocks
    private OrderService orderService;

    private User mockUser;
    private ProductDTO mockProduct;

    @BeforeEach
    void setUp() {
        // Prépare un utilisateur fictif pour les tests
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Timmy Turner");
        mockUser.setEmail("timmy@email.com");

        // Prépare un produit fictif pour les tests
        mockProduct = new ProductDTO();
        mockProduct.setId(1L);
        mockProduct.setName("Finca El Paraiso");
        mockProduct.setPrice(18.90);

        // 2. Comportement par défaut : aucun discount dans MongoDB pendant les tests
        lenient().when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(anyDouble()))
                .thenReturn(Optional.empty());
    }

    // ── TEST 1 : Création commande avec succès ──
    @Test
    void createOrder_shouldReturnOrderWithCorrectTotal() {
        // ARRANGE
        List<Map<String, Object>> cartItems = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", 1);
        item.put("quantity", 2);
        cartItems.add(item);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(productClient.getProductById(1L)).thenReturn(mockProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // ACT
        Order result = orderService.createOrder(cartItems, 1L);

        // ASSERT
        assertNotNull(result);
        assertEquals(37.80, result.getTotalAmount(), 0.01);
        assertEquals("PENDING", result.getStatus());
        assertEquals(1, result.getItems().size());
        assertEquals(2, result.getItems().get(0).getQuantity());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    // ── TEST 2 : Création commande avec userId invalide ──
    @Test
    void createOrder_shouldThrowException_whenUserNotFound() {
        // ARRANGE
        List<Map<String, Object>> cartItems = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", 1);
        item.put("quantity", 1);
        cartItems.add(item);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // ACT + ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(cartItems, 99L));

        assertTrue(exception.getMessage().contains("99"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    // ── TEST 3 : Panier vide ──
    @Test
    void createOrder_shouldReturnOrderWithZeroTotal_whenCartIsEmpty() {
        // ARRANGE
        List<Map<String, Object>> emptyCart = new ArrayList<>();
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // ACT
        Order result = orderService.createOrder(emptyCart, 1L);

        // ASSERT
        assertNotNull(result);
        assertEquals(0.0, result.getTotalAmount(), 0.01);
        assertTrue(result.getItems().isEmpty());
    }

    // ── TEST 4 : Vérification référence unique générée ──
    @Test
    void createOrder_shouldGenerateUniqueReference() {
        // ARRANGE
        List<Map<String, Object>> cartItems = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", 1);
        item.put("quantity", 1);
        cartItems.add(item);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(productClient.getProductById(1L)).thenReturn(mockProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // ACT
        Order result = orderService.createOrder(cartItems, 1L);

        // ASSERT
        assertNotNull(result.getReference());
        assertTrue(result.getReference().startsWith("#CV-2026-"));
    }

    // ── TEST 5 : Quantité correctement prise en compte ──
    @Test
    void createOrder_shouldCalculateTotal_withMultipleQuantity() {
        // ARRANGE
        List<Map<String, Object>> cartItems = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", 1);
        item.put("quantity", 3);
        cartItems.add(item);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(productClient.getProductById(1L)).thenReturn(mockProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // ACT
        Order result = orderService.createOrder(cartItems, 1L);

        // ASSERT — 3 x 18.90 = 56.70
        assertEquals(56.70, result.getTotalAmount(), 0.01);
    }
}