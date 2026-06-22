<template>
  <div class="market-masters-container">
    
    <div class="market-ticker-wrap" v-if="marketPrices.length > 0">
      <div class="ticker-moving">
        <template v-for="(asset, index) in [...marketPrices, ...marketPrices]" :key="`${asset.ticker}-${index}`">
          
          <span class="ticker-item" :title="getAssetName(asset.ticker)">
            <span class="ticker-name">{{ asset.ticker }}</span>
            <span class="ticker-company-label" v-if="getAssetName(asset.ticker)">
              ({{ truncateString(getAssetName(asset.ticker), 8) }})
            </span>
            <span class="ticker-price" :class="asset.direction">
              ${{ parseFloat(asset.current_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              <span v-if="asset.direction === 'up'" class="arrow">▲</span>
              <span v-if="asset.direction === 'down'" class="arrow">▼</span>
            </span>
          </span>

          <span v-if="(index + 1) % 15 === 0" class="ticker-system-broadcast-message">
            ⚡ Prices update every 30 min during market hours ⚡
          </span>
          
        </template>
      </div>
    </div>

    <Transition name="snackbar">
      <div v-if="snackbar.active" class="snackbar-toast" :class="snackbar.type">
        <span class="toast-icon">{{ snackbar.type === 'success' ? '✅' : '⚠️' }}</span>
        <p>{{ snackbar.message }}</p>
      </div>
    </Transition>

<header class="hub-header">
      <div class="header-main-content">
        <h1>Market Masters 📈</h1>
        <p class="subtitle">Welcome back, trader! How good are you at investing?</p>
      </div>

      <div class="macro-index-box">
        <div class="index-card" :class="getDirectionClass('SPX')">
          <div class="index-meta"><span class="index-label">S&P 500 Index 🇺🇸</span></div>
          <span class="index-value">${{ getLivePrice('SPX') }}</span>
        </div>

        <div class="index-card" :class="getDirectionClass('XAU/USD')">
          <div class="index-meta"><span class="index-label">Gold Spot 🪙</span></div>
          <span class="index-value">${{ getLivePrice('XAU/USD') }}</span>
        </div>

        <div class="index-card" :class="getDirectionClass('SMI')">
          <div class="index-meta"><span class="index-label">Swiss Index 🇨🇭</span></div>
          <span class="index-value">${{ getLivePrice('SMI') }}</span>
        </div>

        <div class="index-card" :class="nyseClock.isOpen ? 'trend-up' : 'trend-neutral'">
          <div class="index-meta">
            <span class="status-dot" :class="{ 'is-open': nyseClock.isOpen }"></span>
            <span class="index-label">NYSE Status 🏛️</span>
          </div>
          <span class="index-value" style="font-size: 1.05rem;">
            {{ nyseClock.isOpen ? 'OPEN' : 'CLOSED' }}
          </span>
          <span class="clock-countdown-msg">{{ nyseClock.message }}</span>
        </div>
      </div>
    </header>

    <section class="watchlist-section">
      <div class="watchlist-header">
        <h2>My Personal Watchlist 👀 ({{ currentWatchlist.length }} / 15)</h2>
        <div class="watchlist-add-form">
          <TickerSearchBar ref="watchlistSearchRef" @selected="handleWatchlistSelection" />
          <button @click="submitWatchlistAdd" :disabled="isActionProcessing || currentWatchlist.length >= 15" class="btn btn-primary">
            {{ isActionProcessing ? 'Verifying...' : 'Add Asset' }}
          </button>
        </div>
      </div>
      
      <div class="watchlist-grid" v-if="currentWatchlist.length > 0">
        <v-tooltip 
          v-for="ticker in currentWatchlist" 
          :key="ticker" 
          location="top"
          open-delay="200"
        >
          <template v-slot:activator="{ props }">
            <div class="watchlist-tile" v-bind="props">
              
              <div class="tile-identity">
                <span class="tile-ticker">{{ ticker }}</span>
                <span class="tile-company-name">
                  {{ getAssetName(ticker) }}
                </span>
              </div>
              
              <div class="tile-meta-pricing">
                <span class="tile-price" :class="getDirection(ticker)">
                  ${{ getLivePrice(ticker) }}
                </span>
                <span class="tile-timestamp">
                  Updated: {{ getLastUpdatedTime(ticker) }}
                </span>
              </div>
              
              <button class="remove-btn" @click.stop="removeFromWatchlist(ticker)">
                &times;
              </button>
            </div>
          </template>

          <div class="vuetify-tooltip-content">
            <div class="tooltip-header">
              <strong>{{ getAssetName(ticker) }}</strong> ({{ ticker }})
            </div>
            <v-divider class="my-1 border-opacity-50" color="white"></v-divider>
            <div class="tooltip-body">
              <span class="perf-label">48h Trend Model:</span>
              <span class="perf-value" :class="getDirection(ticker)">
                {{ getDirection(ticker) === 'up' ? '📈 Bullish Gain Vector' : getDirection(ticker) === 'down' ? '📉 Bearish Loss Vector' : '➡️ Neutral Side Movement' }}
              </span>
            </div>
          </div>
        </v-tooltip>
      </div>
      <p v-else class="empty-msg">Your watchlist is currently empty. Add assets above to monitor their performance.</p>
    </section>

<!-- 🧭 COMPACT DISCOVERY HUB -->
    <section class="watchlist-section mt-2">
      <div class="watchlist-header pb-2">
        <h2>Suggested Sectors 🧭</h2>
        <p class="empty-msg ma-0" style="font-size: 0.75rem;">Click the green plus (+) to quickly track standard baseline pools.</p>
      </div>

      <!-- Ultra-dense multi-column layout wrapper -->
      <div class="sectors-grid-columns">
        <div v-for="(sector, sectorKey) in sectorDirectory" :key="sectorKey" class="sector-column-box">
          <div class="sector-column-header">
            {{ sector.label }}
          </div>
          
          <div class="sector-mini-pills-list">
            <v-tooltip 
              v-for="asset in sector.assets" 
              :key="asset.ticker" 
              location="top"
              open-delay="100"
            >
              <template v-slot:activator="{ props }">
                <div class="sector-mini-pill" v-bind="props">
                  <div class="mini-pill-meta">
                    <span class="mini-ticker">{{ asset.ticker }}</span>
                    <span class="mini-name">{{ asset.shortName }}</span>
                  </div>
                  
                  <button 
                    class="mini-add-btn" 
                    :disabled="currentWatchlist.includes(asset.ticker)"
                    @click.stop="quickAddFromDiscovery(asset.ticker)"
                  >
                    {{ currentWatchlist.includes(asset.ticker) ? '✓' : '+' }}
                  </button>
                </div>
              </template>

              <!-- Dense contextual metric pricing fallback payload -->
              <div class="vuetify-tooltip-content">
                <strong>{{ asset.name }}</strong> ({{ asset.ticker }})
                <v-divider class="my-1 border-opacity-50" color="white"></v-divider>
                Live Feed: <span :class="getDirection(asset.ticker)">${{ getLivePrice(asset.ticker) }}</span>
              </div>
            </v-tooltip>
          </div>
        </div>
      </div>
    </section>

    <div class="dashboard-grid">
      <section class="dashboard-card portfolios-card">
        <div class="card-header">
          <h2>Active Portfolios 💼</h2>
          <button class="btn btn-secondary" @click="isCreateModalActive = true">Create New Portfolio</button>
        </div>

        <div class="portfolios-list" v-if="portfolios.length > 0">
          <div v-for="portfolio in portfolios" :key="portfolio.id" class="portfolio-row">
            <div class="portfolio-meta">
              <h3>{{ portfolio.name }}</h3>
              <div class="tag-row">
                <span class="tag" :class="!portfolio.competition ? 'ind' : 'comp'">
                  {{ !portfolio.competition ? 'Independent Mode' : 'Tournament Match' }}
                </span>
                <span class="tag structure-tag" :class="portfolio.is_dynamic ? 'dyn' : 'stat'">
                  {{ portfolio.is_dynamic ? '🔄 Dynamic Structure' : '🔒 Static Structure' }}
                </span>
              </div>
            </div>
            <div class="portfolio-stats">
              <div>
                <span class="label">Available Cash</span>
                <span class="value">${{ parseFloat(portfolio.cash_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
            <div class="portfolio-actions">
              <button class="btn btn-primary" @click="inspectPortfolio(portfolio.id)">Open Portfolio View</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state"><p>You haven't initialized an investment portfolio yet.</p></div>
      </section>

      <section class="dashboard-card rankings-card">
        <div class="card-header"><h2>Competition Standings 🏆</h2></div>
        <div class="empty-state-notice">Leaderboard rankings are calculated dynamically based on active match registration blocks.</div>
      </section>
    </div>

    <div v-if="isCreateModalActive" class="dialog-overlay" @click.self="isCreateModalActive = false">
      <div class="dialog-box upgraded">
        <div class="dialog-header">
          <h2>Create a Trading Portfolio</h2>
          <button class="close-x" @click="isCreateModalActive = false">&times;</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>Portfolio Name</label>
            <input type="text" v-model="newPortfolioForm.name" placeholder="e.g., Up Only" class="form-control" />
          </div>
          
          <div class="form-group">
            <label>Join a competition or trade independently</label>
            <select v-model="newPortfolioForm.isCompMode" class="form-control">
              <option :value="false">Independent Mode</option>
              <option :value="true">Competition Mode</option>
            </select>
          </div>
          
          <div class="form-group" v-if="newPortfolioForm.isCompMode">
            <label>Competition ID</label>
            <input type="number" v-model="newPortfolioForm.compId" placeholder="Enter Competition ID" class="form-control" />
          </div>

          <div class="form-group" v-if="!newPortfolioForm.isCompMode">
            <label>Starting Capital</label>
            <input 
              type="number" 
              v-model.number="newPortfolioForm.customBudget" 
              min="100" 
              max="1000000000" 
              placeholder="Default: 100,000.00" 
              class="form-control"
            />
            <span class="input-hint">Define your starting capital</span>
          </div>

          <div class="form-group">
            <label>Portfolio Management</label>
            <div class="radio-group-box" :class="{ disabled: newPortfolioForm.isCompMode }">
              <label class="radio-label">
                <input type="radio" :value="true" v-model="newPortfolioForm.isDynamic" :disabled="newPortfolioForm.isCompMode" />
                <span class="ms-2"><strong>Dynamic:</strong> You can rebalance your holdings continuously</span>
              </label>
              <label class="radio-label">
                <input type="radio" :value="false" v-model="newPortfolioForm.isDynamic" :disabled="newPortfolioForm.isCompMode" />
                <span class="ms-2"><strong>Static:</strong> No rebalancing allowed; assets are locked after creation.</span>
              </label>
            </div>
            <span class="input-hint" v-if="newPortfolioForm.isCompMode">* Note: In Competition Mode, settings are defined by the teacher.</span>
          </div>

          <button class="btn btn-secondary full-width margin-top" @click="submitNewPortfolio" :disabled="isActionProcessing">
            {{ isActionProcessing ? 'Processing Deployment...' : 'Deploy Portfolio Assets' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 💼 FULL-SCREEN TRADING TERMINAL DIALOG -->
  <v-dialog v-model="portfolioDialog.isOpen" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-slate-50 d-flex flex-column h-screen">
      <!-- Terminal Control Ribbon -->
      <v-toolbar color="slate-900" dark class="px-4" density="compact" flat style="background: #0f172a; color: white;">
        <v-toolbar-title class="text-subtitle-1 font-weight-black tracking-wide">
          💼 CORE PORTFOLIO ENGINE WORKSPACE &mdash; ID: {{ selectedPortfolio?.id }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="portfolioDialog.isOpen = false">×</v-btn>
      </v-toolbar>

      <div class="d-flex flex-row flex-grow-1 overflow-hidden" style="height: calc(100vh - 48px);">
        <!-- 🎯 LEFT WORKSPACE: TRADING CONTROLLER DESK -->
        <div class="w-50 border-r bg-white pa-6 overflow-y-auto">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-2">Order Execution Terminal</h2>
          <p class="text-caption text-slate-500 mb-6">
            System Constraints Enforced: <strong>$10.00 Fixed Processing Fee</strong> | Velocity Cap: <strong>2 trades/min</strong>, <strong>30 trades/day</strong>.
          </p>

          <!-- Transaction Type Vector Tabs -->
          <v-tabs v-model="tradeForm.action" color="primary" class="mb-4 border-b" grow density="compact">
            <v-tab value="BUY">📈 LONG / BUY</v-tab>
            <v-tab value="SELL">📉 SELL POSITION</v-tab>
            <v-tab value="SHORT">🐻 SHORT SELL</v-tab>
            <v-tab value="COVER">🛡️ BUY TO COVER</v-tab>
          </v-tabs>

          <!-- Core Order Parameters Form -->
          <v-form ref="tradeFormRef" @submit.prevent="dispatchOrder">
            <div class="d-flex gap-4 mb-4">
              <!-- Target Asset Input -->
              <v-text-field
                v-model="tradeForm.ticker"
                label="Asset Ticker"
                variant="outlined"
                density="comfortable"
                placeholder="e.g., NVDA"
                persistent-placeholder
                class="flex-grow-1"
                @input="tradeForm.ticker = tradeForm.ticker.toUpperCase()"
                :rules="[v => !!v || 'Ticker code target is required.']"
              ></v-text-field>

              <!-- Order Class Matrix Selection -->
              <v-select
                v-model="tradeForm.orderType"
                :items="['MARKET', 'LIMIT']"
                label="Order Execution Class"
                variant="outlined"
                density="comfortable"
                class="w-50"
              ></v-select>
            </div>

            <div class="d-flex gap-4 mb-4">
              <!-- Volumetric Unit Fields -->
              <v-text-field
                v-model.number="tradeForm.quantity"
                label="Share Quantity"
                type="number"
                step="any"
                min="0.000001"
                variant="outlined"
                density="comfortable"
                class="w-50"
                :rules="[v => !!v && v > 0 || 'Quantity must be positive.']"
              ></v-text-field>

              <!-- Target Execution Constraint Fields (Limit Configuration Only) -->
              <v-text-field
                v-model.number="tradeForm.targetPrice"
                label="Target Limit Price ($)"
                type="number"
                step="0.01"
                variant="outlined"
                density="comfortable"
                class="w-50"
                :disabled="tradeForm.orderType === 'MARKET'"
                :rules="tradeForm.orderType === 'LIMIT' ? [v => !!v && v > 0 || 'Target boundary price is required for limits.'] : []"
              ></v-text-field>
            </div>

            <!-- Contextual Operational Alert Callout Block -->
            <v-alert v-if="tradeForm.action === 'SHORT' || tradeForm.action === 'COVER'" type="warning" variant="tonal" class="mb-4 text-caption">
              <strong>Short Infrastructure/Cover Mode Note:</strong> Margin leverage matching and balance checks will evaluate based on competition engine parameters.
            </v-alert>

            <!-- Real-Time Cost Estimator Panel -->
            <div class="bg-slate-50 border rounded pa-4 mb-6" style="background: #f8fafc; border: 1px solid #e2e8f0;">
              <h3 class="text-caption font-weight-bold text-slate-600 mb-2 uppercase tracking-wider">Estimated Financial Impact</h3>
              <div class="d-flex justify-between text-subtitle-2 mb-1">
                <span class="text-slate-500">Gross Principal Volumetric Base:</span>
                <span class="font-weight-bold text-slate-800">${{ computedGrossPrincipal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-between text-subtitle-2 mb-1">
                <span class="text-slate-500">Fixed Clearing Transaction Fee:</span>
                <span class="text-amber-700 font-weight-bold">+$10.00</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-between text-subtitle-1">
                <span class="font-weight-bold text-slate-700">Total Capital Allocation Impact:</span>
                <span class="font-weight-black text-primary">${{ computedTotalImpact.toFixed(2) }}</span>
              </div>
            </div>

            <v-btn type="submit" color="primary" block size="large" class="font-weight-bold" :loading="isTradeProcessing">
              Transmit Order Pipeline Wire Request
            </v-btn>
          </v-form>
        </div>

        <!-- 📊 RIGHT WORKSPACE: HOLDINGS MATRIX & TRANSACTION LEDGER TERMINAL -->
        <div class="w-50 bg-slate-50 pa-6 overflow-y-auto" style="background: #f8fafc;">
          <!-- Cash Balance Display Header -->
          <v-card variant="outlined" class="bg-white mb-6 pa-4 border-emerald-500" style="border-left: 4px solid #10b981;">
            <div class="text-caption text-slate-500 font-weight-bold uppercase">Authorized Liquidity Account Cash Balance</div>
            <div class="text-h4 font-weight-black text-slate-800">${{ selectedPortfolio?.cash_balance?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00' }}</div>
          </v-card>

          <!-- Grid Component 1: Current Portfolio Asset Holdings -->
          <h3 class="text-subtitle-1 font-weight-bold text-slate-700 mb-3 d-flex align-center gap-1">
            <span>📦 Open Asset Positions Matrix</span>
          </h3>
          <div class="bg-white border rounded mb-6" style="border: 1px solid #e2e8f0;">
            <v-table density="comfortable" class="text-caption">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th class="font-weight-bold">Asset Ticker</th>
                  <th class="font-weight-bold">Position Unit Vol</th>
                  <th class="font-weight-bold">Cost Basis Avg ($)</th>
                  <th class="font-weight-bold text-right">Current Evaluated Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="holding in selectedPortfolio?.holdings" :key="holding.id">
                  <td class="font-weight-black text-slate-800">{{ holding.ticker }}</td>
                  <td>{{ holding.quantity }}</td>
                  <td>${{ parseFloat(holding.average_buy_price).toFixed(2) }}</td>
                  <td class="text-right font-weight-bold">${{ getLivePrice(holding.ticker) }}</td>
                </tr>
                <tr v-if="!selectedPortfolio?.holdings?.length">
                  <td colspan="4" class="text-center text-slate-400 py-4">No open asset position entries mapped in local portfolio models.</td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <!-- Grid Component 2: Historic Audit Transaction Records -->
          <h3 class="text-subtitle-1 font-weight-bold text-slate-700 mb-3">
            📜 Historical Verification Transaction Ledger Audit Trails
          </h3>
          <div class="bg-white border rounded" style="border: 1px solid #e2e8f0;">
            <v-table density="compact" class="text-caption">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th class="font-weight-bold">Timestamp Execution</th>
                  <th class="font-weight-bold">Asset</th>
                  <th class="font-weight-bold">Action Type</th>
                  <th class="font-weight-bold">Unit Vol</th>
                  <th class="font-weight-bold text-right">Unit Strike Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in selectedPortfolio?.transactions" :key="tx.id">
                  <td class="text-slate-500">{{ new Date(tx.timestamp).toLocaleString() }}</td>
                  <td class="font-weight-bold">{{ tx.ticker }}</td>
                  <td>
                    <v-chip size="x-small" :color="tx.transaction_type === 'BUY' ? 'emerald' : 'rose'" variant="flat">
                      {{ tx.transaction_type }}
                    </v-chip>
                  </td>
                  <td>{{ tx.quantity }}</td>
                  <td class="text-right font-weight-bold">${{ parseFloat(tx.price_per_unit).toFixed(2) }}</td>
                </tr>
                <tr v-if="!selectedPortfolio?.transactions?.length">
                  <td colspan="5" class="text-center text-slate-400 py-4">No verification trade events archived in history ledger frameworks.</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>

    <div v-if="errorModal.active" class="dialog-overlay alert-z" @click.self="errorModal.active = false">
      <div class="dialog-box alert-box">
        <div class="dialog-header alert-red">
          <h2>⚠️ System Exception</h2>
          <button class="close-x" @click="errorModal.active = false">&times;</button>
        </div>
        <div class="dialog-body">
          <p class="error-modal-msg">{{ errorModal.message }}</p>
          <button class="btn btn-danger full-width" @click="errorModal.active = false">Accept</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api from "@/axios"
import TickerSearchBar from "@/components/TickerSearchBar.vue"
import marketDirectory from '@/assets/data/marketDirectory.json'

const studentInitials = ref('')
const portfolios = ref([])
const currentWatchlist = ref([])
const marketPrices = ref([])

const watchlistSearchRef = ref(null)
const watchlistSelectedTicker = ref('')
const isActionProcessing = ref(false)
const isCreateModalActive = ref(false)

const newPortfolioForm = ref({
  name: '',
  isCompMode: false,
  compId: null,
  customBudget: 100000,
  isDynamic: true
})

const snackbar = ref({ active: false, message: '', type: 'success' })
const errorModal = ref({ active: false, message: '' })

const triggerToast = (msg, type = 'success') => {
  snackbar.value = { active: true, message: msg, type: type }
  setTimeout(() => { snackbar.value.active = false }, 5000)
}

const triggerErrorModal = (msg) => {
  errorModal.value = { active: true, message: msg }
}

const handleWatchlistSelection = (ticker) => {
  watchlistSelectedTicker.value = ticker
}

const fetchDashboardData = async () => {
  try {
    const res = await api.get('/market-masters/hub/')
    studentInitials.value = res.data.student_initials
    portfolios.value = res.data.portfolios
    currentWatchlist.value = res.data.watchlist
    marketPrices.value = res.data.market_prices
  } catch (err) {
    console.error("Pricing hub disconnect:", err)
  }
}

// for suggested buys section
// Clean static sectors mapping block for structural rendering loops
const sectorDirectory = {
  tech: {
    label: "💻 Tech Growth Stocks",
    assets: [
      { ticker: "NVDA", name: "NVIDIA Corporation", shortName: "NVIDIA" },
      { ticker: "AAPL", name: "Apple Inc.", shortName: "Apple" },
      { ticker: "MSFT", name: "Microsoft Corp.", shortName: "Microsoft" },
      { ticker: "TSLA", name: "Tesla, Inc.", shortName: "Tesla" },
      { ticker: "XLK", name: "Tech ETF", shortName: "Technology Select" }
    ]
  },
  indices: {
    label: "🇺🇸 US Index Proxies",
    assets: [
      { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", shortName: "S&P 500 ETF" },
      { ticker: "QQQ", name: "Invesco QQQ Trust", shortName: "Nasdaq 100" },
      { ticker: "VTI", name: "Vanguard Total Stock", shortName: "Total Market" },
      { ticker: "XLF", name: "Financial Sector SPDR", shortName: "Financials" }
    ]
  },
  swiss: {
    label: "🇨🇭 Swiss Stocks (ADR)",
    assets: [
      { ticker: "EWL", name: "iShares MSCI Switzerland", shortName: "SMI Tracker" },
      { ticker: "UBS", name: "UBS Group AG", shortName: "UBS Group" },
      { ticker: "NSRGY", name: "Nestlé S.A. (US ADR)", shortName: "Nestlé" }
    ]
  },
  europe: {
    label: "🇪🇺 European Stocks (ADR)",
    assets: [
      { ticker: "LVMUY", name: "LVMH Moët Hennessy", shortName: "LVMH Group" },
      { ticker: "MBGYY", name: "Mercedes-Benz Group", shortName: "Mercedes" },
      { ticker: "STLA", name: "Stellantis N.V.", shortName: "Stellantis" },

    ]
  },
  commodities: {
    label: "🛢️ Oil, Gas, Metals",
    assets: [
      { ticker: "USO", name: "United States Oil Fund", shortName: "Crude Oil" },
      { ticker: "UNG", name: "United States Natural Gas", shortName: "Natural Gas" },
      { ticker: "XLE", name: "Energy Select Sector", shortName: "Energy Equities" },
      { ticker: "XAU/USD", name: "Gold Spot Price", shortName: "Gold Spot" },
      { ticker: "GLD", name: "SPDR Gold Shares", shortName: "Gold ETF" },
      { ticker: "XAG", name: "Silver Spot Price Proxy", shortName: "Silver Proxy" }
    ]
  },
}

// Quick-Add interceptor connecting discovery pills cleanly into the watchlist API endpoints pipeline
const quickAddFromDiscovery = async (ticker) => {
  if (currentWatchlist.value.includes(ticker)) {
    triggerToast(`[${ticker}] is already monitored inside your watchlist structures.`, "warning")
    return
  }
  if (currentWatchlist.value.length >= 15) {
    triggerErrorModal("Watchlist allocation limits full. Drop tracking arrays rows before appending parameters.")
    return
  }
  
  isActionProcessing.value = true
  try {
    const checkRes = await api.get(`/market-masters/search/?ticker=${ticker}`)
    if (checkRes.data) {
      await api.post('/market-masters/watchlist/add/', { ticker: ticker })
      triggerToast(`Successfully added [${ticker}] to tracking watchlist matrices.`, "success")
      await fetchDashboardData()
    }
  } catch (err) {
    const errorDetails = err.response?.data?.error || "Asset lookup constraint issue parameters."
    triggerErrorModal(`Watchlist Entry Denied: ${errorDetails}`)
  } finally {
    isActionProcessing.value = false
  }
}

const submitWatchlistAdd = async () => {
  const ticker = watchlistSelectedTicker.value
  if (!ticker) {
    triggerToast("Please select an entry using the search component tools.", "warning")
    return
  }
  if (currentWatchlist.value.includes(ticker)) {
    triggerErrorModal(`The asset security ticker symbol [${ticker}] is already explicitly registered to your live tracking watchlist card array.`)
    return
  }

  isActionProcessing.value = true
  try {
    const checkRes = await api.get(`/market-masters/search/?ticker=${ticker}`)
    if (checkRes.data) {
      await api.post('/market-masters/watchlist/add/', { ticker: ticker })
      triggerToast(`Successfully added [${ticker}] to tracking watchlist matrices.`, "success")
      fetchDashboardData()
      if (watchlistSearchRef.value) watchlistSearchRef.value.clearInput()
      watchlistSelectedTicker.value = ''
    }
  } catch (err) {
    const errorDetails = err.response?.data?.error || "Asset validation missing context parameters."
    triggerErrorModal(`Watchlist Registration Denied: ${errorDetails}`)
  } finally {
    isActionProcessing.value = false
  }
}

// Scans the active in-memory price array payload to resolve the ticker's full title
const getAssetName = (ticker) => {
  if (!ticker) return 'Securities Asset'
  const cleanTicker = ticker.toUpperCase()

  // 🔄 STEP 1: Check your real-time live prices cache array first
  const match = marketPrices.value.find(p => p.ticker.toUpperCase() === cleanTicker)
  if (match && match.name && match.name !== 'Global Market Security') {
    return match.name
  }

  // 🔒 STEP 2: Fallback to your massive 8,000-item frontend directory dictionary
  // This acts as an instant local lookup table that saves API credits!
  if (marketDirectory[cleanTicker] && marketDirectory[cleanTicker].name) {
    return marketDirectory[cleanTicker].name
  }

  // 🌍 STEP 3: Human-readable default fallback structure if it's an unmapped ad-hoc ticker
  return 'Market Security'
}

// Truncates company names cleanly to a specific length with trailing ellipses
const truncateString = (str, limit = 4) => {
  if (!str || str === 'Market Asset' || str === 'Global Market Security') return ''
  return str.length > limit ? str.substring(0, limit) : str
}

const removeFromWatchlist = async (tick) => {
  try {
    await api.post('/market-masters/watchlist/remove/', { ticker: tick })
    triggerToast(`Asset [${tick}] dropped from active visibility matrices.`, "success")
    fetchDashboardData()
  } catch (err) {
    triggerErrorModal("Unable to remove the asset.")
  }
}

const submitNewPortfolio = async () => {
  if (newPortfolioForm.value.isCompMode && !newPortfolioForm.value.compId) {
    triggerToast("A target Tournament Match ID configuration code parameters string is required.", "warning")
    return
  }
  if (!newPortfolioForm.value.isCompMode) {
    const budget = newPortfolioForm.value.customBudget
    if (!budget || budget < 100 || budget > 1000000000) {
      triggerErrorModal("Capital allocations must sit within boundary limits constraints between $100.00 and $1,000,000,000.00 max scaling rules.")
      return
    }
  }

  isActionProcessing.value = true
  
  // STEP 1: Isolate the Portfolio Creation request explicitly
  try {
    await api.post('/market-masters/hub/', {
      name: newPortfolioForm.value.name.trim(),
      competition_id: newPortfolioForm.value.isCompMode ? newPortfolioForm.value.compId : null,
      custom_budget: newPortfolioForm.value.isCompMode ? null : newPortfolioForm.value.customBudget,
      is_dynamic: newPortfolioForm.value.isCompMode ? null : newPortfolioForm.value.isDynamic
    })
    
    // If the code reaches here, the portfolio was 100% successfully created!
    triggerToast(`Portfolio "${newPortfolioForm.value.name || 'Sandbox Portfolio'}" successfully deployed to Postgres.`, "success")
    isCreateModalActive = false
    
  } catch (err) {
    // This ONLY catches actual portfolio creation deployment blocks
    const contextError = err.response?.data?.error || "Check competition parameters constraints details."
    triggerErrorModal(`Deployment Failed: ${contextError}`)
    isActionProcessing.value = false
    return // Halt execution here since the creation genuinely failed
  }

  // 🌟 STEP 2: Background state refresh runs independently outside the creation gate
  try {
    await fetchDashboardData()
  } catch (refreshErr) {
    console.error("Background dashboard sync paused temporarily:", refreshErr)
    triggerToast("Portfolio created! Data views will sync automatically on the next poll.", "warning")
  } finally {
    // Reset form states cleanly
    newPortfolioForm.value = { name: '', isCompMode: false, compId: null, customBudget: 100000, isDynamic: true }
    isActionProcessing.value = false
  }
}

const getLivePrice = (ticker) => {
  const match = marketPrices.value.find(p => p.ticker.toUpperCase() === ticker.toUpperCase())
  return match ? parseFloat(match.current_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'
}
const getDirection = (ticker) => {
  const match = marketPrices.value.find(p => p.ticker.toUpperCase() === ticker.toUpperCase())
  return match ? match.direction : 'neutral'
}
const getDirectionClass = (ticker) => {
  const direction = getDirection(ticker)
  return direction === 'up' ? 'trend-up' : direction === 'down' ? 'trend-down' : 'trend-neutral'
}

// 🕒 NEW: Resolves a clean, localized timestamp for when the asset record was modified
const getLastUpdatedTime = (ticker) => {
  if (!ticker) return '---'
  const match = marketPrices.value.find(p => p.ticker.toUpperCase() === ticker.toUpperCase())
  
  if (match && match.updated_at) {
    const dateObj = new Date(match.updated_at)
    // Returns clean, localized digital readouts (e.g., "14:32:05")
    return dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  }
  return 'Pending'
}

const nyseClock = ref({
  isOpen: false,
  message: 'Calculating time metrics...'
})

let clockIntervalId = null

const updateNYSECountdownClock = () => {
  // 🗺️ STEP 1: Parse the current timestamp directly into New York localized parameters
  const nowInNY = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
  
  const currentYear = nowInNY.getFullYear()
  const currentMonth = nowInNY.getMonth()
  const currentDate = nowInNY.getDate()
  const currentDay = nowInNY.getDay() // 0 = Sunday, 6 = Saturday
  
  const hours = nowInNY.getHours()
  const minutes = nowInNY.getMinutes()
  const seconds = nowInNY.getSeconds()
  
  // Convert current NY moments into an absolute scalar minute tracking block
  const totalMinutesPassedToday = (hours * 60) + minutes
  const openingMinutesTarget = (9 * 60) + 30 // 09:30 AM EST
  const closingMinutesTarget = 16 * 60       // 04:00 PM EST
  
  const isWeekend = (currentDay === 0 || currentDay === 6)
  
  // Evaluate true NYSE session flags
  const isMarketHours = !isWeekend && (totalMinutesPassedToday >= openingMinutesTarget && totalMinutesPassedToday < closingMinutesTarget)
  
  nyseClock.value.isOpen = isMarketHours
  
  // ⚡ Helper function to format seconds/minutes pad layers cleanly
  const padTime = (num) => String(num).padStart(2, '0')

  // 🔒 CASE A: Market is currently active and open
  if (isMarketHours) {
    const remainingSecondsTotal = ((closingMinutesTarget * 60) - ((hours * 3600) + (minutes * 60) + seconds))
    const hLeft = Math.floor(remainingSecondsTotal / 3600)
    const mLeft = Math.floor((remainingSecondsTotal % 3600) / 60)
    const sLeft = remainingSecondsTotal % 60
    nyseClock.value.message = `Closes in: ${padTime(hLeft)}h ${padTime(mLeft)}m`
    return
  }
  
  // 🔒 CASE B: It's the weekend
  if (isWeekend) {
    nyseClock.value.message = 'Market closed for the weekend.'
    return
  }
  
  // 🔒 CASE C: Weekday but before 09:30 AM opening bell
  if (totalMinutesPassedToday < openingMinutesTarget) {
    const openingSecondsTotal = ((openingMinutesTarget * 60) - ((hours * 3600) + (minutes * 60) + seconds))
    const hLeft = Math.floor(openingSecondsTotal / 3600)
    const mLeft = Math.floor((openingSecondsTotal % 3600) / 60)
    const sLeft = openingSecondsTotal % 60
    nyseClock.value.message = `Opens in: ${padTime(hLeft)}h ${padTime(mLeft)}m ${padTime(sLeft)}s`
  } 
  // 🔒 CASE D: Weekday post 04:00 PM closing bell
  else {
    nyseClock.value.message = 'Market closed. Reopens tomorrow.'
  }
}


// 📊 NEW: Generates an explanatory tooltip detailing the exact 48-hour percentage delta calculations
const getWatchlistTooltip = (ticker) => {
  if (!ticker) return ''
  const match = marketPrices.value.find(p => p.ticker.toUpperCase() === ticker.toUpperCase())
  const companyName = getAssetName(ticker)
  
  if (!match) return `${companyName} (${ticker}) — Awaiting synchronization pulse.`
  
  // Clean, parse, and evaluate your direction labels safely
  const directionText = match.direction === 'up' ? 'Gain' : match.direction === 'down' ? 'Loss' : 'Unchanged'
  
  // Assuming your backend views send the performance calculation variable as a property string
  // If it isn't explicitly calculated over the wire yet, we default to an elegant baseline statement:
  if (match.performance_pct) {
    return `${companyName} (${ticker})\n48h Performance: ${match.performance_pct}% ${directionText}`
  }
  
  return `${companyName} (${ticker})\nColor indicator reflects active operational 48h market direction trends (${directionText}).`
}

// transaction dialog
// Main state controller structure maps
const portfolioDialog = ref({ isOpen: false })
const selectedPortfolio = ref(null)
const isTradeProcessing = ref(false)
const tradeFormRef = ref(null)

// Core state structure dictionary setup initialization parameters
const tradeForm = ref({
  ticker: '',
  action: 'BUY',
  orderType: 'MARKET',
  quantity: null,
  targetPrice: null
})

// 👑 SYSTEM DIALOG DISPATCH ACTION INTERCEPTOR
const inspectPortfolio = async (id) => {
  try {
    // Dynamically retrieve detailed context metadata parameters for matching active profiles
    const response = await api.get(`/market-masters/portfolios/${id}/`)
    selectedPortfolio.value = response.data
    
    // Clear out form execution vectors cleanly across toggles
    tradeForm.value = {
      ticker: '',
      action: 'BUY',
      orderType: 'MARKET',
      quantity: null,
      targetPrice: null
    }
    
    // Boot open full viewport dialog canvas frame
    portfolioDialog.value.isOpen = true
  } catch (err) {
    triggerErrorModal("Unable to securely synchronize asset portfolio parameters details context grids.")
  }
}

// 🧮 REAL-TIME COST COMPUTATION VECTORS
const computedGrossPrincipal = computed(() => {
  if (!tradeForm.value.ticker || !tradeForm.value.quantity) return 0
  
  if (tradeForm.value.orderType === 'LIMIT') {
    return (tradeForm.value.targetPrice || 0) * tradeForm.value.quantity
  } else {
    // Pull real-time live reference feed price fallback metrics variables configurations
    const livePrice = parseFloat(getLivePrice(tradeForm.value.ticker)) || 0
    return livePrice * tradeForm.value.quantity
  }
})

const computedTotalImpact = computed(() => {
  if (computedGrossPrincipal.value === 0) return 0
  // Enforces fixed $10 regulatory platform processing transaction fees across allocations
  return computedGrossPrincipal.value + 10.00
})

// 🚀 DISPATCH ORDER PIPELINE WIRE INTERCEPTOR
const dispatchOrder = async () => {
  const { valid } = await tradeFormRef.value.validate()
  if (!valid) return

  isTradeProcessing.value = true
  
  // Choose standard market handler or pending limit order queue routing schemas
  const endpoint = tradeForm.value.orderType === 'MARKET' 
    ? '/market-masters/trade/execute/' 
    : '/market-masters/orders/create/'

  const payload = {
    portfolio_id: selectedPortfolio.value.id,
    ticker: tradeForm.value.ticker.toUpperCase(),
    quantity: tradeForm.value.quantity,
    trade_type: tradeForm.value.action, // Pass active structural routing tab type string matching constraints
    order_type: tradeForm.value.orderType,
    target_price: tradeForm.value.orderType === 'LIMIT' ? tradeForm.value.targetPrice : null
  }

  try {
    const res = await api.post(endpoint, payload)
    triggerToast(res.data.message || "Order tracking frame processed cleanly.", "success")
    
    // Synchronize current local structures with backend response updates
    if (res.data.new_cash_balance) {
      selectedPortfolio.value.cash_balance = res.data.new_cash_balance
    }
    
    // Hard refresh context containers configurations layouts variables dashboard arrays
    await fetchDashboardData()
    const refreshProfile = await api.get(`/market-masters/portfolios/${selectedPortfolio.value.id}/`)
    selectedPortfolio.value = refreshProfile.data
  } catch (err) {
    const message = err.response?.data?.error || "Transaction denied due to execution rule restrictions."
    triggerErrorModal(`Trade Rejection: ${message}`)
  } finally {
    isTradeProcessing.value = false
  }
}


onMounted(() => { 
  fetchDashboardData(); setInterval(fetchDashboardData, 60000) 

  updateNYSECountdownClock()
  // Run an explicit 1-second interval cadence loop to keep the text ticking smoothly
  clockIntervalId = setInterval(updateNYSECountdownClock, 1000)
})

onBeforeUnmount(() => {
  if (clockIntervalId) clearInterval(clockIntervalId)
})
</script>

<style scoped>
/* WATCHLIST FLEXBOX MODAL OVERWRITES */
.watchlist-section { max-width: 1160px; background: white; margin: 0 auto 30px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.watchlist-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f4f6f7; padding-bottom: 12px; margin-bottom: 15px; }
.watchlist-header h2 { margin: 0; font-size: 1.2rem; color: #2c3e50; }
.watchlist-add-form { display: flex; gap: 12px; width: 100%; max-width: 650px; align-items: center; }

/* SNACKBAR NOTIFIER CONTAINER PLACEMENTS */
.snackbar-toast {
  position: fixed; top: 25px; right: 25px; z-index: 11000;
  display: flex; align-items: center; gap: 12px;
  padding: 14px 24px; border-radius: 6px; color: white; font-weight: bold;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2); box-sizing: border-box;
}
.snackbar-toast.success { background: #2ecc71; }
.snackbar-toast.warning { background: #f39c12; }
.toast-icon { font-size: 1.1rem; }

.snackbar-enter-active, .snackbar-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.snackbar-enter-from { transform: translate3d(50px, 0, 0); opacity: 0; }
.snackbar-leave-to { transform: translate3d(0, -20px, 0); opacity: 0; }

/* REFACTORED PORTFOLIO STRUCTURE UPGRADES */
.dialog-box.upgraded { max-width: 550px; }
.radio-group-box { display: flex; flex-direction: column; gap: 10px; padding: 12px; background: #f8f9fa; border: 1px solid #cbd5e0; border-radius: 4px; margin-top: 4px; }
.radio-group-box.disabled { opacity: 0.65; pointer-events: none; }
.radio-label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.85rem; color: #2f3542; }
.radio-label input { margin-top: 3px; }
.input-hint { display: block; font-size: 0.72rem; color: #747d8c; margin-top: 4px; font-style: italic; }

.tag-row { display: flex; gap: 6px; margin-top: 6px; }
.tag.structure-tag.dyn { background: #ecf0f1; color: #2c3e50; border: 1px solid #bdc3c7; }
.tag.structure-tag.stat { background: #f2f4f4; color: #7f8c8d; border: 1px dashed #95a5a6; }

/* ERROR MODAL CHASSIS PARAMS */
.alert-z { z-index: 10500 !important; }
.dialog-header.alert-red { background: #e74c3c; }
.btn-danger { background: #e74c3c; color: white; }
.error-modal-msg { color: #2c3e50; font-size: 0.92rem; line-height: 1.5; margin: 10px 0 20px 0; background: #fdf2f2; padding: 12px; border-left: 4px solid #e74c3c; border-radius: 4px; }

/* INTERIOR CORE HOOK TEMPLATES BRIDGES */
.market-masters-container { padding-bottom: 40px; background-color: #f8f9fa; min-height: 100vh; }
.market-ticker-wrap { 
  width: 100%; 
  background: #111; 
  color: #fff; 
  padding: 12px 0; 
  overflow: hidden; 
  white-space: nowrap; 
}

/* Adjust animation speeds based on expanded string contents */
.ticker-moving { 
  display: inline-block; 
  padding-left: 100%; 
  animation: ticker-slide 600s linear infinite; 
}

.ticker-item { 
  display: inline-block; 
  margin-right: 40px; 
  font-weight: bold; 
  font-family: monospace; 
  font-size: 0.95rem; 
}

.ticker-name { 
  color: #3498db; 
  margin-right: 4px; 
  font-weight: 800; 
}

/* 🏢 NEW: Company label style tag */
.ticker-company-label {
  color: #747d8c;
  font-size: 0.8rem;
  margin-right: 6px;
  font-weight: 500;
}

.ticker-price { transition: color 0.25s ease; font-weight: 700; }
.ticker-price.up { color: #2ecc71 !important; }
.ticker-price.down { color: #e74c3c !important; }
.ticker-price.neutral { color: #ffffff !important; }
.arrow { font-size: 0.75rem; margin-left: 2px; }

/* 📢 NEW: Integrated system broadcast message formatting */
.ticker-system-broadcast-message {
  display: inline-block;
  background: #2196f3;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 3px 12px;
  border-radius: 4px;
  margin-right: 40px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.4);
}

@keyframes ticker-slide { 
  0% { transform: translate3d(0, 0, 0); } 
  100% { transform: translate3d(-100%, 0, 0); } 
}

.hub-header { max-width: 1160px; margin: 40px auto; padding: 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.header-main-content { flex: 1; }
.hub-header h1 { font-size: 2.2rem; color: #2c3e50; margin: 0; }
.subtitle { color: #7f8c8d; margin-top: 5px; }

.macro-index-box { display: flex; gap: 15px; background: #fff; padding: 12px 18px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
.index-card { display: flex; flex-direction: column; padding: 6px 15px 6px 8px; border-right: 1px solid #edf2f7; transition: all 0.3s ease; }
.index-card:last-child { border-right: none; padding-right: 0; }
.index-meta { display: flex; align-items: center; gap: 8px; }
.index-label { font-size: 0.75rem; color: #718096; font-weight: 600; }
.index-value { font-family: monospace; font-size: 1.15rem; font-weight: 700; color: #1a202c; margin-top: 4px; }

.index-card.trend-up { background: rgba(46, 204, 113, 0.05); border-radius: 6px; }
.index-card.trend-down { background: rgba(231, 76, 60, 0.05); border-radius: 6px; }

.workflow-banner { max-width: 1160px; background: #fff; border-left: 5px solid #3498db; border-radius: 4px; margin: 0 auto 30px auto; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.workflow-banner h2 { margin: 0 0 15px 0; font-size: 1.2rem; }
.steps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.step-card { background: #fdfdfd; border: 1px solid #eef2f5; border-radius: 6px; padding: 15px; position: relative; }
.step-card.highlight { background: #f4f9fd; border-color: #d6eaf8; }
.step-num { position: absolute; top: 12px; right: 15px; background: #3498db; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; }
.research-links a { display: inline-block; margin-right: 15px; color: #3498db; text-decoration: none; font-weight: bold; }
.sub-paths { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; font-size: 0.85rem; }
.status-msg { color: #e67e22; line-height: 1.4; }
.status-msg.green { color: #27ae60; font-weight: bold; }

.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); /* 🌟 Expanded slightly to give meta text room */
  gap: 15px;
}

.watchlist-tile {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 95px; /* Guarantees standard uniformity across elements */
  cursor: help; /* 🌟 Changes cursor indicator to a question mark loop to nudge the user to hover for tooltips */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.watchlist-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.tile-identity {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 14px;
}

.tile-meta-pricing {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.tile-price {
  font-family: monospace;
  font-size: 1.15rem;
  font-weight: bold;
}

/* 🕒 NEW: Micro-scaled gray accent text style rule for background timestamps */
.tile-timestamp {
  font-size: 0.68rem;
  color: #95a5a6;
  margin-top: 3px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.tile-company-name {
  font-size: 0.74rem;
  color: #747d8c;
  font-weight: 500;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.tile-ticker { font-weight: bold; color: #4a5568; font-size: 0.9rem; }
.tile-price { font-family: monospace; font-size: 1.1rem; font-weight: bold; margin-top: 4px; transition: color 0.3s ease; }
.tile-price.up { color: #2ecc71; }
.tile-price.down { color: #e74c3c; }
.tile-price.neutral { color: #2d3748; }
.remove-btn { position: absolute; top: 4px; right: 6px; background: transparent; border: none; font-size: 1.1rem; color: #a0aec0; cursor: pointer; }
.remove-btn:hover { color: #e53e3e; }
.empty-msg { color: #718096; font-size: 0.9rem; font-style: italic; }

.dashboard-grid { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 1fr; gap: 25px; padding: 0; }
.dashboard-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #f4f6f7; padding-bottom: 10px; }
.card-header h2 { margin: 0; font-size: 1.3rem; }
.card-instruction { background: #fcf8e3; color: #c09853; border: 1px solid #fbeed5; padding: 10px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 20px; }

.portfolio-row { display: flex; justify-content: space-between; align-items: center; background: #fbfcfc; border: 1px solid #eaeded; border-radius: 6px; padding: 15px; margin-bottom: 12px; }
.portfolio-meta h3 { margin: 0 0 5px 0; font-size: 1.05rem; color: #2c3e50; }
.tag { font-size: 0.75rem; padding: 3px 8px; border-radius: 20px; font-weight: bold; }
.tag.ind { background: #e8f8f5; color: #117a65; }
.tag.comp { background: #fef9e7; color: #b59e13; }
.value { font-family: monospace; font-size: 1.1rem; font-weight: bold; color: #2d3748; }

.empty-state-notice { padding: 30px; border: 2px dashed #e2e8f0; text-align: center; color: #718096; border-radius: 6px; }

.system-status-banner { max-width: 1160px; margin: 20px auto 0 auto; padding: 0; }
.banner-content { display: flex; align-items: center; gap: 12px; background-color: #e3f2fd; border: 1px solid #bbdefb; border-left: 4px solid #2196f3; border-radius: 6px; padding: 12px 16px; }
.banner-icon { font-size: 1.2rem; user-select: none; }
.banner-content p { margin: 0; font-size: 0.88rem; color: #1e88e5; line-height: 1.4; }

.dialog-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.dialog-box { background: white; width: 90%; max-width: 500px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden; }
.dialog-header { background: #2c3e50; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
.dialog-header h2 { margin: 0; font-size: 1.15rem; }
.close-x { background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.dialog-body { padding: 25px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: bold; color: #4a5568; margin-bottom: 6px; }
.form-control { width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 4px; box-sizing: border-box; }

.btn { padding: 10px 18px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.85rem; transition: background 0.2s; }
.btn-primary { background: #3498db; color: white; }
.btn-primary:hover { background: #2980b9; }
.btn-secondary { background: #2ecc71; color: white; }
.btn-secondary:hover { background: #27ae60; }
.full-width { width: 100%; }
.margin-top { margin-top: 15px; }
/* Identity stack grouping inside the tile card */
.tile-identity {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
  padding-right: 12px; /* Leaves clean safe space away from the delete X button */
  overflow: hidden;
}

/* 🌟 STYLED DETAILED COMPANY TEXT SUB-TAG */
.tile-company-name {
  font-size: 0.74rem;
  color: #747d8c; /* Subtle, neutral gray color */
  font-weight: 500;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Fades heavy names out with standard '...' notation */
  width: 100%;
}

/* Ensure price numbers space down beautifully */
.tile-price {
  font-family: monospace;
  font-size: 1.15rem;
  font-weight: bold;
  margin-top: auto; /* Forces price figures straight to the bottom floor of the card */
  transition: color 0.3s ease;
}
/* Custom Content Formatting for the Vuetify Popover Window */
.vuetify-tooltip-content {
  padding: 6px 10px;
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
}

.tooltip-header {
  font-size: 0.88rem;
  color: #f5f6fa;
}

.tooltip-body {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  margin-top: 4px;
}

.perf-label {
  color: #dcdde1;
}

/* Tooltip Trend Vector Highlight Colors */
.perf-value.up { color: #2ecc71; font-weight: bold; }
.perf-value.down { color: #e74c3c; font-weight: bold; }
.perf-value.neutral { color: #f5f6fa; }

/* Keep watchlist tile looking tight and clean */
.watchlist-tile {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 95px;
  cursor: pointer; /* Swapped back to pointer since the tooltip is fluid now */
  transition: all 0.2s ease;
}
/* Layout alignment adjustments inside your existing index-card blocks */
.index-card {
  display: flex;
  flex-direction: column;
  padding: 6px 15px 6px 8px;
  border-right: 1px solid #edf2f7;
  transition: all 0.3s ease;
  justify-content: center;
}

/* Small ticker subtitle string layout for the countdown readout */
.clock-countdown-msg {
  font-size: 0.68rem;
  color: #747d8c;
  margin-top: 2px;
  font-weight: 600;
  white-space: nowrap;
}

/* Flashing Green/Red Status dot system indicator next to the card title label */
.status-dot {
  width: 7px;
  height: 7px;
  background: #e74c3c;
  border-radius: 50%;
  display: inline-block;
}
.status-dot.is-open {
  background: #2ecc71;
  box-shadow: 0 0 6px #2ecc71;
}
/* Curated container spacing adjustments */
.suggested-sectors-container {
  margin-top: -15px; /* Pulls it up tight below your watchlist panel box */
}
/* Multi-column grid layout for the sector blocks */
.sectors-grid-columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  margin-top: 8px;
}

/* Individual sector column container */
.sector-column-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

/* Tiny header inside columns */
.sector-column-header {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 4px;
  letter-spacing: 0.3px;
}

/* Internal stack inside the column wrapper */
.sector-mini-pills-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Tiny mini-pill architecture style specifications */
.sector-mini-pill {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 4px 6px;
  border-radius: 4px;
  position: relative;
}

.mini-pill-meta {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  overflow: hidden;
}

.mini-ticker {
  font-weight: 700;
  font-size: 0.75rem;
  color: #1e293b;
  line-height: 1.1;
}

.mini-name {
  font-size: 0.62rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Micro add operations button interface */
.mini-add-btn {
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 900;
  color: #2ecc71;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  transition: transform 0.1s;
}
.mini-add-btn:hover:not(:disabled) {
  transform: scale(1.2);
  color: #27ae60;
}
.mini-add-btn:disabled {
  color: #cbd5e0;
  cursor: not-allowed;
}
</style>