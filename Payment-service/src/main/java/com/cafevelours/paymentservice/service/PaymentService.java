package com.cafevelours.paymentservice.service;

import com.cafevelours.paymentservice.model.Payment;
import com.cafevelours.paymentservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    // 💡 Injection par constructeur (recommandé par Spring)
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment processPayment(Long orderId, Double amount) {
        // 💡 Simulation d'une logique métier : Si le montant est supérieur à 1000€, on refuse (sécurité anti-fraude)
        String status = (amount > 1000.0) ? "REFUSED" : "ACCEPTED";

        Payment payment = Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .status(status)
                .transactionReference(UUID.randomUUID().toString()) // Génère un identifiant unique de transaction
                .build();

        return paymentRepository.save(payment);
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable pour la commande : " + orderId));
    }
}
