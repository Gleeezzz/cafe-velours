# ☕ Café Velours - Microservices Architecture

Welcome to the main repository of **Café Velours**, an e-commerce coffee shop management application built on a highly available, resilient, and scalable 'microservices' architecture.

---

## 🏗️ Global System Architecture

The application is split into autonomous microservices, each possessing its own dedicated database (Pattern: *Database per Service*). They communicate synchronously and are orchestrated by a service discovery registry.

* **`gateway-service` (Port 8080)**: Single entry point for the application (API Gateway). Handles dynamic routing.
* **`product-service` (Port 8081)**: Catalog management (coffees, goodies).
* **`order-service` (Port 8082)**: Order processing and customer purchase history.
* **`payment-service` (Port 8083)**: Secure banking transaction processing and simulation.

---

## 🛠️ Tech Stack

* **Back-end Framework**: Spring Boot 3.5.x & Spring Cloud
* **Data Access**: Spring Data JPA / Hibernate
* **Databases**: MySQL 8.0 (Isolated instances hosted on port `3310`)
* **Service Discovery & Registry**: HashiCorp Consul (Port `8500`)
* **Inter-Service Communication**: Spring Cloud OpenFeign (Synchronous HTTP Requests)
* **API Gateway**: Spring Cloud Gateway (Reactive Webflux Engine)
* **Productivity**: Lombok (Builders, Getters/Setters, Logging)

---

## 🗺️ API Gateway Routing Map (Port 8080)

All client requests must transit through the API Gateway, which forwards the traffic dynamically:

| Microservice | Gateway Exposed Route | HTTP Method | Description |
| :--- | :--- | :--- | :--- |
| **Product** | `/api/products/**` | `GET` / `POST` | Catalog consultation and management |
| **Order** | `/api/orders/**` | `GET` / `POST` | Order creation and purchase history |
| **Payment** | `/api/payments/**` | `GET` / `POST` | Payment processing and tracking |

---

## 🔄 Transactional Workflow: Creating an Order

When a customer checks out, the following synchronous workflow triggers seamlessly:

1. **Client Request**: `POST http://localhost:8080/api/orders`
2. **Gateway**: Routes the request to an available instance of `order-service`.
3. **Order Service**:
    * Dynamically calculates the total order amount.
    * Saves the order with an initial `PENDING` status.
    * Triggers a synchronous call via **OpenFeign** to the `payment-service`.
4. **Payment Service**:
    * Generates a unique transaction reference (UUID).
    * Simulates banking authorization.
    * Persists the transaction in its local database and returns the status (`ACCEPTED` / `REFUSED`).
5. **Resolution (Order Service)**:
    * If the payment is authorized ➡️ Order status updates to `PAID`.
    * If the payment fails or a timeout occurs ➡️ Order status switches to `PAYMENT_FAILED` (Handled via a secure `try/catch` block).

---

## 🚀 Quick Start

### 1. Prerequisites
* Docker & Docker Compose
* Java 17 or higher
* Maven

### 2. Infrastructure Setup
Ensure that the Consul registry and the MySQL database are up and running:
```bash
docker-compose up -d 
```

### 3. Services Startup Order
For optimal service discovery, start the applications within your IDE (IntelliJ) in the following order:

1. `GatewayApplication`
2. `ProductServiceApplication`
3. `PaymentServiceApplication`
4. `OrderServiceApplication`

