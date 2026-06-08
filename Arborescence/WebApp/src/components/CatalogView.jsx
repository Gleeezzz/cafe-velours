import React, { useState, useEffect } from 'react';

export default function CatalogView({ onAddToCart }) {
    // États pour stocker les données de la BDD et gérer le chargement
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Tous');

    // Appel à l'API Gateway au chargement du composant
    useEffect(() => {
        // Remplacer temporairement le port 8080 (Gateway) par le port 8082 (Service direct)
        const GATEWAY_URL = 'http://localhost:8080/api/products';
        fetch(GATEWAY_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }
                return response.json(); // Transforme le JSON reçu de Java en objet JS
            })
            .then((data) => {
                setProducts(data); // Injecte les vrais produits dans l'état
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur de connexion à la Gateway :", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Gestion des onglets de filtres thématiques
    const categories = ['Tous', 'Cafés Grains', 'Cafés Moulus', 'Chocolats Fins'];

    const filteredProducts = activeFilter === 'Tous'
        ? products
        : products.filter(p => p.category === activeFilter);

    // Écrans de transition pour éviter les plantages visuels
    if (loading) {
        return (
            <div className="catalog-container" style={{padding: '40px', textAlign: 'center'}}>
                <p>☕ Connexion au microservice Product via la Gateway...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalog-container" style={{padding: '40px', textAlign: 'center', color: '#721c24'}}>
                <h3>⚠️ Échec de communication Microservice</h3>
                <p>Vérifie que ta Gateway (8080) et ton ProductService (8082) sont démarrés.</p>
                <p><small>Détail : {error}</small></p>
            </div>
        );
    }

    return (
        <div className="catalog-container">
            {/* Fil d'Ariane signature Café Velours */}
            <div className="catalog-breadcrumb-bar">
                <span>Accueil</span> / <span>Catalogue</span> / <strong>{activeFilter}</strong>
            </div>

            <h2 className="catalog-title">Notre Sélection d'Exception</h2>

            {/* Barre de filtres */}
            <div className="filter-tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${activeFilter === cat ? 'active-filter' : ''}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grille de produits synchronisée avec Java */}
            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-wrapper">
                            {product.badge && <span className="product-card-badge">{product.badge}</span>}
                            {/* Solution de secours : si la BDD n'a pas d'image valide, on met un émoji stylé selon la catégorie */}
                            <span style={{fontSize: '3rem', display: 'block', textAlign: 'center', marginTop: '20px'}}>
                                {product.category?.includes('Café') ? '☕' : '🍫'}
                            </span>
                        </div>

                        <div className="product-info">
                            <h4 className="product-name">{product.name}</h4>
                            <p className="product-desc">{product.desc || product.description}</p>
                        </div>

                        <div className="product-footer">
                            <span className="product-price">{parseFloat(product.price).toFixed(2)} $</span>
                            <button className="btn-add-cart" onClick={() => onAddToCart(product)}>
                                + Panier
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}