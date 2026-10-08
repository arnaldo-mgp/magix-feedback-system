import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base: the build works at a domain root and under /repo-name/ on GitHub Pages.
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
