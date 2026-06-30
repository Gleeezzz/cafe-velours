import React, { useState, useEffect } from 'react';

export default function CatalogView({ onAddToCart, onRemoveFromCart, cart, onViewProduct }) {
    // → Pour respecter une Source Unique de Vérité (Single Source of Truth). L'état du panier (`cart`) vit globalement dans `App.jsx`.
    //   En calculant dynamiquement la quantité via une recherche `.find()`, on s'assure que le compteur de la carte produit est TOUJOURS
    //   parfaitement synchronisé avec le panier réel, sans risque d'incohérence de données.
    const getProductQuantity = (productId) => {
        const item = cart.find(i => i.id === productId);
        return item ? item.quantity : 0;
    };

    // États locaux pour gérer les données, le chargement, les erreurs et les filtres de catégorie
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

    // → Un tableau de dépendances vide indique à React que cet effet doit s'exécuter UNIQUEMENT lors du montage du composant (son premier affichage).
    //   C'est l'endroit idéal pour effectuer des requêtes initiales de données (fetching API), évitant ainsi de relancer inutilement des requêtes HTTP à chaque mise à jour du composant.
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
    // → Il gère une fonctionnalité d'expérience utilisateur (UX) avancée : le défilement et la mise en valeur visuelle d'un élément précis (Packs Duos).
    //   Le `setTimeout` de 400ms est une astuce technique cruciale : il donne le temps au DOM virtuel de React de finir de générer et d'ancrer les éléments dans la page avant de tenter un calcul graphique via `scrollIntoView`.
    //   Sans ce délai, le ciblage de l'ID HTML risquerait d'échouer car l'élément n'existerait pas encore physiquement.
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
                        // Feedback visuel temporaire (Effet Wow pour la démonstration)
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

    // Filtrage dynamique côté client pour une réactivité instantanée à l'écran
    const filteredProducts = products.filter(p =>
        activeFilter === 'Tous' || p.category === activeFilter
    );

    // Rendu d'attente (State de chargement)
    if (loading) {
        return (
            <div className="catalog-container" style={{padding: '40px', textAlign: 'center'}}>
                <p>☕ Connexion au microservice Product via la Gateway...</p>
            </div>
        );
    }

    // → Si le microservice ou la Gateway ne répondent pas, l'application ne doit pas crasher avec un écran blanc.
    //   Le bloc `catch` du fetch capture l'erreur et met à jour l'état `error`.
    //   Ce rendu alternatif s'affiche alors proprement, informant l'utilisateur du problème technique tout en préservant l'intégrité de l'interface globale.
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
    // Normalisation de chaîne pour s'affranchir des accents et majuscules lors du mapping d'ID
    const normaliserTexte = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

    return (
        <div className="catalog-container">
            <div className="catalog-breadcrumb-bar">
                {/* 🏠 Lien vers l'Accueil */}
                <span
                    className="breadcrumb-link"
                    onClick={() => window.location.hash = 'home'}
                    style={{
                        cursor: 'pointer',
                        color: '#F5E6D3',
                        transition: 'opacity 0.2s',
                        opacity: 0.85
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                >
        Accueil
    </span>

                <span style={{ margin: '0 8px', color: '#F5E6D3', opacity: 0.5 }}>/</span>

                {/* ☕ Lien vers le Catalogue global */}
                <span
                    className="breadcrumb-link"
                    onClick={() => setActiveFilter('Tous')}
                    style={{
                        cursor: 'pointer',
                        color: '#F5E6D3',
                        transition: 'opacity 0.2s',
                        opacity: 0.85
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                >
        Catalogue
    </span>

                <span style={{ margin: '0 8px', color: '#F5E6D3', opacity: 0.5 }}>/</span>

                {/* 🏷️ Filtre actif actuel (Texte en Blanc pur pour ressortir au maximum) */}
                <strong style={{ color: '#FFFFFF', fontWeight: '600' }}>{activeFilter}</strong>
            </div>
            {/* Grille d'affichage des cartes produits */}
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

                    // → React utilise un algorithme de réconciliation (Virtual DOM) pour optimiser les performances de mise à jour de l'affichage.
                    // L'attribut `key` doit être unique pour chaque élément afin de permettre à React d'identifier instantanément quel élément de la liste a été modifié, ajouté ou supprimé, sans avoir à recalculer et re-rendre l'intégralité de la grille.
                    return (
                        <div key={product.id} id={packHtmlId} className="product-card">

                            {/* Enveloppe de l'image — Clic redirigeant vers le détail du produit */}                            <div
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

                            {/* Section basse : Prix et boutons d'action */}
                            <div className="product-footer">
                                <span className="product-price">{parseFloat(product.price || 0).toFixed(2)} $</span>

                                {/* Affichage conditionnel : Sélecteur de quantité ou bouton d'ajout initial */}
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