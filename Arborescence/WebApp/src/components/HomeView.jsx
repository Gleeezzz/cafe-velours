import React from 'react';

export default function HomeView({ onNavigate }) {
    // Données fictives pour l'aperçu rapide des packs et produits (visuels Figma)
    const featuredPacks = [
        { id: 'pack-guatemala', name: 'Pack Guatemala', price: '26,50$', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400' },
        { id: 'pack-ethiopie', name: 'Pack Éthiopie', price: '27,00$', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400' }
    ];

    const featuredProducts = [
        { id: 1, name: 'Finca el Paraiso', type: 'Café', price: '18,90$', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=400' },
        { id: 5, name: 'Noir Pérou 72%', type: 'Chocolat', price: '9,50$', img: 'https://images.unsplash.com/photo-1548907040-4d42b52115ca?q=80&w=400' }
    ];

    return (
        <div className="home-wrapper">
            {/* 1. SECTION HERO BANNER */}
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

            {/* 2. SECTION PACKS SCROLL HORIZONTAL */}
            <section className="home-section">
                <h2 className="section-main-title">Packs Scroll Horizontal</h2>
                <p className="section-sub-title">Nos Packs Café + Chocolat</p>

                <div className="horizontal-scroll-container">
                    {featuredPacks.map(pack => (
                        <div key={pack.id} className="pack-scroll-card" style={{ backgroundImage: `url(${pack.img})` }}>
                            <div className="pack-card-overlay">
                                <h4>{pack.name}</h4>
                                <p>{pack.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="scroll-controls">
                    <button className="scroll-arrow">← scroll horizontal</button>
                    <button className="scroll-arrow">→</button>
                    <div className="scroll-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            </section>

            <hr className="section-divider" />

            {/* 3. SECTION CATALOGUE APERÇU */}
            <section className="home-section">
                <h2 className="section-main-title">Catalogue Aperçu</h2>

                <div className="catalog-preview-grid">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="preview-product-card">
                            <div className="preview-img-container">
                                <img src={product.img} alt={product.name} />
                            </div>
                            <div className="preview-card-body">
                                <span className="badge-type">{product.type}</span>
                                <h4>{product.name}</h4>
                                <p className="preview-price">{product.price}</p>
                                <button className="btn-preview-cart" onClick={() => onNavigate('catalog')}>
                                    + Panier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-view-all-catalog" onClick={() => onNavigate('catalog')}>
                    Voir tout le catalogue <span className="arrow">→</span>
                </button>
            </section>

            {/* 4. SECTION NOTRE PHILOSOPHIE */}
            <section className="philosophy-section">
                <div className="philosophy-container">
                    <span className="philosophy-tag">Notre Philosophie</span>
                    <h3 className="philosophy-title">
                        Le café et le chocolat, deux univers d'exception qui se révèlent ensemble.
                    </h3>
                    <p className="philosophy-text">
                        Chaque pack duo est le fruit d'une sélection rigoureuse pour vous offrir l'accord parfait.
                    </p>
                </div>
            </section>
        </div>
    );
}