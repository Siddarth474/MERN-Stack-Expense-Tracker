import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/v2' : 'https://mern-stack-expense-tracker-rrvt.onrender.com'
    }
  },
  plugins: [react(), tailwindcss()],
})
