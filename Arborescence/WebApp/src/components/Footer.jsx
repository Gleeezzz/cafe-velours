import React, { useState } from 'react';
import logoCafe from '../assets/LogoCafe.png';
/**
 * ─── 📦 DICTIONNAIRE DE DONNÉES CENTRALISÉ (STATIC DATA) ───
 * Plutôt que de dupliquer ou de créer 6 composants de modales différents,
 * on utilise un objet de configuration JavaScript. C'est propre, maintenable et évolutif.
 */
const MODAL_CONTENT = {
    livraison: {
        title: "🚚 Livraison",
        content: `Nous livrons partout en France métropolitaine sous 3 à 5 jours ouvrés.
        
- Livraison standard : 4,90 €
- Livraison offerte dès 50 € d'achat
- Livraison express (24h) : 9,90 €

Chaque commande est soigneusement emballée pour préserver la fraîcheur de vos cafés. Un email de confirmation avec numéro de suivi vous est envoyé dès l'expédition.`
    },
    faq: {
        title: "❓ FAQ",
        content: `Questions fréquentes :

- Puis-je modifier ma commande ?
  Oui, dans les 2h suivant la validation.

- Les cafés sont-ils torréfiés à la commande ?
  Oui, chaque lot est torréfié sous 48h avant expédition.

- Quelle est la durée de conservation ?
  6 mois en grains, 3 mois moulu, dans un endroit sec.

- Proposez-vous des abonnements ?
  Bientôt disponible ! Inscrivez-vous au Club pour être notifié.`
    },
    contact: {
        title: "📬 Contact",
        content: `Notre équipe est disponible du lundi au vendredi, de 9h à 18h.

- Email : contact@cafevelours.fr
- Téléphone : 04 91 00 00 00
- Adresse : 12 Rue du Torréfacteur, 13100 Aix-en-Provence

Pour toute réclamation ou question sur votre commande, merci de préciser votre numéro de commande dans votre message. Nous répondons sous 24h ouvrées.`
    },
    cgv: {
        title: "📄 Conditions Générales de Vente",
        content: `Les présentes CGV régissent les ventes effectuées sur le site Café Velours.

- Toute commande implique l'acceptation des présentes CGV.
- Les prix sont indiqués en euros TTC.
- Le paiement est sécurisé et effectué en ligne.
- Le droit de rétractation s'exerce dans un délai de 14 jours.
- Café Velours se réserve le droit de modifier ses prix à tout moment.

Pour toute contestation, le tribunal compétent sera celui du siège social de Café Velours.

Projet fictif — CDPI 2026`
    },
    mentions: {
        title: "⚖️ Mentions Légales",
        content: `Éditeur du site : Café Velours SAS
Siège social : 12 Rue du Torréfacteur, 13100 Aix-en-Provence
RCS : 123 456 789 Aix-en-Provence
Capital social : 10 000 €

Directeur de publication : Braulio Umbert
Hébergeur : OVH SAS, 2 rue Kellermann, 59100 Roubaix

Ce site est un projet fictif réalisé dans le cadre d'une formation CDPI - DWWM (Developper web, web mobile) — 2026.`
    },
    rgpd: {
        title: "🔒 RGPD & Données Personnelles",
        content: `Conformément au Règlement Général sur la Protection des Données (RGPD) :

- Les données collectées (nom, email, adresse) sont utilisées uniquement pour le traitement de vos commandes.
- Elles ne sont jamais revendues à des tiers.
- Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
- Pour exercer ces droits : rgpd@cafevelours.fr

Durée de conservation : 3 ans après le dernier achat.

Projet fictif — CDPI 2026`
    }
};

/**
 * ─── 🧱 LE COMPOSANT FOOTER ───
 * @param onNavigate Fonction Callback reçue du composant parent (App.jsx) pour piloter le routage virtuel.
 */

