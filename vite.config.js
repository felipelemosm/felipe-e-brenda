import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' faz o build funcionar em qualquer subcaminho,
// inclusive https://<usuario>.github.io/<repo>/
export default defineConfig({
  plugins: [react()],
  base: './',
})
