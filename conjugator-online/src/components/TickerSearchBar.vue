<template>
  <div class="autocomplete-wrapper" ref="wrapperRef">
    <div class="input-group-row">
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="handleSearchInput"
        @focus="isDropdownOpen = true"
        :placeholder="searchMode === 'ticker' ? 'Search by ticker symbol (e.g., AAPL)...' : 'Search by asset name (e.g., Microsoft)...'" 
        class="search-input"
      />
      
      <div class="toggle-container">
        <button 
          type="button"
          class="toggle-tab" 
          :class="{ active: searchMode === 'ticker' }" 
          @click="changeMode('ticker')"
        >
          Ticker
        </button>
        <button 
          type="button"
          class="toggle-tab" 
          :class="{ active: searchMode === 'name' }" 
          @click="changeMode('name')"
        >
          Name
        </button>
      </div>
    </div>
    
    <ul v-if="isDropdownOpen && filteredSuggestions.length > 0" class="autocomplete-dropdown wide-layout">
      <li 
        v-for="item in filteredSuggestions" 
        :key="item.ticker" 
        @click="selectAsset(item)"
        class="dropdown-item"
      >
        <div class="item-main">
          <span class="ticker-badge-prefix">{{ item.ticker }}</span>
          <span class="item-name" :title="item.name">— {{ item.name }}</span>
        </div>
        <span class="item-badge" :class="item.type.toLowerCase()">{{ item.type }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import marketDirectory from '@/assets/data/marketDirectory.json'

const emit = defineEmits(['selected'])

const searchQuery = ref('')
const searchMode = ref('ticker') // 'ticker' | 'name'
const isDropdownOpen = ref(false)
const filteredSuggestions = ref([])
const wrapperRef = ref(null)

// ⭐ Featured assets shown first / boosted in ranking
const FEATURED_TICKERS = new Set([
  'XAU/USD', 'BTC/USD', 'ETH/USD', 'SOL/USD',
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'SPCX', 'AMZN', 'GOOG', 'META', 'AMD', 'NKE', 'CRM', 'SOFI', 'UBER',
  'SPY', 'QQQ', 'VTI', 'GLD', 'USO', 'EWL', 'V', 'GS', 'JPM', 'BAC', 'NFLX', 'DIS', 'SPOT'
])

const allAssets = Object.entries(marketDirectory).map(([ticker, details]) => ({
  ticker,
  name: details?.name || ticker,
  type: details?.type || 'STOCK',
  featured: FEATURED_TICKERS.has(String(ticker).toUpperCase())
}))

const rankAsset = (asset, q, mode) => {
  const ticker = asset.ticker.toUpperCase()
  const name = asset.name.toUpperCase()

  // lower score = higher priority
  let score = 1000

  if (mode === 'ticker') {
    if (ticker === q) score = 0
    else if (ticker.startsWith(q)) score = 1
    else if (ticker.includes(q)) score = 2
    else return null
  } else {
    if (name === q) score = 0
    else if (name.startsWith(q)) score = 1
    else if (name.includes(q)) score = 2
    else if (ticker.startsWith(q)) score = 3 // fallback convenience
    else return null
  }

  // featured boost
  if (asset.featured) score -= 0.5

  return score
}

const changeMode = (mode) => {
  searchMode.value = mode
  handleSearchInput()
}

const showFeaturedDefault = () => {
  filteredSuggestions.value = allAssets
    .filter(a => a.featured)
    .sort((a, b) => a.ticker.localeCompare(b.ticker))
    .slice(0, 14)
}

const handleSearchInput = () => {
  const raw = searchQuery.value.trim()
  const q = raw.toUpperCase()

  if (!q) {
    showFeaturedDefault()
    return
  }

  const scored = []
  for (const asset of allAssets) {
    const score = rankAsset(asset, q, searchMode.value)
    if (score !== null) scored.push({ ...asset, _score: score })
  }

  scored.sort((a, b) => {
    if (a._score !== b._score) return a._score - b._score
    // tie-break: shorter ticker first, then alphabetic
    if (a.ticker.length !== b.ticker.length) return a.ticker.length - b.ticker.length
    return a.ticker.localeCompare(b.ticker)
  })

  filteredSuggestions.value = scored.slice(0, 20).map(({ _score, ...rest }) => rest)
}

const selectAsset = (item) => {
  searchQuery.value = `${item.ticker} — ${item.name}`
  isDropdownOpen.value = false
  emit('selected', item.ticker)
}

const clearInput = () => {
  searchQuery.value = ''
  filteredSuggestions.value = []
}

const clickOutsideTracker = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  showFeaturedDefault()
  window.addEventListener('click', clickOutsideTracker)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', clickOutsideTracker)
})

defineExpose({ clearInput })
</script>

<style scoped>
.autocomplete-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
}
.input-group-row {
  display: flex;
  width: 100%;
  border: 1px solid #dcdde1;
  border-radius: 6px;
  background: white;
  overflow: hidden;
}
.search-input {
  flex: 1;
  border: none;
  padding: 10px 14px;
  outline: none;
  font-size: 0.9rem;
}
.toggle-container {
  display: flex;
  background: #f1f2f6;
  border-left: 1px solid #dcdde1;
  padding: 2px;
}
.toggle-tab {
  border: none;
  background: transparent;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #747d8c;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}
.toggle-tab.active {
  background: white;
  color: #2c3e50;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Wide Dropdown Overlay Layer (100+ Character Layout) */
.autocomplete-dropdown.wide-layout {
  position: absolute;
  top: 100%;
  left: 0;
  width: 160%; /* Extends wider than input chassis for character space */
  max-width: 750px;
  background: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  margin-top: 6px;
  padding: 0;
  list-style: none;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}
@media (max-width: 768px) {
  .autocomplete-dropdown.wide-layout { width: 100%; }
}
.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #edf2f7;
}
.dropdown-item:hover { background: #f1f2f6; }
.item-main {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 15px;
}
.ticker-badge-prefix {
  background: #2c3e50;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
.item-name {
  color: #2f3542;
  font-weight: 500;
  font-size: 0.88rem;
}
.item-badge {
  font-size: 0.68rem;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 4px;
}
.item-badge.stock { background: #e2e8f0; color: #4a5568; }
.item-badge.crypto { background: #feebc8; color: #c05621; }
.item-badge.commodity { background: #e6fffa; color: #234e52; }
</style>