export default function Footer({ onNavigate }) {
    /* GESTION DE L'ÉTAT LOCAL DE LA MODALE
       activeModal contient soit null (modale fermée), soit une string ('livraison', 'faq'...)
       indiquant quelle clé du dictionnaire MODAL_CONTENT charger dynamiquement. */
    const [activeModal, setActiveModal] = useState(null);

    // Fonctions de mise à jour de l'état (Setters encapsulés)
    const openModal = (key) => setActiveModal(key);
    const closeModal = () => setActiveModal(null);

    /**
     * Gestion de la soumission fictive de la newsletter
     * Redirige l'utilisateur vers le panier pour l'exemple
     */
    const handleSubscribe = (e) => {
        e.preventDefault(); // Bloque le rechargement par défaut de la page HTML
        if (onNavigate) onNavigate('cart');
    };

    return (
        <>
            <footer className="custom-footer">
                <div className="footer-grid-container">

                    {/* Colonne 1 : À Propos */}
                    <div className="footer-brand-column">
                        <img
                            src={logoCafe}
                            alt="Café Velours Logo"
                            className="footer-logo-img"
                        />                        <p className="footer-brand-text">
                            Une sélection rigoureuse de grains fins, torréfiés avec passion pour offrir une expérience sensorielle d'exception à chaque tasse.
                        </p>
                    </div>

                    {/* Colonne 2 : Informations */}
                    {/** → Accessibilité web (A11y) : Un lien <a> sert exclusivement à changer d'URL ou de page.
                    * Pour déclencher une action de script JavaScript sur la page courante (comme ouvrir une modale),
                    * la sémantique HTML exige l'utilisation d'une balise <button>. */}
                    <div className="footer-links-column">
                        <h4>Informations</h4>
                        <ul>
                            <li><button className="footer-link-item" onClick={() => openModal('livraison')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Livraison</button></li>
                            <li><button className="footer-link-item" onClick={() => openModal('faq')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>FAQ</button></li>
                            <li><button className="footer-link-item" onClick={() => openModal('contact')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Contact</button></li>
                        </ul>
                    </div>

                    {/* Colonne 3 : Légal */}
                    <div className="footer-links-column">
                        <h4>Légal</h4>
                        <ul>
                            <li><button className="footer-link-item" onClick={() => openModal('cgv')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>CGV</button></li>
                            <li><button className="footer-link-item" onClick={() => openModal('mentions')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Mentions Légales</button></li>
                            <li><button className="footer-link-item" onClick={() => openModal('rgpd')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>RGPD</button></li>
                        </ul>
                    </div>

                    {/* Colonne 4 : Newsletter */}
                    <div className="footer-newsletter-column">
                        <h4>Rejoindre le Club</h4>
                        <p>Inscrivez-vous pour recevoir nos offres privées et nouveautés éphémères.</p>
                        <div className="footer-newsletter-form">
                            <input type="email" placeholder="Votre adresse email" className="footer-input" />
                            <button className="footer-btn-submit" onClick={handleSubscribe}>S'abonner</button>
                        </div>
                    </div>

                </div>

                <div className="footer-bottom-bar">
                    <hr className="footer-divider" />
                    <p className="footer-credits">
                        {/* Détermination dynamique de l'année en cours (2026) pour éviter l'obsolescence du code */}
                        &copy; {new Date().getFullYear()} Café Velours — Projet fictif CDA — Tous droits réservés.
                    </p>
                </div>
            </footer>

            {/* ─ RENDU CONDITIONNEL DE LA MODALE UNIQUE ─── */}
            {/* Si activeModal est null, React ignore complètement ce bloc. S'il contient une clé, il l'affiche à l'écran. */}
            {activeModal && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            backgroundColor: '#fff', borderRadius: '12px', padding: '40px',
                            maxWidth: '560px', width: '90%', maxHeight: '80vh',
                            overflowY: 'auto', position: 'relative'
                        }}
                        /*
                           → C'est pour stopper la 'propagation de l'événement' (Event Bubbling).
                             Sans cela, un clic *à l'intérieur* de la boîte blanche remonterait jusqu'à l'overlay parent
                             et déclencherait accidentellement `closeModal`. Cela permet de garder la modale ouverte
                             quand on clique sur le texte. */
                        onClick={(e) => e.stopPropagation()}

                    >
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute', top: '15px', right: '20px',
                                background: 'none', border: 'none', fontSize: '1.5rem',
                                cursor: 'pointer', color: '#888'
                            }}
                        >✕</button>
                        <h2 style={{ color: '#8B5A2B', marginBottom: '20px' }}>
                            {MODAL_CONTENT[activeModal].title}
                        </h2>
                        <p style={{ whiteSpace: 'pre-line', color: '#444', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            {MODAL_CONTENT[activeModal].content}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}