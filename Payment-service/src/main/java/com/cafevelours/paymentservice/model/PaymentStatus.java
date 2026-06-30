package com.cafevelours.paymentservice.model;

public enum PaymentStatus {
    PENDING,
    /**
     * Le paiement est initié mais l'autorisation bancaire ou le traitement
     * asynchrone est en cours. La commande reste bloquée dans l'attente du résultat.
     */

    ACCEPTED,
    /**
     * La transaction financière a été validée avec succès par la banque ou le simulateur.
     * Cet état va déclencher (via l'architecture) le passage de la commande au statut "Payée/Confirmée".
     */
    REFUSED
    /**
     * Le paiement a été rejeté (fonds insuffisants, fraude, expiration du token).
     * La commande associée est suspendue ou annulée pour défaut de paiement.
     */
}
