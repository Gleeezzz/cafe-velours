package com.cafevelours.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    /**
     * Appelle l'endpoint POST de payment-service pour traiter un paiement
     */
    @PostMapping("/api/payments")
    Object processPayment(
            @RequestParam("orderId") Long orderId,
            @RequestParam("amount") Double amount
    );
}
