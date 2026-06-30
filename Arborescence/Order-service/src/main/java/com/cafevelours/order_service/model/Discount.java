package com.cafevelours.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// → C'est l'équivalent NoSQL MongoDB de l'annotation `@Table` en SQL.
// Elle indique à Spring Data MongoDB que cette classe Java doit être sérialisée et stockée sous forme de document BSON (JSON binaire)
// au sein d'une collection nommée "discounts".
@Document(collection = "discounts")
// → J'utilise la bibliothèque **Lombok**. Au moment de la compilation,
//  Lombok génère automatiquement le code répétitif (*boilerplate code*) grâce aux annotations :
//   - `@Data` : Génère tous les getters, setters, les méthodes `toString()`, `equals()` et `hashCode()`.
//   - `@NoArgsConstructor` : Génère un constructeur vide (nécessaire pour Spring Data).
//   - `@AllArgsConstructor` : Génère un constructeur avec tous les champs.
//   Cela permet de garder un code source extrêmement propre, lisible et facile à maintenir
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Discount {
    // → Dans MySQL, on utilise un `Long` auto-incrémenté. Dans MongoDB, les identifiants uniques par défaut sont des `ObjectId`
    // (des chaînes de caractères de 24 caractères hexadécimaux générées de manière distribuée).
    // Déclarer l'ID en `String` permet à Spring Data de mapper automatiquement cet ObjectId de MongoDB en chaîne Java.
    @Id
    private String id;
    private double minAmount; // Montant minimum d'achat requis dans le panier (ex: 30.00 $)
    private double discountRate; // Taux de réduction appliqué (ex: 0.10 pour 10% de remise)
}
