import React from 'react';
import coffeeGrowers from '../assets/coffee-growers.jpg';

export default function PhilosophyView() {
    return (
        <div className="philosophy-container" style={{ maxWidth: '1200px', margin: '140px auto 40px auto', padding: '0 20px', color: '#3e2723' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: '#8d6e63' }}>
                    L'Art du Café D'Exception
                </span>
                <h1 style={{ fontSize: '3rem', fontFamily: 'serif', marginTop: '10px', color: '#271206' }}>
                    Notre Philosophie
                </h1>
                <div style={{ width: '60px', height: '2px', backgroundColor: '#8d6e63', margin: '20px auto' }}></div>
            </div>

            {/* Section 1: Histoire — texte à gauche, image à droite */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>

                <div style={{ flex: '1 1 400px' }}>
                    <h2 style={{ fontFamily: 'serif', fontSize: '2rem', marginBottom: '20px' }}>Une Quête de Saveurs Oubliées</h2>
                    <p style={{ lineHeight: '1.8', color: '#5d4037' }}>
                        Né de la passion pour les terroirs d'altitude, <strong>Café Velours</strong> est le fruit d'un voyage à la rencontre de producteurs indépendants. Nous parcourons les chaînes montagneuses mondiales pour dénicher des micro-lots de café et des fèves de cacao uniques, cultivés dans le respect de la biodiversité.
                    </p>
                </div>

                <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
                    <img
                        src={coffeeGrowers}
                        alt="Producteurs de café récoltant les cerises à la main"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            objectFit: 'cover',
                            objectPosition: 'center 25%',
                            height: '350px'
                        }}
                    />
                </div>
                {/* → Grâce à l'utilisation combinée de dimensions fixes et de la propriété CSS `objectFit: 'cover'`.
                Cela force le navigateur à découper et adapter l'image harmonieusement dans son conteneur de 350px de haut sans jamais l'écraser ni l'étirer, peu importe le ratio d'image d'origine renvoyé par le serveur CDN. */}
            </div>

            {/* Section 2: Valeurs (Cartes d'engagements éthiques) */}
            <div style={{ backgroundColor: '#fdfbf7', padding: '60px 40px', borderRadius: '12px', marginBottom: '40px' }}>
                <h2 style={{ textAlign: 'center', fontFamily: 'serif', fontSize: '2rem', marginBottom: '40px' }}>Nos Piliers Fondateurs</h2>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

                    <div style={{ flex: '1 1 250px', textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🤝</div>
                        <h3 style={{ fontFamily: 'serif', marginBottom: '10px' }}>Équité Absolue</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6d4c41' }}>Nous court-circuitons les intermédiaires pour garantir une rémunération supérieure de 30% aux standards du commerce équitable pour nos fermiers.</p>
                    </div>

                    <div style={{ flex: '1 1 250px', textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔥</div>
                        <h3 style={{ fontFamily: 'serif', marginBottom: '10px' }}>Torréfaction Lente</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6d4c41' }}>Chaque lot est torréfié de manière artisanale en France, au degré près, pour révéler la quintessence aromatique sans amertume.</p>
                    </div>

                    <div style={{ flex: '1 1 250px', textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🌿</div>
                        <h3 style={{ fontFamily: 'serif', marginBottom: '10px' }}>Zéro Plastique</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6d4c41' }}>Tous nos emballages de paquets et chocolats fins sont 100% biosourcés, compostables et imprimés avec des encres végétales.</p>
                    </div>

                </div>
            </div>

            {/* Section 3: Bannière visuelle — grains de café en pleine largeur */}
            <div style={{ marginBottom: '40px' }}>
                <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200"
                    alt="Sélection de grains de café torréfiés"
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        objectFit: 'cover',
                        height: '300px'
                    }}
                />
            </div>

        </div>
    );
}