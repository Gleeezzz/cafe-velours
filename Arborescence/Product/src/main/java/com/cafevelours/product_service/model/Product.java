package com.cafevelours.product_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;           // 👈 C'est celui-ci qui te manque !
import jakarta.persistence.ElementCollection; // 👈 Nécessaire pour tastingNotes
import jakarta.persistence.CollectionTable;   // 👈 Nécessaire pour tastingNotes
import jakarta.persistence.JoinColumn;       // 👈 Nécessaire pour tastingNotes
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;          // Ex: "Finca El Paraiso"

    @Column(nullable = false)
    private Double price;         // Ex: 18.90

    @Column(nullable = false)
    private String category;      // CAFE, CHOCOLAT, PACK_DUO

    private String imageUrl;      // Chemin ou URL de l'image du paquet
    private String weight;        // Ex: "250g" ou "80g"
    private String origin;        // Ex: "Guatemala - Huehuetenango"

    @Column(length = 1000)
    private String description;   // Ex: "Récolté à 1600m d'altitude..."

    @ElementCollection //
    @CollectionTable(name = "product_tasting_notes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "note")
    private List<String> tastingNotes; // Ex: ["Caramel", "Amande grillée"]

    private String pairingNotes;  // Ex: "Accord: Caramel + fruits noirs" (Spécifique aux Packs)

    // --- Constructeurs ---
    public Product() {}

    public Product(String name, Double price, String category, String imageUrl, String weight, String origin, String description, List<String> tastingNotes, String pairingNotes) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.weight = weight;
        this.origin = origin;
        this.description = description;
        this.tastingNotes = tastingNotes;
        this.pairingNotes = pairingNotes;
    }

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getTastingNotes() { return tastingNotes; }
    public void setTastingNotes(List<String> tastingNotes) { this.tastingNotes = tastingNotes; }

    public String getPairingNotes() { return pairingNotes; }
    public void setPairingNotes(String pairingNotes) { this.pairingNotes = pairingNotes; }
}
