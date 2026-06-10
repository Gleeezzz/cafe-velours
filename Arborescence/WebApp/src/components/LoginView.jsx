import React, { useState } from 'react';
import '../index.css';

export default function LoginView({ onLoginSuccess }) {
    const [form, setForm] = useState({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Cherche si l'email existe déjà en base
            const response = await fetch('http://localhost:8080/api/orders/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email })
            });

            if (response.ok) {
                // ✅ User existant trouvé → on le connecte directement
                const user = await response.json();
                onLoginSuccess(user);
            } else if (response.status === 404) {
                // 🆕 User inconnu → on l'inscrit via le endpoint d'inscription
                const registerResponse = await fetch('http://localhost:8080/api/orders/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: form.name, email: form.email })
                });

                if (registerResponse.ok) {
                    const newUser = await registerResponse.json();
                    onLoginSuccess(newUser);
                } else {
                    setError("Erreur lors de la création du compte.");
                }
            }
        } catch (err) {
            setError("Impossible de joindre le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-container" style={{ maxWidth: '420px', margin: '60px auto', padding: '40px 30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>☕</div>
                <h2 style={{ color: '#8B5A2B', margin: 0 }}>Café Velours</h2>
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '6px' }}>Connectez-vous ou créez votre compte</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                    <label>Nom complet*</label>
                    <input
                        type="text"
                        placeholder="Ex: Raphael Nadal"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email*</label>
                    <input
                        type="email"
                        placeholder="raphael@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>

                {error && (
                    <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                )}

                <button type="submit" className="btn-confirm" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Accéder à mon compte →"}
                </button>
            </form>
        </div>
    );
}