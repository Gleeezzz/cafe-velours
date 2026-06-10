import React, { useState } from 'react';
import '../index.css';

export default function ProfileView({ userProfile, setUserProfile, orders, setCurrentView }) {
    // État pour savoir quelle commande est actuellement déroulée (contient l'ID de la commande)
    const [expandedOrderId] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});

    // États pour le mode édition du profil
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstname: userProfile?.firstname || "Sophie",
        lastname: userProfile?.lastname || "Martin",
        email: userProfile?.email || "sophie@email.com",
        address: userProfile?.address || "12 rue de Fleurs, 13100 Marseille",
        phone: userProfile?.phone || "06 12 34 56 78"
    });

    // Permet d'ouvrir/fermer plusieurs accordéons indépendamment
    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
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

    // Fonction sécurisée pour formater le prix
    const formatPrice = (price) => {
        if (price === undefined || price === null) return "0.00 $";
        if (typeof price === 'string') {
            return price.includes('$') ? price : `${price} $`;
        }
        return `${Number(price).toFixed(2)} $`;
    };

    // Filtrer les éventuelles données de test / mock data pures du front
    // On ne garde que les vraies commandes qui viennent du cycle de vente (comme la #27)
    const validOrders = orders ? orders.filter(o => o && (o.id === 27 || o.finalAmount || o.items || o.orderItems)) : [];

    // ÉCRAN CONDITIONNEL : Si aucune commande valide
    if (validOrders.length === 0) {
        return (
            <div className="checkout-container" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>☕</div>
                <h2 style={{ fontSize: '1.4rem', color: '#8B5A2B', marginBottom: '10px' }}>Aucun profil actif</h2>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '30px' }}>
                    Vous n'avez pas encore passé de commande. Votre historique et vos informations de profil apparaîtront ici dès votre premier achat !
                </p>
                <button className="btn-confirm" style={{ width: '100%', padding: '12px' }} onClick={() => setCurrentView('catalog')}>
                    Découvrir notre Catalogue
                </button>
            </div>
        );
    }

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

                {validOrders.map((order, index) => {
                    const isExpanded = !!expandedOrders[order.id];
                    // Extraction adaptative de la liste des articles selon la structure renvoyée par le backend
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

                            {/* LISTE DES PRODUITS CLAIRE ET NETTE */}
                            <div style={{ margin: '12px 0', padding: '5px 0' }}>
                                {orderItems.length > 0 ? (
                                    orderItems.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333', marginBottom: '6px', paddingBottom: '4px', borderBottom: idx !== orderItems.length - 1 ? '1px dashed #f0f0f0' : 'none' }}>
                                            <div>
                                                <span style={{ fontWeight: '600', color: '#8B5A2B' }}>{item.quantity || item.quantite || 1}x</span> {item.productName || item.nom || "Café d'Exception"}
                                                {item.description && <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#777', fontStyle: 'italic' }}>{item.description}</p>}
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{formatPrice(item.price || item.prix)}</span>
                                        </div>
                                    ))
                                ) : (
                                    /* Fallback si la structure est plate */
                                    <p style={{ fontSize: '0.9rem', color: '#444', margin: '4px 0', fontWeight: '500' }}>
                                        {order.itemsSummary || "Finca El Paraiso"}
                                    </p>
                                )}
                            </div>

                            {/* ZONE DÉTAILS DÉROULANTE */}
                            {isExpanded && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #eee', backgroundColor: '#FAF9F6', padding: '12px', borderRadius: '6px' }}>
                                    <h5 style={{ margin: '0 0 8px 0', color: '#8B5A2B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Détails de livraison & facturation</h5>
                                    <p style={{ fontSize: '0.85rem', margin: '4px 0' }}><strong>Destinataire :</strong> {activeFirstname} {activeLastname}</p>
                                    <p style={{ fontSize: '0.85rem', margin: '4px 0' }}><strong>Adresse :</strong> {order.address || userProfile?.address || "Rue de feuillies, 13100 Masilia"}</p>
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
            <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1rem', color: '#8B5A2B', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px', marginTop: 0 }}>
                    Mon Profil
                </h3>

                {!isEditing ? (
                    <div style={{ fontSize: '0.95rem', lineHeight: '2.2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Adresse</span>
                            <span style={{ fontWeight: '500' }}>{userProfile?.address || "Rue de feuillies, 13100 Masilia"}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Téléphone</span>
                            <span style={{ fontWeight: '500' }}>{userProfile?.phone || "06 12 34 56 78"}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Membre depuis</span>
                            <span style={{ fontWeight: '500' }}>Juin 2026</span>
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
        </div>
    );
}