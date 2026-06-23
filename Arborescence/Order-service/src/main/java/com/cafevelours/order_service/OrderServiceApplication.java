package com.cafevelours.order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;// Ajoute cet import
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

//   1. @SpringBootConfiguration  → déclare cette classe comme source de config Spring
//   2. @EnableAutoConfiguration  → Spring Boot configure automatiquement les beans
//      nécessaires selon les dépendances présentes (ex: JPA si spring-data-jpa est
//      dans le pom.xml, Tomcat si spring-boot-starter-web est présent)
//   3. @ComponentScan            → Spring scanne tous les packages enfants pour
//      détecter les @Component, @Service, @Repository, @Controller, etc.

//   → Spring Boot :
//   1. Crée le contexte d'application (conteneur IoC)
//   2. Scanne et instancie tous les beans (@Component, @Service, @Repository...)
//   3. Configure la source de données (MySQL via application.properties)
//   4. Démarre le serveur Tomcat embarqué sur le port 8081
//   5. Enregistre le service auprès de Consul (service discovery)

@SpringBootApplication
// → Active l'enregistrement de ce microservice auprès de Consul (port 8500).
//   Au démarrage, l'Order-Service s'annonce à Consul :
//   "Je suis order-service, je tourne sur le port 8081, je suis disponible."
//   Les autres services (Gateway, Payment...) peuvent alors le trouver
//   via Consul sans avoir besoin de connaître son adresse IP directe.
//   C'est le principe du SERVICE DISCOVERY : les services se trouvent
//   dynamiquement sans configuration statique d'URLs.
@EnableDiscoveryClient
// → Active OpenFeign dans ce microservice.
//   OpenFeign permet d'appeler d'autres microservices via HTTP
//   comme si c'étaient de simples méthodes Java locales.
//   Sans cette annotation, les interfaces @FeignClient (ProductClient,
//   PaymentClient) ne seraient pas détectées par Spring au démarrage.

@EnableFeignClients // <-- LA LIGNE MAGIQUE ICI
public class OrderServiceApplication {
	// → C'est le point d'entrée de toute application Java.
	//   La JVM (Java Virtual Machine) cherche et exécute cette méthode
	//   en premier au lancement du programme.
	//   SpringApplication.run() démarre tout le contexte Spring Boot.
	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
