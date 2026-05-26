-- 1. On insère Sophie Martin (ID 1)
INSERT INTO users (id, name, email, address, phone_number, member_since)
VALUES (1, 'Sophie Martin', 'sophie@email.com', '12 rue de Fleurs, Marseille', '06 12 34 56 78', '2026-01-01');

-- 2. On insère sa première commande (ID 1, Référence #CV-2026-0042)
INSERT INTO orders (id, reference, order_date, total_amount, status, user_id)
VALUES (1, '#CV-2026-0042', '2026-03-16', 36.40, 'Confirmée', 1);

-- Lignes de la commande #CV-2026-0042 :
-- 1x Finca El Paraiso (ID Produit 1 à 18.90)
INSERT INTO order_items (product_id, quantity, price, order_id)
VALUES (1, 1, 18.90, 1);
-- 1x Tablette Chocolat Noir Pérou (ID Produit 2 à 7.50) -> Juste pour l'exemple, le total s'ajustera sur ton Front !
INSERT INTO order_items (product_id, quantity, price, order_id)
VALUES (2, 1, 7.50, 1);


-- 3. On insère sa deuxième commande (ID 2, Référence #CV-2026-0012)
INSERT INTO orders (id, reference, order_date, total_amount, status, user_id)
VALUES (2, '#CV-2026-0012', '2026-02-10', 26.50, 'Expédiée', 1);

-- Lignes de la commande #CV-2026-0012 :
-- 1x Pack Guatemala (ID Produit 3 à 26.50)
INSERT INTO order_items (product_id, quantity, price, order_id)
VALUES (3, 1, 26.50, 2);