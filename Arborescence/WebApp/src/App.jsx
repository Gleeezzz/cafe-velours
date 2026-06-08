import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import CatalogView from "./components/CatalogView.jsx";
import Footer from './components/Footer';
import CartView from './components/CartView';

export default function App() {
    const [currentView, setCurrentView] = useState('home');

    // 🛒 AJOUT DE L'ÉTAT DU PANIER (Initialisé avec Finca El Paraiso comme sur tes maquettes)
    const [cart, setCart] = useState([
        { id: 1, name: "Finca El Paraiso", category: "Cafés Grains", price: 18.90, quantity: 1 }
    ]);

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    // 🛒 AJOUT DE LA FONCTION POUR AJOUTER AU PANIER
    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1, price: parseFloat(product.price) }];
        });
    };

    // Calcul du nombre total d'articles pour le badge de ton caddie
    const totalArticles = cart.reduce((total, item) => total + item.quantity, 0);

    const renderView = () => {
        switch (currentView) {
            case 'home':
                // On passe la fonction de navigation pour rendre les boutons de l'accueil actifs
                return <HomeView onNavigate={handleNavigate} />;
            case 'catalog':
                return <CatalogView onAddToCart={addToCart} />;
            case 'profile':
                return <ProfileView />;
            case 'cart':
                // Ici ton panier utilise l'état global du panier
                return <CartView cart={cart} setCart={setCart} />;
            default:
                // Par sécurité, si une vue inconnue est demandée, on redirige vers l'accueil
                return <HomeView onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            {/* On passe le cartCount à la Navbar */}
            <Navbar currentView={currentView} onNavigate={handleNavigate} cartCount={totalArticles} />

            <main className="flex-grow">
                {renderView()}
            </main>

            <Footer />
        </div>
    );
}