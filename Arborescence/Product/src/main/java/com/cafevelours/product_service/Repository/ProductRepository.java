package com.cafevelours.product_service.Repository; // 👈 Interface d'acces aux données
// Fait le pont entre la logique métier et la base MySQL

import com.cafevelours.product_service.model.Product; // 👈 // → C'est une interface Spring Data JPA qui fournit automatiquement
//   toutes les opérations CRUD sans écrire de code
//   Les deux types génériques sont : <Product, Long>

import org.springframework.data.jpa.repository.JpaRepository;
// → @Repository est un stéréotype Spring. Il indique à Spring de créer
//   automatiquement une implémentation de cette interface au démarrage
//   (via un proxy dynamique)

import org.springframework.stereotype.Repository;
//   Spring s'en charge entièrement.
//   @Repository active aussi la traduction des exceptions SQL en exceptions Spring.


import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {  // → C'est la magie de Spring Data JPA : il analyse le nom de la méthode.
   // Spring génère automatiquement : SELECT * FROM products WHERE category = ?
    //   On appelle ça le "Query Method Naming" ou dérivation de requête.

    // → On peut utiliser @Query("SELECT p FROM Product p WHERE p.price < :max")
    //   pour écrire du JPQL (langage de requête JPA orienté objet).
    List<Product> findByCategory(String category);

}