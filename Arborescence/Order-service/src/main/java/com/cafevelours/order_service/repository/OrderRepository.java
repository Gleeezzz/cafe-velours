package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    //   Dans l'entité Order, il n'y a PAS de champ "userId".
    //   Il y a un champ "user" de type User (relation @ManyToOne).
    //   Et dans User, il y a un champ "id".

    //   Sans l'underscore → findByUserId :
    //   Spring cherche un champ "userId" directement dans Order → introuvable
    //   → exception PropertyReferenceException au démarrage de l'application !

    // Cette méthode magique de Spring Data JPA va filtrer
    // automatiquement les commandes grâce à l'ID de l'utilisateur !
    List<Order> findByUser_Id(Long userId);
}
    // Héritage de JpaRepository<Order, Long> donne gratuitement :
    // - findAll()           → SELECT * FROM orders
    // - findById(id)        → SELECT * FROM orders WHERE id = ?
    // - save(order)         → INSERT ou UPDATE selon l'état de l'entité
    // - deleteById(id)      → DELETE FROM orders WHERE id = ?
    // - deleteAll(orders)   → DELETE FROM orders WHERE id IN (...)
    // - existsById(id)      → SELECT COUNT(*) FROM orders WHERE id = ?
    // → Toutes ces méthodes sont utilisées dans OrderController sans
    //   avoir écrit une seule ligne de SQL !


