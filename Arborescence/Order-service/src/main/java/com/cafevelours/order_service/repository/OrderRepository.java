package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Cette méthode magique de Spring Data JPA va filtrer
    // automatiquement les commandes grâce à l'ID de l'utilisateur !
    List<Order> findByUser_Id(Long userId);
}
