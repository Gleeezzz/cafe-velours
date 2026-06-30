import React from 'react';

export default function Navbar({ currentView, onNavigate, cartCount }) {
    return (
        <header className="custom-header">
            <nav className="navbar-container">
                {/* Logo cliquable */}
                {/* L'attribut href="#home" assure une sémantique de base, mais l'événement est intercepté
                    par JavaScript pour piloter notre routage interne. */}
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
                            /* → En combinant une expression de template string JavaScript et un opérateur ternaire :
                                 `${currentView === 'home' ? 'active-link' : ''}`.
                                 Si l'état courant correspond à la vue, la classe CSS `.active-link` s'applique à la volée. */
                            className={`nav-link-btn ${currentView === 'catalog' ? 'active-link' : ''}`}
                        >
                            Catalogue
                        </button>
                    </li>
                    {/* Onglet Catalogue */}
                    <li>
                        <button
                            onClick={() => onNavigate('profile')}
                            className={`nav-link-btn ${currentView === 'profile' ? 'active-link' : ''}`}
                        >
                            Profil
                        </button>
                    </li>

                    {/* AJOUT DU BOUTON PANIER AVEC BADGE COMME SUR TON FIGMA */}
                    <li>
                        <button
                            onClick={() => onNavigate('cart')}
                            className={`nav-link-btn relative ${currentView === 'cart' ? 'active-link' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            🛒
                            {/* RENDU CONDITIONNEL ET SHORT-CIRCUIT EVALUATION (&&) */}
                            {/* Si la condition de gauche est fausse (panier vide),
                            React ignore instantanément la partie droite. Le badge rouge ne s'affiche dans le DOM
                            que s'il y a au moins un produit dans le panier, évitant d'afficher un "0" inutile. */}
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