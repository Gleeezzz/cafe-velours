package com.cafevelours.order_service.service;

import com.cafevelours.order_service.client.ProductClient;
import com.cafevelours.order_service.dto.ProductDTO;
import com.cafevelours.order_service.model.Order;
import com.cafevelours.order_service.model.OrderItem;
import com.cafevelours.order_service.model.User;
import com.cafevelours.order_service.repository.OrderRepository;
import com.cafevelours.order_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//  @Service:
//  → C'est un stéréotype Spring (comme @Controller, @Repository).
//   Il indique à Spring que cette classe contient de la logique métier
//   et doit être gérée comme un bean dans le conteneur IoC.
//   Spring crée automatiquement une instance unique (singleton) de cette
//   classe et l'injecte partout où elle est déclarée comme dépendance.
@Service
public class OrderService {

    //  INJECTIONS DE DÉPENDANCES
    // → Pour récupérer le prix réel du produit depuis le Product-Service
    //   au moment de la commande. On ne fait pas confiance au prix
    //   envoyé par le frontend (il pourrait être falsifié côté client).
    //   → Sécurité : le prix est toujours lu depuis la BDD produit.
    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductClient productClient, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
        this.userRepository = userRepository;  // ✅ ajouté ici
    }

    //  MÉTHODE PRINCIPALE : createOrder()
    // → @Transactional enveloppe toute la méthode dans une transaction SQL.
    //   Si une exception survient N'IMPORTE OÙ dans la méthode,
    //   toutes les opérations SQL déjà effectuées sont annulées (ROLLBACK).
    //   Si tout se passe bien → COMMIT (les données sont persistées).
    @Transactional
    public Order createOrder(List<Map<String, Object>> itemsFromFrontend, Long userId) {

        // Création d'un objet Order vide — sera rempli progressivement
        Order order = new Order();
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        //  BOUCLE : Traitement de chaque article du panier
        // → Le frontend React envoie un JSON comme :
        //   [{ "productId": 3, "quantity": 2 }, { "productId": 7, "quantity": 1 }]
        //   Map<String, Object> mappe chaque article JSON sans créer de DTO dédié.
        //   La clé (String) = nom du champ JSON, la valeur (Object) = sa valeur.
        for (Map<String, Object> itemMap : itemsFromFrontend) {
            Long productId = Long.valueOf(itemMap.get("productId").toString());
            int quantity = Integer.parseInt(itemMap.get("quantity").toString());

            // Extraction et conversion des valeurs depuis la Map
            // .toString() puis Long.valueOf() car la Map stocke des Object,
            // pas directement des Long/int → conversion explicite nécessaire

            ProductDTO product = productClient.getProductById(productId);

            if (product != null) {
                // Création d'une ligne de commande pour cet article
                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(productId);
                orderItem.setQuantity(quantity);

                // → On persist le prix officiel au moment de l'achat.
                //   Si le prix change demain, l'historique reste cohérent.
                orderItem.setPrice(product.getPrice());

                // Lien bidirectionnel : l'item connaît sa commande parente
                // → permet à JPA d'écrire le bon order_id en BDD via cascade
                orderItem.setOrder(order);

                orderItems.add(orderItem);

                // Accumulation du total : prix unitaire × quantité
                totalAmount += product.getPrice() * quantity;
            }
        }

        //  FINALISATION DE LA COMMANDE

        // Rattachement de tous les items à la commande
        // → grâce à cascade = CascadeType.ALL dans Order,
        //   les OrderItems seront sauvegardés automatiquement avec la commande
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");

        // → UUID.randomUUID() génère un identifiant universel unique (128 bits).
        //   Ex complet : "550e8400-e29b-41d4-a716-446655440000"
        //   .toString().substring(0, 6) → on prend les 6 premiers caractères
        //   .toUpperCase() → on met en majuscules pour lisibilité
        //   Résultat final : "#CV-2026-A3F9D2"
        //   La contrainte unique = true sur la colonne reference en BDD
        //   garantit qu'il ne peut pas y avoir de doublon (protection supplémentaire).
        // Génération automatique d'une référence unique
        String generatedRef = "#CV-2026-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        order.setReference(generatedRef);

        // → JPA nécessite un objet User complet pour établir la relation @ManyToOne.
        //   On ne peut pas juste faire order.setUserId(userId) car le champ
        //   est typé User (objet), pas Long.
        //   orElseThrow → si l'userId est invalide, on lève une exception
        //   AVANT de sauvegarder quoi que ce soit → cohérence garantie.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + userId));
        order.setUser(user);

        // → INSERT INTO orders (...) VALUES (...)
        //   Grâce à @Transactional + cascade ALL :
        //   → les OrderItems sont aussi insérés automatiquement (INSERT INTO order_items)
        //   → si une erreur survient → ROLLBACK de tout (Order + OrderItems)
        //   Retourne l'objet Order avec son id MySQL généré, prêt pour le Controller.
        return orderRepository.save(order);
    }
}