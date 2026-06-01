package com.cafevelours.order_service.service;

import com.cafevelours.order_service.model.Discount;
import com.cafevelours.order_service.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private DiscountRepository discountRepository; // Injection NoSQL MongoDB tout au début !

    // Méthode métier qui calcule et applique la réduction NoSQL si > 50€
    public double applyNoSqlDiscount(double initialAmount) {
        Optional<Discount> discountOpt = discountRepository
                .findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(initialAmount);

        if (discountOpt.isPresent()) {
            Discount discount = discountOpt.get();
            System.out.println("🔥 Remise NoSQL trouvée dans MongoDB ! - " + (discount.getDiscountRate() * 100) + "%");
            return initialAmount * (1 - discount.getDiscountRate());
        }

        return initialAmount;
    }
}