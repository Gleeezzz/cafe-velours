import React, { useState, useEffect } from 'react';

export default function CatalogView({ onAddToCart, onRemoveFromCart, cart = [] }) {

    const getProductQuantity = (productId) => {
        const item = cart.find(i => i.id === productId);
        return item ? item.quantity : 0;
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Tous');

    useEffect(() => {
        const GATEWAY_URL = 'http://localhost:8080/api/products';
        fetch(GATEWAY_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur de connexion à la Gateway :", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const categories = ['Tous', 'Cafés Grains', 'Cafés Moulus', 'Chocolats Fins', 'Packs Duos'];

    const filteredProducts = products.filter(p =>
        activeFilter === 'Tous' || p.category === activeFilter
    );

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
            <div className="catalog-breadcrumb-bar">
                <span>Accueil</span> / <span>Catalogue</span> / <strong>{activeFilter}</strong>
            </div>

            <h2 className="catalog-title">Notre Sélection d'Exception</h2>

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

            <div className="products-grid">
                {filteredProducts.map(product => {
                    const qtyInCart = getProductQuantity(product.id);

                    return (
                        <div key={product.id} className="product-card">

                            <div className="product-image-wrapper">
                                <img
                                    src={product.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300"}
                                    alt={product.name}
                                />
                                <span className="product-card-badge">{product.category}</span>
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description || "Un café d'exception rigoureusement sélectionné."}</p>
                            </div>

                            <div className="product-footer">
                                <span className="product-price">{parseFloat(product.price).toFixed(2)} $</span>

                                {qtyInCart > 0 ? (
                                    <div className="qty-selector-container">
                                        <button
                                            className="qty-btn-minus"
                                            onClick={() => {
                                                if (typeof onRemoveFromCart === 'function') {
                                                    onRemoveFromCart(product.id);
                                                }
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="qty-display-value">{qtyInCart}</span>
                                        <button
                                            className="qty-btn-plus"
                                            onClick={() => onAddToCart(product)}
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-add-cart"
                                        onClick={() => onAddToCart(product)}
                                    >
                                        Ajouter
                                    </button>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}