import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-gray-400 text-[11px] font-sans mt-auto border-t border-[#B87333]/10">
            <div className="px-6 py-6 text-center space-y-2">
                <p className="font-serif italic text-white text-xs tracking-wide">Café Velours — Grains d'Exception</p>
                <div className="flex justify-center gap-4 text-gray-500">
                    <span className="hover:underline cursor-pointer">CGV</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Mentions Légales</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Contact</span>
                </div>
                <p className="text-[10px] text-gray-600 pt-2 border-t border-gray-800">
                    Projet Titre CDA — 2025-2026 — Document à visée pédagogique
                </p>
            </div>
        </footer>
    );
}