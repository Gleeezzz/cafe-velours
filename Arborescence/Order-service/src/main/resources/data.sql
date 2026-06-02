SET FOREIGN_KEY_CHECKS = 0;

-- 1. On insère l'utilisateur Sophie Martin (ID 1)
REPLACE INTO users (id, name, email)
VALUES (1, 'Sophie Martin', 'sophie@email.com');

-- 2. On insère sa première commande (ID 1) -> Montant inférieur au palier NoSQL
REPLACE INTO orders (id, reference, order_date, total_amount, status, user_id)
VALUES (1, '#CV-2026-0042', '2026-03-16', 26.40, 'PAID', 1);

-- Lignes de la commande 1 (Rattachées à l'order_id = 1)
REPLACE INTO order_items (id, product_id, quantity, price, order_id) VALUES (1, 1, 1, 18.90, 1);
REPLACE INTO order_items (id, product_id, quantity, price, order_id) VALUES (2, 2, 1, 7.50, 1);

-- 3. On insère sa deuxième commande (ID 2) -> Montant éligible à la remise NoSQL de 10%
REPLACE INTO orders (id, reference, order_date, total_amount, status, user_id)
VALUES (2, '#CV-2026-0012', '2026-02-10', 60.00, 'PAID', 1);

-- Lignes de la commande 2 (Rattachées à l'order_id = 2)
REPLACE INTO order_items (id, product_id, quantity, price, order_id) VALUES (3, 3, 2, 30.00, 2);

SET FOREIGN_KEY_CHECKS = 1;