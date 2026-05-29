package com.cafevelours.paymentservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId; // 💡 Référence vers la commande concernée

    @Column(nullable = false)
    private Double amount; // 💡 Montant payé

    // 🟢 Correction ici : On utilise l'Enum au lieu d'un simple String pour sécuriser les états
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(unique = true)
    private String transactionReference; // 💡 Numéro de transaction unique (ex: UUID)
}