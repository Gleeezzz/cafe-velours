package com.cafevelours.order_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference; // Ex: "#CV-2026-0042"

    private LocalDate orderDate; // Ex: 16 mars 2026
    private Double totalAmount;  // Ex: 36.40
    private String status;       // Ex: "Confirmée" ou "Expédiée"

    // Lien vers l'utilisateur qui a passé la commande
    @ManyToOne(cascade = CascadeType.PERSIST) // 💡 Permet de créer le User automatiquement lors de la commande !
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Une commande contient plusieurs lignes d'articles (OrderItem)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // --- Constructeurs ---
    public Order() {}

    public Order(String reference, LocalDate orderDate, Double totalAmount, String status, User user) {
        this.reference = reference;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.user = user;
    }

    // --- Getters et Setters ---
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
