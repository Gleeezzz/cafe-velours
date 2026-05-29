package com.cafevelours.paymentservice.controller;

import com.cafevelours.paymentservice.model.Payment;
import com.cafevelours.paymentservice.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Endpoint pour traiter un paiement
     * POST http://localhost:8083/api/payments
     */
    @PostMapping
    public ResponseEntity<Payment> processPayment(
            @RequestParam Long orderId,
            @RequestParam Double amount) {

        Payment payment = paymentService.processPayment(orderId, amount);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    /**
     * Endpoint pour récupérer le paiement lié à une commande
     * GET http://localhost:8083/api/payments/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }
}