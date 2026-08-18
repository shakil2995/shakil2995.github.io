import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps asset paths relative so the built `dist/` works when
// uploaded to cPanel public_html (root or any subfolder) with no server config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
