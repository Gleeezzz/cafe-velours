package com.cafevelours.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


// → Avec les versions modernes de Spring Cloud Gateway, l'annotation `@SpringBootApplication` suffit amplement.
//   Dès que la dépendance `spring-cloud-starter-gateway` est présente dans le fichier `pom.xml`, Spring Boot
//   détecte automatiquement qu'il doit configurer un serveur de routage réactif (basé sur Netty et non Tomcat)
//   et applique les configurations définies dans le fichier de propriétés.
@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

}
