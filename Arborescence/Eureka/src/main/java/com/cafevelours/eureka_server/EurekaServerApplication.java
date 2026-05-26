package com.cafevelours.eureka_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer; // L'import va s'ajouter tout seul

@SpringBootApplication
@EnableEurekaServer // 👈 chaque ms va s'enregistrer pour que les autres puissent le trouver //
public class EurekaServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaServerApplication.class, args);
	}
}