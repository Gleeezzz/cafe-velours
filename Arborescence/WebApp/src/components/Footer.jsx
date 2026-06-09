import React from 'react';

export default function Footer() {
    return (
        <footer className="custom-footer">
            <div className="footer-grid-container">

                {/* Colonne 1 : À Propos / Identité */}
                <div className="footer-brand-column">
                    <h3 className="footer-brand-title">Café <span>Velours</span></h3>
                    <p className="footer-brand-text">
                        Une sélection rigoureuse de grains fins, torréfiés avec passion pour offrir une expérience sensorielle d'exception à chaque tasse.
                    </p>
                </div>

                {/* Colonne 2 : Informations */}
                <div className="footer-links-column">
                    <h4>Informations</h4>
                    <ul>
                        <li><a href="#livraison" className="footer-link-item">Livraison</a></li>
                        <li><a href="#faq" className="footer-link-item">FAQ</a></li>
                        <li><a href="#contact" className="footer-link-item">Contact</a></li>
                    </ul>
                </div>

                {/* Colonne 3 : Légal */}
                <div className="footer-links-column">
                    <h4>Légal</h4>
                    <ul>
                        <li><a href="#cgv" className="footer-link-item">CGV</a></li>
                        <li><a href="#mentions" className="footer-link-item">Mentions Légales</a></li>
                        <li><a href="#rgpd" className="footer-link-item">RGPD</a></li>
                    </ul>
                </div>

                {/* Colonne 4 : Newsletter */}
                <div className="footer-newsletter-column">
                    <h4>Rejoindre le Club</h4>
                    <p>Inscrivez-vous pour recevoir nos offres privées et nouveautés éphémères.</p>
                    <div className="footer-newsletter-form">
                        <input type="email" placeholder="Votre adresse email" className="footer-input" />
                        <button className="footer-btn-submit">S'abonner</button>
                    </div>
                </div>

            </div>

            {/* Ligne de copyright du bas */}
            <div className="footer-bottom-bar">
                <hr className="footer-divider" />
                <p className="footer-credits">
                    &copy; {new Date().getFullYear()} Café Velours — Projet fictif CDA — Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}