import React, { useState } from 'react';
import '../index.css';

/* Ce composant gère l'affichage des informations de l'utilisateur, l'édition de ses coordonnées,
* l'historique complet de ses achats, ainsi que les actions de conformité RGPD (Suppression/Déconnexion).
*/

export default function ProfileView({ userProfile, setUserProfile, orders, setCurrentView, userId, onLogout, onDeleteAccount }) {
    /* ─── 🧊 INTERFACE & NAVIGATION DYNAMIQUE (HOOKS) ─── */

    /* Gestion de l'affichage accordéon des commandes.
       Stocke un objet de type `{ [orderId]: true/false }` permettant d'ouvrir le détail
       de chaque commande indépendamment les unes des autres. */
    const [expandedOrders, setExpandedOrders] = useState({});

    // Toggle d'état : false = Mode consultation | true = Formulaire d'édition ouvert
    const [isEditing, setIsEditing] = useState(false);

    // État du formulaire d'édition pré-rempli avec les données existantes ou des valeurs de repli (fallback)
    const [editForm, setEditForm] = useState({
        firstname: userProfile?.firstname || "Sophie",
        lastname: userProfile?.lastname || "Martin",
        email: userProfile?.email || "sophie@email.com",
        address: userProfile?.address || "12 rue de Fleurs, 13100 Marseille",
        phone: userProfile?.phone || "06 12 34 56 78"
    });


    /**
     * TOGGLE ACCORDÉON : Ouvre ou ferme le tiroir de détails d'une commande
     * @param orderId Identifiant unique de la commande cliquée
     */
    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]  // Inverse l'état booléen de la clé orderId
        }));
    };

    /**
     * PERSISTANCE LOCAL DU PROFIL (MUTATION D'ÉTAT)
     */
    const handleSaveProfile = (e) => {
        e.preventDefault();
        // Met à jour l'état global détenu par App.jsx en y déversant les nouvelles valeurs du formulaire
        setUserProfile({
            ...userProfile,
            firstname: editForm.firstname,
            lastname: editForm.lastname,
            email: editForm.email,
            address: editForm.address,
            phone: editForm.phone
        });
        setIsEditing(false);
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "0.00 $";
        if (typeof price === 'string') {
            return price.includes('$') ? price : `${price} $`;
        }
        return `${Number(price).toFixed(2)} $`;
    };

    /* 🧼 NETTOYAGE DES DONNÉES ENTRANTES (DATA SANITIZATION)
       On filtre le tableau des commandes pour éliminer les objets corrompus, mal formés ou vides
       qui auraient pu transiter lors des phases de tests inter-services. */

    const validOrders = orders ? orders.filter(o => o && (o.id === 27 || o.finalAmount || o.items || o.orderItems)) : [];

    /* 🔀 RENDU CONDITIONNEL D'ÉCRAN VIDE (EARLY RETURN)
       Si l'historique est vierge, on court-circuite le rendu pour afficher un écran d'incitation à l'achat (UX propre). */
    if (validOrders.length === 0) {
        return (
            <div className="checkout-container" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.75 87.5C18.75 87.5 12.5 87.5 12.5 81.25C12.5 75 18.75 56.25 50 56.25C81.25 56.25 87.5 75 87.5 81.25C87.5 87.5 81.25 87.5 81.25 87.5H18.75ZM50 50C54.9728 50 59.7419 48.0246 63.2583 44.5083C66.7746 40.9919 68.75 36.2228 68.75 31.25C68.75 26.2772 66.7746 21.5081 63.2583 17.9917C59.7419 14.4754 54.9728 12.5 50 12.5C45.0272 12.5 40.2581 14.4754 36.7417 17.9917C33.2254 21.5081 31.25 26.2772 31.25 31.25C31.25 36.2228 33.2254 40.9919 36.7417 44.5083C40.2581 48.0246 45.0272 50 50 50Z"
                            fill="#8B5A2B"
                        />
                    </svg>
                </div>                <h2 style={{ fontSize: '1.4rem', color: '#8B5A2B', marginBottom: '10px' }}>Aucun profil actif</h2>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '30px' }}>
                    Vous n'avez pas encore passé de commande. Votre historique et vos informations de profil apparaîtront ici dès votre premier achat !
                </p>
                <button className="btn-confirm" style={{ width: '100%', padding: '12px' }} onClick={() => setCurrentView('catalog')}>
                    Découvrir notre Catalogue
                </button>
            </div>
        );
    }

    // Extraction des valeurs actives pour un affichage fluide
    const activeFirstname = userProfile?.firstname || "Sophie";
    const activeLastname = userProfile?.lastname || "Martin";
    const activeEmail = userProfile?.email || "sophie@email.com";

    return (
        <div className="checkout-container" style={{ maxWidth: '600px', margin: '30px auto' }}>

            {/* AVATAR & HEADER DYNAMIQUE */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                    width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#8B5A2B',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', fontWeight: 'bold', margin: '0 auto 10px auto'
                }}>
                    {/* Génération automatique des initiales de l'utilisateur (Ex: "SM") */}
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
                    CLIENT PREMIUM
                </span>
            </div>

            {/* BLOCK 1 : HISTORIQUE DES COMMANDES */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1rem', color: '#8B5A2B', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>
                    Mes Commandes ({validOrders.length})
                </h3>

                {/* Itération sur le tableau des commandes via la méthode .map() */}
                {validOrders.map((order, index) => {
                    const isExpanded = !!expandedOrders[order.id];
                    const orderItems = order.items || order.orderItems || [];

                    return (
                        <div key={order.id || index} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <strong style={{ fontSize: '1rem' }}>
                                    {order.id ? (String(order.id).startsWith('#') ? order.id : `#${order.id}`) : "#CV-2026-XXXX"}
                                </strong>
                                <span style={{
                                    backgroundColor: '#E2F0D9',
                                    color: '#385723',
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    {order.status || "Payée"}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#888', margin: '2px 0' }}>Fait le : {order.date || "Récemment"}</p>

                            <div style={{ margin: '12px 0', padding: '5px 0' }}>
                                {orderItems.length > 0 ? (
                                    orderItems.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333', marginBottom: '6px', paddingBottom: '4px', borderBottom: idx !== orderItems.length - 1 ? '1px dashed #f0f0f0' : 'none' }}>
                                            <div>
                                                <span style={{ fontWeight: '600', color: '#8B5A2B' }}>{item.quantity || item.quantite || 1}x</span> {item.productName || item.nom || "Café d'Exception"}
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{formatPrice(item.price || item.prix)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ fontSize: '0.9rem', color: '#444', margin: '4px 0', fontWeight: '500' }}>
                                        {order.itemsSummary || "Finca El Paraiso"}
                                    </p>
                                )}
                            </div>
                            {/* TIROIR ACCORDÉON DE LIVRAISON SÉLECTIONNÉ */}
                            {isExpanded && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #eee', backgroundColor: '#FAF9F6', padding: '12px', borderRadius: '6px' }}>
                                    <h5 style={{ margin: '0 0 8px 0', color: '#8B5A2B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Détails de livraison & facturation</h5>
                                    <p style={{ fontSize: '0.85rem', margin: '4px 0' }}><strong>Destinataire :</strong> {activeFirstname} {activeLastname}</p>
                                    <p style={{ fontSize: '0.85rem', margin: '4px 0' }}><strong>Adresse :</strong> {order.address || userProfile?.address || "Rue de fleurs, 13100 Marseille"}</p>
                                    <p style={{ fontSize: '0.85rem', margin: '4px 0' }}><strong>Mode de paiement :</strong> Carte Bancaire (Simulé)</p>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #f5f5f5', paddingTop: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#111' }}>
                                    Total : {formatPrice(order.finalAmount || order.totalAmount || order.total)}
                                </span>
                                <button
                                    style={{
                                        backgroundColor: isExpanded ? '#8B5A2B' : 'transparent',
                                        color: isExpanded ? '#fff' : '#666',
                                        border: '1px solid #ccc', borderRadius: '4px', padding: '5px 14px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onClick={() => toggleOrderDetails(order.id)}
                                >
                                    {isExpanded ? 'Masquer' : 'Détails'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BLOCK 2 : MON PROFIL INTERACTIF */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', color: '#8B5A2B', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px', marginTop: 0 }}>
                    Mon Profil
                </h3>

                {!isEditing ? (
                    /* Vue Consultation simple */
                    <div style={{ fontSize: '0.95rem', lineHeight: '2.2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Adresse</span>
                            <span style={{ fontWeight: '500' }}>{userProfile?.address || "Rue de fleurs, 13100 Marseille"}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Téléphone</span>
                            <span style={{ fontWeight: '500' }}>{userProfile?.phone || "06 12 34 56 78"}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Membre depuis</span>
                            <span style={{ fontWeight: '500' }}>{userProfile?.memberSince || "Juin 2026"}</span>
                        </div>
                        <button
                            className="btn-confirm"
                            style={{ marginTop: '20px', width: '100%', padding: '10px' }}
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier mon profil
                        </button>
                    </div>
                ) : (
                    /* Vue Édition de profil avec formulaire contrôlé */
                    <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.85rem', color: '#555' }}>Prénom</label>
                                <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={editForm.firstname} onChange={e => setEditForm({...editForm, firstname: e.target.value})} required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.85rem', color: '#555' }}>Nom</label>
                                <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={editForm.lastname} onChange={e => setEditForm({...editForm, lastname: e.target.value})} required />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#555' }}>Adresse Complète</label>
                            <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} required />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: '#555' }}>Téléphone</label>
                            <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} required />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" className="btn-confirm" style={{ flex: 1, padding: '10px', backgroundColor: '#385723' }}>
                                Sauvegarder
                            </button>
                            <button type="button" className="btn-confirm" style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc' }} onClick={() => setIsEditing(false)}>
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* LE BOUTON CATALOGUE INTERACTIF */}
            <button
                onClick={() => setCurrentView('catalog')}
                style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    color: '#8B5A2B',
                    border: '1px solid #8B5A2B',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#8B5A2B';
                    e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#8B5A2B';
                }}
            >
                ← Retourner au catalogue
            </button>

            {/* --- ESPACE COMPTE & SÉCURITÉ RGPD --- */}
            <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px dashed #e0e0e0' }}>
                <h4 style={{ color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    Options du compte
                </h4>

                {/* Bouton Se déconnecter */}
                <button
                    onClick={onLogout}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '10px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                    🚪 Se déconnecter
                </button>

                {/* Bouton Supprimer le compte */}
                /* → Via cette fonctionnalité d'effacement du compte. Conformément à la loi sur le "Droit à l'oubli",
                le client peut déclencher un nettoyage complet. L'application demande une confirmation de sécurité,
                puis appelle la méthode `onDeleteAccount` qui va envoyer une requête DELETE au Back-end pour purger
                toutes les données personnelles de l'utilisateur stockées en base MySQL. */
                <button
                    onClick={() => {
                        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement votre compte et vos données ? Cette action est irréversible (Conforme RGPD).")) {
                            onDeleteAccount(userId);
                        }
                    }}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: 'transparent',
                        color: '#d32f2f',
                        border: '1px solid #d32f2f',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#d32f2f';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#d32f2f';
                    }}
                >
                    🗑️ Supprimer mon compte
                </button>
            </div>

        </div>
    );
}