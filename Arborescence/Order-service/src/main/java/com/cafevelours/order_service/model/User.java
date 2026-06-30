package com.cafevelours.order_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;

// → @Entity est une annotation JPA qui indique à Spring Boot que cette classe
// Java est un modèle persistant (qui a vocation à être mappé avec la base de données).
//   @Table(name = "users") est optionnel mais fortement recommandé :
//   il spécifie explicitement le nom de la table SQL ("users"). Sans cela,
//   Hibernate nommerait la table "User" par défaut (ce qui peut poser problème car "user" est un mot-clé réservé dans certains SGBD comme PostgreSQL).

@Entity
@Table(name = "users")
public class User {
    // → IDENTITY délègue l'auto-incrémentation directement au SGBD (colonne `AUTO_INCREMENT` sous MySQL). C'est idéal pour MySQL.
    //   SEQUENCE est utilisé pour PostgreSQL ou Oracle qui gèrent des objets séquences indépendants.
    //   AUTO laisse Hibernate choisir, ce qui est risqué en production car moins prédictible.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //   → `nullable = false` applique une contrainte de niveau base de données (NOT NULL) empêchant d'enregistrer un utilisateur sans nom.
    //   `unique = true` génère un index unique SQL empêchant d'avoir deux clients avec le même email (essentiel pour notre système de connexion !).

    @Column(nullable = false)
    private String name; // Ex: "Sophie Martin"

    @Column(nullable = false, unique = true)
    private String email; // Ex: "sophie@email.com"

    private String address; // Ex: "12 rue de Fleurs, Marseille"
    private String phoneNumber; // Ex: "06 12 34 56 78"
    private LocalDate memberSince; // Ex: Janvier 2026
    private String password;
    // Grâce au composant BCryptPasswordEncoder intégré dans l'application, la chaîne injectée dans ce champ `password` n'est jamais le texte brut saisi par l'utilisateur,
    // mais son empreinte cryptographique (hash) irréversible.
    // private String password;

    // --- Constructeurs ---
    // → C'est une obligation stricte de la spécification JPA / Hibernate. Hibernate utilise la réflexion Java pour instancier l'objet à vide lorsqu'il lit les lignes de la base de données,
    // puis il utilise les Setters ou l'accès direct aux champs pour injecter les données SQL. Sans constructeur vide, le code lève une exception au démarrage.
    public User() {}

    public User(String name, String email, String address, String phoneNumber, LocalDate memberSince) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.memberSince = memberSince;
    }

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() {
        return password;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDate getMemberSince() { return memberSince; }
    public void setMemberSince(LocalDate memberSince) { this.memberSince = memberSince; }

    public void setPassword(String password) { this.password = password; }
}
