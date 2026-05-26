package com.cafevelours.product_service.Repository; // 👈 Assure-toi que le package a bien l'underscore si ton dossier en a un

import com.cafevelours.product_service.model.Product; // 👈 Modifie cette ligne en ajoutant l'underscore _
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
}