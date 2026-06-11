import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import CatalogView from "./components/CatalogView.jsx";
import Footer from './components/Footer';
import CartView from './components/CartView';
import LoginView from './components/LoginView';

export default function App() {
    const [currentView, setCurrentView] = useState('home');
    const [cart, setCart] = useState([]);

    // ✅ userId dynamique — plus de hardcode !
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    // ✅ Appelé par LoginView quand le login/register réussit
    const handleLoginSuccess = (user) => {
        // On split le name "Rafael Nadal" en firstname + lastname
        const nameParts = (user.name || "").split(" ");
        const firstname = nameParts[0] || "";
        const lastname = nameParts.slice(1).join(" ") || "";

        setUserId(user.id);
        setUserProfile({
            firstname,
            lastname,
            email: user.email || "",
            address: user.address || "",
            phone: user.phoneNumber || "06 12 34 56 78",
            memberSince: user.memberSince || "Juin 2026"
        });
        setIsLoggedIn(true);
        fetchOrderHistory(user.id);
    };

    const fetchOrderHistory = async (uid) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/user/${uid}`);
            if (response.ok) {
                const data = await response.json();
                setOrdersHistory(data);
            }
        } catch (error) {
            console.error("Erreur réseau lors de la récupération de l'historique :", error);
        }
    };

    const handleNavigate = (view) => {
        if (view.toLowerCase() === 'profile') {
            fetchOrderHistory(userId);
        }
        setCurrentView(view.toLowerCase());
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1, price: parseFloat(product.price) }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === productId);
            if (!existing) return prevCart;
            if (existing.quantity === 1) {
                return prevCart.filter(item => item.id !== productId);
            } else {
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
                        onRemoveFromCart={removeFromCart}
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
                        userId={userId}
                        isLoggedIn={isLoggedIn}
                        onLoginSuccess={handleLoginSuccess}
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
            <Footer onNavigate={handleNavigate} />
        </div>
    );
}