import React, { useState } from 'react';

export default function CartView() {
    const [isPaid, setIsPaid] = useState(false);

    // Article du panier calqué sur la commande éligible de Sophie
    const cartItems = [
        { id: 3, name: "Café Grain Exception - Finca Alta", qty: 2, price: 30.00 }
    ];

    const sousTotal = 60.00;
    const discountRate = 0.10; // 10% issus de ton MongoDB
    const montantRemise = sousTotal * discountRate;
    const totalFinal = sousTotal - montantRemise;

    // ÉCRAN B : Confirmation de Commande (ComConfirme.png)
    if (isPaid) {
        return (
            <div className="bg-[#FAF7F4] py-12 flex flex-col items-center justify-center px-6 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="font-serif text-xl font-bold text-[#0D0D0D] tracking-wide">
                    Merci pour votre commande !
                </h2>
                <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                    Votre paiement a été validé. Nos maîtres torréfacteurs préparent votre colis avec soin.
                </p>

                <div className="bg-white rounded-2xl p-4 border border-dashed border-gray-300 w-full max-w-xs mt-6 space-y-2 text-left shadow-sm">
                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Référence SQL :</span>
                        <span className="font-mono font-bold text-gray-800">#CV-2026-0012</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Statut :</span>
                        <span className="text-emerald-700 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded text-[9px] border border-emerald-200">
              PAID
            </span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-2 border-t border-gray-100">
                        <span className="text-gray-400">Montant final :</span>
                        <span className="font-serif font-bold text-[#B87333]">{totalFinal.toFixed(2)} €</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsPaid(false)}
                    className="mt-8 bg-[#0D0D0D] hover:bg-gray-900 text-white text-[10px] uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition-all"
                >
                    Simuler un nouveau panier
                </button>
            </div>
        );
    }

    // ÉCRAN A : Récapitulatif du Panier (Commande.png)
    return (
        <div className="bg-[#FAF7F4] font-sans pb-12">
            <div className="px-5 py-6">
                <h2 className="font-serif text-2xl text-[#0D0D0D] tracking-wide font-bold">Votre Panier</h2>
                <p className="text-xs text-gray-500 mt-1">Récapitulatif de vos articles sélectionnés</p>
            </div>

            <div className="px-5 space-y-5">
                {/* Liste des articles */}
                <div className="bg-white rounded-2xl p-4 border border-dashed border-gray-300 shadow-sm">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-1">
                            <div>
                                <h4 className="font-serif font-bold text-xs text-[#0D0D0D]">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5">Qté : {item.qty} x {item.price.toFixed(2)}€</p>
                            </div>
                            <span className="font-serif font-bold text-xs text-[#0D0D0D]">
                {(item.qty * item.price).toFixed(2)} €
              </span>
                        </div>
                    ))}
                </div>

                {/* Bloc des totaux */}
                <div className="bg-[#F3E6D9]/30 rounded-2xl p-4 border border-gray-200 space-y-2.5">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Sous-total articles</span>
                        <span>{sousTotal.toFixed(2)} €</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50/60 p-2 rounded-xl border border-emerald-200/60 border-dashed">
                        <span className="font-medium">🏷️ Remise Fidélité NoSQL</span>
                        <span className="font-bold">-{montantRemise.toFixed(2)} € (-10%)</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 pb-2 border-b border-dashed border-gray-300">
                        <span>Frais de port</span>
                        <span className="text-emerald-600 font-medium">Offerts</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                        <span className="font-serif text-xs font-bold text-[#0D0D0D]">Total à régler</span>
                        <span className="font-serif text-base font-bold text-[#B87333]">
              {totalFinal.toFixed(2)} €
            </span>
                    </div>
                </div>

                {/* Bouton de validation */}
                <div className="pt-2">
                    <button
                        onClick={() => setIsPaid(true)}
                        className="w-full bg-[#B87333] hover:bg-[#9E5E24] text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99]"
                    >
                        Valider et Payer {totalFinal.toFixed(2)} €
                    </button>
                </div>
            </div>
        </div>
    );
}