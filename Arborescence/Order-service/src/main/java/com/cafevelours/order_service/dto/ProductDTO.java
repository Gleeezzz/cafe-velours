package com.cafevelours.order_service.dto;


public class ProductDTO {
    // → Ce sont les trois seules données du catalogue nécessaires au processus de commande.
    //   L'ID sert à l'enregistrement dans la table de jointure `order_items`, le nom sert à l'affichage dans l'historique client,
    //   et le prix sert à calculer le montant total brut de la commande. Le reste des attributs du produit
    //   (origine du café, intensité, image, description) n'intéresse pas l'Order-Service.
    private Long id;
    private String name;
    private Double price;

    // Constructeurs
    public ProductDTO() {}

    // → Lors de l'appel OpenFeign, la réponse HTTP revient sous forme de texte JSON.
    // Spring utilise une bibliothèque appelée **Jackson** pour désérialiser ce JSON et reconstruire cet objet Java automatiquement.
    // Jackson a impérativement besoin de ce constructeur vide pour instancier l'objet `ProductDTO` à blanc avant d'utiliser les Setters pour injecter les valeurs du JSON.
    public ProductDTO(Long id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // Getters et Setters
    // Indispensables pour l'encapsulation et pour permettre à Jackson d'accéder aux attributs privés lors de la conversion JSON <-> Java.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
