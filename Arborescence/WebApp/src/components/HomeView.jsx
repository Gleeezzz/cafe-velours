import React, { useState, useRef } from 'react';

export default function HomeView({ onNavigate }) {

    const featuredPacks = [
        { id: 'pack-guatemala', name: 'Pack Guatemala', price: '26,50$', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400' },
        { id: 'pack-ethiopie', name: 'Pack Éthiopie', price: '27,00$', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400' },
        { id: 'pack-colombie', name: 'Pack Colombie', price: '25,00$', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400' },
        { id: 'pack-bresil', name: 'Pack Brésil', price: '24,50$', img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400' },
        { id: 'pack-kenya', name: 'Pack Kenya', price: '28,00$', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=400' },
    ];

    const featuredProducts = [
        { id: 1, name: 'Finca el Paraiso', type: 'Café', price: '18,90$', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=400' },
        { id: 5, name: 'Noir Pérou 72%', type: 'Chocolat', price: '9,50$', img: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=400' },
        { id: 2, name: 'Yirgacheffe Héritage', type: 'Café', price: '16,20$', img: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?q=80&w=400' },
        { id: 6, name: 'Lait Caramel Fleur de Sel', type: 'Chocolat', price: '8,90$', img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=400' },
    ];

    // --- Logique du carrousel ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 3;
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

                <div style={{ position: 'relative', overflow: 'hidden', padding: '10px 0' }}>
                    {/* Track animé */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% - ${currentIndex * 16 / visibleCount}px))`,
                        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        willChange: 'transform'
                    }}>
                        {featuredPacks.map((pack, index) => (
                            <div
                                key={pack.id}
                                onClick={() => onNavigate('catalog')}
                                style={{
                                    minWidth: `calc(${100 / visibleCount}% - ${16 * (visibleCount - 1) / visibleCount}px)`,
                                    height: '260px',
                                    borderRadius: '14px',
                                    backgroundImage: `url(${pack.img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.03)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                                }}
                            >
                                {/* Overlay dégradé */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                    padding: '20px 16px 16px',
                                    borderRadius: '0 0 14px 14px'
                                }}>
                                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{pack.name}</h4>
                                    <p style={{ color: '#e0c9a6', margin: '4px 0 0', fontSize: '0.9rem' }}>{pack.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contrôles */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <button
                        onClick={goPrev}
                        disabled={currentIndex === 0}
                        style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            border: '1px solid #8B5A2B', background: currentIndex === 0 ? '#f5f5f5' : '#8B5A2B',
                            color: currentIndex === 0 ? '#ccc' : '#fff',
                            fontSize: '1.1rem', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >←</button>

                    {/* Dots */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <span
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                style={{
                                    width: i === currentIndex ? '20px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: i === currentIndex ? '#8B5A2B' : '#ddd',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goNext}
                        disabled={currentIndex === maxIndex}
                        style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            border: '1px solid #8B5A2B', background: currentIndex === maxIndex ? '#f5f5f5' : '#8B5A2B',
                            color: currentIndex === maxIndex ? '#ccc' : '#fff',
                            fontSize: '1.1rem', cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >→</button>
                </div>
            </section>

            <hr className="section-divider" />

            {/* 3. CATALOGUE APERÇU */}
            <section className="home-section">
                <h2 className="section-main-title" style={{ marginBottom: '12px' }}>Catalogue Aperçu</h2>
                <p className="section-sub-title" style={{ marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.7' }}>
                    Une sélection de nos meilleurs cafés single-origin et chocolats premium — torréfiés avec passion,
                    choisis pour révéler les meilleurs accords sensoriels.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    maxWidth: '860px',
                    margin: '0 auto'
                }}>
                    {featuredProducts.map(product => (
                        <div
                            key={product.id}
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                            }}
                            onClick={() => onNavigate('catalog')}
                        >
                            {/* Image */}
                            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'cover',
                                        transition: 'transform 0.4s ease'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                {/* Badge type */}
                                <span style={{
                                    position: 'absolute', top: '12px', left: '12px',
                                    backgroundColor: 'rgba(139, 90, 43, 0.9)',
                                    color: '#fff', padding: '4px 12px', borderRadius: '20px',
                                    fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.5px'
                                }}>
                        {product.type}
                    </span>
                            </div>

                            {/* Contenu */}
                            <div style={{ padding: '16px 18px 20px' }}>
                                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: '#1a1a1a', fontWeight: '700' }}>
                                    {product.name}
                                </h4>
                                <p style={{ margin: '0 0 14px', color: '#8B5A2B', fontWeight: '600', fontSize: '1rem' }}>
                                    {product.price}
                                </p>
                                <button
                                    style={{
                                        width: '100%', padding: '10px',
                                        backgroundColor: '#8B5A2B', color: '#fff',
                                        border: 'none', borderRadius: '8px',
                                        fontSize: '0.9rem', fontWeight: '600',
                                        cursor: 'pointer', transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d4422'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#8B5A2B'}
                                    onClick={(e) => { e.stopPropagation(); onNavigate('catalog'); }}
                                >
                                    Voir au catalogue →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '35px' }}>
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
                        Le café et le chocolat, deux univers d'exception qui se révèlent ensemble.
                    </h3>
                    <p className="philosophy-text">
                        Chaque pack duo est le fruit d'une sélection rigoureuse pour vous offrir l'accord parfait.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('philosophy')}
                    className="mt-4 px-6 py-2 bg-[#271206] text-white font-medium rounded hover:bg-[#4e2f1d] transition-colors"
                >
                    Découvrir
                </button>
            </section>
        </div>
    );
}