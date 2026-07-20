import React, { useState } from 'react';
import '../index.css';
import LoginView from "./LoginView.jsx";

export default function CartView({ cart, setCart, userProfile, setUserProfile, ordersHistory, setOrdersHistory, onViewChange, userId, isLoggedIn, onLoginSuccess }) {
    // Étapes du tunnel : 'checkout' -> 'payment' -> 'success'
    // Machine à états simple pour le suivi de l'étape du tunnel d'achat
    const [step, setStep] = useState('checkout');
    const [isProcessing, setIsProcessing] = useState(false);

    // États locaux pour les formulaires
    // → En React, les 'props' sont en lecture seule (immuables). On ne peut pas les modifier directement depuis un champ d'entrée.
    //   Créer un état local modifiable permet à l'utilisateur de corriger ou compléter ses informations de livraison (ex: code postal, ville)
    //   sans impacter immédiatement l'état global tant qu'il n'a pas cliqué sur 'Valider'.
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

    // → La vue est totalement protégée par un gardien d'authentification conditionnel (`if (!isLoggedIn)`).
    //   Si l'état global de session est faux, React court-circuite le rendu du formulaire et affiche immédiatement une invite
    //   de sécurité embarquant le composant `LoginView`. L'accès aux formulaires de livraison et de paiement est strictement impossible.
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

    // ── FIX SECURE : Nettoyage et conversion des prix pour éviter le NaN ──
    // → C'est une mesure de robustesse défensive essentielle (Sanitization). Selon la provenance des données du catalogue
    //   (Base de données ou APIs externes), le prix peut arriver formaté avec un symbole (ex: '15.50 $') ou une virgule (ex: '15,50').
    //   Cette fonction nettoie la chaîne, harmonise les séparateurs décimaux, et renvoie un nombre strict ou 0 par défaut pour interdire tout calcul donnant un résultat 'NaN' (Not a Number).
    const safeParsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (!price) return 0;
        // Supprime le symbole '$', remplace la virgule par un point et convertit
        return parseFloat(price.toString().replace('$', '').replace(',', '.')) || 0;
    };

    // ── LOGIQUE MÉTIER DE CALCUL DU PANIER ──

    // 1. On calcule d'abord le sous-total brut en faisant la somme du panier
    // 1. Sous-total brut
    // ── LOGIQUE MÉTIER DE CALCUL DU PANIER ──

    // 1. Sous-total brut calculé côté client
    const subtotal = cart.reduce((acc, item) => {
        return acc + (safeParsePrice(item.price) * (item.quantity || 1));
    }, 0);

    // 2. État pour synchroniser les calculs de MongoDB
    const [discountInfo, setDiscountInfo] = useState({
        discountRate: 0,
        discountAmount: 0,
        finalAmount: subtotal
    });

    // 3. Appel synchrone au backend Java (MongoDB) à chaque modification du panier
    React.useEffect(() => {
        if (subtotal <= 0) {
            setDiscountInfo({ discountRate: 0, discountAmount: 0, finalAmount: 0 });
            return;
        }

        // On interroge directement ton endpoint Spring Boot @GetMapping("/discount-preview")
        fetch(`http://localhost:8080/api/orders/discount-preview?amount=${subtotal}`)
            .then(res => {
                if (!res.ok) throw new Error("Erreur HTTP " + res.status);
                return res.json();
            })
            .then(data => {
                // Mettre à jour l'état React avec la réponse exacte de MongoDB
                setDiscountInfo(data);
            })
            .catch(err => {
                console.error("⚠️ Erreur lors de la récupération de la remise depuis l'API :", err);
                // Fallback de sécurité si le microservice est momentanément indisponible
                setDiscountInfo({ discountRate: 0, discountAmount: 0, finalAmount: subtotal });
            });
    }, [subtotal]);

    // 4. Variables associées à l'affichage
    const hasDiscount = discountInfo.discountRate > 0;
    const discountAmount = discountInfo.discountAmount;
    const total = discountInfo.finalAmount;
    // Passage à l'étape de paiement
    // Enregistre les modifications de coordonnées de livraison dans l'état global et passe au paiement
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

        // CONNEXION BACKEND : Validation du paiement et envoi au OrderController
         // 1. On filtre et transforme le panier en un objet JSON allégé (`itemsPayload`) contenant uniquement `productId` et `quantity`.
        //      L'Order-Service n'a pas besoin de recevoir le prix ou le nom du produit depuis le Front-end (ce serait une énorme faille, l'utilisateur pourrait tricher sur le prix !).
        //   2. On émet une requête HTTP `POST` vers l'API Gateway (port 8080) sur la route `/api/orders`.
        //   3. La Gateway route cet appel vers l'Order-Service, qui calcule lui-même le vrai prix final (en contactant le Product-Service via OpenFeign), applique la remise, et persiste la commande en BDD.
        //   4. En cas de succès (HTTP 200/201), on met à jour l'historique des commandes local et on bascule sur l'écran de succès.
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
                // Ajoute la nouvelle commande en haut du tableau historique (Immuabilité)
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

    // Nettoie le panier d'achat à la sortie de l'écran de succès pour éviter les doublons de commande
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

                    {/* BLOC RECAPITULATIF FINANCIER DYNAMIQUE */}                    <div className="order-summary" style={{ marginTop: '20px', padding: '15px', background: '#F9F6F0', borderRadius: '8px' }}>
                        <h3 className="summary-title-figma">Récapitulatif</h3>
                        <ul className="summary-list" style={{ padding: 0, listStyle: 'none' }}>
                            {cart.map(item => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(safeParsePrice(item.price) * item.quantity).toFixed(2)} $</span>
                                </li>
                            ))}
                        </ul>

                    {/* Rendu conditionnel de la réduction commerciale */}
                        {hasDiscount && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 'bold', margin: '10px 0' }}>
                                <span>Remise automatique (-{(discountInfo.discountRate * 100).toFixed(0)}%) :</span>                                <span>-{discountAmount.toFixed(2)} $</span>
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

                    {/* Menu accordéon dépliable géré par l'état local showDetails */}
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