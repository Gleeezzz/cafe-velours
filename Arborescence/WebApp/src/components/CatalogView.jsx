import React, { useState } from 'react';

export default function CatalogView() {
    // 1. Catégories de filtres issues de tes maquettes
    const categories = [
        { id: 'all', label: 'Tout' },
        { id: 'cafe', label: 'Cafés' },
        { id: 'chocolat', label: 'Chocolats' },
        { id: 'pack', label: 'Packs' }
    ];

    // 2. Mock complet des produits basés sur l'univers Café Velours
    const products = [
        { id: 1, name: "Finca Alta - Éthiopie", price: 15.00, category: 'cafe', tag: 'Caramel', desc: 'Notes fruitées et gourmandes.' },
        { id: 2, name: "Bourbon Pointu", price: 18.90, category: 'cafe', tag: 'Floral', desc: 'Rare et subtilement acidulé.' },
        { id: 3, name: "Cacao Madagascar 75%", price: 7.50, category: 'chocolat', tag: 'Fruité', desc: 'Tablette artisanale pure origine.' },
        { id: 4, name: "Éclats d'Amandes Noir", price: 8.20, category: 'chocolat', tag: 'Amande grillée', desc: 'Croquant et intensité aromatique.' },
        { id: 5, name: "Pack Découverte Initiation", price: 45.00, category: 'pack', tag: 'Populaire', desc: 'Sélection grands crus grains & chocolats.' },
        { id: 6, name: "Pack Duo Finca Alta", price: 58.00, category: 'pack', tag: 'Premium', desc: 'Le meilleur de nos terroirs assemblés.' }
    ];

    // 3. État pour mémoriser la catégorie sélectionnée
    const [activeFilter, setActiveFilter] = useState('all');

    // 4. Filtrage dynamique de la liste
    const filteredProducts = activeFilter === 'all'
        ? products
        : products.filter(p => p.category === activeFilter);

    return (
        <div className="bg-[#FAF7F4] font-sans pb-12">

            {/* ─── EN-TÊTE DU CATALOGUE ─── */}
            <div className="px-5 py-6">
                <h2 className="font-serif text-2xl text-[#0D0D0D] tracking-wide font-bold">Notre Collection</h2>
                <p className="text-xs text-gray-500 mt-1">Sélection rigoureuse de nos maîtres artisans</p>
            </div>

            {/* ─── BARRE DE FILTRAGE (Système d'onglets) ─── */}
            <div className="px-5 flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveFilter(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all uppercase whitespace-nowrap ${
                            activeFilter === cat.id
                                ? 'bg-[#B87333] text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* ─── GRILLE DES PRODUITS (Spécification Mobile : 2 Colonnes) ─── */}
            <div className="px-5 mt-6 grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-2xl p-4 border border-dashed border-gray-300 shadow-sm flex flex-col justify-between transition-transform duration-200 active:scale-[0.98]"
                    >
                        {/* Visuel / Badges */}
                        <div>
                            <div className="flex justify-between items-start gap-1 mb-2">
                <span className="bg-[#F3E6D9] text-[#B87333] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {product.tag}
                </span>
                                <span className="font-serif font-bold text-[#B87333] text-sm whitespace-nowrap">
                  {product.price.toFixed(2)} €
                </span>
                            </div>

                            {/* Titre & Description courte */}
                            <h4 className="font-serif font-bold text-xs text-[#0D0D0D] tracking-wide line-clamp-2 mt-1">
                                {product.name}
                            </h4>
                            <p className="text-gray-400 text-[10px] mt-1 line-clamp-2 leading-tight">
                                {product.desc}
                            </p>
                        </div>

                        {/* Bouton d'action "Ajouter au panier" */}
                        <button className="mt-4 w-full bg-[#0D0D0D] hover:bg-gray-800 text-white text-[10px] uppercase font-semibold py-2 rounded-xl transition-all tracking-wider">
                            + Panier
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}