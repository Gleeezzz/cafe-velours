package com.cafevelours.product_service.model;

import jakarta.persistence.Entity; // Déclare que cette classe est une entité gérée par JPA
import jakarta.persistence.Table; // Permet de préciser le nom exact de la table SQL
import jakarta.persistence.Id;  // Marque le champ comme clé primaire
import jakarta.persistence.GeneratedValue; // Indique que la valeur est auto-générée
import jakarta.persistence.GenerationType;  // Définit la stratégie de génération (IDENTITY = auto-increment SQL)
import jakarta.persistence.Column;           // Permet de configurer les contraintes d'une colonne SQL
import jakarta.persistence.ElementCollection; // Pour mapper une liste de valeurs simples (pas une entité)
import jakarta.persistence.CollectionTable;   // Précise le nom de la table de jointure pour @ElementCollection
import jakarta.persistence.JoinColumn;       // Définit la colonne FK dans la table de jointure
import java.util.List;

@Entity
//→ Elle dit à Spring/Hibernate : "Cette classe correspond à une table SQL.
@Table(name = "products")
// → Par convention JPA utiliserait "product" (nom de la classe en minuscule).
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // → Délègue la génération de l'id au moteur SQL (AUTO_INCREMENT en MySQL).
    private Long id;   // → Long (objet Java) peut être null, ce qui permet à JPA de détecter

    @Column(nullable = false)
    // → Ça ajoute une contrainte NOT NULL au niveau de la colonne SQL
    private String name;          // Ex: "Finca El Paraiso"

    @Column(nullable = false)
    private Double price;         // Ex: 18.90 - Double nullable (≠ double primitif)

    @Column(nullable = false)
    private String category;      // Valeurs possibles : "Cafés Grains", "Chocolats", "Packs Duo"

    private String imageUrl;      // Chemin ou URL de l'image du paquet
    private String weight;        // Ex: "250g" ou "80g"
    private String origin;        // Ex: "Guatemala - Huehuetenango"

    @Column(length = 1000)
    private String description;   // Ex: "Récolté à 1600m d'altitude..."

    @ElementCollection  // → @ElementCollection sert à stocker une liste de types simples (String, Integer...)
    //   qui ne sont PAS des entités JPA à part entière.

    @CollectionTable(name = "product_tasting_notes", joinColumns = @JoinColumn(name = "product_id"))
    // → JPA va créer (ou utiliser) une table séparée pour stocker la liste.
    // → Précise le nom de la colonne dans product_tasting_notes qui contient la valeur String.

    @Column(name = "note")
    private List<String> tastingNotes; // Ex: ["Caramel", "Amande grillée"]

    private String pairingNotes;  //Ex : "Jasmin, Bergamote"
    // Champ spécifique aux Packs Duos — accord café + chocolat recommandé

    // --- Constructeurs ---
    // → JPA l'exige obligatoirement. Hibernate instancie les objets en appelant
    //   le constructeur sans argument par réflexion Java, puis remplit les champs
    //   via les setters. Sans ce constructeur, Hibernate lève une exception au démarrage.

    public Product() {}
    // Constructeur complet utilisé pour créer un produit manuellement (tests, seeds...)

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
    // → C'est le principe d'ENCAPSULATION (un des 4 piliers de la POO).
    //   Les attributs sont privés → on contrôle l'accès via des méthodes publiques.
    //   Ça permet d'ajouter une validation dans un setter si besoin (ex: prix > 0).
    //   Jackson (la lib JSON de Spring) utilise aussi les getters pour sérialiser
    //   l'objet en JSON lors de la réponse HTTP.

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
