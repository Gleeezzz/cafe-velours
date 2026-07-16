import React, { useState } from 'react';

export default function HomeView({ onNavigate, onViewProduct }) {

    // Données statiques des packs promotionnels mis en avant
    const featuredPacks = [
        { id: 23, name: 'Pack Guatemala', price: '26,50$', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400' },
        { id: 20, name: 'Duo Intense Éthiopie', price: '27,00$', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400' },
        { id: 19, name: 'Duo Signature Colombie', price: '25,00$', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400' },
        { id: 21, name: 'Duo Douceur Brésilienne', price: '24,50$', img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400' },
        { id: 22, name: 'Duo Exploration Épicée', price: '28,00$', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=400' },
    ];

    // Données statiques des produits individuels
    const featuredProducts = [
        { id: 3, name: 'Finca el Paraiso', type: 'Café', price: '18,90$', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=400' },
        { id: 16, name: 'Noir Fleur de Sel & Piment', type: 'Chocolat', price: '9,50$', img: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=400' },
        { id: 5, name: 'Yirgacheffe Héritage', type: 'Café', price: '16,20$', img: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?q=80&w=400' },
        { id: 15, name: 'Lait Gourmand & Noisettes', type: 'Chocolat', price: '8,90$', img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=400' },
    ];

    // --- Logique du carrousel ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 3;  // Nombre de cartes visibles simultanément à l'écran
    const maxIndex = featuredPacks.length - visibleCount;

    const goNext = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    const goPrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

    return (
        <div className="home-wrapper">

            {/* 1. HERO BANNER */}
            <section className="hero-banner">
                <div className="hero-overlay">
                    <h1 className="hero-title">Grains d'Exception<br /><span>Plaisirs Absolus</span></h1>
                    <p className="hero-subtitle">
                        Cafés single-origin et chocolats premiums sélectionnés pour révéler les meilleurs accords sensoriels
                    </p>
                    <button className="btn-hero-action" onClick={() => onNavigate('catalog')}>
                        Découvrir la sélection <span className="arrow">→</span>
                    </button>
                </div>
            </section>

            {/* 2. PACKS CARROUSEL */}
            <section className="home-section">
                <h2 className="section-main-title">Nos Packs Café + Chocolat</h2>
                <p className="section-sub-title">Des duos soigneusement sélectionnés pour éveiller vos sens</p>

                <div className="carousel-container">
                    {/* Track animé */}
                    <div
                        className="carousel-track"
                        style={{
                            transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% - ${currentIndex * 16 / visibleCount}px))`
                        }}
                    >
                        {featuredPacks.map((pack) => (
                            <div
                                key={pack.id}
                                className="carousel-card"
                                onClick={() => {
                                    if (typeof onViewProduct === 'function') {
                                        onViewProduct(pack.id);
                                    }
                                }}
                                style={{
                                    minWidth: `calc(${100 / visibleCount}% - ${16 * (visibleCount - 1) / visibleCount}px)`,
                                    backgroundImage: `url(${pack.img})`
                                }}
                            >
                                {/* Overlay dégradé */}
                                <div className="carousel-card-overlay">
                                    <h4 className="carousel-card-title">{pack.name}</h4>
                                    <p className="carousel-card-price">{pack.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contrôles du Carrousel */}
                <div className="carousel-controls">
                    <button
                        onClick={goPrev}
                        disabled={currentIndex === 0}
                        className="carousel-btn-nav"
                    >
                        ←
                    </button>

                    {/* Pagination par points dynamiques */}
                    <div className="carousel-dots">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <span
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goNext}
                        disabled={currentIndex === maxIndex}
                        className="carousel-btn-nav"
                    >
                        →
                    </button>
                </div>
            </section>

            <hr className="section-divider" />

            {/* 3. CATALOGUE APERÇU */}
            <section className="home-section">
                <h2 className="section-main-title margin-bottom-12">Catalogue Aperçu</h2>
                <p className="section-sub-title catalogue-intro">
                    Une sélection de nos meilleurs cafés single-origin et chocolats premium — torréfiés avec passion,
                    choisis pour révéler les meilleurs accords sensoriels.
                </p>

                {/* Structure en Grille CSS responsive */}
                <div className="home-product-grid">
                    {featuredProducts.map(product => (
                        <div
                            key={product.id}
                            className="home-product-card"
                            onClick={() => {
                                if (typeof onViewProduct === 'function') {
                                    onViewProduct(product.id);
                                }
                            }}
                        >
                            {/* Section Image */}
                            <div className="home-product-img-wrapper">
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="home-product-img"
                                />
                                <span className="home-product-badge">
                                    {product.type}
                                </span>
                            </div>

                            {/* Section Descriptif */}
                            <div className="home-product-info">
                                <h4 className="home-product-name">{product.name}</h4>
                                <p className="home-product-price">{product.price}</p>

                                <button
                                    className="home-product-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (typeof onViewProduct === 'function') {
                                            onViewProduct(product.id);
                                        }
                                    }}
                                >
                                    Voir la description →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="view-all-container">
                    <button className="btn-view-all-catalog" onClick={() => onNavigate('catalog')}>
                        Voir tout le catalogue <span className="arrow">→</span>
                    </button>
                </div>
            </section>

            {/* 4. PHILOSOPHIE */}
            <section className="philosophy-section">
                <div className="philosophy-container">
                    <span className="philosophy-tag">Notre Philosophie</span>
                    <h3 className="philosophy-title">
                        Le café et le chocolat, deux univers d'exception qui se révèleront ensemble.
                    </h3>
                    <p className="philosophy-text">
                        Chaque pack duo est le fruit d'une sélection rigoureuse pour vous offrir l'accord parfait.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('philosophy')}
                    className="philosophy-btn"
                >
                    Découvrir
                </button>
            </section>
        </div>
    );
}