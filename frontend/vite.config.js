import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import prerender from '@prerenderer/rollup-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      routes: [
        '/',
        '/services',
        '/portfolio',
        '/pricing',
        '/about',
        '/career',
        '/contact',
        '/privacy-policy',
        '/terms'
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'prerender-trigger',
        headless: true
      }
    })
  ],
  envDir: '.',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})

