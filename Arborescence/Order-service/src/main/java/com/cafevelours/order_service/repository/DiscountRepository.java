package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.Discount;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DiscountRepository extends MongoRepository<Discount, String> {
    Optional<Discount> findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(double amount);
}