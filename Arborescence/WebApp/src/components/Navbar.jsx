import React, { useState } from 'react';
import logoCafe from '../assets/LogoCafe.png';

export default function Navbar({ currentView, onNavigate, cartCount }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNavigate = (view) => {
        onNavigate(view);
        setMenuOpen(false); // Ferme le menu burger sur mobile
    }

    return (
        <header className="custom-header">
            <nav className="navbar-container">

                {/* LOGO CLIQUABLE */}
                <a
                    href="#home"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate('home');
                    }}
                    className="brand-logo"
                >
                    <img
                        src={logoCafe}
                        alt="Café Velours Logo"
                        className="navbar-logo-img"
                    />
                </a>

                {/* BOUTON BURGER (Mobile) */}
                <button
                    className={`burger-btn ${menuOpen ? 'is-open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Ouvrir le menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* OVERLAY SOMBRE (Mobile) - Placé avant le menu pour l'ordre d'empilement DOM */}
                {menuOpen && (
                    <div className="nav-overlay" onClick={() => setMenuOpen(false)}></div>
                )}

                {/* LIENS DE NAVIGATION */}
                <ul className={`nav-menu ${menuOpen ? 'nav-menu-open' : ''}`}>
                    <li>
                        <button
                            onClick={() => handleNavigate('home')}
                            className={`nav-link-btn ${currentView === 'home' ? 'active-link' : ''}`}
                        >
                            Accueil
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavigate('catalog')}
                            className={`nav-link-btn ${currentView === 'catalog' ? 'active-link' : ''}`}
                        >
                            Catalogue
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavigate('profile')}
                            className={`nav-link-btn ${currentView === 'profile' ? 'active-link' : ''}`}
                        >
                            Profil
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavigate('cart')}
                            className={`nav-link-btn nav-link-cart ${currentView === 'cart' ? 'active-link' : ''}`}
                        >
                            Panier 🛒
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