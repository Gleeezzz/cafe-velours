import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import CatalogView from "./components/CatalogView.jsx";
import Footer from './components/Footer';
import CartView from './components/CartView';

export default function App() {
    // 1. On commence maintenant sur la page d'accueil ('home') pour le scénario réel
    const [currentView, setCurrentView] = useState('home');

    // 2. Le panier démarre complètement VIDE
    const [cart, setCart] = useState([]);

    // 3. Infos de profil initiales de Sophie (vides au départ ou modifiables)
    const [userProfile, setUserProfile] = useState({
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        zip: "",
        city: "",
        phone: "06 12 34 56 78",
        memberSince: "Janvier 2026"
    });

    // 4. Historique global des commandes passé au composant ProfileView
    // Dans App.jsx, mets le tableau à vide au départ :
    const [ordersHistory, setOrdersHistory] = useState([]);

    // Fonction de navigation
    const handleNavigate = (view) => {
        setCurrentView(view.toLowerCase());
    };

    // Gestion de l'ajout au panier
    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1, price: parseFloat(product.price) }];
        });
    };

    // Calcul du nombre total d'articles pour la Navbar
    const totalArticles = cart.reduce((total, item) => total + item.quantity, 0);

    const renderView = () => {
        switch (currentView.toLowerCase()) {
            case 'home':
                return <HomeView onNavigate={handleNavigate} />;
            case 'catalog':
                return <CatalogView onAddToCart={addToCart} />;
            case 'profile':
                return (
                    <ProfileView
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        orders={ordersHistory} // Ton state contenant le tableau des commandes
                        setCurrentView={setCurrentView} // Permet au bouton de renvoyer vers le catalogue
                    />
                );
            case 'cart':
                return (
                    <CartView
                        cart={cart}
                        setCart={setCart}
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        ordersHistory={ordersHistory}
                        setOrdersHistory={setOrdersHistory}
                        onViewChange={handleNavigate}
                    />
                );
            default:
                return <HomeView onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <Navbar currentView={currentView} onNavigate={handleNavigate} cartCount={totalArticles} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
}