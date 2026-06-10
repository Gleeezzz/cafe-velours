-- 1. Nettoyage de sécurité (évite les conflits si le script passe deux fois)
DELETE FROM product_tasting_notes;
DELETE FROM products;

-- 2. Insertion du premier café avec l'ID 1 FORCÉ (très important pour Order-Service !)
INSERT INTO products (id, name, price, category, origin, description, weight, image_url, pairing_notes)
VALUES (1, 'Finca El Paraiso', 18.90, 'Café Grain', 'Colombie', 'Un café d''exception aux notes de fruits rouges.', '250g', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600', 'Chocolat noir');

-- 3. Insertion de ses notes de dégustation liées à l'id 1
INSERT INTO product_tasting_notes (product_id, note) VALUES (1, 'Fruits rouges');
INSERT INTO product_tasting_notes (product_id, note) VALUES (1, 'Acidité brillante');

-- 4. Insertion du deuxième produit (chocolat ou autre) avec l'ID 2
INSERT INTO products (id, name, price, category, origin, description, weight, image_url, pairing_notes)
VALUES (2, 'Tablette Chocolat Noir', 5.50, 'Épicerie', 'Équateur', 'Chocolat 70% idéal pour accompagner ton café.', '100g', 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=600', 'Café filtre');

-- 5. Insertion du troisième produit (Pack Duo) avec l'ID 3
INSERT INTO products (id, name, price, category, origin, description, weight, image_url, pairing_notes)
VALUES (3, 'Pack Duo Velours', 22.00, 'Coffret', 'Multi', 'Le combo parfait pour découvrir notre gamme.', '1 Pack', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600', 'Tous moments');