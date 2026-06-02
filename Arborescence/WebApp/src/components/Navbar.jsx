import React from 'react';

export default function Navbar({ currentTab, setCurrentTab }) {
    // Vos 5 onglets définis dans notre plan de route
    const navigationItems = [
        { id: 'home', label: 'Accueil' },
        { id: 'catalog', label: 'Catalogue' },
        { id: 'profile', label: 'Profil' },
        { id: 'cart', label: 'Panier' }
    ];

    return (
        <nav className="bg-[#0D0D0D] text-white sticky top-0 z-50">
            {/* Barre principale (Header Flexbox) */}
            <div className="px-4 py-4 flex items-center justify-between border-b border-[#B87333]/20">

                {/* Logo Serif de la Charte */}
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setCurrentTab('home')}>
          <span className="font-serif italic text-xl tracking-wider font-semibold">
            Café Velours
          </span>
                </div>

                {/* Menu de navigation rapide */}
                <div className="flex gap-4 text-xs uppercase tracking-widest">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentTab(item.id)}
                            className={`transition-colors duration-200 ${
                                currentTab === item.id
                                    ? 'text-[#B87333] font-bold'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}