import React from 'react';

export default function Navbar({ currentView, onNavigate, cartCount }) {
    return (
        <header className="custom-header">
            <nav className="navbar-container">
                {/* Logo cliquable */}
                <a href="#home" onClick={() => onNavigate('home')} className="brand-logo">
                    Café <span>Velours</span>
                </a>

                {/* Liens de navigation */}
                <ul className="nav-menu">
                    <li>
                        <button
                            onClick={() => onNavigate('home')}
                            className={`nav-link-btn ${currentView === 'home' ? 'active-link' : ''}`}
                        >
                            Accueil
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onNavigate('catalog')}
                            className={`nav-link-btn ${currentView === 'catalog' ? 'active-link' : ''}`}
                        >
                            Catalogue
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onNavigate('profile')}
                            className={`nav-link-btn ${currentView === 'profile' ? 'active-link' : ''}`}
                        >
                            Profil
                        </button>
                    </li>

                    {/* 🛒 AJOUT DU BOUTON PANIER AVEC BADGE COMME SUR TON FIGMA */}
                    <li>
                        <button
                            onClick={() => onNavigate('cart')}
                            className={`nav-link-btn relative ${currentView === 'cart' ? 'active-link' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            🛒
                            {cartCount > 0 && (
                                <span className="nav-cart-badge">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}