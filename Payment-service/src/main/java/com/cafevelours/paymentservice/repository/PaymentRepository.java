package com.cafevelours.paymentservice.repository;


import com.cafevelours.paymentservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // 💡 Optionnel : permettra de chercher un paiement par rapport à sa commande
    Optional<Payment> findByOrderId(Long orderId);
}
