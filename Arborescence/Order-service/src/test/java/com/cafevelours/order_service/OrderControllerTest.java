package com.cafevelours.order_service;

import com.cafevelours.order_service.client.PaymentClient;
import com.cafevelours.order_service.controller.OrderController;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

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

    // ── TEST 3 : GET historique commandes user existant ──
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
    }

    // ── TEST 4 : GET historique user inexistant ──
    @Test
    void getUserOrderHistory_shouldThrowException_whenUserNotFound() {
        when(userRepository.existsById(99L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderController.getUserOrderHistory(99L));

        assertTrue(exception.getMessage().contains("99"));
    }

    // ── TEST 5 : POST créer commande avec succès ──
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

    // ── TEST 6 : POST login user existant ──
    @Test
    void login_shouldReturnUser_whenEmailExists() {
        Map<String, String> body = new HashMap<>();
        body.put("email", "raphael@email.com");

        when(userRepository.findByEmail("raphael@email.com")).thenReturn(Optional.of(mockUser));

        ResponseEntity<User> response = orderController.login(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Raphael Nadal", response.getBody().getName());
    }

    // ── TEST 7 : POST login email inexistant ──
    @Test
    void login_shouldReturn404_whenEmailNotFound() {
        Map<String, String> body = new HashMap<>();
        body.put("email", "inconnu@email.com");

        when(userRepository.findByEmail("inconnu@email.com")).thenReturn(Optional.empty());

        ResponseEntity<User> response = orderController.login(body);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // ── TEST 8 : POST register nouvel utilisateur ──
    @Test
    void register_shouldReturn201_whenNewUser() {
        Map<String, String> body = new HashMap<>();
        body.put("name", "Nouveau User");
        body.put("email", "nouveau@email.com");

        when(userRepository.findByEmail("nouveau@email.com")).thenReturn(Optional.empty());
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

        when(userRepository.findByEmail("raphael@email.com")).thenReturn(Optional.of(mockUser));

        ResponseEntity<User> response = orderController.register(body);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        verify(userRepository, never()).save(any(User.class));
    }
}
