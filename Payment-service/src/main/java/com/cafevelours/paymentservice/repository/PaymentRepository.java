package com.cafevelours.paymentservice.repository;

import com.cafevelours.paymentservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/* * → C'est la magie de **Spring Data JPA**. En étendant `JpaRepository<Payment, Long>`, Spring génère
 * automatiquement au démarrage de l'application l'implémentation concrète de cette interface en mémoire.
 * Les méthodes CRUD de base (`save()`, `findById()`, `delete()`, etc.) sont injectées d'office sans
 * qu'on ait besoin d'écrire la moindre ligne de code SQL ou d'ouvrir manuellement des connexions JDBC. */

@Repository
/* * → Elle indique à Spring que ce composant gère les opérations d'accès à la base de données.
 * Elle permet aussi d'activer la traduction automatique des exceptions SQL natives (souvent complexes)
 * en exceptions Spring génériques de plus haut niveau, plus faciles à intercepter.
 */

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    /*  → C'est le mécanisme de **Derived Queries** (Requêtes dérivées). */

    // 💡 Une méthode personnalisée très utile pour retrouver un paiement grâce à son numéro unique UUID
    Optional<Payment> findByTransactionReference(String transactionReference);

    // 💡 Pour retrouver facilement le historique de paiement lié à une commande spécifique
    Optional<Payment> findByOrderId(Long orderId);
}
