import React from 'react';
import coffeeGrowers from '../assets/coffee-growers.jpg';

export default function PhilosophyView() {
    return (
        <div className="philosophy-page">

            {/* Header */}
            <div className="philosophy-header">
                <span className="philosophy-subtitle">
                    L'Art du Café D'Exception
                </span>
                <h1 className="philosophy-main-title">
                    Notre Philosophie
                </h1>
                <div className="philosophy-divider"></div>
            </div>

            {/* Section 1: Histoire — texte à gauche, image à droite */}
            <div className="philosophy-row">
                <div className="philosophy-col-text">
                    <h2 className="philosophy-section-title">Une Quête de Saveurs Oubliées</h2>
                    <p className="philosophy-paragraph">
                        Né de la passion pour les terroirs d'altitude, <strong>Café Velours</strong> est le fruit d'un voyage à la rencontre de producteurs indépendants. Nous parcourons les chaînes montagneuses mondiales pour dénicher des micro-lots de café et des fèves de cacao uniques, cultivés dans le respect de la biodiversité.
                    </p>
                </div>

                <div className="philosophy-col-img">
                    <img
                        src={coffeeGrowers}
                        alt="Producteurs de café récoltant les cerises à la main"
                        className="philosophy-img-growers"
                    />
                </div>
            </div>

            {/* Section 2: Valeurs (Cartes d'engagements éthiques) */}
            <div className="philosophy-cards-section">
                <h2 className="philosophy-cards-title">Nos Piliers Fondateurs</h2>
                <div className="philosophy-cards-grid">

                    <div className="philosophy-card">
                        <div className="philosophy-card-icon">🤝</div>
                        <h3>Équité Absolue</h3>
                        <p>Nous court-circuitons les intermédiaires pour garantir une rémunération supérieure de 30% aux standards du commerce équitable pour nos fermiers.</p>
                    </div>

                    <div className="philosophy-card">
                        <div className="philosophy-card-icon">🔥</div>
                        <h3>Torréfaction Lente</h3>
                        <p>Chaque lot est torréfié de manière artisanale en France, au degré près, pour révéler la quintessence aromatique sans amertume.</p>
                    </div>

                    <div className="philosophy-card">
                        <div className="philosophy-card-icon">🌿</div>
                        <h3>Zéro Plastique</h3>
                        <p>Tous nos emballages de paquets et chocolats fins sont 100% biosourcés, compostables et imprimés avec des encres végétales.</p>
                    </div>

                </div>
            </div>

            {/* Section 3: Bannière visuelle */}
            <div className="philosophy-banner">
                <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200"
                    alt="Sélection de grains de café torréfiés"
                    className="philosophy-banner-img"
                />
            </div>

        </div>
    );
}