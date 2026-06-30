package com.cafevelours.paymentservice.controller;

import com.cafevelours.paymentservice.model.Payment;
import com.cafevelours.paymentservice.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/* → `@RestController` combine `@Controller` et `@ResponseBody`. Cela signifie que chaque méthode */
/* renvoie directement les données métiers sérialisées au format JSON (au lieu de chercher à afficher une vue HTML).*/
@RestController
@RequestMapping("/api/payments") // Décoiffe l'URI racine pour tous les endpoints de ce contrôleur
public class PaymentController {

    // Injection de dépendance par constructeur (recommandé par Spring pour l'immutabilité et les tests unitaires)
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Endpoint pour traiter un paiement
     *  → Conformément aux standards de l'architecture REST, le verbe `POST` est utilisé pour *créer* * une nouvelle ressource (une transaction de paiement). De plus, cela évite de faire transiter
     *  des informations financières sensibles directement dans l'URL.
     * POST http://localhost:8083/api/payments
     *  @param orderId ID de la commande concernée (transmis via @RequestParam dans l'URL)
     *  @param amount Montant total de la transaction
     *  @return Le modèle 'Payment' créé encapsulé dans une ResponseEntity avec le code HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<Payment> processPayment(
            @RequestParam Long orderId,
            @RequestParam Double amount) {
        // Appel de la couche service pour exécuter la logique métier (validation, simulation bancaire)


        Payment payment = paymentService.processPayment(orderId, amount);
        // Renvoie l'objet créé avec le statut HTTP 201 (CREATED) garantissant la réussite de la création côté serveur
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    /**
     * Endpoint pour récupérer le paiement lié à une commande
     * GET http://localhost:8083/api/payments/order/{orderId}
     * → `@RequestParam` extrait des paramètres de requête (ex: `?orderId=1&amount=45`), idéal pour filtrer ou passer des données.
     * → `@PathVariable` extrait une valeur directement intégrée dans le segment de l'URI (ex: `/order/1`). On l'utilise
     * lorsque le paramètre fait partie intégrante de l'identité de la ressource recherchée.
     * * @param orderId ID de la commande lu directement dans le chemin de l'URL
     * @return Le statut du paiement avec un code HTTP 200 (OK)
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        // Raccourci Spring pour renvoyer le corps de la réponse avec le statut HTTP 200 OK
        return ResponseEntity.ok(payment);
    }
}