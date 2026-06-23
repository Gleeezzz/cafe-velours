import React, { useState } from 'react';
import '../index.css';

export default function LoginView({ onLoginSuccess }) {
    // Mode 'login' (Sign In) ou 'register' (Sign Up)
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!isRegisterMode) {
                // 🔑 1. SIGN IN : Tentative de connexion
                const response = await fetch('http://localhost:8080/api/orders/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                });

                if (response.ok) {
                    const user = await response.json();
                    onLoginSuccess(user);
                } else if (response.status === 401) {
                    setError("Email ou mot de passe incorrect.");
                } else {
                    setError("Identifiants incorrects ou compte inexistant.");
                }
            } else {
                // 🔐 2. SIGN UP : Tentative d'inscription
                const registerResponse = await fetch('http://localhost:8080/api/orders/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        password: form.password
                    })
                });

                if (registerResponse.status === 409) {
                    setError("Cet email est déjà utilisé.");
                } else if (registerResponse.ok) {
                    const newUser = await registerResponse.json();
                    alert("Compte créé avec succès ! Bienvenue chez Café Velours.");
                    onLoginSuccess(newUser);
                } else {
                    setError("Erreur lors de la création du compte.");
                }
            }
        } catch (err) {
            setError("Impossible de joindre le serveur de sécurité.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-container" style={{ maxWidth: '420px', margin: '60px auto', padding: '40px 30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>☕</div>
                <h2 style={{ color: '#8B5A2B', margin: 0 }}>Café Velours</h2>
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '6px' }}>
                    {isRegisterMode ? "Créez votre compte sécurisé" : "Connectez-vous à votre espace"}
                </p>
            </div>

            {/* Système d'onglets pour basculer proprement entre Sign In et Sign Up */}
            <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #eee' }}>
                <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setError(''); }}
                    style={{
                        flex: 1, padding: '10px', background: 'none', border: 'none',
                        borderBottom: !isRegisterMode ? '3px solid #8B5A2B' : 'none',
                        fontWeight: !isRegisterMode ? 'bold' : 'normal', color: !isRegisterMode ? '#8B5A2B' : '#888',
                        cursor: 'pointer'
                    }}
                >
                    Connexion
                </button>
                <button
                    type="button"
                    onClick={() => { setIsRegisterMode(true); setError(''); }}
                    style={{
                        flex: 1, padding: '10px', background: 'none', border: 'none',
                        borderBottom: isRegisterMode ? '3px solid #8B5A2B' : 'none',
                        fontWeight: isRegisterMode ? 'bold' : 'normal', color: isRegisterMode ? '#8B5A2B' : '#888',
                        cursor: 'pointer'
                    }}
                >
                    Inscription
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                {/* Le champ Nom complet s'affiche uniquement en mode Inscription */}
                {isRegisterMode && (
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
                )}

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

                <div className="form-group">
                    <label>Mot de passe*</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                </div>

                {error && (
                    <p style={{ color: 'red', fontSize: '0.85rem', margin: '5px 0 0 0' }}>{error}</p>
                )}

                <button type="submit" className="btn-confirm" disabled={isLoading} style={{ marginTop: '10px' }}>
                    {isLoading ? "Traitement..." : isRegisterMode ? "Créer mon compte sécurisé →" : "Accéder à mon compte →"}
                </button>
            </form>
        </div>
    );
}