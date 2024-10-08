import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permet l'accès depuis l'extérieur
    port: 5173        // Spécifie le port sur lequel le serveur écoute
  }
})
