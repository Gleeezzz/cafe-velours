package com.cafevelours.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

// → Même principe que ProductClient : ce nom correspond exactement à
//   spring.application.name dans le application.properties du Payment-Service.
//   Feign interroge Consul pour résoudre ce nom en adresse réelle (localhost:8083).
@FeignClient(name = "payment-service")
public interface PaymentClient {

    // → Le verbe HTTP POST est utilisé car on CRÉE une transaction de paiement.
    //   GET = lire des données sans effet de bord.
    //   POST = créer une ressource ou déclencher une action avec effet (débit...).
    //   Utiliser GET pour un paiement serait une violation des conventions REST
    //   et un risque de sécurité (les GET peuvent être mis en cache ou loggués).
    //

    /**
     * Appelle l'endpoint POST de payment-service pour traiter un paiement
     */
    // → @RequestParam envoie les paramètres dans l'URL sous forme de query string :
    //   POST /api/payments?orderId=42&amount=36.40
    //   C'est différent de @RequestBody qui enverrait un JSON dans le body.
    //   Les deux approches sont valides — ici on a choisi query params
    //   pour sa simplicité côté Payment-Service.
    @PostMapping("/api/payments")
    Object processPayment(
            // orderId → identifiant de la commande à payer
            // Permet au Payment-Service de lier le paiement à la commande
            @RequestParam("orderId") Long orderId,

            // amount → montant final après remise éventuelle
            // C'est le montant réel débité, calculé dans l'OrderController
            @RequestParam("amount") Double amount
    );

    // → Dans cette version du projet, on n'a pas besoin d'exploiter
    //   le détail de la réponse du Payment-Service.
    //   On vérifie juste que l'appel ne lève pas d'exception (= paiement OK).
    //   Object est flexible : il accepte n'importe quel JSON retourné
    //   sans nécessiter de classe de mapping dédiée.
    //   En production, on créerait un PaymentResponseDTO avec
    //   les champs : transactionId, status, timestamp..
}
