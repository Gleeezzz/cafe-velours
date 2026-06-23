package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// → User = l'entité gérée par ce repository
//   Long = le type de la clé primaire (@Id) dans l'entité User
//   Spring Data JPA génère automatiquement toutes les opérations CRUD
//   pour la table users sans qu'on écrive une seule ligne de SQL.

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // → Un utilisateur avec cet email peut ne pas exister en BDD.
    //   Optional<User> force le code appelant à gérer explicitement ce cas :
    //   - .isPresent()  → vérifie si l'utilisateur existe (utilisé dans /register)
    //   - .map(...)     → transforme si présent (utilisé dans /login)
    //   - .orElseThrow() → lève une exception si absent
    //   Retourner User directement obligerait à retourner null si absent
    //   → risque de NullPointerException si l'appelant oublie de vérifier.
    //   Optional rend le contrat de la méthode explicite : "peut ne pas exister".


    // Permettra plus tard de récupérer le profil via l'email de connexion
    Optional<User> findByEmail(String email);
}
    // Héritage de JpaRepository<User, Long> donne gratuitement :
    // - findById(id)     → récupérer un user par son id (utilisé dans OrderService)
    // - save(user)       → INSERT ou UPDATE (utilisé dans /register)
    // - existsById(id)   → vérifier existence (utilisé dans /user/{userId} et DELETE)
    // - deleteById(id)   → supprimer un user (utilisé dans DELETE /users/{id})
