import React, { useState, useEffect } from 'react';

export default function ProductDetailView({ productId = 1, onAddToCart, onNavigate }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // → C'est un choix d'optimisation architecturale.
    // En récupérant la liste globale, nous profitons de la mise en cache implicite du navigateur.
    // De plus, cela permet d'exécuter une recherche instantanée côté client via `.find()` sans surcharger le microservice `ProductService` avec de multiples requêtes atomiques lors des allers-retours de l'utilisateur.
    useEffect(() => {
        // Lien direct avec ton ProductService via la Gateway
        fetch(`http://localhost:8080/api/products`)
            .then(res => res.json())
            .then(data => {
                // Conversion explicite en Number pour éviter les erreurs de comparaison strictes (Type Mismatch)
                // On trouve le produit sélectionné (par défaut l'ID 1 ou celui passé en props)
                const found = data.find(p => p.id === Number(productId));
                setProduct(found);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur fiche produit:", err);
                setLoading(false);
            });
    }, [productId]); // Dépendance cruciale : l'effet s'exécute à nouveau si l'utilisateur change de fiche produit

    // Gestion des états d'affichage asynchrones (UX)
    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Chargement de l'expérience sensorielle...</p>;
    if (!product) return <p style={{ textAlign: 'center', padding: '50px' }}>Produit introuvable.</p>;

    // Liste exacte des 6 cafés vedettes de tes wireframes possédant un Pack Duo dédié
    const cafesAvecPack = ["Velours", "Guatemala", "Ethiopie", "Kenya", "Bresil", "Colombie"];

    // Détection de correspondance (en ignorant les accents et les casses pour éviter les pièges de saisie BDD)
    // → C'est de la programmation défensive. Pour éviter qu'une différence de casse (majuscule/minuscule) ou la présence d'accents (ex: 'Éthiopie' vs 'ethiopie') ne brise la logique d'association visuelle, cette fonction utilise la décomposition Unicode `normalize("NFD")` pour détacher les accents,
    // puis une Regex pour les supprimer, avant de tout passer en minuscules. Cela sécurise la comparaison de chaînes de caractères.
    const normaliserTexte = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    const aUnPackDedie = cafesAvecPack.some(nom => normaliserTexte(product.name).includes(normaliserTexte(nom)));

    // ── LOGIQUE MÉTIER EXTENSION FIGMA ──
    // Mock de caractéristiques sensorielles selon la catégorie pour faire briller ta présentation jury
    const tastingNotes = product.category.includes('Grain') || product.category.includes('Moulu')
        ? { intensite: '8/10', corps: 'Onctueux', acidite: 'Légère', aromes: 'Jasmin, Agrumes, Caramel' }
        : { intensite: '9/10', corps: 'Puissant', acidite: 'Nulle', aromes: 'Épices, Fruits Rouges, Miel' };

    return (
        <div className="product-detail-container" style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', color: '#3e2723' }}>
            <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>

                {/* Gauche : Image Block */}
                <div style={{ flex: '1', minWidth: '350px', textAlign: 'center', backgroundColor: '#fdfbf7', padding: '30px', borderRadius: '12px' }}>
                    <img
                        src={product.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400"}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                </div>

                {/* Droite : Info Block */}
                <div style={{ flex: '1.2', minWidth: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ backgroundColor: '#eae0d5', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                            {product.category}
                        </span>
                        <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', marginTop: '15px', marginBottom: '10px', color: '#271206' }}>
                            {product.name}
                        </h1>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#8d6e63', marginBottom: '20px' }}>
                            {parseFloat(product.price || 0).toFixed(2)} $
                        </p>
                        <p style={{ lineHeight: '1.6', color: '#5d4037', marginBottom: '30px' }}>
                            {product.description || "Une expérience gustative mémorable issue d'une agriculture éthique et raisonnée."}
                        </p>

                        {/* Fiche technique / Dégustation (Inspiration Figma) */}
                        <div style={{ borderTop: '1px solid #eae0d5', paddingTop: '20px', marginBottom: '30px' }}>
                            <h4 style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px', marginBottom: '15px', color: '#8d6e63' }}>
                                Notes de Dégustation & Profil
                            </h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <tbody>
                                <tr style={{ borderBottom: '1px solid #f5f0eb' }}><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Intensité</td><td style={{ textAlign: 'right' }}>{tastingNotes.intensite}</td></tr>
                                <tr style={{ borderBottom: '1px solid #f5f0eb' }}><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Profil de Corps</td><td style={{ textAlign: 'right' }}>{tastingNotes.corps}</td></tr>
                                <tr style={{ borderBottom: '1px solid #f5f0eb' }}><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Acidité</td><td style={{ textAlign: 'right' }}>{tastingNotes.acidite}</td></tr>
                                <tr style={{ borderBottom: '1px solid #f5f0eb' }}><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Notes Aromatiques</td><td style={{ textAlign: 'right', color: '#8d6e63', fontStyle: 'italic' }}>{tastingNotes.aromes}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bouton d'ajout principal */}
                    <button
                        onClick={() => onAddToCart(product)}
                        style={{
                            backgroundColor: '#271206',
                            color: '#fff',
                            border: 'none',
                            padding: '15px 30px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#4e2f1d'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#271206'}
                    >
                        Ajouter à la Sélection — {parseFloat(product.price || 0).toFixed(2)} $
                    </button>

                    {/* ── INTERCONNECTION AVANCÉE INTER-COMPOSANTS ── */}

                    {/*→ J'utilise un mécanisme de persistance à court terme via l'API `localStorage`. Avant de déclencher le changement de hash de l'URL vers le catalogue, j'enregistre la valeur 'Packs Duos' sous la clé 'activeCatalogCategory'.
                    Lorsque le composant `CatalogView` va s'initialiser, il va lire ce jeton dans son constructeur d'état, appliquer le bon filtre à l'écran, et nettoyer immédiatement la clé du stockage.
                    C'est un pont de communication asynchrone ultra-efficace. */}
                    {/* 2. Bouton secondaire corrigé (Nettoyé et harmonisé) */}
                    <button
                        onClick={() => {
                            // On stocke la catégorie pour que le catalogue sache quel onglet ouvrir
                            localStorage.setItem('activeCatalogCategory', 'Packs Duos');

                            // On déclenche la navigation
                            window.location.hash = 'catalog';
                            if (typeof onNavigate === 'function') {
                                onNavigate('catalog');
                            }
                        }}
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            backgroundColor: 'transparent',
                            color: '#3B1206',
                            border: '2px solid #3B1206',
                            padding: '14px 24px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 18, 6, 0.05)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <span>Découvrir nos Packs Duos</span>
                        <span style={{ fontSize: '18px', transition: 'transform 0.2s' }}>→</span>
                    </button>
                </div>

            </div>
        </div>
    );
}