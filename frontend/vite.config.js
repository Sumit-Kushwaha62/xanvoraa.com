import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import prerender from '@prerenderer/rollup-plugin'

const PRERENDERED_HOME = '__prerendered-home.html'

function promotePrerenderedHome() {
  return {
    name: 'promote-prerendered-home',
    generateBundle: {
      order: 'post',
      handler(_outputOptions, bundle) {
        const prerenderedHome = bundle[PRERENDERED_HOME]

        if (!prerenderedHome) {
          throw new Error(`Missing prerendered homepage asset: ${PRERENDERED_HOME}`)
        }

        const rootIndex = bundle['index.html']

        if (!rootIndex || rootIndex.type !== 'asset' || prerenderedHome.type !== 'asset') {
          throw new Error('Unable to replace the Vite root index with prerendered Home HTML')
        }

        rootIndex.source = prerenderedHome.source
        delete bundle[PRERENDERED_HOME]
      },
    },
  }
}

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
      },
      postProcess(renderedRoute) {
        if (renderedRoute.route === '/') {
          renderedRoute.outputPath = PRERENDERED_HOME
        }
      }
    }),
    promotePrerenderedHome()
  ],
  envDir: '.',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})

