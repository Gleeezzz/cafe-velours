import React, { useState } from 'react';
// 1. IMPORTATION DU LOGO DEPUIS LES ASSETS
import logoCafe from '../assets/LogoCafe.png';

export default function Navbar({ currentView, onNavigate, cartCount }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const handleNavigate = (view) => {
        onNavigate(view);
        setMenuOpen(false); // close burger menu
    }

    return (
        <header className="custom-header">
            <nav className="navbar-container">

                {/* LOGO CLIQUABLE ET VISUEL */}
                <a
                    href="#home"
                    onClick={(e) => {
                        e.preventDefault(); // Évite le comportement d'ancre par défaut
                        onNavigate('home');
                    }}
                    className="brand-logo"
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <img
                        src={logoCafe}
                        alt="Café Velours Logo"
                        className="navbar-logo-img"
                        style={{
                            height: '40px',       // Ajuste la hauteur selon tes envies (ex: 40px ou 45px)
                            width: 'auto',        // Garde les proportions de ton logo intactes
                            objectContain: 'contain'
                        }}
                    />
                    {/* Optionnel : Si ton image ne contient QUE le dessin/symbole et que tu veux
                        garder l'écriture "Café Velours" juste à côté, décommente la ligne ci-dessous : */}
                    {/* <span style={{ marginLeft: '10px' }}>Café <span>Velours</span></span> */}
                </a>

                {/* BOUTON BURGER - visible uniquement en mobile via CSS */}
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

                {/* Liens de navigation */}
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
                            className={`nav-link-btn relative ${currentView === 'cart' ? 'active-link' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
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
                {/* Overlay sombre derrière le menu mobile ouvert */}
                {menuOpen && (
                    <div className="nav-overlay" onClick={() => setMenuOpen(false)}></div>
                )}
            </nav>
        </header>
    );
}