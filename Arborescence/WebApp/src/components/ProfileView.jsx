import React from 'react';
import '../index.css';

export default function ProfileView({ userProfile, setUserProfile, orders, setCurrentView }) {

    const handleEditProfile = () => {
        alert("Action : Modifier le profil");
    };

    // Fonction sécurisée pour formater le prix
    const formatPrice = (price) => {
        if (price === undefined || price === null) return "0.00 $";
        if (typeof price === 'string') {
            return price.includes('$') ? price : `${price} $`;
        }
        return `${price.toFixed(2)} $`;
    };

    // ── CONDITION CRITIQUE : Si aucune commande, on bloque TOUT le reste du rendu ──
    if (!orders || orders.length === 0) {
        return (
            <div className="checkout-container" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>☕</div>
                <h2 style={{ fontSize: '1.4rem', color: '#8B5A2B', marginBottom: '10px' }}>
                    Aucun profil actif
                </h2>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '30px' }}>
                    Vous n'avez pas encore passé de commande. Votre historique et vos informations de profil apparaîtront ici dès votre premier achat !
                </p>
                <button
                    className="btn-confirm"
                    style={{ width: '100%', padding: '12px' }}
                    onClick={() => setCurrentView('catalog')} // Aligné sur 'catalog' (minuscule) comme dans ton App.jsx
                >
                    Découvrir notre Catalogue
                </button>
            </div>
        );
    }

    // ── RENDU NORMAL : S'affiche UNIQUEMENT si au moins une commande existe ──
    const activeFirstname = userProfile?.firstname || "Client";
    const activeLastname = userProfile?.lastname || "";
    const activeEmail = userProfile?.email || "non-communique@email.com";
    const activeAddress = userProfile?.address || "Adresse non renseignée";

    return (
        <div className="checkout-container" style={{ maxWidth: '600px', margin: '30px auto' }}>
            {/* AVATAR & HEADER DYNAMIQUE */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                    width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#8B5A2B',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', fontWeight: 'bold', margin: '0 auto 10px auto'
                }}>
                    {activeFirstname.charAt(0).toUpperCase()}
                    {activeLastname ? activeLastname.charAt(0).toUpperCase() : ""}
                </div>
                <h2 style={{ margin: '5px 0 0 0', fontSize: '1.5rem' }}>
                    {activeFirstname} {activeLastname}
                </h2>
                <p style={{ margin: '2px 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                    {activeEmail}
                </p>
                <span style={{ backgroundColor: '#E8F5E9', color: '#2e7d32', padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    CLIENT
                </span>
            </div>

            {/* HISTORIQUE DES COMMANDES */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1rem', color: '#8B5A2B', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>
                    Mes Commandes ({orders.length})
                </h3>

                {orders.map((order, index) => (
                    <div key={order.id || index} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '1rem' }}>{order.id ? (order.id.startsWith('#') ? order.id : `#${order.id}`) : "#CV-2026-XXXX"}</strong>
                            <span style={{
                                backgroundColor: order.status === 'Expédiée' || order.status === 'Confirmée' ? '#E2F0D9' : '#FFF2CC',
                                color: order.status === 'Expédiée' || order.status === 'Confirmée' ? '#385723' : '#D66011',
                                padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'
                            }}>
                                {order.status || "En cours"}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#888', margin: '2px 0' }}>{order.date || "Récemment"}</p>
                        <p style={{ fontSize: '0.9rem', color: '#444', margin: '8px 0' }}>{order.itemsSummary || "Articles de la commande"}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #f5f5f5', paddingTop: '10px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#111' }}>
                                {formatPrice(order.total)}
                            </span>
                            <button
                                style={{ backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
                                onClick={() => alert(`Détails de la commande ${order.id} : \n${order.itemsSummary || "Non spécifié"}`)}
                            >
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* DÉTAILS DU PROFIL (Désormais masqués si 0 commande) */}
            <div>
                <h3 style={{ fontSize: '1rem', color: '#8B5A2B', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>
                    Mon Profil
                </h3>
                <div style={{ fontSize: '0.95rem', lineHeight: '2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Adresse</span>
                        <span>{activeAddress}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Téléphone</span>
                        <span>{userProfile?.phone || "06 12 34 56 78"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Membre depuis</span>
                        <span>{userProfile?.memberSince || "Juin 2026"}</span>
                    </div>
                </div>

                <button className="btn-confirm" style={{ marginTop: '20px', width: '100%' }} onClick={handleEditProfile}>
                    Modifier mon profil
                </button>
            </div>
        </div>
    );
}