import React, { useState, useEffect } from 'react';

export default function CatalogView({ onAddToCart, onRemoveFromCart, cart, onViewProduct }) {
    const getProductQuantity = (productId) => {
        const item = cart.find(i => i.id === productId);
        return item ? item.quantity : 0;
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState(() => {
        const savedFilter = localStorage.getItem('activeCatalogCategory');
        if (savedFilter) {
            localStorage.removeItem('activeCatalogCategory'); // On nettoie tout de suite après lecture
            return savedFilter;
        }
        return 'Tous'; // Valeur par défaut
    });

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

    // ÉTAPE 2 : Gestion du scroll automatique vers le pack associé
    useEffect(() => {
        if (activeFilter === 'Packs Duos') {
            const targetPackSearch = localStorage.getItem('targetPackSearch');
            if (targetPackSearch) {
                // On attend 400ms pour laisser le temps au DOM de React de monter entièrement les cartes
                setTimeout(() => {
                    const element = document.getElementById(`pack-${targetPackSearch}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Ajout d'une animation de bordure marron pour l'effet "Wow" devant le jury
                        element.style.transition = "all 0.5s ease-in-out";
                        element.style.border = "3px solid #8d6e63";
                        element.style.boxShadow = "0px 10px 20px rgba(141, 110, 99, 0.2)";

                        // On retire l'effet après 2,5 secondes
                        setTimeout(() => {
                            element.style.border = "none";
                            element.style.boxShadow = "none";
                        }, 2500);
                    } else {
                        console.warn(`Alerte intégration : Aucun pack trouvé avec l'id HTML: pack-${targetPackSearch}`);
                    }
                    localStorage.removeItem('targetPackSearch');
                }, 400);
            }
        }
    }, [activeFilter]);

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

    // Fonction de nettoyage de texte pour l'identification robuste
    const normaliserTexte = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

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

                    // ÉTAPE 3 : Détermination ultra-robuste de l'ID HTML pour le défilement fluide
                    let packHtmlId = "";
                    const nameClean = normaliserTexte(product.name);

                    if (nameClean.includes("colombie") || nameClean.includes("paraiso")) packHtmlId = "pack-Colombie";
                    else if (nameClean.includes("ethiopie") || nameClean.includes("yirgacheffe")) packHtmlId = "pack-Ethiopie";
                    else if (nameClean.includes("bresil") || nameClean.includes("douceur") || nameClean.includes("soyeux")) packHtmlId = "pack-Bresil";
                    else if (nameClean.includes("kenya") || nameClean.includes("kilimandjaro") || nameClean.includes("exploration")) packHtmlId = "pack-Kenya";
                    else if (nameClean.includes("guatemala") || nameClean.includes("cerrado")) packHtmlId = "pack-Guatemala";
                    else if (nameClean.includes("velours")) packHtmlId = "pack-Velours";

                    return (
                        <div key={product.id} id={packHtmlId} className="product-card">

                            {/* Clic fonctionnel sur l'image */}
                            <div
                                className="product-image-wrapper cursor-pointer"
                                onClick={() => {
                                    if (typeof onViewProduct === 'function') {
                                        onViewProduct(product.id);
                                    }
                                }}
                            >
                                <img
                                    src={product.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300"}
                                    alt={product.name}
                                />
                                <span className="product-card-badge">{product.category}</span>
                            </div>

                            <div className="product-info">
                                {/* Clic fonctionnel sur le titre */}
                                <h3
                                    className="product-name cursor-pointer hover:text-[#8d6e63] transition-colors"
                                    onClick={() => {
                                        if (typeof onViewProduct === 'function') {
                                            onViewProduct(product.id);
                                        }
                                    }}
                                >
                                    {product.name}
                                </h3>
                                <p className="product-desc">{product.description || "Un café d'exception rigoureusement sélectionné."}</p>
                            </div>

                            <div className="product-footer">
                                <span className="product-price">{parseFloat(product.price || 0).toFixed(2)} $</span>

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