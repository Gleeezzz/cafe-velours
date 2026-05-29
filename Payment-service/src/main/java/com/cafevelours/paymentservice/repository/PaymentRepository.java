package com.cafevelours.paymentservice.repository;

import com.cafevelours.paymentservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // 💡 Une méthode personnalisée très utile pour retrouver un paiement grâce à son numéro unique UUID
    Optional<Payment> findByTransactionReference(String transactionReference);

    // 💡 Pour retrouver facilement le historique de paiement lié à une commande spécifique
    Optional<Payment> findByOrderId(Long orderId);
}
