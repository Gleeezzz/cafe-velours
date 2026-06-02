import React from 'react';

export default function HomeView({ onNavigate }) {
    // Données de mock pour le scroll horizontal des packs
    const featuredPacks = [
        { id: 1, name: "Pack Découverte Initiation", price: "45.00", desc: "Idéal pour s'initier aux grands crus de café et chocolats.", badge: "Populaire" },
        { id: 2, name: "Pack Duo Finca Alta & Cacao", price: "58.00", desc: "L'alliance parfaite entre torréfaction cuivrée et douceur.", badge: "Premium" },
        { id: 3, name: "Pack Connaisseur Intense", price: "65.00", desc: "Pour les amateurs de saveurs robustes et de caractères affirmés.", badge: "Édition Limitée" }
    ];

    return (
        <div className="bg-[#FAF7F4] font-sans pb-12">

            {/* ─── 1. HERO SECTION (Ambiance Sombre de la Charte) ─── */}
            <section className="bg-[#0D0D0D] text-white px-6 py-16 text-center rounded-b-[32px] shadow-lg">
        <span className="text-[#B87333] text-xs uppercase tracking-widest font-semibold block mb-2">
          Grains d'Exception & Chocolats Premium
        </span>
                <h1 className="font-serif text-3xl font-bold tracking-wide leading-tight max-w-sm mx-auto">
                    Le raffinement d'une torréfaction artisanale
                </h1>
                <p className="text-gray-400 text-xs mt-4 max-w-xs mx-auto leading-relaxed">
                    Découvrez une expérience sensorielle unique où la douceur du velours rencontre la force de caractères rigoureusement sélectionnés.
                </p>
                <button
                    onClick={() => onNavigate('catalog')}
                    className="mt-8 bg-[#B87333] hover:bg-[#9E5E24] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                    Découvrir le catalogue
                </button>
            </section>

            {/* ─── 2. PACKS DUO (Scroll Horizontal Mobile - Spécif. Charte) ─── */}
            <section className="mt-12 px-5">
                <div className="flex justify-between items-baseline mb-4">
                    <h3 className="font-serif text-lg font-bold text-[#0D0D0D] tracking-wide">
                        Nos Packs Exclusifs
                    </h3>
                    <span className="text-xs text-[#B87333] font-medium cursor-pointer" onClick={() => onNavigate('catalog')}>
            Voir tout →
          </span>
                </div>

                {/* Conteneur de défilement horizontal */}
                <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
                    {featuredPacks.map((pack) => (
                        <div
                            key={pack.id}
                            className="bg-white min-w-[260px] max-w-[260px] rounded-2xl p-5 border border-dashed border-gray-300 shadow-sm snap-start flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#B87333]/10 text-[#B87333] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#B87333]/20">
                    {pack.badge}
                  </span>
                                    <span className="font-serif font-bold text-[#B87333] text-base">{pack.price} €</span>
                                </div>
                                <h4 className="font-serif font-bold text-sm text-[#0D0D0D] line-clamp-1">{pack.name}</h4>
                                <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{pack.desc}</p>
                            </div>

                            <button
                                onClick={() => onNavigate('catalog')}
                                className="mt-4 w-full bg-[#0D0D0D] hover:bg-gray-800 text-white text-xs py-2.5 rounded-xl transition-all font-medium"
                            >
                                Découvrir le pack
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── 3. NOTRE HISTOIRE (Inspiré de Histoire.jpg) ─── */}
            <section className="mt-12 px-5">
                <div className="bg-[#F3E6D9]/50 rounded-2xl p-6 border border-gray-200/60 text-center">
                    <span className="text-xl">☕</span>
                    <h3 className="font-serif text-lg font-bold text-[#0D0D0D] mt-2 tracking-wide">
                        L'Art du Geste Précis
                    </h3>
                    <p className="text-gray-600 text-xs mt-3 leading-relaxed max-w-sm mx-auto">
                        Chez <span className="font-serif italic font-medium">Café Velours</span>, chaque grain est importé de coopératives éco-responsables puis torréfié à cœur de manière traditionnelle. Notre savoir-faire garantit une fraîcheur absolue pour révéler la quintessence aromatique de chaque terroir.
                    </p>
                </div>
            </section>

        </div>
    );
}