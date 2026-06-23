package com.cafevelours.order_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
//   → Jackson (lib de sérialisation JSON de Spring) suit les relations JPA
//   pour construire le JSON. Sans @JsonIgnore, il ferait :
//   OrderItem → Order → List<OrderItem> → Order → ... → boucle infinie !
//   @JsonIgnore dit à Jackson : "N'inclus PAS ce champ dans le JSON."
//   → Coupe la boucle : on sérialise l'OrderItem sans remonter vers l'Order parent
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // → productName n'existe pas dans la table order_items en MySQL.
    //   Les noms de produits vivent dans le Product-Service (port 8082),
    //   pas dans l'Order-Service. On le récupère à la volée via OpenFeign
    //   et on le stocke temporairement en mémoire dans cet attribut.
    //   @Transient = JPA ignore ce champ → pas de colonne product_name en BDD.

    //  → Dans OrderController, pour chaque OrderItem, on appelle
    //   productClient.getProductById(item.getProductId()) via OpenFeign.
    //   OpenFeign fait un appel HTTP GET vers le Product-Service
    //   et retourne un ProductDTO avec le nom. On le set via setProductName().
    @Transient   // Pour stocker temporairement le nom recupere via OpenFeign sans alourdir la base H2
    private String productName;
    //  → Architecture microservices : l'Order-Service et le Product-Service
    //   sont des applications séparées avec des bases de données séparées.
    //   On ne peut pas faire de JOIN SQL entre deux BDD différentes.
    //   On stocke uniquement l'id → on appelle le Product-Service via HTTP
    //   (OpenFeign) quand on a besoin des détails du produit.

    @Column(nullable = false)
    private Long productId; // L'identifiant du produit venant du microservice Product

    private Integer quantity; // Quantité (Ex: 1)
    private Double price;     // Prix au moment de l'achat (Ex: 18.90)

    // Rattachement à la commande parente
    // → Plusieurs OrderItems (Many) appartiennent à une seule Order (One).
    //   C'est l'inverse de @OneToMany dans Order.java.
    //   En SQL : la table order_items a une colonne order_id (FK → orders.id).

    // → C'est OrderItem qui possède la relation car c'est lui qui a
    //   la clé étrangère order_id en base. C'est pourquoi Order.java utilise
    //   mappedBy = "order" → il délègue la gestion de la FK à OrderItem.
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)// FK obligatoire — un item sans commande n'a pas de sens
    @JsonIgnore // 💡 Bloque la boucle infinie dans le JSON !
    private Order order;

    // --- Constructeurs ---
    public OrderItem() {}

    public OrderItem(Long productId, Integer quantity, Double price, Order order) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.order = order;
    }

    // → Pour établir le lien bidirectionnel JPA dès la création.
    //   Quand on sauvegarde un OrderItem avec sa référence Order,
    //   Hibernate écrit automatiquement le bon order_id en SQL

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    // → Pour établir le lien bidirectionnel JPA dès la création.
    //   Quand on sauvegarde un OrderItem avec sa référence Order,
    //   Hibernate écrit automatiquement le bon order_id en SQL


    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}