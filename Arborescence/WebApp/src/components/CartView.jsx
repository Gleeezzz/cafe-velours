import React, { useState } from 'react';
import '../index.css';

export default function CartView({ cart, setCart, userProfile, setUserProfile, ordersHistory, setOrdersHistory, onViewChange }) {
    // Étapes du tunnel : 'checkout' -> 'payment' -> 'success'
    const [step, setStep] = useState('checkout');

    // États locaux pour les formulaires (commencent vides !)
    const [localForm, setLocalForm] = useState({
        firstname: userProfile.firstname || "",
        lastname: userProfile.lastname || "",
        email: userProfile.email || "",
        address: userProfile.address || "",
        zip: userProfile.zip || "",
        city: userProfile.city || ""
    });

    // État pour le formulaire de paiement par carte
    const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvc: "" });

    // États pour le détail d'une commande ouverte dans le récapitulatif
    const [showDetails, setShowDetails] = useState(false);

    // ── CALCUL DES PRIX & REMISE DYNAMIQUE ──
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasDiscount = subtotal > 50;
    const discountAmount = hasDiscount ? subtotal * 0.10 : 0;
    const total = subtotal - discountAmount;

    // Numéro de commande unique pour cette session de test
    const [generatedOrderNum] = useState(`CV-2026-00${Math.floor(Math.random() * 90) + 10}`);

    // Passage à l'étape de paiement
    const handleGoToPayment = (e) => {
        e.preventDefault();
        // On sauvegarde les infos saisies dans le profil utilisateur global
        setUserProfile({
            ...userProfile,
            firstname: localForm.firstname,
            lastname: localForm.lastname,
            email: localForm.email,
            address: `${localForm.address}, ${localForm.zip} ${localForm.city}`
        });
        setStep('payment');
    };

    // Validation du paiement, envoi BDD et inscription à l'historique
    const handleProcessPayment = async (e) => {
        e.preventDefault();

        // Préparation de la chaîne textuelle résumant les articles pour l'historique
        const itemsSummary = cart.map(item => `${item.name} x${item.quantity}`).join(' + ');

        // 1. On injecte la commande de manière 100% dynamique dans l'historique
        const newOrder = {
            id: generatedOrderNum,
            date: "8 juin 2026",
            itemsSummary: itemsSummary,
            total: parseFloat(total.toFixed(2)),
            status: "Expédiée" // Statut demandé après le paiement
        };

        setOrdersHistory([newOrder, ...ordersHistory]);

        // 2. Envoi synchrone au backend en tâche de fond
        const itemsPayload = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        try {
            await fetch('http://localhost:8081/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemsPayload)
            });
        } catch (error) {
            console.error("Erreur réseau backend, mais la simulation continue :", error);
        }

        setStep('success');
    };

    const handleNavigationAfterSuccess = (targetView) => {
        setCart([]); // On vide le panier
        if (onViewChange) onViewChange(targetView);
    };

    /* ─────────────────────────────────────────────────────────
       RENDU 1 : COORDONNÉES DE LIVRAISON (CHECKOUT)
       ───────────────────────────────────────────────────────── */
    if (step === 'checkout') {
        if (cart.length === 0) {
            return (
                <div className="checkout-container" style={{ textAlign: 'center', padding: '40px' }}>
                    <h2>Votre panier est vide</h2>
                    <p style={{ marginBottom: '20px' }}>Ajoutez des produits depuis le catalogue pour commencer la simulation.</p>
                    <button className="btn-confirm" onClick={() => onViewChange('catalog')}>Aller au catalogue</button>
                </div>
            );
        }

        return (
            <div className="checkout-container">
                <h2 className="checkout-title">Finaliser la commande</h2>
                <form className="checkout-form" onSubmit={handleGoToPayment}>
                    <div className="form-row-half">
                        <div className="form-group">
                            <label>Prénom*</label>
                            <input type="text" placeholder="Ex: Sophie" value={localForm.firstname} onChange={(e) => setLocalForm({...localForm, firstname: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Nom*</label>
                            <input type="text" placeholder="Ex: Martin" value={localForm.lastname} onChange={(e) => setLocalForm({...localForm, lastname: e.target.value})} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email*</label>
                        <input type="email" placeholder="sophie@email.com" value={localForm.email} onChange={(e) => setLocalForm({...localForm, email: e.target.value})} required />
                    </div>

                    <div className="form-group">
                        <label>Adresse de livraison*</label>
                        <input type="text" placeholder="Numéro et nom de rue" value={localForm.address} onChange={(e) => setLocalForm({...localForm, address: e.target.value})} required />
                    </div>

                    <div className="form-row-mixed">
                        <div className="form-group">
                            <label>Code postal*</label>
                            <input type="text" placeholder="13100" value={localForm.zip} onChange={(e) => setLocalForm({...localForm, zip: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Ville*</label>
                            <input type="text" placeholder="Marseille" value={localForm.city} onChange={(e) => setLocalForm({...localForm, city: e.target.value})} required />
                        </div>
                    </div>

                    {/* BLOC RECAPITULATIF DYNAMIQUE AVEC CODE REMISE */}
                    <div className="order-summary" style={{ marginTop: '20px', padding: '15px', background: '#F9F6F0', borderRadius: '8px' }}>
                        <h3 className="summary-title-figma">Récapitulatif</h3>
                        <ul className="summary-list" style={{ padding: 0, listStyle: 'none' }}>
                            {cart.map(item => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(item.price * item.quantity).toFixed(2)} $</span>
                                </li>
                            ))}
                        </ul>

                        {hasDiscount && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 'bold', margin: '10px 0' }}>
                                <span>Remise automatique (-10%) :</span>
                                <span>-{discountAmount.toFixed(2)} $</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #ccc', paddingTop: '10px', fontSize: '1.1rem' }}>
                            <span>Total :</span>
                            <span>{total.toFixed(2)} $</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-confirm" style={{ marginTop: '20px' }}>
                        Procéder au paiement
                    </button>
                </form>
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────
       RENDU 2 : BANDEAU DE PAIEMENT PAR CARTE BANCAIRE (NOUVEAU)
       ───────────────────────────────────────────────────────── */
    if (step === 'payment') {
        return (
            <div className="checkout-container">
                <h2 className="checkout-title" style={{ textAlign: 'center' }}>💳 Paiement Sécurisé</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Montant à débiter : <strong>{total.toFixed(2)} $</strong></p>

                <form className="checkout-form" onSubmit={handleProcessPayment}>
                    <div className="form-group">
                        <label>Numéro de Carte Bancaire*</label>
                        <input type="text" placeholder="4242 4242 4242 4242" maxLength="19" value={cardForm.number} onChange={(e) => setCardForm({...cardForm, number: e.target.value})} required />
                    </div>

                    <div className="form-row-half">
                        <div className="form-group">
                            <label>Date d'expiration*</label>
                            <input type="text" placeholder="MM/AA" maxLength="5" value={cardForm.expiry} onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Code CVC*</label>
                            <input type="text" placeholder="123" maxLength="3" value={cardForm.cvc} onChange={(e) => setCardForm({...cardForm, cvc: e.target.value})} required />
                        </div>
                    </div>

                    <div className="payment-alert" style={{ background: '#E8F5E9', borderLeft: '4px solid #2e7d32', padding: '10px', margin: '15px 0', borderRadius: '4px' }}>
                        <span className="alert-text" style={{ color: '#2e7d32', fontSize: '0.9rem' }}>
                            🔒 Passerelle de test : Saisissez n'importe quel numéro fictif pour valider.
                        </span>
                    </div>

                    <button type="submit" className="btn-confirm" style={{ backgroundColor: '#2e7d32' }}>
                        Valider le paiement ({total.toFixed(2)} $)
                    </button>

                    <button type="button" className="btn-confirm" style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc', marginTop: '10px' }} onClick={() => setStep('checkout')}>
                        Retour aux coordonnées
                    </button>
                </form>
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────
       RENDU 3 : CONFIRMATION ET SUCCÈS (EXPÉDITION ACCÉLÉRÉE)
       ───────────────────────────────────────────────────────── */
    if (step === 'success') {
        return (
            <div className="checkout-container" style={{ textAlign: 'center', padding: '30px' }}>
                <div className="success-container">
                    <div style={{ color: '#2e7d32', fontSize: '4rem', marginBottom: '10px' }}>✓</div>
                    <h2 className="success-main-title" style={{ color: '#2e7d32' }}>Paiement validé avec succès !</h2>
                    <p style={{ fontSize: '1.1rem', margin: '10px 0' }}>
                        Votre commande <strong style={{ color: '#8B5A2B' }}>#{generatedOrderNum}</strong> change de statut :
                        <span style={{ backgroundColor: '#E8F5E9', color: '#2e7d32', padding: '3px 8px', borderRadius: '12px', fontSize: '0.85rem', marginLeft: '10px', fontWeight: 'bold' }}>
                            Expédiée
                        </span>
                    </p>
                    <p style={{ color: '#666', marginBottom: '25px' }}>Un e-mail de confirmation contenant votre facture de {total.toFixed(2)} $ a été envoyé à {localForm.email}.</p>

                    <div style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fafafa', marginBottom: '25px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowDetails(!showDetails)}>
                            <h4 style={{ margin: 0 }}>📋 Voir le détail de la commande</h4>
                            <span>{showDetails ? '▲' : '▼'}</span>
                        </div>

                        {showDetails && (
                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <p style={{ fontSize: '0.9rem', margin: '5px 0' }}><strong>Destinataire :</strong> {localForm.firstname} {localForm.lastname}</p>
                                <p style={{ fontSize: '0.9rem', margin: '5px 0' }}><strong>Adresse :</strong> {localForm.address}, {localForm.zip} {localForm.city}</p>
                                <hr style={{ border: '0', borderTop: '1px dashed #ddd', margin: '10px 0' }} />
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>{(item.price * item.quantity).toFixed(2)} $</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn-confirm" style={{ marginBottom: '10px' }} onClick={() => handleNavigationAfterSuccess('profile')}>
                        Voir mon historique de commandes
                    </button>

                    <button className="btn-confirm" style={{ backgroundColor: 'transparent', color: '#8B5A2B', border: '1px solid #8B5A2B' }} onClick={() => handleNavigationAfterSuccess('catalog')}>
                        Retour au catalogue
                    </button>
                </div>
            </div>
        );
    }
}