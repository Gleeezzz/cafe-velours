package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Permettra plus tard de récupérer le profil via l'email de connexion
    Optional<User> findByEmail(String email);
}
