import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import CatalogView from "./components/CatalogView.jsx";
import Footer from './components/Footer';
import CartView from './components/CartView';
import LoginView from './components/LoginView';
import PhilosophyView from './components/PhilosophyView';
import ProductDetailView from './components/ProductDetailView';

export default function App() {

    // 🛠️ FIX 1 : Initialisation robuste capable de lire 'product-detail/23' dès le rafraîchissement
    const [currentView, setCurrentView] = useState(() => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash.startsWith('product-detail/')) {
            return 'product-detail';
        }
        return hash || 'home';
    });

    const [cart, setCart] = useState([]);

    // 🛠️ FIX 2 : Si on est sur un rafraîchissement de fiche produit, on extrait l'ID depuis l'URL en priorité
    const [selectedProductId, setSelectedProductId] = useState(() => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash.startsWith('product-detail/')) {
            return hash.split('/')[1] || null;
        }
        return localStorage.getItem('selectedProductId') || null;
    });

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

    // Écouteur global pour gérer les boutons "Précédent / Suivant" du navigateur
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '').toLowerCase();

            if (hash.startsWith('product-detail/')) {
                const id = hash.split('/')[1];
                setSelectedProductId(id);
                localStorage.setItem('selectedProductId', id);
                setCurrentView('product-detail');
            } else if (hash) {
                setCurrentView(hash);
                if (hash === 'profile' && userId) {
                    fetchOrderHistory(userId);
                }
            } else {
                setCurrentView('home');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        // Force l'analyse du hash au tout premier montage du composant
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [userId]);

    const handleLoginSuccess = (user) => {
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

        // 🔄 FIX : Rediriger l'utilisateur vers la boutique plutôt que de le laisser bloqué
        handleNavigate('catalog');
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
        const targetView = view.toLowerCase();
        if (targetView === 'profile') {
            fetchOrderHistory(userId);
        }
        window.location.hash = targetView;
        setCurrentView(targetView);
    };

    const handleViewProduct = (productId) => {
        setSelectedProductId(productId);
        localStorage.setItem('selectedProductId', productId);
        window.location.hash = `product-detail/${productId}`;
        setCurrentView('product-detail');
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

    // 🌟 FONCTION 1 : Déconnexion de l'utilisateur
    const handleLogout = () => {
        setUserId(null);
        setIsLoggedIn(false);
        setUserProfile({
            firstname: "",
            lastname: "",
            email: "",
            address: "",
            zip: "",
            city: "",
            phone: "06 12 34 56 78",
            memberSince: ""
        });
        setOrdersHistory([]);
        window.location.hash = 'home'; // Redirection vers l'accueil
    };

// 🌟 FONCTION 2 : Suppression du compte via API Spring Boot
    const handleDeleteAccount = async (uid) => {
        if (!uid) return;

        try {
            const response = await fetch(`http://localhost:8080/api/orders/users/${uid}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Votre compte a été supprimé avec succès conformément au RGPD.");
                handleLogout(); // Déconnecte et redirige après suppression
            } else {
                alert("Erreur lors de la suppression du compte sur le serveur.");
            }
        } catch (error) {
            console.error("Erreur réseau lors de la suppression :", error);
            alert("Impossible de joindre le serveur pour supprimer le compte.");
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'home':
                return (
                    <HomeView
                        onNavigate={handleNavigate}
                        onViewProduct={handleViewProduct}
                    />
                );
            case 'catalog':
                return (
                    <CatalogView
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                        cart={cart}
                        onViewProduct={handleViewProduct}
                    />
                );
            case 'philosophy':
            case 'philosophie':
                return <PhilosophyView/>;
            case 'product-detail':
                return (
                    <ProductDetailView
                        productId={selectedProductId}
                        onAddToCart={addToCart}
                        onNavigate={handleNavigate}
                    />
                );
            case 'profile':
                return (
                    <ProfileView
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        orders={ordersHistory}
                        setCurrentView={handleNavigate}
                        userId={userId}             // 👈 Ajouté
                        onLogout={handleLogout}     // 👈 Ajouté
                        onDeleteAccount={handleDeleteAccount} // 👈 Ajouté
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
                return (
                    <HomeView
                        onNavigate={handleNavigate}
                        onViewProduct={handleViewProduct}
                    />
                );
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