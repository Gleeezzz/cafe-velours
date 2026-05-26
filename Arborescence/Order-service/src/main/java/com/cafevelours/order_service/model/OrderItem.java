package com.cafevelours.order_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  LA PLACE DE TA VARIABLE EST ICI, DANS LA CLASSE :
    @Transient   // Pour stocker temporairement le nom recupere via OpenFeign sans alourdir la base H2
    private String productName;

    @Column(nullable = false)
    private Long productId; // L'identifiant du produit venant du microservice Product

    private Integer quantity; // Quantité (Ex: 1)
    private Double price;     // Prix au moment de l'achat (Ex: 18.90)

    // Rattachement à la commande parente
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // --- Constructeurs ---
    public OrderItem() {}

    public OrderItem(Long productId, Integer quantity, Double price, Order order) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.order = order;
    }

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

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}