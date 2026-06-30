package com.cafevelours.paymentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
/** 1. `@SpringBootConfiguration` : Désigne cette classe comme source de configuration pour le contexte de l'application.
 * 2. `@EnableAutoConfiguration` : Demande à Spring Boot de configurer automatiquement l'application en fonction des dépendances présentes dans le fichier `pom.xml` (ex: si la dépendance MySQL/JPA est détectée, il pré-configure la connexion à la BDD).
 * 3. `@ComponentScan` : Active le balayage automatique de l'application. Spring va scanner le package courant (`com.cafevelours.paymentservice`) et tous ses sous-packages pour détecter et instancier automatiquement les classes annotées avec `@Component`, `@RestController`, `@Service`, ou `@Repository` sous forme de Beans Spring.
 */
public class PaymentServiceApplication {
/* 1. Crée et initialise le conteneur d'inversion de contrôle (IoC Context).
 * 2. Déclenche le scan des packages pour instancier nos Beans (Contrôleurs, Services, Repositories).
 * 3. Démarre un serveur web embarqué (par défaut **Tomcat**) sur le port configuré pour écouter les requêtes HTTP entrantes.
 */
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
