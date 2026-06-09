import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import CatalogView from "./components/CatalogView.jsx";
import Footer from './components/Footer';
import CartView from './components/CartView';

export default function App() {
    const [currentView, setCurrentView] = useState('home');
    const [cart, setCart] = useState([]);
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
    const [ordersHistory, setOrdersHistory] = useState([]);

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

    // AJOUT DE LA FONCTION MANQUANTE : Décrémentation / Suppression du panier
    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === productId);
            if (!existing) return prevCart;

            if (existing.quantity === 1) {
                // S'il n'en reste qu'un, on l'enlève complètement du panier
                return prevCart.filter(item => item.id !== productId);
            } else {
                // Sinon, on baisse la quantité de 1
                return prevCart.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
            }
        });
    };

    const totalArticles = cart.reduce((total, item) => total + item.quantity, 0);

    const renderView = () => {
        switch (currentView.toLowerCase()) {
            case 'home':
                return <HomeView onNavigate={handleNavigate} />;
            case 'catalog':
                return (
                    <CatalogView
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart} // Maintenant, "removeFromCart" existe bien !
                        cart={cart}
                    />
                );
            case 'profile':
                return (
                    <ProfileView
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        orders={ordersHistory}
                        setCurrentView={setCurrentView}
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