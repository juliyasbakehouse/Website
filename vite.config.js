import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this as a project site under /Website/, but the local dev
  // server should keep serving from root.
  base: command === 'build' ? '/Website/' : '/',
  plugins: [react(), tailwindcss()],
}))
