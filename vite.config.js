import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/",   // ✅ ADD THIS LINE

  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  server: {
    host: true,
    port: 3000,
  },
})