import React, { useState } from 'react';
import '../index.css';
import LoginView from "./LoginView.jsx";

export default function CartView({ cart, setCart, userProfile, setUserProfile, ordersHistory, setOrdersHistory, onViewChange, userId, isLoggedIn, onLoginSuccess }) {
    // Étapes du tunnel : 'checkout' -> 'payment' -> 'success'
    const [step, setStep] = useState('checkout');
    const [isProcessing, setIsProcessing] = useState(false);

    // États locaux pour les formulaires
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

    // Garder une trace de l'ID de commande généré par le backend pour l'écran de succès
    const [backendOrderId, setBackendOrderId] = useState(null);

    if (!isLoggedIn) {
        return (
            <div className="checkout-container"
                 style={{maxWidth: '500px', margin: '40px auto', textAlign: 'center', padding: '30px'}}>
                <div style={{fontSize: '2rem', marginBottom: '15px'}}>🔒</div>
                <h2 style={{color: '#8B5A2B', marginBottom: '10px'}}>Connectez-vous pour commander</h2>
                <p style={{color: '#666', marginBottom: '25px'}}>Vous avez {cart.length} article(s) dans votre
                    panier.</p>
                <LoginView onLoginSuccess={onLoginSuccess}/>
            </div>
        );
    }

    // ── 🛠️ FIX SECURE : Nettoyage et conversion des prix pour éviter le NaN ──
    const safeParsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (!price) return 0;
        // Supprime le symbole '$', remplace la virgule par un point et convertit
        return parseFloat(price.toString().replace('$', '').replace(',', '.')) || 0;
    };

    const subtotal = cart.reduce((sum, item) => sum + (safeParsePrice(item.price) * item.quantity), 0);
    const hasDiscount = subtotal > 50;
    const discountAmount = hasDiscount ? subtotal * 0.10 : 0;
    const total = subtotal - discountAmount;

    // Passage à l'étape de paiement
    const handleGoToPayment = (e) => {
        e.preventDefault();
        // 🛠️ FIX : On conserve la structure propre et séparée pour éviter de casser le formulaire au rechargement
        setUserProfile({
            ...userProfile,
            firstname: localForm.firstname,
            lastname: localForm.lastname,
            email: localForm.email,
            address: localForm.address,
            zip: localForm.zip,
            city: localForm.city
        });
        setStep('payment');
    };

    // 🌟 CONNEXION BACKEND : Validation du paiement et envoi au OrderController
    const handleProcessPayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const itemsPayload = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        try {
            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    items: itemsPayload
                })
            });

            if (response.ok) {
                const savedOrder = await response.json();
                setBackendOrderId(savedOrder.id);
                setOrdersHistory([savedOrder, ...ordersHistory]);
                setStep('success');
            } else {
                alert("Erreur retournée par le serveur de commande.");
            }
        } catch (error) {
            console.error("Erreur réseau backend lors du paiement :", error);
            alert("Impossible de joindre la Gateway (8080). Vérifie tes microservices.");
        } finally {
            setIsProcessing(false);
        }
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

                    {/* BLOC RECAPITULATIF */}
                    <div className="order-summary" style={{ marginTop: '20px', padding: '15px', background: '#F9F6F0', borderRadius: '8px' }}>
                        <h3 className="summary-title-figma">Récapitulatif</h3>
                        <ul className="summary-list" style={{ padding: 0, listStyle: 'none' }}>
                            {cart.map(item => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(safeParsePrice(item.price) * item.quantity).toFixed(2)} $</span>
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
       RENDU 2 : BANDEAU DE PAIEMENT PAR CARTE BANCAIRE
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
                            🔒 Passerelle de test liée à l'order-service et au payment-service.
                        </span>
                    </div>

                    <button type="submit" className="btn-confirm" style={{ backgroundColor: '#2e7d32' }} disabled={isProcessing}>
                        {isProcessing ? "Traitement bancaire..." : `Valider le paiement (${total.toFixed(2)} $)`}
                    </button>

                    <button type="button" className="btn-confirm" style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc', marginTop: '10px' }} onClick={() => setStep('checkout')} disabled={isProcessing}>
                        Retour aux coordonnées
                    </button>
                </form>
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────
       RENDU 3 : CONFIRMATION ET SUCCÈS
       ───────────────────────────────────────────────────────── */
    if (step === 'success') {
        return (
            <div className="checkout-container" style={{ textAlign: 'center', padding: '30px' }}>
                <div className="success-container">
                    <div style={{ color: '#2e7d32', fontSize: '4rem', marginBottom: '10px' }}>✓</div>
                    <h2 className="success-main-title" style={{ color: '#2e7d32' }}>Paiement validé avec succès !</h2>
                    <p style={{ fontSize: '1.1rem', margin: '10px 0' }}>
                        Votre commande <strong style={{ color: '#8B5A2B' }}>#{backendOrderId || "Générée"}</strong> a bien été enregistrée :
                        <span style={{ backgroundColor: '#E8F5E9', color: '#2e7d32', padding: '3px 8px', borderRadius: '12px', fontSize: '0.85rem', marginLeft: '10px', fontWeight: 'bold' }}>
                            PAID
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
                                        <span>{(safeParsePrice(item.price) * item.quantity).toFixed(2)} $</span>
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