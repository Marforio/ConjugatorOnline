import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

const CHUNK_RELOAD_KEY = 'll_chunk_reload_once'

function isChunkLoadError(msg: string) {
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed')
  )
}

function handleChunkError(input: unknown) {
  const msg = String(input ?? '')
  if (!isChunkLoadError(msg)) return

  if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
    window.location.reload()
  }
}

window.addEventListener('error', (e) => handleChunkError((e as ErrorEvent).message))
window.addEventListener('unhandledrejection', (e) =>
  handleChunkError((e as PromiseRejectionEvent).reason)
)

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.mount('#app')