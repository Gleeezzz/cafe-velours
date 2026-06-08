import React from 'react';

export default function ProfileView() {
    // Données strictes de ton écran Figma Sophie_3.png
    const userData = {
        name: "Sophie Martin",
        email: "sophie@email.com",
        role: "Client",
        address: "12 rue de Fleurs, Marseille",
        phone: "06 12 34 56 78",
        joined: "Janvier 2026"
    };

    const orderHistory = [
        {
            id: "#CV-2026-0042",
            date: "16 mars 2026",
            details: "Finca El Paraiso x1 + Pack Guatemala x1",
            total: "36,40 $",
            status: "Confirmée",
            statusClass: "tag-confirmed"
        },
        {
            id: "#CV-2026-0042", // Gardé à l'identique de la maquette
            date: "2 mars 2026",
            details: "Pack Ethiopie x1",
            total: "36,40 $",
            status: "Expédiée",
            statusClass: "tag-shipped"
        }
    ];

    return (
        <div className="profile-view-wrapper">

            {/* 1. Zone Haute : Avatar & Identité */}
            <div className="profile-avatar-header">
                <div className="avatar-circle">SM</div>
                <h2 className="profile-name">{userData.name}</h2>
                <p className="profile-email">{userData.email}</p>
                <span className="role-badge">{userData.role}</span>
            </div>

            {/* 2. Zone Commandes */}
            <h3 className="profile-group-title">Mes commandes</h3>
            {orderHistory.map((order, idx) => (
                <div key={idx} className="order-card-figma">
                    <div className="order-card-header">
                        <h4 className="order-id-txt">{order.id}</h4>
                        <span className={`status-tag ${order.statusClass}`}>{order.status}</span>
                    </div>
                    <p className="order-date-txt">{order.date}</p>
                    <p className="order-items-details">{order.details}</p>
                    <div className="order-card-footer">
                        <span className="order-total-price">{order.total}</span>
                        <button className="btn-order-details">Détails</button>
                    </div>
                </div>
            ))}

            {/* 3. Zone Infos Profil */}
            <h3 className="profile-group-title">Mon profil</h3>

            <div className="info-row-figma">
                <span className="info-label-figma">Adresse</span>
                <span className="info-value-figma">{userData.address}</span>
            </div>

            <div className="info-row-figma">
                <span className="info-label-figma">Téléphone</span>
                <span className="info-value-figma">{userData.phone}</span>
            </div>

            <div className="info-row-figma">
                <span className="info-label-figma">Membre depuis</span>
                <span className="info-value-figma">{userData.joined}</span>
            </div>

            {/* Gros Bouton d'action bas de page */}
            <button className="btn-edit-profile-figma" onClick={() => alert('Action : Modifier le profil')}>
                Modifier mon profil
            </button>

        </div>
    );
}