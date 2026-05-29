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

    @Column(nullable = false)
    private String status; // 💡 PENDING, ACCEPTED, REFUSED

    @Column(unique = true)
    private String transactionReference; // 💡 Numéro de transaction unique (ex: UUID)
}