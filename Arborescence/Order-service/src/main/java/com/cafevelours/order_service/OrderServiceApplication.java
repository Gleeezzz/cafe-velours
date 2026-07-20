package com.cafevelours.order_service;

import com.cafevelours.order_service.model.Discount;
import com.cafevelours.order_service.repository.DiscountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🧪 TEST ULTIME : Initialisation et vérification explicite de la collection MongoDB
    @Bean
    CommandLineRunner initMongoData(DiscountRepository discountRepository) {
        return args -> {
            System.out.println("🧹 Nettoyage de la collection Mongo...");
            discountRepository.deleteAll();

            Discount discount = new Discount();
            discount.setMinAmount(50.0);
            discount.setDiscountRate(0.10);

            discountRepository.save(discount);

            System.out.println("=================================================");
            System.out.println("✅ Règle de remise insérée avec succès dans MongoDB !");
            System.out.println("📊 Nombre total de documents dans 'discounts' : " + discountRepository.count());
            System.out.println("=================================================");
        };
    }
}