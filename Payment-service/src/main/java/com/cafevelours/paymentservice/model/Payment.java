package com.cafevelours.paymentservice.model;

import jakarta.persistence.*;
import lombok.*;
/* → `@Entity` indique à Spring Boot et à l'ORM (Hibernate) que cette classe Java correspond à une table
 * dans notre base de données relationnelle. Hibernate va mapper (traduire) automatiquement les instances
 * de cette classe en lignes SQL, et ses attributs en colonnes. Cela nous évite d'écrire des requêtes SQL manuelles.*/
/* - `@NoArgsConstructor` : Requis par JPA pour pouvoir instancier l'objet lors de la récupération depuis la BDD.
 * - `@Builder` : Permet d'implémenter le Design Pattern 'Builder' pour instancier des objets de manière propre et lisible (ex: Payment.builder().amount(10).build()).
 */

@Entity
@Table(name = "payments") // Force le nom de la table SQL au pluriel, respectant les conventions de nommage en BDD
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Payment {

    /*  CLÉ PRIMAIRE DE LA TABLE */
    /* * → Cela délègue la responsabilité de la création de l'identifiant directement au système de gestion
     * de base de données (SGBD) sous-jacent (ex: une colonne `AUTO_INCREMENT` en MySQL/PostgreSQL).
     * Chaque fois qu'un paiement est inséré, la BDD lui attribue un ID unique incrémenté de 1.
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // `nullable = false` applique une contrainte de niveau BDD (NOT NULL) pour garantir l'intégrité des données

    @Column(nullable = false)
    private Long orderId; // Lien logique (ID) vers la commande issue du microservice Order-Service

    @Column(nullable = false)
    private Double amount; // Montant de la transaction financière

    // 🟢 Correction ici : On utilise l'Enum au lieu d'un simple String pour sécuriser les états
    // * Avec `EnumType.STRING`, l'état est écrit textuellement en clair (ex: "PENDING", "SUCCESS", "FAILED").
    // * C'est beaucoup plus robuste et lisible lors des audits ou des opérations de maintenance en BDD.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    /* ─ RÉFÉRENCE UNIQUE DE TRANSACTION ─── */
    /* * → C'est une sécurité métier absolue. Cette référence (qui sera souvent un UUID ou un token Stripe/PayPal)
     * doit être unique dans tout le système pour empêcher les attaques par rejeu ou qu'une même transaction
     * bancaire ne vienne valider deux fois (ou par erreur) deux traitements de paiement distincts.
     */
    @Column(unique = true)
    private String transactionReference; // 💡 Numéro de transaction unique (ex: UUID)
}