package com.cafevelours.product_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//   1. @SpringBootConfiguration : Marque la classe comme source de configuration pour le contexte.
//   2. @EnableAutoConfiguration : Indique à Spring de configurer automatiquement l'application (comme la base de données SQL ou les dépendances) selon les jars présents dans le classpath.
//   3. @ComponentScan : Indique à Spring de scanner le package courant (`com.cafevelours.product_service`) et ses sous-packages pour détecter et enregistrer tous les composants (comme tes @RestController ou @Service) sous forme de Beans.
public class ProductServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

}
