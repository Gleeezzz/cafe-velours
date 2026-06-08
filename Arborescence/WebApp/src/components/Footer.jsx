import React from 'react';

export default function Footer() {
    return (
        <footer className="custom-footer">
            <div className="footer-title">
                Café Velours — Grains d'Exception
            </div>

            <ul className="footer-links">
                <li><a href="#cgv" className="footer-link-item">CGV</a></li>
                <li><a href="#mentions" className="footer-link-item">Mentions Légales</a></li>
                <li><a href="#contact" className="footer-link-item">Contact</a></li>
            </ul>

            <div className="footer-credits">
                Projet Titre CDA — 2025-2026 — Document à visée pédagogique
            </div>
        </footer>
    );
}