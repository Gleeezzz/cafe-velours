package com.cafevelours.order_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ex: "Sophie Martin"

    @Column(nullable = false, unique = true)
    private String email; // Ex: "sophie@email.com"

    private String address; // Ex: "12 rue de Fleurs, Marseille"
    private String phoneNumber; // Ex: "06 12 34 56 78"
    private LocalDate memberSince; // Ex: Janvier 2026

    // --- Constructeurs ---
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

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDate getMemberSince() { return memberSince; }
    public void setMemberSince(LocalDate memberSince) { this.memberSince = memberSince; }
}
