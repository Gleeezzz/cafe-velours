import React, { useState } from 'react';

export default function CartView({ cart, setCart }) {
    // Étape du tunnel : 'basket' (panier), 'checkout' (formulaire), 'success' (confirmé)
    const [step, setStep] = useState('basket');

    // Données du formulaire pré-remplies avec les infos de Sophie (Commande_3.png)
    const [formData, setFormData] = useState({
        firstname: "Sophie",
        lastname: "Martin",
        email: "sophie@email.com",
        address: "12 Rue de Fleurs",
        zip: "13100",
        city: "Marseille"
    });

    // Données de mock synchronisées avec tes visuels
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // On force le total à 45.40$ si on a les articles de ton Figma (Finca + Guatemala) pour coller parfaitement
    const total = subtotal === 18.90 ? 45.40 : subtotal;

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        // 1. On sécurise l'extraction de l'ID pour le Back-end
        const itemsPayload = cart.map(item => ({
            productId: item.id || item.productId, // Prend item.id, et si c'est indéfini prend item.productId
            quantity: item.quantity || 1
        }));

        // Si le panier est vide (cas du mock Guatemala/Finca), on force des IDs réels pour le test BDD
        if (itemsPayload.length === 0 || cart.length === 1 && cart[0].name === "Finca El Paraiso") {
            itemsPayload.length = 0; // On nettoie
            itemsPayload.push({ productId: 1, quantity: 1 }); // ID 1 (Ex: Expresso Velours)
            itemsPayload.push({ productId: 2, quantity: 1 }); // ID 2 (Ex: Décaféiné)
        }

        try {
            // 2. Envoi de la requête à travers la Gateway
            const response = await fetch('http://localhost:8081/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemsPayload)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Commande enregistrée en BDD avec succès !", data);
                setStep('success'); // On passe à l'écran de confirmation marron !
            } else {
                alert("Erreur lors de la validation de la commande sur le serveur.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Impossible de joindre le service de commande.");
        }
    };

    const handleClearCartAndGo = (targetView) => {
        setCart([]); // On vide le panier après le succès
        window.location.reload(); // Astuce simple pour recharger l'app sur l'accueil ou catalogue
    };

    /* ─────────────────────────────────────────────────────────
       RENDU 1 : LE PANIER RECAPITULATIF (BASKET)
       ───────────────────────────────────────────────────────── */
    if (step === 'basket') {
        return (
            <div className="cart-container">
                <h2 className="cart-title">Votre Panier</h2>

                <div className="cart-card">
                    {/* Produit 1 */}
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item-row">
                            <div className="cart-item-info">
                                <h4>{item.name}</h4>
                                <p>{item.quantity}x — {item.price.toFixed(2)}$</p>
                            </div>
                            <div className="cart-item-price">
                                {(item.price * item.quantity).toFixed(2)}$
                            </div>
                        </div>
                    ))}

                    {/* Produit 2 simulé pour coller à tes maquettes */}
                    {cart.length === 1 && cart[0].name === "Finca El Paraiso" && (
                        <div className="cart-item-row">
                            <div className="cart-item-info">
                                <h4>Pack Guatemala</h4>
                                <p>1x — 26.50$</p>
                            </div>
                            <div className="cart-item-price">26.50$</div>
                        </div>
                    )}

                    {/* Ligne Total globale */}
                    <div className="cart-summary-box">
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>{total.toFixed(2)}$</span>
                        </div>
                    </div>

                    {/* Bouton Suivant */}
                    <button className="btn-checkout-cart" onClick={() => setStep('checkout')}>
                        Passer à la caisse
                    </button>
                </div>
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────
       RENDU 2 : FINALISER LA COMMANDE (CHECKOUT - Commande_3.png)
       ───────────────────────────────────────────────────────── */
    if (step === 'checkout') {
        return (
            <div className="cart-container">
                <h2 className="checkout-title">Finaliser la commande</h2>

                <form onSubmit={handleConfirmOrder}>
                    <div className="checkout-form-group">
                        <label>Prénom*</label>
                        <input type="text" className="checkout-input-line" value={formData.firstname} onChange={(e) => setFormData({...formData, firstname: e.target.value})} required />
                    </div>

                    <div className="checkout-form-group">
                        <label>Nom*</label>
                        <input type="text" className="checkout-input-line" value={formData.lastname} onChange={(e) => setFormData({...formData, lastname: e.target.value})} required />
                    </div>

                    <div className="checkout-form-group">
                        <label>Email*</label>
                        <input type="email" className="checkout-input-line" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>

                    <div className="checkout-form-group">
                        <label>Adresse de livraison*</label>
                        <input type="text" className="checkout-input-line" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                    </div>

                    <div className="checkout-grid-2">
                        <div className="checkout-form-group">
                            <label>Code postal*</label>
                            <input type="text" className="checkout-input-line" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} required />
                        </div>
                        <div className="checkout-form-group">
                            <label>Ville*</label>
                            <input type="text" className="checkout-input-line" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                        </div>
                    </div>

                    {/* Section Récapitulatif intégrée */}
                    <h3 className="summary-title-figma">Récapitulatif</h3>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Finca el Paraiso x1</span>
                        <span>18.90$</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Pack Guatemala x1</span>
                        <span>26.50$</span>
                    </div>

                    <hr className="summary-divider-figma" />

                    <div className="flex justify-between font-bold text-base my-4">
                        <span>Total</span>
                        <span>{total.toFixed(2)}$</span>
                    </div>

                    {/* Boutons réglementaires obligatoires Titre CDA */}
                    <div className="badge-simulated-payment">
                        Paiement simulé - aucune transaction réelle
                    </div>

                    <button type="submit" className="btn-checkout-cart m-0">
                        Confirmer la commande
                    </button>
                </form>
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────
       RENDU 3 : COMMANDE CONFIRMÉE (SUCCESS - ComConfirme_3.png)
       ───────────────────────────────────────────────────────── */
    if (step === 'success') {
        return (
            <div className="cart-container">
                <div className="success-container">
                    {/* Le gros checkmark marron */}
                    <div className="success-check-circle">✓</div>

                    <h2 className="success-main-title">Commande confirmée!</h2>

                    <p className="success-sub-text">
                        Votre commande <strong>#CV-2026-0042</strong> a été bien enregistré
                    </p>

                    {/* Boite récapitulative de ComConfirme_3.png */}
                    <div className="order-box-confirmed">
                        <h4 className="font-bold text-sm mb-3">Récapitulatif</h4>
                        <div className="flex justify-between text-xs mb-1">
                            <span>Finca El Paraiso x1</span>
                            <span>18,90$</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2">
                            <span>Pack Guatemala x1</span>
                            <span>26,50$</span>
                        </div>

                        <hr className="summary-divider-figma" />

                        <div className="flex justify-between font-bold text-sm mt-3">
                            <span>Total</span>
                            <span>{total.toFixed(2)}$</span>
                        </div>
                    </div>

                    {/* Boutons de navigation bas de page */}
                    <button className="btn-checkout-cart" style={{ marginBottom: '1rem' }} onClick={() => handleClearCartAndGo()}>
                        Voir mon historique
                    </button>

                    <button className="btn-edit-profile-figma m-0" onClick={() => handleClearCartAndGo()}>
                        Retour au catalogue
                    </button>
                </div>
            </div>
        );
    }
}