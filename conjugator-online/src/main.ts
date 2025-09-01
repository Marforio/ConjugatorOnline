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
import { getAccessToken, getRefreshToken } from '@/services/auth'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(vuetify)

// 🔐 Auth check before mounting
const access = getAccessToken()
const refresh = getRefreshToken()

if (!access || !refresh) {
  console.warn("No tokens found — redirecting to login.")
  router.replace('/login').then(() => {
    app.mount('#app') // ✅ mount only after redirect completes
  })
} else {
  app.mount('#app') // ✅ mount normally if tokens exist
}
