import React, { useState } from 'react';
import '../index.css';

/* Ce composant gère l'affichage des informations de l'utilisateur, l'édition de ses coordonnées,
* l'historique complet de ses achats, ainsi que les actions de conformité RGPD (Suppression/Déconnexion).
*/

export default function ProfileView({ userProfile, setUserProfile, orders, setCurrentView, userId, onLogout, onDeleteAccount }) {
    /* ─── INTERFACE & NAVIGATION DYNAMIQUE (HOOKS) ─── */

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

    /*  NETTOYAGE DES DONNÉES ENTRANTES (DATA SANITIZATION)
       On filtre le tableau des commandes pour éliminer les objets corrompus, mal formés ou vides
       qui auraient pu transiter lors des phases de tests inter-services. */

    const validOrders = orders ? orders.filter(o => o && (o.id === 27 || o.finalAmount || o.items || o.orderItems)) : [];

    /* 🔀 RENDU CONDITIONNEL D'ÉCRAN VIDE (EARLY RETURN)
       Si l'historique est vierge, on court-circuite le rendu pour afficher un écran d'incitation à l'achat (UX propre). */
    if (validOrders.length === 0) {
        return (
            <div className="profile-empty">
                <div className="profile-empty-icon">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.75 87.5C18.75 87.5 12.5 87.5 12.5 81.25C12.5 75 18.75 56.25 50 56.25C81.25 56.25 87.5 75 87.5 81.25C87.5 87.5 81.25 87.5 81.25 87.5H18.75ZM50 50C54.9728 50 59.7419 48.0246 63.2583 44.5083C66.7746 40.9919 68.75 36.2228 68.75 31.25C68.75 26.2772 66.7746 21.5081 63.2583 17.9917C59.7419 14.4754 54.9728 12.5 50 12.5C45.0272 12.5 40.2581 14.4754 36.7417 17.9917C33.2254 21.5081 31.25 26.2772 31.25 31.25C31.25 36.2228 33.2254 40.9919 36.7417 44.5083C40.2581 48.0246 45.0272 50 50 50Z"
                            fill="#8B5A2B"
                        />
                    </svg>
                </div>
                <h2 className="profile-empty-title">Aucun profil actif</h2>
                <p className="profile-empty-text">
                    Vous n'avez pas encore passé de commande. Votre historique et vos informations de profil apparaîtront ici dès votre premier achat !
                </p>
                <button className="btn-confirm profile-empty-btn" onClick={() => setCurrentView('catalog')}>
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
        <div className="profile-page">

            {/* AVATAR & HEADER DYNAMIQUE */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {/* Génération automatique des initiales de l'utilisateur (Ex: "SM") */}
                    {activeFirstname.charAt(0).toUpperCase()}
                    {activeLastname ? activeLastname.charAt(0).toUpperCase() : ""}
                </div>
                <h2 className="profile-page-name">
                    {activeFirstname} {activeLastname}
                </h2>
                <p className="profile-page-email">
                    {activeEmail}
                </p>
                <span className="profile-badge">
                    CLIENT PREMIUM
                </span>
            </div>

            {/* BLOCK 1 : HISTORIQUE DES COMMANDES */}
            <div className="profile-orders-section">
                <h3 className="profile-section-title">
                    Mes Commandes ({validOrders.length})
                </h3>

                {/* Itération sur le tableau des commandes via la méthode .map() */}
                {validOrders.map((order, index) => {
                    const isExpanded = !!expandedOrders[order.id];
                    const orderItems = order.items || order.orderItems || [];

                    return (
                        <div key={order.id || index} className="order-card">
                            <div className="order-card-top">
                                <strong className="order-id">
                                    {order.id ? (String(order.id).startsWith('#') ? order.id : `#${order.id}`) : "#CV-2026-XXXX"}
                                </strong>
                                <span className="order-status">
                                    {order.status || "Payée"}
                                </span>
                            </div>
                            <p className="order-date">Fait le : {order.date || "Récemment"}</p>

                            <div className="order-items">
                                {orderItems.length > 0 ? (
                                    orderItems.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`order-item${idx !== orderItems.length - 1 ? ' order-item-separator' : ''}`}
                                        >
                                            <div>
                                                <span className="order-item-qty">{item.quantity || item.quantite || 1}x</span> {item.productName || item.nom || "Café d'Exception"}
                                            </div>
                                            <span className="order-item-price">{formatPrice(item.price || item.prix)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="order-item-fallback">
                                        {order.itemsSummary || "Finca El Paraiso"}
                                    </p>
                                )}
                            </div>
                            {/* TIROIR ACCORDÉON DE LIVRAISON SÉLECTIONNÉ */}
                            {isExpanded && (
                                <div className="order-details">
                                    <h5 className="order-details-title">Détails de livraison & facturation</h5>
                                    <p className="order-details-line"><strong>Destinataire :</strong> {activeFirstname} {activeLastname}</p>
                                    <p className="order-details-line"><strong>Adresse :</strong> {order.address || userProfile?.address || "Rue de fleurs, 13100 Marseille"}</p>
                                    <p className="order-details-line"><strong>Mode de paiement :</strong> Carte Bancaire (Simulé)</p>
                                </div>
                            )}

                            <div className="order-footer">
                                <span className="order-total">
                                    Total : {formatPrice(order.finalAmount || order.totalAmount || order.total)}
                                </span>
                                <button
                                    className={`btn-toggle-details${isExpanded ? ' active' : ''}`}
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
            <div className="profile-section">
                <h3 className="profile-section-title profile-section-title-flush">
                    Mon Profil
                </h3>

                {!isEditing ? (
                    /* Vue Consultation simple */
                    <div className="profile-view-mode">
                        <div className="profile-row">
                            <span className="profile-row-label">Adresse</span>
                            <span className="profile-row-value">{userProfile?.address || "Rue de fleurs, 13100 Marseille"}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-row-label">Téléphone</span>
                            <span className="profile-row-value">{userProfile?.phone || "06 12 34 56 78"}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-row-label">Membre depuis</span>
                            <span className="profile-row-value">{userProfile?.memberSince || "Juin 2026"}</span>
                        </div>
                        <button
                            className="btn-confirm profile-edit-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier mon profil
                        </button>
                    </div>
                ) : (
                    /* Vue Édition de profil avec formulaire contrôlé */
                    <form onSubmit={handleSaveProfile} className="profile-edit-form">
                        <div className="form-row">
                            <div className="profile-form-group">
                                <label>Prénom</label>
                                <input type="text" value={editForm.firstname} onChange={e => setEditForm({...editForm, firstname: e.target.value})} required />
                            </div>
                            <div className="profile-form-group">
                                <label>Nom</label>
                                <input type="text" value={editForm.lastname} onChange={e => setEditForm({...editForm, lastname: e.target.value})} required />
                            </div>
                        </div>
                        <div className="profile-form-group">
                            <label>Adresse Complète</label>
                            <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} required />
                        </div>
                        <div className="profile-form-group">
                            <label>Téléphone</label>
                            <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} required />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-confirm btn-save-profile">
                                Sauvegarder
                            </button>
                            <button type="button" className="btn-confirm btn-cancel-profile" onClick={() => setIsEditing(false)}>
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* LE BOUTON CATALOGUE INTERACTIF */}
            <button
                onClick={() => setCurrentView('catalog')}
                className="btn-back-catalog"
            >
                ← Retourner au catalogue
            </button>

            {/* --- ESPACE COMPTE & SÉCURITÉ RGPD --- */}
            <div className="account-options">
                <h4 className="account-options-title">
                    Options du compte
                </h4>

                {/* Bouton Se déconnecter */}
                <button
                    onClick={onLogout}
                    className="btn-logout"
                >
                    🚪 Se déconnecter
                </button>

                {/* Bouton Supprimer le compte */}
                {/*
      → Via cette fonctionnalité d'effacement du compte. Conformément à la loi sur le "Droit à l'oubli",
      le client peut déclencher un nettoyage complet. L'application demande une confirmation de sécurité,
      puis appelle la méthode `onDeleteAccount` qui va envoyer une requête DELETE au Back-end pour purger
      toutes les données personnelles de l'utilisateur stockées en base MySQL.
  */}
                <button
                    onClick={() => {
                        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement votre compte et vos données ? Cette action est irréversible (Conforme RGPD).")) {
                            onDeleteAccount(userId);
                        }
                    }}
                    className="btn-delete-account"
                >
                    🗑️ Supprimer mon compte
                </button>
            </div>

        </div>
    );
}
