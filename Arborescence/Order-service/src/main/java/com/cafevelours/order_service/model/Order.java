package com.cafevelours.order_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// → Même principe que Product.java : @Entity dit à JPA que cette classe
//   correspond à une table SQL. @Table(name = "orders") force le nom
//   de la table car "order" est un mot réservé SQL dans certains moteurs.
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // → Oui, c'est le standard JPA. Chaque entité a une clé primaire
    //   auto-incrémentée par MySQL (AUTO_INCREMENT).

    @Column(nullable = false, unique = true)
    private String reference; // Ex: "#CV-2026-0042"

    // → LocalDate est le type Java moderne pour les dates (sans heure).
    //   JPA/Hibernate le mappe automatiquement en DATE SQL.
    //   Avantages : comparaison de dates facile, pas de parsing manuel,
    //   pas de problème de format (dd/MM vs MM/dd).
    private LocalDate orderDate; // Ex: 16 mars 2026
    private Double totalAmount;  // Ex: 36.40
    private String status;       // Ex: "Confirmée" ou "Expédiée"

    // --- Attributs de la mécanique NoSQL (Ignorés par MySQL grâce à @Transient) ---
     //→ @Transient indique à JPA/Hibernate d'IGNORER complètement ce champ.
    //   Il ne sera ni sauvegardé ni lu depuis la base MySQL.
    //   C'est utile pour des attributs calculés ou temporaires qui n'ont
    //   pas leur place en BDD relationnelle.

    // → Les remises sont gérées dans MongoDB (Order-Service utilise deux BDD).
    //   Le taux de remise est récupéré depuis MongoDB à la volée,
    //   appliqué en mémoire sur l'objet Order, mais jamais persisté en MySQL.
    //   C'est l'avantage d'une architecture polyglotte : chaque donnée
    //   est stockée dans le moteur le plus adapté.
    @Transient
    private Double discountRate = 0.0;
    // → finalAmount = totalAmount * (1 - discountRate)
    //   C'est une valeur CALCULÉE, pas stockée. On la recalcule à chaque fois
    //   depuis totalAmount et discountRate. Inutile de la persister car
    //   elle dépend de deux autres valeurs.

    @Transient
    private Double finalAmount;

    // --- Getters et Setters pour la mécanique NoSQL ---
    public Double getDiscountRate() {
        return discountRate;
    }
    public void setDiscountRate(Double discountRate) {
        this.discountRate = discountRate;
    }
    // → C'est un getter intelligent avec logique métier intégrée.
    //   Si finalAmount n'a pas été calculé (null) ET que totalAmount existe,
    //   on calcule à la volée : totalAmount * (1 - discountRate).
    //   Ex : totalAmount = 36.40, discountRate = 0.10
    //        → finalAmount = 36.40 * 0.90 = 32.76
    //   Sinon on retourne la valeur déjà calculée.
    //   Le "?:" est l'opérateur ternaire — protection contre le null.

    public Double getFinalAmount() {
        if (finalAmount == null && totalAmount != null) {
            return totalAmount * (1 - (discountRate != null ? discountRate : 0.0));
        }
        return finalAmount;
    }
    public void setFinalAmount(Double finalAmount) {
        this.finalAmount = finalAmount;
    }

    @ManyToOne // 🌟 Sans cascade persist/all pour éviter qu'Hibernate ne re-sauvegarde le User
    // → Représente une relation N:1 entre Order et User.
    //   Plusieurs commandes (Many) peuvent appartenir à un seul utilisateur (One).
    //   En SQL : la table orders a une colonne user_id (clé étrangère FK)
    //   qui pointe vers users.id.

    //   Si on mettait CascadeType.ALL, quand on sauvegarde
    //   une commande, Hibernate essaierait de RE-sauvegarder le User aussi.
    //   Or le User existe déjà en BDD → conflit / doublon.
    //   Sans cascade : on sauvegarde uniquement la commande, le User est juste référenc

    @JoinColumn(name = "user_id") // Le nom de ta colonne en BDD
    // → Précise le nom de la colonne FK dans la table orders.
    //   Sans @JoinColumn, JPA utiliserait un nom généré automatiquement.
    //   Avec name = "user_id" → la colonne s'appelle exactement "user_id" en SQL.
    private User user;

    // Une commande contient plusieurs lignes d'articles (OrderItem)
    // → Relation 1:N entre Order et OrderItem.
    //   Une commande contient plusieurs lignes d'articles.
    //   En SQL : la table order_items a une colonne order_id (FK vers orders.id).
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    // → mappedBy indique que c'est OrderItem qui "possède" la relation
    //   (c'est lui qui a la colonne FK order_id en BDD).
    //   "order" = le nom du champ dans la classe OrderItem qui référence Order.
    //   Sans mappedBy, JPA créerait une table de jointure intermédiaire inutile.

    // -------------CascadeType.ALL----------------------------
    //  → Les opérations sur Order se propagent automatiquement aux OrderItems.
    //   Si on sauvegarde une Order → ses items sont sauvegardés.
    //   Si on supprime une Order → ses items sont supprimés.
    //   CascadeType.ALL = PERSIST + MERGE + REMOVE + REFRESH + DETACH.

    //-------------orphanRemoval = true------------------------
     //  → Si on retire un OrderItem de la liste items (order.getItems().remove(item)),
    //   JPA le supprime automatiquement de la BDD.
    //   Sans orphanRemoval, l'item resterait en BDD avec un order_id orphelin.

    private List<OrderItem> items = new ArrayList<>();

    // --- Constructeurs ---

    public Order() {}
    // → Obligatoire pour JPA/Hibernate (instanciation par réflexion).

    // Constructeur utilisé lors de la création d'une nouvelle commande
    public Order(String reference, LocalDate orderDate, Double totalAmount, String status, User user) {
        this.reference = reference;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.user = user;
        this.discountRate = 0.0; // Ajout de  securite pour le constructeur
    }

    // --- Getters et Setters ---
    // → ENCAPSULATION (pilier de la POO). Les attributs sont privés,
    //   l'accès passe par des méthodes contrôlées.
    //   Jackson utilise les getters pour sérialiser l'objet en JSON.

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
