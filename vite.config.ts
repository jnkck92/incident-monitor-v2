import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Liest .env.* Dateien für den aktuellen Modus (development / production)
  // inkl. .env.local
  const env = loadEnv(mode, process.cwd(), '')

  const diveraBaseUrl = env.VITE_DIVERA_BASE_URL || 'https://app.divera247.com'

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      // Proxy leitet /divera-api/* an die DIVERA-API weiter (löst CORS-Problem
      // im Entwicklungsmodus). Für Produktion nginx-Proxy entsprechend einrichten.
      proxy: {
        '/divera-api': {
          target: diveraBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/divera-api/, ''),
        },
      },
    },
  }
})
