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

    // → C'est ce qu'on appelle le 'Lazy State Initialization' (initialisation paresseuse).
    // Si j'exécutais le code directement dans l'état, React relirait l'URL du navigateur à CHAQUE re-rendu du composant, ce qui nuit aux performances.
    // Passer une fonction garantit que la lecture de l'URL n'est faite qu'UNE seule fois, au tout premier chargement (montage) de l'application.
    const [currentView, setCurrentView] = useState(() => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash.startsWith('product-detail/')) {
            return 'product-detail';
        }
        return hash || 'home';
    });

    // État global du panier d'achat, partagé entre la Navbar (pour le compteur) et la CartView
    const [cart, setCart] = useState([]);

    // Gestion de la fiche produit active : on tente de la récupérer depuis l'URL ou à défaut dans le LocalStorage
    const [selectedProductId, setSelectedProductId] = useState(() => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash.startsWith('product-detail/')) {
            return hash.split('/')[1] || null;
        }
        return localStorage.getItem('selectedProductId') || null;
    });

    // ❌ ANCIEN CODE :
    // const [userId, setUserId] = useState(null);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ✅ NOUVEAU CODE : On va chercher la session sauvegardée dans le navigateur
    const [savedSession] = useState(() => {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    });

    const [userId, setUserId] = useState(() => savedSession ? savedSession.userId : null);
    const [isLoggedIn, setIsLoggedIn] = useState(() => savedSession ? savedSession.isLoggedIn : false);

    // Profil de l'utilisateur connecté (restauré si présent en session)
    const [userProfile, setUserProfile] = useState(() => {
        if (savedSession && savedSession.userProfile) {
            return savedSession.userProfile;
        }
        return {
            firstname: "",
            lastname: "",
            email: "",
            address: "",
            zip: "",
            city: "",
            phone: "06 12 34 56 78",
            memberSince: "Janvier 2026"
        };
    });

    // Stockage de l'historique des commandes récupéré depuis l'Order-Service via l'API
    const [ordersHistory, setOrdersHistory] = useState([]);

    // Écouteur global pour gérer les boutons "Précédent / Suivant" du navigateur

    // → Il permet de gérer nativement l'historique du navigateur.
    // Si l'utilisateur clique sur le bouton 'Précédent' (flèche retour) ou 'Suivant' du navigateur, l'URL change.
    // Cet effet intercepte ce changement, extrait la nouvelle vue, et met à jour l'état `currentView` pour afficher dynamiquement le bon composant sans recharger la page.
    // Le tableau de dépendances contient `userId` pour réactualiser l'historique si l'utilisateur change.
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
        handleHashChange(); // Force l'analyse initiale au premier montage

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [userId]);


    // → Lorsque l'API valide les identifiants, elle renvoie l'objet utilisateur complet.
    // Cette fonction découpe le nom complet reçu pour isoler le prénom et le nom de famille,
    // met à jour les états globaux (`userId`, `isLoggedIn`, `userProfile`),
    // lance la récupération de l'historique, et redirige directement vers le catalogue.

    // → Pour centraliser la donnée. L'historique des commandes est requis à la fois dans le profil et lors de la validation finale du panier.
    // Centraliser l'appel HTTP ici permet de distribuer la donnée sous forme de props, évitant des appels API redondants et inutiles.
    const handleLoginSuccess = (user) => {
        const nameParts = (user.name || "").split(" ");
        const firstname = nameParts[0] || "";
        const lastname = nameParts.slice(1).join(" ") || "";

        const newProfile = {
            firstname,
            lastname,
            email: user.email || "",
            address: user.address || "",
            zip: user.zip || "",
            city: user.city || "",
            phone: user.phoneNumber || "06 12 34 56 78",
            memberSince: user.memberSince || "Juin 2026"
        };

        setUserId(user.id);
        setUserProfile(newProfile);
        setIsLoggedIn(true);

        // 💾 SAUVEGARDE EN DURA DANS LE NAVIGATEUR
        localStorage.setItem('userSession', JSON.stringify({
            userId: user.id,
            isLoggedIn: true,
            userProfile: newProfile
        }));

        fetchOrderHistory(user.id);

        // 🔄 Redirection vers la boutique
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

    // Change la vue en mettant à jour le hash de l'URL et l'état interne
    const handleNavigate = (view) => {
        const targetView = view.toLowerCase();
        if (targetView === 'profile') {
            fetchOrderHistory(userId);
        }
        window.location.hash = targetView;
        setCurrentView(targetView);
    };
    // Ouvre la vue de détail d'un produit spécifique et sauvegarde son ID dans l'URL et le LocalStorage
    const handleViewProduct = (productId) => {
        setSelectedProductId(productId);
        localStorage.setItem('selectedProductId', productId);
        window.location.hash = `product-detail/${productId}`;
        setCurrentView('product-detail');
    };

    // → En React, on ne doit JAMAIS modifier directement un état (ex: `prevCart.push()`). Il faut renvoyer une nouvelle référence d'objet.
    // J'utilise la forme fonctionnelle de `setCart` : si l'article est déjà présent, je crée un nouveau tableau via `.map()` en incrémentant la quantité de l'objet ciblé cloné via le spread operator `{...item}`.
    // S'il est absent, je crée un nouveau tableau fusionnant le panier précédent et le nouvel objet.
    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1, price: parseFloat(product.price) }];
        });
    };
    // Retire un article du panier ou diminue sa quantité de façon immuable
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
    // Calcul dynamique du total d'articles dans le panier via une réduction de tableau
    const totalArticles = cart.reduce((total, item) => total + item.quantity, 0);

    // Fonction de réinitialisation de session lors de la déconnexion
const handleLogout = () => {
    // 🗑️ SUPPRESSION DE LA SESSION STOCKÉE
    localStorage.removeItem('userSession');

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
    window.location.hash = 'home';
};
    // → L'utilisateur peut demander la suppression définitive de ses données depuis son profil.
    // Un appel HTTP avec la méthode `DELETE` est envoyé à la Gateway (qui route vers l'Order-Service).
    // Si le serveur confirme la suppression complète des lignes MySQL, l'interface déconnecte immédiatement l'utilisateur et nettoie le cache d'état.
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
    // → J'utilise un simple pattern `switch(currentView)`.
    // En fonction de la chaîne stockée dans l'état, la fonction retourne le composant JavaScript (JSX) correspondant en lui injectant les fonctions et données requises via les 'props'.
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
    )
}