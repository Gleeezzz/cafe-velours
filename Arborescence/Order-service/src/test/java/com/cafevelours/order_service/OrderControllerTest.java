package com.cafevelours.order_service;

import com.cafevelours.order_service.client.PaymentClient;
import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.controller.OrderController;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Discount;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * ⚠️ JURY : Suite de tests unitaires du OrderController (Mockito pur, sans contexte Spring).
 * Complète la suite initiale en ajoutant les mocks manquants (ProductClient, PasswordEncoder)
 * et les branches non couvertes : mot de passe invalide, remise appliquée, panne
 * Product-Service, panne MongoDB, panne Payment-Service, suppression de compte RGPD.
 */
@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderService orderService;

    @Mock
    private PaymentClient paymentClient;

    @Mock
    private DiscountRepository discountRepository;

    @Mock
    private ProductClient productClient;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private OrderController orderController;

    private User mockUser;
    private Order mockOrder;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Raphael Nadal");
        mockUser.setEmail("raphael@email.com");
        mockUser.setPassword("$2a$10$hashedPasswordExample");

        mockOrder = new Order();
        mockOrder.setId(1L);
        mockOrder.setStatus("PENDING");
        mockOrder.setTotalAmount(45.00);
        mockOrder.setReference("#CV-2026-ABC123");
        mockOrder.setUser(mockUser);
    }

    // ── TEST 1 : GET profil user existant ──
    @Test
    void getUserProfile_shouldReturnUser_whenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        User result = orderController.getUserProfile(1L);

        assertNotNull(result);
        assertEquals("Raphael Nadal", result.getName());
        assertEquals("raphael@email.com", result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    // ── TEST 2 : GET profil user inexistant ──
    @Test
    void getUserProfile_shouldThrowException_whenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderController.getUserProfile(99L));

        assertTrue(exception.getMessage().contains("99"));
    }

    // ── TEST 3 : GET historique commandes user existant (sans remise) ──
    @Test
    void getUserOrderHistory_shouldReturnOrders_whenUserExists() {
        List<Order> orders = new ArrayList<>();
        orders.add(mockOrder);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(orderRepository.findByUser_Id(1L)).thenReturn(orders);
        when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(anyDouble()))
                .thenReturn(Optional.empty());

        List<Order> result = orderController.getUserOrderHistory(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("#CV-2026-ABC123", result.get(0).getReference());
        assertEquals(0.0, result.get(0).getDiscountRate());
    }

    // ── TEST 4 : GET historique user inexistant ──
    @Test
    void getUserOrderHistory_shouldThrowException_whenUserNotFound() {
        when(userRepository.existsById(99L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderController.getUserOrderHistory(99L));

        assertTrue(exception.getMessage().contains("99"));
    }

    // ── TEST 4bis : GET historique — remise trouvée en base MongoDB ──
    @Test
    void getUserOrderHistory_shouldApplyDiscount_whenRuleMatches() {
        mockOrder.setTotalAmount(60.0);
        List<Order> orders = List.of(mockOrder);

        Discount discount = new Discount();
        discount.setDiscountRate(0.10);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(orderRepository.findByUser_Id(1L)).thenReturn(orders);
        when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(60.0))
                .thenReturn(Optional.of(discount));

        List<Order> result = orderController.getUserOrderHistory(1L);

        assertEquals(0.10, result.get(0).getDiscountRate());
        assertEquals(54.0, result.get(0).getFinalAmount());
    }

    // ── TEST 4ter : GET historique — hydratation Feign réussie ──
    @Test
    void getUserOrderHistory_shouldHydrateProductName_whenProductServiceOk() {
        OrderItem item = new OrderItem();
        item.setProductId(10L);
        mockOrder.setItems(List.of(item));

        ProductDTO product = new ProductDTO();
        product.setName("Café Guatemala");

        when(userRepository.existsById(1L)).thenReturn(true);
        when(orderRepository.findByUser_Id(1L)).thenReturn(List.of(mockOrder));
        when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(anyDouble()))
                .thenReturn(Optional.empty());
        when(productClient.getProductById(10L)).thenReturn(product);

        orderController.getUserOrderHistory(1L);

        assertEquals("Café Guatemala", item.getProductName());
    }

    // ── TEST 4quater : GET historique — panne Product-Service (fallback) ──
    @Test
    void getUserOrderHistory_shouldFallback_whenProductServiceDown() {
        OrderItem item = new OrderItem();
        item.setProductId(99L);
        mockOrder.setItems(List.of(item));

        when(userRepository.existsById(1L)).thenReturn(true);
        when(orderRepository.findByUser_Id(1L)).thenReturn(List.of(mockOrder));
        when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(anyDouble()))
                .thenReturn(Optional.empty());
        when(productClient.getProductById(99L)).thenThrow(new RuntimeException("Product-Service down"));

        orderController.getUserOrderHistory(1L);

        assertEquals("Produit Catalogue Indisponible", item.getProductName());
    }

    // ── TEST 5 : POST créer commande avec succès (paiement OK) ──
    @Test
    void createOrder_shouldReturn201_whenSuccess() {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", 1);
        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", 1);
        item.put("quantity", 2);
        items.add(item);
        body.put("items", items);

        mockOrder.setTotalAmount(37.80);
        mockOrder.setFinalAmount(37.80);

        when(orderService.createOrder(any(), anyLong())).thenReturn(mockOrder);
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);
        when(paymentClient.processPayment(anyLong(), anyDouble())).thenReturn(null);
        ResponseEntity<Order> response = orderController.createOrder(body);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("PAID", response.getBody().getStatus());
    }

    // ── TEST 5bis : POST créer commande — MongoDB indisponible (remise ignorée) ──
    @Test
    void createOrder_shouldIgnoreDiscount_whenMongoDown() {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", 1);
        body.put("items", List.of(Map.of("productId", 1, "quantity", 1)));

        mockOrder.setTotalAmount(45.40);

        when(orderService.createOrder(any(), anyLong())).thenReturn(mockOrder);
        when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(anyDouble()))
                .thenThrow(new RuntimeException("MongoDB indisponible"));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);
        when(paymentClient.processPayment(anyLong(), anyDouble())).thenReturn(null);
        ResponseEntity<Order> response = orderController.createOrder(body);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(0.0, response.getBody().getDiscountRate());
        assertEquals("PAID", response.getBody().getStatus());
    }

    // ── TEST 5ter : POST créer commande — Payment-Service indisponible ──
    @Test
    void createOrder_shouldMarkPaymentFailed_whenPaymentServiceDown() {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", 1);
        body.put("items", List.of(Map.of("productId", 1, "quantity", 1)));

        mockOrder.setTotalAmount(30.0);

        when(orderService.createOrder(any(), anyLong())).thenReturn(mockOrder);
        when(discountRepository.findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(anyDouble()))
                .thenReturn(Optional.empty());
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);
        doThrow(new RuntimeException("Payment-service indisponible"))
                .when(paymentClient).processPayment(anyLong(), anyDouble());

        ResponseEntity<Order> response = orderController.createOrder(body);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("PAYMENT_FAILED", response.getBody().getStatus());
    }

    // ── TEST 5quater : POST créer commande — body invalide (500) ──
    @Test
    void createOrder_shouldReturn500_whenBodyInvalid() {
        Map<String, Object> body = new HashMap<>();
        body.put("items", List.of(Map.of("productId", 1, "quantity", 1)));
        // userId absent → NullPointerException interne, capturée par le catch générique

        ResponseEntity<Order> response = orderController.createOrder(body);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    // ── TEST 6 : POST login user existant, mot de passe correct ──
    @Test
    void login_shouldReturnUser_whenCredentialsValid() {
        Map<String, String> body = new HashMap<>();
        body.put("email", "raphael@email.com");
        body.put("password", "bonMotDePasse");

        when(userRepository.findByEmail("raphael@email.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("bonMotDePasse", mockUser.getPassword())).thenReturn(true);

        ResponseEntity<User> response = orderController.login(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Raphael Nadal", response.getBody().getName());
    }

    // ── TEST 7 : POST login email inexistant ──
    @Test
    void login_shouldReturnUnauthorized_whenEmailNotFound() {
        Map<String, String> body = new HashMap<>();
        body.put("email", "inconnu@email.com");
        body.put("password", "x");

        when(userRepository.findByEmail("inconnu@email.com")).thenReturn(Optional.empty());

        ResponseEntity<User> response = orderController.login(body);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    // ── TEST 7bis : POST login — mot de passe incorrect ──
    @Test
    void login_shouldReturnUnauthorized_whenPasswordWrong() {
        Map<String, String> body = new HashMap<>();
        body.put("email", "raphael@email.com");
        body.put("password", "mauvais");

        when(userRepository.findByEmail("raphael@email.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("mauvais", mockUser.getPassword())).thenReturn(false);

        ResponseEntity<User> response = orderController.login(body);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    // ── TEST 8 : POST register nouvel utilisateur ──
    @Test
    void register_shouldReturn201_whenNewUser() {
        Map<String, String> body = new HashMap<>();
        body.put("name", "Nouveau User");
        body.put("email", "nouveau@email.com");
        body.put("password", "motdepasse123");

        when(userRepository.findByEmail("nouveau@email.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("motdepasse123")).thenReturn("$2a$10$hashed");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        ResponseEntity<User> response = orderController.register(body);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // ── TEST 9 : POST register email déjà existant ──
    @Test
    void register_shouldReturn409_whenEmailAlreadyExists() {
        Map<String, String> body = new HashMap<>();
        body.put("name", "Raphael Nadal");
        body.put("email", "raphael@email.com");
        body.put("password", "x");

        when(userRepository.findByEmail("raphael@email.com")).thenReturn(Optional.of(mockUser));

        ResponseEntity<User> response = orderController.register(body);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        verify(userRepository, never()).save(any(User.class));
    }

    // ── TEST 10 : DELETE compte — user inexistant (404) ──
    @Test
    void deleteUserAccount_shouldReturn404_whenUserNotFound() {
        when(userRepository.existsById(5L)).thenReturn(false);

        ResponseEntity<?> response = orderController.deleteUserAccount(5L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // ── TEST 10bis : DELETE compte — suppression en cascade des commandes ──
    @Test
    void deleteUserAccount_shouldCascadeDeleteOrders_whenOrdersExist() {
        when(userRepository.existsById(1L)).thenReturn(true);
        when(orderRepository.findByUser_Id(1L)).thenReturn(List.of(mockOrder));

        ResponseEntity<?> response = orderController.deleteUserAccount(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(orderRepository, times(1)).deleteAll(List.of(mockOrder));
        verify(userRepository, times(1)).deleteById(1L);
    }

    // ── TEST 10ter : DELETE compte — aucune commande à supprimer ──
    @Test
    void deleteUserAccount_shouldSkipCascade_whenNoOrders() {
        when(userRepository.existsById(2L)).thenReturn(true);
        when(orderRepository.findByUser_Id(2L)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = orderController.deleteUserAccount(2L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(orderRepository, never()).deleteAll(anyList());
        verify(userRepository, times(1)).deleteById(2L);
    }

    // ── TEST 10quater : DELETE compte — erreur SQL inattendue (500) ──
    @Test
    void deleteUserAccount_shouldReturn500_whenRepositoryThrows() {
        when(userRepository.existsById(3L)).thenReturn(true);
        when(orderRepository.findByUser_Id(3L)).thenThrow(new RuntimeException("Erreur SQL"));

        ResponseEntity<?> response = orderController.deleteUserAccount(3L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}