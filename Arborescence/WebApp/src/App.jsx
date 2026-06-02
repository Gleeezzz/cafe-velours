import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulation de l'ID utilisateur de Sophie Martin
    const userId = 1;

    useEffect(() => {
        // Appel de la Gateway Spring Boot (Port 8080) vers l'endpoint de l'historique
        axios.get(`http://localhost:8080/api/orders/user/${userId}`)
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des commandes :", err);
                setError("Impossible de charger l'historique. Vérifiez que la Gateway et Order-Service sont lancés.");
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f6f0', minHeight: '100vh', color: '#2c1d11' }}>
            <header style={{ borderBottom: '2px solid #4a2c11', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ color: '#4a2c11', margin: 0 }}>☕ Café Velours — Espace Client</h1>
                <p style={{ color: '#666', fontStyle: 'italic' }}>Grains d'Exception & Chocolats Premium</p>
            </header>

            <main>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                    <h2>Bienvenue, Sophie Martin 👋</h2>
                    <p style={{ color: '#555' }}>Consultez ci-dessous vos achats et vos remises exclusives basées sur notre moteur NoSQL.</p>
                </div>

                <h3 style={{ color: '#4a2c11', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>📜 Votre Historique de Commandes</h3>

                {loading && <p style={{ color: '#f39c12', fontWeight: 'bold' }}>🔄 Chargement de vos commandes...</p>}
                {error && <div style={{ color: '#c0392b', backgroundColor: '#fcdede', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>⚠️ {error}</div>}

                {!loading && !error && orders.length === 0 && (
                    <p>Vous n'avez pas encore passé de commande sur Café Velours.</p>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {orders.map((order) => {
                            // On se base uniquement sur ce que renvoie le Back-end NoSQL
                            const currentDiscountRate = order.discountRate || 0;
                            const hasDiscount = currentDiscountRate > 0;
                             // On calcule le montant final en appliquant directement le taux reçu du Back
                            const currentFinalAmount = hasDiscount ? (order.totalAmount * (1 - currentDiscountRate)) : order.totalAmount;

                            return (
                                <div key={order.id} style={{ border: '1px solid #e0d7cc', borderRadius: '6px', padding: '15px', backgroundColor: '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '10px' }}>
                                        <span>Commande #{order.id}</span>
                                        <span style={{ color: '#27ae60' }}>Statut: {order.status}</span>
                                    </div>

                                    {/* Montant Initial */}
                                    <p style={{ margin: '5px 0' }}><strong>Montant Initial :</strong> {order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00'} €</p>

                                    {/* Affichage de la remise */}
                                    {hasDiscount ? (
                                        <div style={{ backgroundColor: '#e8f8f5', padding: '8px', borderRadius: '4px', margin: '10px 0', borderLeft: '4px solid #2ecc71' }}>
                                            <p style={{ margin: 0, color: '#27ae60', fontWeight: 'bold' }}>🎉 Remise NoSQL Appliquée : -{(currentDiscountRate * 100)}%</p>
                                            <p style={{ margin: 0, fontSize: '1.1em', fontWeight: 'bold' }}>Montant Final Restant : {Number(currentFinalAmount).toFixed(2)} €</p>
                                        </div>
                                    ) : (
                                        <div style={{ margin: '10px 0', color: '#7f8c8d' }}>
                                            <p style={{ margin: '5px 0', fontSize: '0.9em', fontStyle: 'italic' }}>Aucune remise appliquée.</p>
                                            <p style={{ margin: 0, fontSize: '1.1em', fontWeight: 'bold', color: '#2c1d11' }}>
                                                Montant À Payer : {order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00'} €
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;