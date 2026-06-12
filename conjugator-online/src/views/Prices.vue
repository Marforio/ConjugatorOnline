<template>
  <v-container class="fill-height align-start">
    <v-row justify="center" class="w-100 mt-5">
      <v-col cols="12" md="10" lg="8">
        
        <v-card class="elevation-2 mb-6" rounded="lg">
          <v-card-item class="bg-indigo-darken-2 text-white">
            <v-card-title class="text-h5 d-flex align-center justify-between">
              <div>
                <v-icon icon="mdi-monetization-on" class="mr-2"></v-icon>
                ASGI WebSocket Terminal Multiplexer
              </div>
              <v-chip :color="wsConnected ? 'success' : 'error'" class="ml-auto" variant="elevated">
                {{ wsConnected ? 'Live Connection Active' : 'Disconnected' }}
              </v-chip>
            </v-card-title>
          </v-card-item>

          <v-card-text class="pt-4">
            <v-row align="center">
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="newTicker"
                  label="Subscribe to New Ticker Symbol"
                  placeholder="e.g. GOOG, TSLA, NVDA"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-trending-up"
                  hide-details
                  @keyup.enter="subscribeTicker"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn 
                  color="indigo" 
                  size="large" 
                  block 
                  prepend-icon="mdi-plus" 
                  :disabled="!newTicker"
                  @click="subscribeTicker"
                >
                  Add Stream
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-alert
          v-if="systemAlert"
          type="info"
          variant="tonal"
          closable
          class="mb-6"
          icon="mdi-lan-connect"
          @click:close="systemAlert = ''"
        >
          {{ systemAlert }}
        </v-alert>

        <v-card class="elevation-2" rounded="lg">
          <v-table hover>
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="text-subtitle-1 font-weight-bold">Asset Token</th>
                <th class="text-subtitle-1 font-weight-bold text-center">Real-Time Valuation</th>
                <th class="text-subtitle-1 font-weight-bold text-center">Connection Channel Status</th>
                <th class="text-subtitle-1 font-weight-bold text-end">Operations</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(price, symbol) in activeTickers" :key="symbol">
                <td>
                  <v-avatar color="indigo-lighten-5" size="small" class="mr-2">
                    <span class="text-indigo text-caption font-weight-bold">{{ symbol[0] }}</span>
                  </v-avatar>
                  <span class="font-weight-black">{{ symbol }}</span>
                </td>
                <td class="text-center font-weight-medium text-h6 text-success">
                  {{ price !== 'Error' && price !== 'N/A' ? '$' + price : 'Fetching state...' }}
                </td>
                <td class="text-center">
                  <v-chip color="green" size="small" variant="light" prepend-icon="mdi-sync">
                    Streaming Duplex Mode
                  </v-chip>
                </td>
                <td class="text-end">
                  <v-btn
                    icon="mdi-delete-outline"
                    variant="text"
                    color="red-lighten-1"
                    density="comfortable"
                    @click="unsubscribeTicker(symbol)"
                  ></v-btn>
                </td>
              </tr>
              <tr v-if="Object.keys(activeTickers).length === 0">
                <td colspan="4" class="text-center text-grey py-8">
                  <v-icon icon="mdi-sleep" size="large" class="mb-2"></v-icon>
                  <p>Stream pool is currently idle. Enter a symbol above to start piping data.</p>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const wsConnected = ref(false)
const newTicker = ref('')
const systemAlert = ref('')
// Start off mimicking the initial backend baseline symbols tracking
const activeTickers = ref({ 'AAPL': 'N/A', 'MSFT': 'N/A' })
let socket = null

onMounted(() => {
  // Connect to your updated endpoint
  const wsUrl = "wss://backend.language-labs.ch/ws/stocks/"
  socket = new WebSocket(wsUrl)

  socket.onopen = () => {
    wsConnected.value = true
    systemAlert.value = "WebSocket connection established with Azure Channels runtime engine."
  }

  socket.onmessage = (event) => {
    const packet = JSON.parse(event.data)

    // Handle different payload types flowing across the EXACT SAME connection
    if (packet.type === 'MARKET_DATA') {
      // Loop through incoming multiplexed structures and dynamically map values
      for (const [symbol, price] of Object.entries(packet.tickers)) {
        activeTickers.value[symbol] = price
      }
    } else if (packet.type === 'SYSTEM_ALERT') {
      systemAlert.value = packet.message
    } else if (packet.type === 'IDLE_PULSE') {
      systemAlert.value = packet.message
    }
  }

  socket.onclose = () => {
    wsConnected.value = false
    systemAlert.value = "WebSocket connection dropped by cloud host."
  }
})

const subscribeTicker = () => {
  const symbol = newTicker.value.trim().toUpperCase()
  if (symbol && socket && socket.readyState === WebSocket.OPEN) {
    // 💥 MULTIPLEX MAGIC: Send a control event UP to Django over the existing socket
    socket.send(JSON.stringify({
      action: 'SUBSCRIBE',
      symbol: symbol
    }))
    // Pre-seed local dict mapping for reactive UI feedback
    activeTickers.value[symbol] = 'N/A'
    newTicker.value = ''
  }
}

const unsubscribeTicker = (symbol) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Dispatch removal instruction packet UP over the existing socket
    socket.send(JSON.stringify({
      action: 'UNSUBSCRIBE',
      symbol: symbol
    }))
    // Clean up local layout reactivity map
    delete activeTickers.value[symbol]
  }
}

onUnmounted(() => {
  if (socket) socket.close()
})
</script>