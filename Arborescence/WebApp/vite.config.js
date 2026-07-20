import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/* → C'est le chef d'orchestre du projet. Vite ne sait pas lire nativement le JSX (React) ou le TypeScript.
    Ce fichier sert à configurer des "plugins" (extensions) pour étendre les capacités de Vite. */

// https://vite.dev/config/
export default defineConfig({
  /* ─ CONFIGURATION DU SERVEUR DE DÉVELOPPEMENT ─── */
  server: {
    port: 5173,         // Force l'application à démarrer sur le port 5173 (aligné avec la Gateway)
    strictPort: true,   // Si le port 5173 est déjà pris, Vite s'arrêtera au lieu de basculer sur le 5174/5175
  },

  /* ─ EXTENSIONS & OUTILS DE TRANSFORMATION ─── */

  /* → Ce plugin est indispensable car il configure Babel ou SWC sous le capot. Il accomplit deux missions clés :
    1. Transpilation : Il convertit le code JSX (ex: <App />) en code JavaScript standard (React.createElement)
    compréhensible par tous les navigateurs web.
    2. Fast Refresh (HMR) : Il permet le rechargement à chaud ultra-rapide. Dès qu'on modifie un composant React
    et qu'on sauvegarde, l'interface se met à jour instantanément dans le navigateur *sans perdre l'état actuel* (le compteur ne retombe pas à zéro, par exemple). */
  plugins: [react()],
})
