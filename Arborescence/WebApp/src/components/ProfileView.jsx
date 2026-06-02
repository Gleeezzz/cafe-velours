import React from 'react';

export default function ProfileView() {
    // Simulatons les informations utilisateur
    const user = {
        name: "Sophie Martin",
        email: "sophie@email.com",
        phone: "06 12 34 56 78",
        address: "12 Rue du Velours, 75001 Paris",
        status: "Client Premium"
    };

    // On simule l'historique que ton backend renvoie (Commande 1 et Commande 2)
    const ordersHistory = [
        { id: 1, ref: "#CV-2026-0042", date: "16/03/2026", amount: 26.40, discount: null, final: 26.40 },
        { id: 2, ref: "#CV-2026-0012", date: "10/02/2026", amount: 60.00, discount: "10%", final: 54.00 }
    ];

    return (
        <div className="bg-[#FAF7F4] font-sans pb-12">

            {/* ─── EN-TÊTE PROFIL (Bandeau Marron Cuivré) ─── */}
            <div className="bg-[#B87333] text-white px-6 py-8 rounded-b-[28px] shadow-md text-center">
                <div className="w-16 h-16 bg-white text-[#B87333] rounded-full mx-auto flex items-center justify-center font-serif text-2xl font-bold border-2 border-white shadow-inner">
                    SM
                </div>
                <h2 className="font-serif text-xl font-bold mt-3">{user.name}</h2>
                <p className="text-white/80 text-xs italic">{user.status} — Café Velours</p>
            </div>

            {/* ─── SECTION INFORMATIONS PERSONNELLES ─── */}
            <div className="px-5 mt-6">
                <h3 className="font-serif text-sm font-bold text-[#0D0D0D] uppercase tracking-wider mb-3">
                    Vos informations
                </h3>
                <div className="bg-white rounded-2xl p-4 border border-dashed border-gray-300 space-y-3 shadow-sm">
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Adresse e-mail</span>
                        <span className="text-xs text-gray-700 font-medium">{user.email}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Téléphone</span>
                        <span className="text-xs text-gray-700 font-medium">{user.phone}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Adresse de livraison</span>
                        <span className="text-xs text-gray-700 font-medium">{user.address}</span>
                    </div>
                </div>
            </div>

            {/* ─── SECTION HISTORIQUE DES COMMANDES (Lien MySQL/NoSQL) ─── */}
            <div className="px-5 mt-8">
                <h3 className="font-serif text-sm font-bold text-[#0D0D0D] uppercase tracking-wider mb-3">
                    Historique des commandes
                </h3>
                <div className="space-y-3">
                    {ordersHistory.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden"
                        >
                            {/* Badge de remise si existant (NoSQL) */}
                            {order.discount && (
                                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                                    Remise NoSQL -{order.discount}
                                </div>
                            )}

                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-mono font-bold text-gray-800">{order.ref}</span>
                                <span className="text-[10px] text-gray-400">{order.date}</span>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-100">
                                <span className="text-[11px] text-gray-500">Montant payé :</span>
                                <div className="text-right">
                                    {order.discount && (
                                        <span className="text-[10px] text-gray-400 line-through mr-1.5">
                      {order.amount.toFixed(2)}€
                    </span>
                                    )}
                                    <span className="font-serif font-bold text-xs text-[#B87333]">
                    {order.final.toFixed(2)} €
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}