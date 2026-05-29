package com.cafevelours.paymentservice.service;

import com.cafevelours.paymentservice.model.Payment;
import com.cafevelours.paymentservice.model.PaymentStatus;
import com.cafevelours.paymentservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    // 💡 Injection par constructeur (recommandé pour la robustesse et les tests)
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Traite et enregistre un nouveau paiement pour une commande
     */
    @Transactional
    public Payment processPayment(Long orderId, Double amount) {
        // 1. Simulation d'une logique métier : si le montant est égal à 0 ou négatif, on refuse d'office
        PaymentStatus finalStatus = PaymentStatus.ACCEPTED;
        if (amount <= 0) {
            finalStatus = PaymentStatus.REFUSED;
        } else {
            // Simulation d'un traitement bancaire aléatoire (ex: 5% de chance de refus pour tester l'échec)
            if (Math.random() < 0.05) {
                finalStatus = PaymentStatus.REFUSED;
            }
        }

        // 2. Génération d'une référence de transaction unique (UUID) conforme au plan d'action
        String transactionRef = UUID.randomUUID().toString();

        // 3. Construction de l'objet Payment grâce au Builder Lombok
        Payment payment = Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .status(finalStatus)
                .transactionReference(transactionRef)
                .build();

        // 4. Sauvegarde en base de données MySQL
        return paymentRepository.save(payment);
    }

    /**
     * Récupère un paiement par l'ID de la commande
     */
    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for Order ID: " + orderId));
    }
}