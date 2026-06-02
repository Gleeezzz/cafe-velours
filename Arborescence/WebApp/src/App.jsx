import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import ProfileView from './components/ProfileView';
import CartView from './components/CartView';
import Footer from './components/Footer';

export default function App() {
    // L'état qui pilote l'onglet actif de l'application
    const [currentTab, setCurrentTab] = useState('home');

    // Fonction de rendu dynamique selon l'onglet sélectionné
    const renderContent = () => {
        switch (currentTab) {
            case 'home':
                return <HomeView onNavigate={setCurrentTab} />;
            case 'catalog':
                return <CatalogView />;
            case 'profile':
                return <ProfileView />;
            case 'cart':
                return <CartView />;
            default:
                return <div className="p-6 text-center">Vue introuvable.</div>;
        }
    };

    return (
        <div className="bg-[#FAF7F4] min-h-screen flex flex-col justify-between font-sans selection:bg-[#B87333]/20">
            {/* En-tête Global de l'application */}
            <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

            {/* Zone de contenu dynamique (Cœur des pages) */}
            <main className="flex-grow">
                {renderContent()}
            </main>

            {/* Bas de page Global */}
            <Footer />
        </div>
    );
}