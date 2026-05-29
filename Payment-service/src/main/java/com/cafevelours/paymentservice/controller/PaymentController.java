package com.cafevelours.paymentservice.controller;

import com.cafevelours.paymentservice.model.Payment;
import com.cafevelours.paymentservice.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // 💡 Injection par constructeur
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * 💳 Endpoint pour traiter/effectuer un paiement
     * Exemple d'appel : POST http://localhost:8083/api/payments?orderId=1&amount=25.50
     */
    @PostMapping
    public ResponseEntity<Payment> processPayment(
            @RequestParam Long orderId,
            @RequestParam Double amount) {

        Payment payment = paymentService.processPayment(orderId, amount);
        return ResponseEntity.ok(payment);
    }

    /**
     * 🔍 Endpoint pour récupérer les informations d'un paiement via l'ID de la commande
     * Exemple d'appel : GET http://localhost:8083/api/payments/order/1
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }
}
