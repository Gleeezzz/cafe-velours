import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // <--- CETTE LIGNE EST CRUCIALE, C'EST ELLE QUI ACTIVE TOUT !
// Injection des styles globaux, des polices de caractères et des variables de base de l'application

// → `createRoot` est l'API standard introduite avec React 18
//Elle permet d'activer le nouveau moteur de rendu concurrent de React.
//Ce moteur permet de hiérarchiser les mises à jour de l'affichage
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)