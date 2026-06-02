package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.Discount;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DiscountRepository extends MongoRepository<Discount, String> {
    Optional<Discount> findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(double amount);
} //Comment faire la requete sur sql ?? montrer ça au jury