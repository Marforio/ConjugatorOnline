import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(vuetify)

app.mount('#app')
