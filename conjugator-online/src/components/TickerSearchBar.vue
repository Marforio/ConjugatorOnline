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

const changeMode = (mode) => {
  searchMode.value = mode
  handleSearchInput()
}

const handleSearchInput = () => {
  const query = searchQuery.value.trim().toUpperCase()
  if (!query) {
    filteredSuggestions.value = []
    return
  }

  const results = []
  
  for (const [ticker, details] of Object.entries(marketDirectory)) {
    let isMatched = false
    
    if (searchMode.value === 'ticker') {
      isMatched = ticker.toUpperCase().includes(query)
    } else {
      isMatched = details.name.toUpperCase().includes(query)
    }
    
    if (isMatched) {
      results.push({
        ticker: ticker,
        name: details.name,
        type: details.type
      })
    }
    if (results.length >= 10) break
  }
  
  filteredSuggestions.value = results
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

onMounted(() => { window.addEventListener('click', clickOutsideTracker) })
onBeforeUnmount(() => { window.removeEventListener('click', clickOutsideTracker) })

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