import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createWebHistory } from 'vue-router'

import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    target: 'es2022', 
  },
  server: {
    proxy: {
      "/api": {
        target: "https://languagelabsback-feb3ekeqg2hkbrcp.switzerlandnorth-01.azurewebsites.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
