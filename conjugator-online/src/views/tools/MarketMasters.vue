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
      <v-row>
        <v-col cols="12" md="5">
          <div class="m-3 mx-8">
            <h1>Market Masters 📈</h1>
            <p class="subtitle">Welcome back, trader! How good are you at investing?</p>
          </div>
        </v-col>
        <v-col cols="12" md="7">
          <div class="macro-index-box enhanced-macro-box">

            <div class="index-card" :class="getDirectionClass('QQQ')">
              <div class="index-meta">
                <div class="index-ticker">QQQ 🇺🇸</div>
                <span class="index-desc">NASDAQ Proxy</span>
              </div>
              <span class="index-value">${{ getLivePrice('QQQ') }}</span>
            </div>

            <div class="index-card" :class="getDirectionClass('XAU/USD')">
              <div class="index-meta">
                <div class="index-ticker">XAU/USD 🪙</div>
                <span class="index-desc">Gold Spot Price</span>
              </div>
              <span class="index-value">${{ getLivePrice('XAU/USD') }}</span>
            </div>

            <div class="index-card" :class="getDirectionClass('EWL')">
              <div class="index-meta">
                <div class="index-ticker">EWL 🇨🇭</div>
                <span class="index-desc">Swiss SIX Proxy</span>
              </div>
              <span class="index-value">${{ getLivePrice('EWL') }}</span>
            </div>

            <div class="index-card" :class="nyseClock.isOpen ? 'trend-up' : 'trend-neutral'">
              <div class="index-meta">
                <span class="status-dot" :class="{ 'is-open': nyseClock.isOpen }"></span>
                <span class="index-ticker ms-1">NYSE 🏛️</span>
                <span class="index-desc">Market Status</span>
              </div>
              <span class="index-value" style="font-size: 1rem;">
                {{ nyseClock.isOpen ? 'OPEN' : 'CLOSED' }}
              </span>
              <span class="clock-countdown-msg">{{ nyseClock.message }}</span>
            </div>

          </div>
        </v-col>

      </v-row>

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
        <v-menu 
          v-for="ticker in currentWatchlist" 
          :key="ticker"
          open-on-hover 
          :close-on-content-click="false" 
          location="top center" 
          transition="fade-transition"
          @update:model-value="(isOpen) => isOpen && handleLoadChartHistory(ticker)"
        >
          <template v-slot:activator="{ props }">
            <div class="watchlist-tile cursor-pointer" v-bind="props">
              
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

          <v-card width="340" class="pa-4 bg-slate-900 rounded-lg elevation-16 border border-slate-700" style="background: #0f172a; color: white;">
            <div class="vuetify-tooltip-content">
              <div class="tooltip-header d-flex justify-space-between align-center">
                <div>
                  <strong class="text-subtitle-2 font-weight-black">{{ getAssetName(ticker) }}</strong>
                  <span class="text-caption text-slate-400 ml-1">({{ ticker }})</span>
                </div>
              </div>

              <v-divider class="my-2 border-opacity-30" color="white"></v-divider>

              <div class="tooltip-body mb-3">
                <div class="d-flex justify-start align-center mb-2">
                  <span class="text-caption text-slate-400 font-weight-bold me-3">48h Performance: </span>
                  <span
                    class="text-subtitle-2 font-weight-black tracking-tight"
                    :class="getPerformanceColorClass(trendByTicker[ticker]?.performance_pct_48h)"
                  >
                    {{
                      trendByTicker[ticker]?.performance_pct_48h
                        ? trendByTicker[ticker].performance_pct_48h + '%'
                        : 'Insufficient 48h data - Please wait 48h for data to accumulate'
                    }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center text-caption text-slate-400 mb-1">
                  <span class="font-weight-medium">
                    Price since
                    {{
                      trendByTicker[ticker]?.history_since
                        ? new Date(trendByTicker[ticker].history_since).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                        : 'N/A'
                    }} :
                  </span>
                </div>

                <div class="relative-chart-wrapper rounded" style="position: relative; height: 110px; width: 100%;">
                  <div v-if="chartLoadingByTicker[ticker]" class="d-flex justify-center align-center h-100">
                    <v-progress-circular indeterminate color="sky-lighten-2" size="20"></v-progress-circular>
                  </div>

                  <div
                    v-else-if="!trendByTicker[ticker]?.prices?.length"
                    class="d-flex justify-center align-center h-100 text-slate-500 font-italic text-caption"
                  >
                    No historical data available.
                  </div>

                  <canvas
                    v-show="!chartLoadingByTicker[ticker] && trendByTicker[ticker]?.prices?.length"
                    :ref="el => { if (el) chartRefs[ticker] = el }"
                  ></canvas>
                </div>
              </div>
            </div>
          </v-card>
        </v-menu>
      </div>
      <p v-else class="empty-msg">Your watchlist is currently empty. Add assets above to monitor their performance.</p>
    </section>

<!-- 🧭 COMPACT DISCOVERY HUB -->
    <section class="watchlist-section mt-2">
      <div class="watchlist-header pb-2">
        <h2>Suggested Assets 💡</h2>
        <p class="empty-msg ma-0" style="font-size: 0.75rem;">Click the green plus (+) to quickly add assets to your watchlist</p>
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

      <v-row class="px-6">
        <v-col cols="12" lg="6">
          <v-card rounded="lg" elevation="2" class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-h6 font-weight-bold">Active Portfolios 💼</div>
                <v-btn size="small" color="primary" variant="tonal" @click="isCreateModalActive = true">Create New Portfolio</v-btn>
              </div>

              <div class="portfolios-list" v-if="portfolios.length > 0">
                <div v-for="portfolio in portfolios" :key="portfolio.id" class="portfolio-row" :class="portfolio.competition ? 'bg-warning-subtle' : 'bg-secondary-subtle'">
                  <div class="portfolio-meta">
                    <h3>{{ portfolio.name }}</h3>

                    <!-- compact status/icon row -->
                    <div class="d-flex align-center ga-1 mb-1">
                      <!-- Independent vs Competition -->
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-chip
                            v-bind="props"
                            size="x-small"
                            variant="tonal"
                            :color="!portfolio.competition ? 'indigo' : 'deep-purple'"
                            class="px-1"
                          >
                            <v-icon size="14">{{ !portfolio.competition ? 'mdi-account' : 'mdi-school' }}</v-icon>
                          </v-chip>
                        </template>
                        <span>{{ !portfolio.competition ? 'Independent Portfolio' : 'Teacher Competition Portfolio' }}</span>
                      </v-tooltip>

                      <!-- Static / Dynamic -->
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-chip
                            v-bind="props"
                            size="x-small"
                            variant="tonal"
                            :color="portfolio.portfolio_type === 'DYNAMIC' ? 'teal' : 'blue-grey'"
                            class="px-1"
                          >
                            <v-icon size="14">
                              {{ portfolio.portfolio_type === 'DYNAMIC' ? 'mdi-sync' : 'mdi-lock-outline' }}
                            </v-icon>
                          </v-chip>
                        </template>
                        <span>{{ portfolio.portfolio_type === 'DYNAMIC' ? 'Dynamic Mode' : 'Static Mode' }}</span>
                      </v-tooltip>

                      <!-- Trading status -->
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-chip
                            v-bind="props"
                            size="x-small"
                            variant="tonal"
                            :color="portfolio.trading_is_open ? 'success' : 'warning'"
                            class="px-1"
                          >
                            <v-icon size="14">
                              {{ portfolio.trading_is_open ? 'mdi-lightning-bolt' : 'mdi-lock' }}
                            </v-icon>
                          </v-chip>
                        </template>
                        <span>{{ portfolio.trading_is_open ? 'Trading Active' : 'Trading Locked' }}</span>
                      </v-tooltip>

                      <!-- Level -->
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-chip
                            v-bind="props"
                            size="x-small"
                            variant="tonal"
                            :color="portfolio.trading_level === 'ADVANCED' ? 'deep-orange' : 'green'"
                            class="px-1"
                          >
                            <v-icon size="14">
                              {{ portfolio.trading_level === 'ADVANCED' ? 'mdi-speedometer' : 'mdi-leaf' }}
                            </v-icon>
                          </v-chip>
                        </template>
                        <span>{{ portfolio.trading_level === 'ADVANCED' ? 'Advanced Level' : 'Basic Level' }}</span>
                      </v-tooltip>
                    </div>

                    <!-- always show timeline -->
                    <div class="text-caption text-slate-500 mt-1">
                      <span>🕒 Start: {{ formatDate(portfolio.start_time) || '—' }}</span>
                      <span class="mx-1">•</span>
                      <span v-if="portfolio.trade_cutoff_time">Cutoff: {{ formatDate(portfolio.trade_cutoff_time) }} • </span>
                      <span>End: {{ formatDate(portfolio.end_time) || '—' }}</span>
                    </div>
                  </div>

                  <div class="portfolio-stats">
                    <div class="mb-1">
                      <span class="label me-1">PnL</span>
                      <span
                        class="value"
                        :class="Number(portfolio.pnl_value || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'"
                      >
                        {{ Number(portfolio.pnl_value || 0) >= 0 ? '+' : '' }}${{
                          Math.abs(Number(portfolio.pnl_value || 0)).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }}
                        <span class="text-caption ms-1">
                          ({{ Number(portfolio.pnl_pct || 0) >= 0 ? '+' : '' }}{{ Number(portfolio.pnl_pct || 0).toFixed(0) }}%)
                        </span>
                      </span>
                    </div>

                    <div>
                      <span class="label">Cash</span>
                      <span class="value">
                        ${{ Number(portfolio.cash_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 0 }) }}
                      </span>
                    </div>
                  </div>

                  <div class="portfolio-actions d-flex align-center ga-1">
                    <!-- delete only if independent -->
                    <v-btn
                      v-if="!portfolio.competition"
                      color="red"
                      variant="tonal"
                      size="x-small"
                      class="font-weight-bold mt-2 me-4"
                      icon="mdi-trash-can"
                      @click="promptDeletePortfolio(portfolio)"
                    >
                    </v-btn>
                    <button class="btn btn-primary" @click="inspectPortfolio(portfolio.id)">View</button>
                  </div>
                </div>
              </div>

            <div v-else class="empty-state"><p>You haven't initialized an investment portfolio yet.</p></div>
        </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card rounded="lg" elevation="2" class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-h6 font-weight-bold">Competition Standings 🏆</div>
              <v-chip size="x-small" color="indigo" variant="tonal">
                {{ activeCompetitionStandings.length }} Competitions
              </v-chip>
            </div>

            <div v-if="activeCompetitionStandings.length === 0" class="text-medium-emphasis text-body-2">
              You are not currently participating in a competition.
            </div>

            <v-expansion-panels v-else variant="accordion">
              <v-expansion-panel
                v-for="comp in activeCompetitionStandings"
                :key="comp.competition.id"
                rounded="lg"
              >
                <v-expansion-panel-title>
                  <div class="d-flex w-100 align-center justify-space-between">
                    <div>
                      <div class="font-weight-bold">{{ comp.competition.name }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatDate(comp.competition.start_time) }} → {{ formatDate(comp.competition.end_time) }}
                      </div>
                    </div>
                    <v-chip
                      size="x-small"
                      :color="comp.competition.trading_is_open ? 'success' : 'warning'"
                      variant="tonal"
                    >
                      {{ comp.competition.trading_is_open ? 'Trading Open' : 'Trading Closed' }}
                    </v-chip>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-alert
                    v-if="comp.my_position"
                    density="compact"
                    variant="tonal"
                    color="primary"
                    class="mb-2"
                  >
                    Your Rank: <strong>#{{ comp.my_position.rank }}</strong>
                    • PnL:
                    <strong :class="comp.my_position.pnl_value >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                      {{ comp.my_position.pnl_value >= 0 ? '+' : '' }}${{ Math.abs(comp.my_position.pnl_value).toFixed(2) }}
                      ({{ comp.my_position.pnl_pct >= 0 ? '+' : '' }}{{ comp.my_position.pnl_pct.toFixed(2) }}%)
                    </strong>
                  </v-alert>

                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Portfolio</th>
                        <th class="text-right">Net Equity</th>
                        <th class="text-right">PnL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in comp.standings"
                        :key="row.portfolio_id"
                        :class="row.is_me ? 'bg-blue-lighten-5' : ''"
                      >
                        <td class="font-weight-bold">#{{ row.rank }}</td>
                        <td>{{ row.student_name }}</td>
                        <td>{{ row.portfolio_name }}</td>
                        <td class="text-right">${{ Number(row.net_equity).toLocaleString() }}</td>
                        <td
                          class="text-right font-weight-bold"
                          :class="row.pnl_value >= 0 ? 'text-emerald-600' : 'text-rose-600'"
                        >
                          {{ row.pnl_value >= 0 ? '+' : '' }}${{ Math.abs(Number(row.pnl_value)).toFixed(2) }}
                          <span class="text-caption">({{ row.pnl_pct >= 0 ? '+' : '' }}{{ Number(row.pnl_pct).toFixed(2) }}%)</span>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
    
    <div v-if="isCreateModalActive" class="dialog-overlay" @click.self="isCreateModalActive = false">
      <div class="dialog-box upgraded scrollable-dialog">
        <div class="dialog-header">
          <h2>Create Your Personal Trading Portfolio</h2>
          <button class="close-x" @click="isCreateModalActive = false">&times;</button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>Portfolio Name</label>
            <input
              type="text"
              v-model="newPortfolioForm.name"
              placeholder="e.g., Up Only"
              class="form-control"
            />
            <label>This portfolio is independent from teacher competitions.</label>
          </div>

          <div class="form-group">
            <label>Starting Capital</label>
            <input
              type="text"
              :value="uiCustomBudget"
              @input="onBudgetInput"
              @blur="onBudgetBlur"
              inputmode="decimal"
              placeholder="Default: 100'000"
              class="form-control"
            />
            <span class="input-hint">Define your starting capital</span>
          </div>

          <!-- NEW: Trading level -->
          <div class="form-group">
            <label>Trading Level</label>
            <div class="radio-group-box">
              <label class="radio-label">
                <input type="radio" value="BASIC" v-model="newPortfolioForm.trading_level" />
                <span class="ms-2"><strong>Basic:</strong> BUY / SELL only</span>
              </label>
              <label class="radio-label">
                <input type="radio" value="ADVANCED" v-model="newPortfolioForm.trading_level" />
                <span class="ms-2"><strong>Advanced:</strong> BUY / SELL / SHORT / COVER</span>
              </label>
            </div>
          </div>

          <div class="form-group" v-if="newPortfolioForm.trading_level === 'ADVANCED'">
            <label>Max Leverage</label>
            <input
              type="number"
              v-model.number="newPortfolioForm.leverage_setting"
              min="1"
              max="5"
              step="1"
              class="form-control"
              style="width: 80px;"
            />
            <span class="input-hint">Allowed range: 1x to 5x</span>
          </div>

          <!-- Portfolio mode -->
          <div class="form-group">
            <label>Portfolio Mode</label>
            <div class="radio-group-box">
              <label class="radio-label">
                <input type="radio" value="DYNAMIC" v-model="newPortfolioForm.portfolio_type" />
                <span class="ms-2"><strong>Dynamic:</strong> Trading allowed until close date</span>
              </label>
              <label class="radio-label">
                <input type="radio" value="STATIC" v-model="newPortfolioForm.portfolio_type" />
                <span class="ms-2"><strong>Static:</strong> Trading locks at cutoff date</span>
              </label>
            </div>
          </div>

          <!-- NEW: timeline -->
          <div class="form-group">
            <label>Start Time</label>
            <input type="datetime-local" v-model="newPortfolioForm.start_time" class="form-control" />
          </div>

          <div class="form-group" v-if="newPortfolioForm.portfolio_type === 'STATIC'">
            <label>Trade Cutoff Time (Static only)</label>
            <input type="datetime-local" v-model="newPortfolioForm.trade_cutoff_time" class="form-control" />
            <span class="input-hint">Trading locks after this timestamp</span>
          </div>

          <div class="form-group">
            <label>End Time (Competition/Portfolio Close)</label>
            <input type="datetime-local" v-model="newPortfolioForm.end_time" class="form-control" />
          </div>

          <button class="btn btn-secondary full-width margin-top" @click="submitNewPortfolio" :disabled="isActionProcessing">
            {{ isActionProcessing ? 'Creating...' : 'Create Portfolio' }}
          </button>
        </div>
      </div>
    </div>


    <v-dialog v-model="portfolioDialog.isOpen" fullscreen transition="dialog-bottom-transition">
      <v-card color="grey-lighten-4" class="d-flex flex-column h-screen">
        
        <v-toolbar color="slate-900" dark class="px-4" density="compact" flat style="background: #0f172a; color: white;">
          <v-toolbar-title class="text-subtitle-1 font-weight-black tracking-wide">
            PORTFOLIO TERMINAL — {{ selectedPortfolio?.name || `PORTFOLIO ${selectedPortfolio?.id || ''}` }}

            <span class="text-body-2" style="margin-left: 8%;">Ends {{ formatDate(portfolioMeta.endTime) }}</span>
            
            <v-chip size="x-small" class="ms-4" :color="portfolioMeta.tradingIsOpen ? 'success' : 'warning'" variant="tonal">
              <template v-if="portfolioMeta.cutoffTime">
                {{ portfolioMeta.tradingIsOpen ? 'Trading Open until ' + formatDate(portfolioMeta.cutoffTime) : 'Trading Closed on ' + formatDate(portfolioMeta.endTime) }}
              </template>
              <template v-else>
                {{ portfolioMeta.tradingIsOpen ? 'Trading Open' : 'Trading Closed' }}
              </template>
            </v-chip>
          </v-toolbar-title>
          
          <v-btn icon variant="text" @click="portfolioDialog.isOpen = false">×</v-btn>
        </v-toolbar>

        <v-row no-gutters class="flex-grow-1 dialog-content-row">
          
          <v-col cols="12" lg="5" class="bg-white pa-4 pa-lg-6 dialog-col-left border-e">
            <div class="d-flex justify-between align-center mb-2">
              <h2 class="text-h6 font-weight-bold text-slate-800">Order Entry</h2>
              <v-btn variant="text" color="secondary" size="small" class="font-weight-bold" @click="clearOrderFields">
                Clear Fields
              </v-btn>
              <v-btn variant="tonal" color="primary" size="small" class="font-weight-bold ml-2" @click="isRulesDialogOpen = true">
                Rules
              </v-btn>
            </div>

            <p class="text-caption text-slate-500 mb-6">
              Fees: <strong>$10.00 per transaction</strong> | Frequency Cap: <strong>2 trades/min</strong>, <strong>30 trades/day</strong>.
            </p>

            <v-tabs v-model="tradeForm.action" color="primary" class="mb-4 border-b" grow density="compact">
              <v-tab value="BUY">📈 BUY</v-tab>
              <v-tab value="SELL">📉 SELL</v-tab>
              <v-tab v-if="canUseAdvancedActions" value="SHORT">🐻 SHORT SELL</v-tab>
              <v-tab v-if="canUseAdvancedActions" value="COVER">🛡️ BUY TO COVER</v-tab>
            </v-tabs>

            <v-alert
              v-if="isTradingLocked"
              type="warning"
              variant="tonal"
              class="mb-4"
              icon="mdi-lock"
            >
              Trading is locked for this portfolio.
              <span v-if="portfolioMeta.cutoffTime">
                Cutoff was {{ new Date(portfolioMeta.cutoffTime).toLocaleString() }}.
              </span>
            </v-alert>

            <v-form ref="tradeFormRef" @submit.prevent="submitOrder">
              <v-row class="mb-2">
                <v-col cols="8">
                  <div class="text-caption text-slate-600 mb-1 font-weight-bold">Search Asset</div>

                  <div v-show="['SELL','COVER'].includes(tradeForm.action)">
                    <v-select
                      v-model="tradeForm.ticker"
                      :items="tradeForm.action === 'SELL' ? longPositions : shortPositions"
                      item-title="ticker"
                      item-value="ticker"
                      :placeholder="tradeForm.action === 'SELL' ? 'Select a LONG position' : 'Select a SHORT position to cover'"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      @update:model-value="clearQuantityField"
                    >
                      <template #item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :title="item.raw.ticker"
                          :subtitle="tradeForm.action === 'SELL'
                            ? `LONG | Qty: ${parseFloat(item.raw.quantity).toFixed(4)} | Entry: $${parseFloat(item.raw.average_buy_price).toFixed(2)}`
                            : `SHORT | Qty: ${parseFloat(item.raw.quantity).toFixed(4)} | Avg Short: $${parseFloat(item.raw.average_buy_price).toFixed(2)}`"
                        />
                      </template>
                    </v-select>
                  </div>

                  <div v-show="!['SELL','COVER'].includes(tradeForm.action)">
                    <TickerSearchBar ref="watchlistSearchRef" @selected="handleTerminalAssetSelection" />
                  </div>

                  <div v-if="tradeForm.ticker" class="text-caption text-primary mt-1 font-weight-bold">
                    Active Target: {{ tradeForm.ticker }}
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="d-flex align-center text-caption text-slate-600 mb-1 font-weight-bold">
                    Execution Class
                    <v-tooltip location="top" max-width="320">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" size="16" class="ml-1">mdi-help-circle-outline</v-icon>
                      </template>
                      <span>
                        MARKET executes immediately at live price. LIMIT waits until your target price is reached.
                      </span>
                    </v-tooltip>
                  </div>
                  <v-select
                    v-model="tradeForm.orderType"
                    :items="['MARKET', 'LIMIT']"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    max-width="150"
                  />
                </v-col>
              </v-row>

              <v-row class="mb-2">
                <v-col cols="6">
                  <v-text-field
                    v-model.number="tradeForm.quantity"
                    :label="quantityLabel"
                    type="number"
                    step="any"
                    min="0.000001"
                    variant="outlined"
                    density="comfortable"
                    :hint="tradeForm.action === 'SELL'
                      ? `Max available: ${maxAllowedQuantity.toFixed(4)}`
                      : tradeForm.action === 'COVER'
                        ? `Max short available to cover: ${maxAllowedQuantity.toFixed(4)}`
                        : ''"
                    persistent-hint
                    :rules="[
                      v => !!v && v > 0 || 'Quantity must be positive.',
                      v => !['SELL','COVER'].includes(tradeForm.action) || v <= maxAllowedQuantity || (
                        tradeForm.action === 'SELL'
                          ? 'Exceeds maximum shares owned.'
                          : 'Exceeds maximum short quantity available to cover.'
                      )
                    ]"
                  />
                </v-col>

                <v-col cols="6">
                  <div class="d-flex align-center">
                    <v-text-field
                      v-model.number="tradeForm.targetPrice"
                      :label="targetPriceLabel"
                      type="number"
                      step="0.01"
                      variant="outlined"
                      density="comfortable"
                      :disabled="tradeForm.orderType === 'MARKET'"
                      :rules="tradeForm.orderType === 'LIMIT' ? [v => !!v && v > 0 || 'Limit price is required.'] : []"
                    />
                    <v-tooltip v-if="tradeForm.orderType === 'LIMIT'" location="top" max-width="320">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" size="16" class="ml-2 mt-n4">mdi-help-circle-outline</v-icon>
                      </template>
                      <span>
                        LIMIT target price controls when the order can execute.
                      </span>
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
              <v-expand-transition>
                <div v-if="tradeForm.action === 'BUY' && canUseAdvancedActions && selectedPortfolio.leverage_setting !== 1" class="mb-4">
                  <v-alert type="info" variant="tonal" icon="mdi-finance" class="text-caption">
                    <div class="d-flex justify-space-between flex-wrap ga-2">
                      <span><strong>Cash:</strong> ${{ Number(selectedPortfolio?.cash_balance || 0).toFixed(2) }}</span>
                      <span><strong>Leverage:</strong> {{ selectedPortfolio?.leverage_setting || 1 }}x</span>
                      <span><strong>Buying Power:</strong> ${{ buyPowerDisplay.toFixed(0) }}</span>
                      <span><strong>Borrow Limit:</strong> ${{ Number(maxBorrowLimit || 0).toFixed(0) }}</span>
                      <span><strong>Post-Order Headroom:</strong> ${{ buyHeadroomDisplay.toFixed(0) }}</span>
                    </div>
                    <div class="mt-2">
                      <strong>Live Margin Health:</strong>
                      <span :class="healthStatusColor"> {{ (liveMarginRatio * 100).toFixed(1) }}% </span>
                    </div>
                    <v-progress-linear
                      :model-value="liveMarginRatio * 100"
                      :color="healthBarColor"
                      height="8"
                      rounded
                      class="mt-1"
                    />
                  </v-alert>
                </div>
              </v-expand-transition>

              <!-- NEW: Advanced controls for SHORT -->
              <v-expand-transition>
                <div v-if="tradeForm.action === 'SHORT' && !selectedPortfolio.leverage_setting === 1">
                  <v-row class="mb-2">
                    <v-col cols="12" md="6">
                      <div class="d-flex align-center text-caption text-slate-600 mb-2 font-weight-bold">
                        Desired Leverage (x)
                        <v-tooltip location="top" max-width="340">
                          <template #activator="{ props }">
                            <v-icon v-bind="props" size="16" class="ml-1">mdi-help-circle-outline</v-icon>
                          </template>
                          <span>
                            Leverage is like a magic booster. With 3x leverage, your $1 acts like $3 when you make a trade.
                          </span>
                        </v-tooltip>
                      </div>

                      <v-slider
                        v-model="tradeForm.requestedLeverage"
                        :min="1"
                        :max="selectedPortfolio?.leverage_setting || 1"
                        step="1"
                        thumb-label="always"
                        color="primary"
                        hide-details
                      />

                      <div class="text-caption text-slate-500 mt-1">
                        Portfolio max: {{ selectedPortfolio?.leverage_setting || 1 }}x
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="d-flex align-center text-caption text-slate-600 mb-1 font-weight-bold">
                        Stop-Loss Price (Optional)
                        <v-tooltip location="top" max-width="360">
                          <template #activator="{ props }">
                            <v-icon v-bind="props" size="16" class="ml-1">mdi-help-circle-outline</v-icon>
                          </template>
                          <span>
                            For SHORT positions, stop-loss is a safety threshold above entry.
                            If market price rises to this level, risk controls can force close to limit losses.
                          </span>
                        </v-tooltip>
                      </div>

                      <v-text-field
                        v-model.number="tradeForm.stopLossPrice"
                        type="number"
                        step="0.01"
                        min="0.01"
                        variant="outlined"
                        density="comfortable"
                        placeholder="e.g. 145.00"
                        :rules="[
                          v => v === null || v === '' || Number(v) > 0 || 'Stop-loss must be positive.'
                        ]"
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>

              <!-- NEW: explanatory hint for COVER -->
              <v-expand-transition>
                <div v-if="tradeForm.action === 'COVER'" class="mb-3">
                  <v-alert type="info" variant="tonal" density="comfortable" icon="mdi-shield-check-outline">
                    BUY TO COVER reduces or closes an existing short position.
                  </v-alert>
                </div>
              </v-expand-transition>

              <v-expand-transition>
                <div
                  v-if="tradeForm.ticker && !marketPrices.some(p => p.ticker.toUpperCase() === tradeForm.ticker.toUpperCase())"
                  class="mb-4"
                >
                  <v-alert type="amber" variant="tonal" density="compact" icon="mdi-cloud-search-outline" class="text-caption">
                    ✨ <strong>Uncached Asset:</strong> Price will be verified from live market feeds when you press Submit.
                  </v-alert>
                </div>
              </v-expand-transition>

              <v-card variant="flat" color="grey-lighten-4" class="pa-4 mb-4 border">
                <h3 class="text-caption font-weight-bold text-slate-600 mb-2 uppercase tracking-wider">
                  {{ tradeForm.action === 'SELL' ? 'Fees' : 'Cost Summary' }}
                </h3>

                <div class="d-flex justify-space-between text-subtitle-2 mb-1">
                  <span>Recovered Principal:</span>
                  <span class="font-weight-bold">${{ (computedGrossPrincipal || 0).toFixed(2) }}</span>
                </div>

                <div class="d-flex justify-space-between text-subtitle-2 mb-1">
                  <span>Processing Fee:</span>
                  <span :class="tradeForm.action === 'SELL' ? 'text-rose-600 font-weight-bold' : 'text-amber-700 font-weight-bold'">
                    {{ tradeForm.action === 'SELL' ? '-' : '+' }}$10.00
                  </span>
                </div>

                <v-divider class="my-2" />

                <div class="d-flex justify-space-between text-subtitle-1 mb-2">
                  <span class="font-weight-bold text-slate-700">
                    {{ tradeForm.action === 'SELL' ? 'Net Cash Recovered:' : 'Total Order Impact:' }}
                  </span>
                  <span :class="tradeForm.action === 'SELL' ? 'text-emerald-600 font-weight-black' : 'text-primary font-weight-black'">
                    {{ tradeForm.action === 'SELL' ? '+' : '' }}${{ (computedTotalImpact || 0).toFixed(2) }}
                  </span>
                </div>

                <v-expand-transition>
                  <div v-if="tradeForm.action === 'SELL' && computedTotalImpact > 0" class="mt-2 pt-2 border-t border-slate-300">
                    <v-alert type="success" variant="tonal" density="compact" icon="mdi-cash-plus" class="text-caption pa-2 ma-0">
                      On execution, the fee will be subtracted from your asset sale value. <strong>${{ computedTotalImpact.toFixed(2) }}</strong> will be added back into your capital balance.
                    </v-alert>
                  </div>
                </v-expand-transition>

                <v-expand-transition>
                  <div v-if="marginLoanRequired > 0" class="mt-2 pt-2 border-t border-dashed border-slate-300">
                    <div class="d-flex justify-space-between text-caption text-rose-600 font-weight-bold mb-1">
                      <span>⚠️ Requires Margin Financing:</span>
                      <span>+${{ marginLoanRequired.toFixed(2) }}</span>
                    </div>
                    <div class="text-caption text-slate-500 line-height-1">
                      This order exceeds your liquid cash. The balance will be handled via broker debt using your portfolio's
                      <strong>{{ selectedPortfolio?.leverage_setting }}x leverage tier</strong>.
                    </div>
                  </div>
                </v-expand-transition>
              </v-card>

              <v-btn
                type="submit"
                :disabled="isTradingLocked"
                :color="tradeForm.action === 'SELL' ? 'emerald' : 'primary'"
                block
                size="large"
                class="font-weight-bold"
                :loading="isTradeProcessing"
              >
                {{ isTradingLocked ? 'Trading Locked' : (tradeForm.action === 'SELL' ? 'Liquidate Asset' : 'Submit Order') }}
              </v-btn>
            </v-form>
          </v-col>

          <v-col cols="12" lg="7" class="pa-4 pa-lg-6 dialog-col-right">
            <v-card variant="outlined" class="bg-white mb-4 rounded-lg pa-3">
              <div class="d-flex justify-space-between align-center mb-2">
                <h3 class="text-subtitle-2 font-weight-bold text-slate-700">📊 Portfolio Visualizations</h3>
                <v-chip size="x-small" color="indigo" variant="flat">Learning Mode</v-chip>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-caption font-weight-bold mb-1">Asset Allocation</div>
                  <div style="height:180px;"><canvas ref="allocationChartRef"></canvas></div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-caption font-weight-bold mb-1">Cash vs Invested</div>
                  <div style="height:180px;"><canvas ref="cashVsAssetsChartRef"></canvas></div>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <div class="text-caption font-weight-bold mb-1">Asset Contribution (Estimated)</div>
                  <div style="height:220px;"><canvas ref="contribChartRef"></canvas></div>
                </v-col>
              </v-row>
            </v-card>

          <!-- PERFORMANCE CARD (place above your existing available capital card) -->
          <v-card
            variant="flat"
            class="mb-4 pa-4 text-white rounded-lg"
            :style="{ background: performanceCardBg }"
          >
            <v-row no-gutters align="center">
              <v-col cols="8">
                <div class="text-overline font-weight-bold opacity-80 tracking-wide">Portfolio Performance</div>
                <div class="text-h4 font-weight-black">
                  {{ performancePctText }}
                </div>
                <div class="text-caption opacity-90 mt-1">
                  Since initialization
                </div>
              </v-col>

              <v-col cols="4" class="text-right">
                <v-chip
                  :color="performancePct >= 0 ? 'emerald-lighten-4' : 'red-lighten-4'"
                  variant="tonal"
                  size="small"
                  class="font-weight-bold"
                >
                  {{ performancePct >= 0 ? '📈 Gain' : '📉 Loss' }}
                </v-chip>
                <div class="text-caption mt-1">
                  {{ performanceValueText }}
                </div>
              </v-col>
            </v-row>
          </v-card>

            <v-card 
              v-if="!canUseAdvancedActions"
              variant="flat" 
              color="teal-darken-4" 
              dark 
              class="mb-6 pa-4 text-white rounded-lg"
            >
              <v-row no-gutters align="center">
                <v-col cols="7">
                  <div class="text-overline font-weight-bold opacity-70 tracking-wide">Available Cash Capital</div>
                  <div class="text-h4 font-weight-black text-emerald-accent-2">
                    ${{ parseFloat(selectedPortfolio?.cash_balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                  </div>
                </v-col>
                <v-col cols="5" class="text-right">
                  <v-chip color="emerald-lighten-4" variant="tonal" size="small" class="font-weight-bold text-uppercase">
                    🟢 Cash Account
                  </v-chip>
                  <div class="text-caption text-teal-lighten-3 mt-1 font-italic" style="font-size: 0.7rem;">
                    Leverage & Shorting Disabled
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <v-card 
              v-else
              variant="flat" 
              color="slate-900" 
              dark 
              class="mb-6 pa-4 text-white rounded-lg"
              style="background: #0f172a;"
            >
              <v-row no-gutters>
                <v-col cols="6">
                  <div class="text-overline font-weight-bold opacity-70 tracking-wide">Liquid Cash</div>
                  <div class="text-h4 font-weight-black text-emerald-accent-3">
                    ${{ parseFloat(selectedPortfolio?.cash_balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                  </div>
                </v-col>
                <v-col cols="6" class="text-right">
                  <div class="text-overline font-weight-bold opacity-70 tracking-wide">Total Buying Power</div>
                  <div class="text-h5 font-weight-bold text-blue-lighten-3">
                    ${{ maxPurchasingPower.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-3 border-opacity-30" color="white"></v-divider>

              <v-row no-gutters class="text-caption mb-3">
                <v-col cols="6">
                  <span>Active Margin Debt:</span>
                  <span class="font-weight-black ml-1 text-orange-lighten-3">
                    ${{ parseFloat(selectedPortfolio?.borrowed_funds_balance || 0).toFixed(2) }}
                  </span>
                </v-col>
                <v-col cols="6" class="text-right">
                  <span>Max Available Credit:</span>
                  <span class="font-weight-bold ml-1">${{ maxBorrowLimit.toFixed(2) }}</span>
                </v-col>
              </v-row>

              <div class="mb-1 d-flex justify-space-between text-caption font-weight-bold">
                <span class="d-flex align-center gap-1">
                  ⚠️ Account Health Capacity
                </span>
                <span :class="healthStatusColor">{{ (liveMarginRatio * 100).toFixed(1) }}% Ratio</span>
              </div>
              
              <v-progress-linear
                :model-value="liveMarginRatio * 100"
                :color="healthBarColor"
                height="8"
                rounded
                striped
                :max="100"
              ></v-progress-linear>
              
              <div class="d-flex justify-space-between text-slate-400 mt-1" style="font-size: 0.65rem;">
                <span class="text-rose-400 font-weight-bold">10% Forced Liquidation Drop Limit</span>
                <span>100% Fully Collateralized</span>
              </div>
            </v-card>

            <h3 class="text-subtitle-2 font-weight-bold text-slate-700 mb-2">📦 Open Positions</h3>
            <div v-if="selectedPortfolio?.assets?.length">
              <v-card
                v-for="holding in selectedPortfolio.assets"
                :key="`${holding.ticker}-${holding.position_type}`"
                class="pa-4 mb-3 rounded-lg border"
                variant="flat"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="font-weight-black">{{ holding.ticker }}</div>
                    <div class="text-caption text-slate-500">{{ holding.position_type }} · Qty {{ Number(holding.quantity).toFixed(1) }}</div>
                  </div>
                  <v-chip size="x-small" :color="holding.position_type === 'SHORT' ? 'deep-orange' : 'indigo'" variant="flat">
                    {{ holding.position_type }}
                  </v-chip>
                </div>

                <v-row class="mt-2">
                  <v-col cols="6" class="py-1 text-caption">Avg Entry: <strong>${{ Number(holding.average_buy_price).toFixed(2) }}</strong></v-col>
                  <v-col cols="6" class="py-1 text-caption text-right">Live: <strong>${{ getAssetLivePrice(holding.ticker).toFixed(2) }}</strong></v-col>
                  <v-col cols="6" class="py-1 text-caption">Mkt Value: <strong>${{ getHoldingMarketValue(holding).toFixed(2) }}</strong></v-col>
                  <v-col cols="6" class="py-1 text-caption text-right">
                    P&L:
                    <strong :class="getHoldingPnL(holding) >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                      {{ getHoldingPnL(holding) >= 0 ? '+' : '' }}${{ getHoldingPnL(holding).toFixed(2) }}
                      ({{ getHoldingPnLPct(holding) >= 0 ? '+' : '' }}{{ getHoldingPnLPct(holding).toFixed(2) }}%)
                    </strong>
                  </v-col>
                </v-row>

                <div class="text-caption mt-2">
                  48h:
                  <strong :class="Number(trendByTicker[holding.ticker]?.performance_pct_48h || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                    {{ trendByTicker[holding.ticker]?.performance_pct_48h ?? 'N/A' }}<span v-if="trendByTicker[holding.ticker]?.performance_pct_48h">%</span>
                  </strong>
                </div>
              </v-card>
            </div>

            <div class="d-flex justify-space-between align-center mb-2 mt-4">
              <h3 class="text-subtitle-2 font-weight-bold text-slate-700">⏳ Pending or Limit Orders</h3>
              <v-chip size="x-small" color="amber-darken-3" variant="flat" class="font-weight-bold">
                {{ selectedPortfolio?.open_orders?.length || 0 }} Orders Pending
              </v-chip>
            </div>

            <v-card variant="outlined" class="bg-white mb-6 rounded-lg">
              <v-table density="comfortable" class="text-caption">
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th class="font-weight-bold text-left">Ticker</th>
                    <th class="font-weight-bold text-left">Class</th>
                    <th class="font-weight-bold text-center">Units</th>
                    <th class="font-weight-bold text-center">Target Price</th>
                    <th class="font-weight-bold text-right">Live Price</th>
                    <th class="font-weight-bold text-center">Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in selectedPortfolio?.open_orders" :key="order.id" class="align-center">
                    <td class="font-weight-black text-slate-800">{{ order.ticker }}</td>
                    <td>
                      <v-chip size="x-small" :color="['BUY', 'COVER'].includes(order.transaction_type) ? 'emerald' : 'rose'" variant="flat">
                        LIMIT {{ order.transaction_type }}
                      </v-chip>
                    </td>
                    <td class="text-center">{{ parseFloat(order.quantity).toFixed(4) }}</td>
                    <td class="text-center font-weight-bold text-amber-800" v-if="order.target_price !== null">${{ parseFloat(order.target_price).toFixed(2) }}</td>
                    <td class="text-center font-weight-bold text-amber-800" v-else>—</td>
                    <td class="text-right font-weight-bold">${{ getLivePrice(order.ticker) }}</td>
                    <td class="text-center">
                      <v-btn 
                        variant="text" 
                        color="rose-darken-2" 
                        icon="mdi-close-circle-outline" 
                        density="compact"
                        class="font-weight-black"
                        style="font-size: 1.15rem; line-height: 1;"
                        @click="killWorkingOrder(order.id)"
                      >
                        ×
                      </v-btn>
                    </td>
                  </tr>
                  <tr v-if="!selectedPortfolio?.open_orders?.length">
                    <td colspan="6" class="text-center text-slate-400 py-4 font-italic">
                      No limit orders in your portfolio.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <h3 class="text-subtitle-2 font-weight-bold text-slate-700 mb-2">📜 Transaction History</h3>
            <v-card variant="outlined" class="bg-white">
              <v-table density="compact" class="text-caption">
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th class="font-weight-bold">Execution Date</th>
                    <th class="font-weight-bold">Asset</th>
                    <th class="font-weight-bold">Action</th>
                    <th class="font-weight-bold">Units</th>
                    <th class="font-weight-bold text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tx in selectedPortfolio?.transactions" :key="tx.id">
                    <td class="text-slate-400" style="font-size: 0.68rem;">{{ new Date(tx.timestamp).toLocaleString() }}</td>
                    <td class="font-weight-bold">{{ tx.ticker }}</td>
                    <td>
                      <v-chip size="x-small" :color="['BUY', 'COVER'].includes(tx.transaction_type) ? 'emerald' : 'rose'" variant="flat">
                        {{ tx.transaction_type }}
                      </v-chip>
                    </td>
                    <td>{{ parseFloat(tx.quantity).toFixed(2) }}</td>
                    <td class="text-right font-weight-bold">${{ parseFloat(tx.price_per_unit).toFixed(2) }}</td>
                  </tr>
                  <tr v-if="!selectedPortfolio?.transactions?.length">
                    <td colspan="5" class="text-center text-slate-400 py-4">No recent trade operations completed.</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
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

  <v-dialog v-model="isQuoteModalActive" max-width="520">
    <v-card class="pa-4 rounded-lg">
      <h3 class="text-h6 font-weight-bold mb-3">Confirm Order</h3>

      <div v-if="quoteData">
        <div><strong>{{ quoteData.order_type }}</strong> {{ quoteData.trade_type }} {{ quoteData.quantity }} {{ quoteData.ticker }}</div>
        <div>Live Price: ${{ quoteData.live_price.toFixed(4) }}</div>
        <div>Gross: ${{ quoteData.gross_principal.toFixed(2) }}</div>
        <div>Fee: ${{ quoteData.tx_fee.toFixed(2) }}</div>
        <div class="mt-2"><strong>Estimated Impact: ${{ quoteData.total_impact.toFixed(2) }}</strong></div>
      </div>

      <div class="d-flex justify-end mt-4">
        <v-btn variant="text" @click="cancelQuoteConfirmation">Cancel</v-btn>
        <v-btn color="primary" :loading="isTradeProcessing" @click="confirmAndRouteOrder">
          Confirm & Submit
        </v-btn>
      </div>
    </v-card>
  </v-dialog>

    <v-dialog v-model="deleteDialog.active" max-width="460">
    <v-card class="pa-4 rounded-lg">
      <h3 class="text-h6 font-weight-bold mb-2">Delete Portfolio?</h3>
      <p class="text-body-2 mb-4">
        This action cannot be undone.
        <br />
        <strong>{{ deleteDialog.target?.name }}</strong> will be permanently removed.
      </p>

      <div class="d-flex justify-end ga-2">
        <v-btn variant="text" @click="deleteDialog.active = false">Cancel</v-btn>
        <v-btn color="error" :loading="deleteDialog.loading" @click="confirmDeletePortfolio">
          Delete
        </v-btn>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isRulesDialogOpen" max-width="760">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">Market Masters — Leverage & Liquidation Rules</v-card-title>
    <v-card-text class="text-body-2">
      <ul class="pl-4">
        <li>You can place normal BUY/SELL trades using available cash.</li>
        <li>Leverage is enabled only in ADVANCED portfolios (leverage &gt; 1x).</li>
        <li>SHORT and BUY TO COVER are disabled in BASIC mode.</li>
        <li>Every trade has a $10 transaction fee.</li>
        <li>Net Equity = Cash + Long Value − Short Value − Borrowed Funds.</li>
        <li>Gross Exposure = Long Value + Short Value.</li>
        <li>Margin Ratio = Net Equity / Gross Exposure.</li>
        <li><strong>Forced liquidation triggers when Margin Ratio &lt; 10% (0.10).</strong></li>
        <li>Liquidation closes positions immediately; in this simulation it is effectively game over for that portfolio.</li>
      </ul>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" variant="flat" @click="isRulesDialogOpen = false">Got it</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import api from "@/axios"
import TickerSearchBar from "@/components/TickerSearchBar.vue"
import marketDirectory from '@/assets/data/marketDirectory.json'
import Chart from 'chart.js/auto'

const studentInitials = ref('')
const portfolios = ref([])
const currentWatchlist = ref([])
const marketPrices = ref([])

const watchlistSearchRef = ref(null)
const watchlistSelectedTicker = ref('')
const isActionProcessing = ref(false)
const isCreateModalActive = ref(false)

const isQuoteModalActive = ref(false)
const quoteData = ref(null)

const portfolioDialog = ref({ isOpen: false })
const selectedPortfolio = ref(null)
const isTradeProcessing = ref(false)
const tradeFormRef = ref(null)

// --- Portfolio visualization charts ---
const allocationChartRef = ref(null)
const cashVsAssetsChartRef = ref(null)
const contribChartRef = ref(null)

const activeCompetitionStandings = ref([])

const portfolioPnlSeries = ref([])
const pnlSeriesByTicker = ref({})
const sparklineRefs = ref({})
const sparklineCharts = ref({})

let allocationChart = null
let cashVsAssetsChart = null
let contribChart = null

const getLivePriceNumber = (ticker) => {
  const hit = marketPrices.value.find(p => String(p.ticker).toUpperCase() === String(ticker).toUpperCase())
  return hit ? Number(hit.current_price || 0) : 0
}

const computePortfolioVizData = (portfolio) => {
  if (!portfolio) return null

  const cash = Number(portfolio.cash_balance || 0)
  const assets = portfolio.assets || []

  const allocationRows = []
  let investedTotal = 0

  for (const a of assets) {
    const qty = Number(a.quantity || 0)
    const px = getLivePriceNumber(a.ticker) || Number(a.average_buy_price || 0)
    const mvSigned = qty * px
    const mvAbs = Math.abs(mvSigned)

    investedTotal += mvAbs

    allocationRows.push({
      ticker: a.ticker,
      position_type: a.position_type,
      qty,
      price: px,
      marketValueAbs: mvAbs,
      pnlEstimate: (px - Number(a.average_buy_price || 0)) * qty
    })
  }

  return {
    cash,
    investedTotal,
    allocationRows
  }
}

let renderToken = 0

const destroyVizCharts = () => {
  allocationChart?.destroy(); allocationChart = null
  cashVsAssetsChart?.destroy(); cashVsAssetsChart = null
  contribChart?.destroy(); contribChart = null
}

const renderPortfolioVizCharts = async () => {
  const token = ++renderToken
  await nextTick()

  const p = selectedPortfolio.value
  if (!p) return
  const data = computePortfolioVizData(p)
  if (!data) return

  // only latest invocation proceeds
  if (token !== renderToken) return

  destroyVizCharts()

  const heldAssets = (data.allocationRows || []).filter(r => Number(r.marketValueAbs || 0) > 0)

  if (allocationChartRef.value && token === renderToken) {
    const ctx = allocationChartRef.value.getContext('2d')
    if (ctx && heldAssets.length) {
      allocationChart = new Chart(ctx, {/* ... */})
    }
  }

  if (cashVsAssetsChartRef.value && token === renderToken) {
    const ctx = cashVsAssetsChartRef.value.getContext('2d')
    if (ctx) {
      cashVsAssetsChart = new Chart(ctx, {/* ... */})
    }
  }

  if (contribChartRef.value && token === renderToken) {
    const ctx = contribChartRef.value.getContext('2d')
    if (!ctx) return

    const portfolioId = selectedPortfolio.value?.id
    if (!portfolioId) return

    const res = await api.get(`/market-masters/portfolios/${portfolioId}/pnl-timeseries/`)
    if (token !== renderToken) return // stale async response

    contribChart = new Chart(ctx, {/* ... */})
  }
}

const tradeForm = ref({
  ticker: '',
  action: 'BUY',
  orderType: 'MARKET',
  quantity: null,
  targetPrice: null, // can remove if you fully drop LIMIT
  requestedLeverage: 1,
  stopLossPrice: null
})

const newPortfolioForm = ref({
  name: '',
  customBudget: 100000,
  trading_level: 'BASIC',      // 'BASIC' | 'ADVANCED'
  portfolio_type: 'DYNAMIC',   // 'DYNAMIC' | 'STATIC'
  start_time: '',
  trade_cutoff_time: '',       // required when portfolio_type === 'STATIC'
  end_time: ''
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

const deleteDialog = ref({
  active: false,
  loading: false,
  target: null
})

const promptDeletePortfolio = (portfolio) => {
  if (portfolio?.competition) return
  deleteDialog.value = { active: true, loading: false, target: portfolio }
}

const confirmDeletePortfolio = async () => {
  const target = deleteDialog.value.target
  if (!target?.id) return

  deleteDialog.value.loading = true
  try {
    await api.delete(`/market-masters/portfolios/${target.id}/`)
    triggerToast('Portfolio deleted.', 'success')
    deleteDialog.value.active = false
    deleteDialog.value.target = null
    await fetchDashboardData()
  } catch (err) {
    console.error('Delete portfolio failed:', err?.response?.data || err)
    triggerToast(err?.response?.data?.error || 'Failed to delete portfolio.', 'error')
  } finally {
    deleteDialog.value.loading = false
  }
}

const handleWatchlistSelection = (ticker) => {
  watchlistSelectedTicker.value = ticker
}


const longPositions = computed(() =>
  (selectedPortfolio.value?.assets || []).filter(a => a.position_type === 'LONG' && Number(a.quantity) > 0)
)

const shortPositions = computed(() =>
  (selectedPortfolio.value?.assets || []).filter(a => a.position_type === 'SHORT' && Number(a.quantity) > 0)
)

const maxClosableQuantity = computed(() => {
  if (tradeForm.value.action !== 'COVER') return 0
  const row = shortPositions.value.find(a => a.ticker === tradeForm.value.ticker)
  return row ? Number(row.quantity || 0) : 0
})

const maxAllowedQuantity = computed(() => {
  if (tradeForm.value.action === 'SELL') return Number(maxSellableQuantity.value || 0)
  if (tradeForm.value.action === 'COVER') return Number(maxClosableQuantity.value || 0)
  return Infinity
})

function formatWithApostrophes(raw, type) {
  const cleaned = String(raw ?? "").replace(/[^0-9.]/g, "")
  if (!cleaned) return ""

  const [intRaw, decRaw = ""] = cleaned.split(".")
  const intNoLeading = intRaw.replace(/^0+(?=\d)/, "") || "0"
  const grouped = intNoLeading.replace(/\B(?=(\d{3})+(?!\d))/g, "'")

  if (type === "integer") return grouped
  if (type === "money") return `${grouped}${decRaw.length ? "." + decRaw.slice(0, 2) : ""}`
  return `${grouped}${decRaw.length ? "." + decRaw.slice(0, 3) : ""}` // decimal
}

function parseFormattedNumber(input) {
  if (!input) return null
  const normalized = String(input).replace(/'/g, "").trim()
  if (!normalized) return null

  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

const uiCustomBudget = ref("100'000")
const formatBudget = (value) => {
  const n = Number(value || 0)
  const [intPart, decPart] = n.toFixed(2).split('.')
  return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")}.${decPart}`
}

const onBudgetInput = (e) => {
  const raw = String(e.target.value || '')

  // allow typing, but sanitize for numeric model
  const cleaned = raw.replace(/'/g, '').replace(/[^0-9.]/g, '')
  const parts = cleaned.split('.')
  const normalized = parts.length > 2
    ? `${parts[0]}.${parts.slice(1).join('')}`
    : cleaned

  uiCustomBudget.value = raw // keep user's in-progress typing visible

  const parsed = Number(normalized)
  if (!Number.isNaN(parsed)) {
    newPortfolioForm.value.customBudget = parsed
  }
}

const onBudgetBlur = () => {
  // normalize and prettify on blur
  uiCustomBudget.value = formatBudget(newPortfolioForm.value.customBudget)
}


watch(() => newPortfolioForm.value.trading_level, (level) => {
  if (level === 'BASIC') newPortfolioForm.value.leverage_setting = 1
})

// before submit:
const parsedBudget = parseFormattedNumber(uiCustomBudget.value)
newPortfolioForm.value.customBudget = parsedBudget
watch(uiCustomBudget, (v) => {
  uiCustomBudget.value = formatWithApostrophes(v, "money")
})

const fetchDashboardData = async () => {
  try {
    const res = await api.get('/market-masters/hub/')
    studentInitials.value = res.data.student_initials
    portfolios.value = res.data.portfolios
    currentWatchlist.value = res.data.watchlist
    marketPrices.value = res.data.market_prices

    console.log('Portfolio data fetched:', res.data.portfolios)

    if (portfolios.value.some(p => !!p.competition)) {
      await fetchCompetitionStandingsForStudent()
    } else {
      activeCompetitionStandings.value = []
    }
  } catch (err) {
    console.error("Pricing hub disconnect:", err)
  }
}

const fetchCompetitionStandingsForStudent = async () => {
  try {
    const competitionPortfolios = (portfolios.value || []).filter(p => !!p.competition)
    const competitionIds = [...new Set(competitionPortfolios.map(p => p.competition))]

    const results = await Promise.all(
      competitionIds.map(async (id) => {
        const res = await api.get(`/market-masters/competitions/${id}/standings/`)
        return res.data
      })
    )

    activeCompetitionStandings.value = results
  } catch (err) {
    console.error('Failed loading standings', err?.response?.data || err)
    activeCompetitionStandings.value = []
  }
}

const fetchPortfolioPnlSeries = async (portfolioId) => {
  try {
    const res = await api.get(`/market-masters/portfolios/${portfolioId}/pnl-timeseries/`)
    const payload = res?.data || {}

    // expected shape:
    // payload = { portfolio: [{t, pnl}], assets: { AAPL: [{t,pnl}], TSLA: [{t,pnl}] } }

    portfolioPnlSeries.value = payload.portfolio || []
    pnlSeriesByTicker.value = payload.assets || {}

    // wait for DOM to paint canvases in open-position cards
    await nextTick()

    for (const [ticker, pts] of Object.entries(pnlSeriesByTicker.value)) {
      if (!sparklineRefs.value[ticker] || pts.length < 8) continue
      const ctx = sparklineRefs.value[ticker].getContext('2d')
      if (!ctx) continue

      if (sparklineCharts.value[ticker]) {
        sparklineCharts.value[ticker].destroy()
      }

      const data = pts.map(p => Number(p.pnl || 0))
      const color = (data[data.length - 1] || 0) >= 0 ? '#059669' : '#dc2626'

      sparklineCharts.value[ticker] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: pts.map(() => ''),
          datasets: [{
            data,
            borderColor: color,
            borderWidth: 1.5,
            tension: 0.3,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      })
    }

    return payload
  } catch (err) {
    console.error('Failed to fetch portfolio pnl timeseries:', err?.response?.data || err)
    triggerToast('Unable to load portfolio P&L history.', 'error')
    return { portfolio: [], assets: {} }
  }
}

//  for historical price charts
const chartRefs = ref({})                 // { [ticker]: HTMLCanvasElement }
const chartInstances = ref({})            // { [ticker]: Chart instance }
const chartLoadingByTicker = ref({})      // { [ticker]: boolean }
const trendByTicker = ref({})             // { [ticker]: api response }

// Helper utility to match performance numbers cleanly to colors
const getPerformanceColorClass = (pctStr) => {
  if (!pctStr) return 'text-slate-400'
  return pctStr.startsWith('-') ? 'text-rose-400 font-weight-bold' : 'text-emerald-400 font-weight-bold'
}

// 🔄 CHARTS HYDRATION CORE ENGINE HANDLER
// 🔄 UPDATED SCRIPT SEGMENT: Captures a completely generic string variable safely
const handleLoadChartHistory = async (targetTicker) => {
  if (!targetTicker) return
  const key = String(targetTicker).toUpperCase()

  chartLoadingByTicker.value[key] = true
  trendByTicker.value[key] = null

  // destroy only this ticker's old chart
  if (chartInstances.value[key]) {
    chartInstances.value[key].destroy()
    delete chartInstances.value[key]
  }

  try {
    const res = await api.get(`/market-masters/assets/history/?ticker=${encodeURIComponent(key)}`)
    trendByTicker.value[key] = res.data

    if (!res.data?.prices?.length) return

    await nextTick()

    const canvasElement = chartRefs.value[key]
    if (!canvasElement) return

    const ctx = canvasElement.getContext('2d')
    const isBearishTrend = String(res.data?.performance_pct || '').startsWith('-')
    const primaryLineColor = isBearishTrend ? '#f43f5e' : '#10b981'

    chartInstances.value[key] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: res.data.labels || [],
        datasets: [{
          data: res.data.prices || [],
          borderColor: primaryLineColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.25
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { x: { display: false }, y: { display: false } }
      }
    })
  } catch (err) {
    console.error("Historical rendering error:", err)
  } finally {
    chartLoadingByTicker.value[key] = false
  }
}

const portfolioMeta = computed(() => {
  const p = selectedPortfolio.value ?? {}
  const c = p.competition_detail ?? {}

  const pick = (...vals) => vals.find(v => v !== undefined && v !== null && v !== '')

  const tradingRaw = pick(p.trading_is_open, c.trading_is_open)
  const tradingIsOpen = tradingRaw === true || tradingRaw === 'true' || tradingRaw === 1

  return {
    // Identity
    isCompetition: Boolean(p.competition),
    competitionName: pick(p.competition_name, c.name, null),

    // Config
    tradingLevel: pick(p.trading_level, c.trading_level, 'BASIC'),
    portfolioType: pick(p.portfolio_type, c.portfolio_type, p.competition ? 'DYNAMIC' : 'STATIC', '—'),
    leverageSetting: Number(p.leverage_setting ?? c.max_leverage_tier ?? 1),

    // Timeline
    startTime: pick(p.start_time, c.start_time, null),
    cutoffTime: pick(p.trade_cutoff_time, c.trade_cutoff_time, null),
    endTime: pick(p.end_time, c.end_time, null),

    // Trading state
    tradingIsOpen
  }
})

const canUseAdvancedActions = computed(() => portfolioMeta.value.tradingLevel === 'ADVANCED')
const isTradingLocked = computed(() => !portfolioMeta.value.tradingIsOpen)


const quantityLabel = computed(() => {
  if (tradeForm.value.action === 'SHORT') return 'Units to Short'
  if (tradeForm.value.action === 'COVER') return 'Units to Cover'
  if (tradeForm.value.action === 'SELL') return 'Units to Sell'
  return 'Asset Quantity'
})

const targetPriceLabel = computed(() => {
  if (tradeForm.value.orderType !== 'LIMIT') return 'Target Limit Price ($)'
  if (tradeForm.value.action === 'SHORT') return 'Target Entry Price ($)'
  if (tradeForm.value.action === 'COVER') return 'Target Cover Price ($)'
  return 'Target Limit Price ($)'
})

const getAssetLivePrice = (ticker) => {
  const m = marketPrices.value?.find(p => p.ticker?.toUpperCase() === ticker?.toUpperCase())
  return Number(m?.current_price || 0)
}

const getHoldingMarketValue = (h) => getAssetLivePrice(h.ticker) * Number(h.quantity || 0)

const getHoldingPnL = (h) => {
  const live = getAssetLivePrice(h.ticker)
  const avg = Number(h.average_buy_price || 0)
  const qty = Number(h.quantity || 0)
  if (!live || !avg || !qty) return 0
  // SHORT gains when price drops
  return h.position_type === 'SHORT' ? (avg - live) * qty : (live - avg) * qty
}

const getHoldingPnLPct = (h) => {
  const avg = Number(h.average_buy_price || 0)
  if (!avg) return 0
  const live = getAssetLivePrice(h.ticker)
  const raw = h.position_type === 'SHORT' ? ((avg - live) / avg) * 100 : ((live - avg) / avg) * 100
  return Number.isFinite(raw) ? raw : 0
}

// for suggested buys section
// Clean static sectors mapping block for structural rendering loops
const sectorDirectory = {
  tech: {
    label: "💻 US Tech Stocks",
    assets: [
      { ticker: "NVDA", name: "NVIDIA Corporation", shortName: "NVIDIA" },
      { ticker: "AAPL", name: "Apple Inc.", shortName: "Apple" },
      { ticker: "MSFT", name: "Microsoft Corp.", shortName: "Microsoft" },
      { ticker: "TSLA", name: "Tesla, Inc.", shortName: "Tesla" },
      { ticker: "GOOGL", name: "Alphabet Inc.", shortName: "Alphabet" },
      { ticker: "SPCX", name: "Space Exploration Technologies.", shortName: "SpaceX" }
      
    ]
  },
  multinationals: {
    label: "🇺🇸 Multinationals",
    assets: [
      { ticker: "NFLX", name: "Netflix, Inc.", shortName: "Netflix" },
      { ticker: "NKE", name: "Nike, Inc.", shortName: "Nike" },
      { ticker: "DIS", name: "The Walt Disney Company", shortName: "Disney" },
      { ticker: "AMZN", name: "Amazon.com Inc.", shortName: "Amazon" },
      { ticker: "V", name: "Visa", shortName: "Visa" },
      { ticker: "SPOT", name: "Spotify Technology S.A.", shortName: "Spotify" }

    ]
  },
  indices: {
    label: "🇺🇸 US Index Proxies",
    assets: [
      { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", shortName: "S&P 500 ETF" },
      { ticker: "QQQ", name: "Invesco QQQ Trust", shortName: "Nasdaq 100 ETF" },
      { ticker: "VTI", name: "Vanguard Total Stock", shortName: "Total Market" },
      { ticker: "XLF", name: "Financial Sector SPDR", shortName: "Financials" },
      { ticker: "XLK", name: "Tech ETF", shortName: "Technology Select" },
      { ticker: "DBC", name: "Invesco DB Commodity Index Tracking Fund", shortName: "Commodity ETF" }
    ]
  },

  swiss: {
    label: "Swiss / EU Stocks (ADR)",
    assets: [
      { ticker: "EWL", name: "iShares MSCI Switzerland", shortName: "SIX Tracker" },
      { ticker: "UBS", name: "UBS Group AG", shortName: "UBS Group" },
      { ticker: "NSRGY", name: "Nestlé S.A. (US ADR)", shortName: "Nestlé" },
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
      triggerToast(`Successfully added [${ticker}] towatchlist.`, "success")
      await fetchDashboardData()
    }
  } catch (err) {
    const errorDetails = err.response?.data?.error || "Failed to find asset."
    triggerErrorModal(`Watchlist Entry Denied: ${errorDetails}`)
  } finally {
    isActionProcessing.value = false
  }
}
const normalizeTicker = (raw) => String(raw || '').trim().toUpperCase()

const submitWatchlistAdd = async () => {
  const ticker = normalizeTicker(watchlistSelectedTicker.value)

  if (!ticker) {
    triggerToast("Please select a valid ticker.", "warning")
    return
  }

  const alreadyTracked = (currentWatchlist.value || []).some(
    t => normalizeTicker(t) === ticker
  )
  if (alreadyTracked) {
    triggerToast(`[${ticker}] is already in your watchlist.`, "warning")
    return
  }

  if ((currentWatchlist.value || []).length >= 15) {
    triggerErrorModal("Watchlist limit reached (15). Remove one before adding another.")
    return
  }

  isActionProcessing.value = true
  try {
    // Validate ticker / resolve quote source server-side
    await api.get(`/market-masters/search/?ticker=${encodeURIComponent(ticker)}`)

    // Backend should: add TrackingList + upsert/activate TrackedTicker
    await api.post('/market-masters/watchlist/add/', { ticker })

    triggerToast(`Added [${ticker}] to your watchlist.`, "success")
    await fetchDashboardData()

    if (watchlistSearchRef.value?.clearInput) watchlistSearchRef.value.clearInput()
    watchlistSelectedTicker.value = ''
  } catch (err) {
    const msg = err?.response?.data?.error || "Could not add ticker to watchlist."
    triggerErrorModal(`Watchlist add failed: ${msg}`)
  } finally {
    isActionProcessing.value = false
  }
}

const getAssetName = (ticker) => {
  const clean = normalizeTicker(ticker)
  if (!clean) return 'Market Security'

  const liveMatch = (marketPrices.value || []).find(
    p => normalizeTicker(p?.ticker) === clean
  )
  if (liveMatch?.name && liveMatch.name !== 'Global Market Security') {
    return liveMatch.name
  }

  return marketDirectory?.[clean]?.name || 'Market Security'
}

const truncateString = (str, limit = 24) => {
  const text = String(str || '').trim()
  if (!text || text === 'Market Security' || text === 'Global Market Security') return ''
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text
}

const removeFromWatchlist = async (tick) => {
  const ticker = normalizeTicker(tick)
  if (!ticker) return

  isActionProcessing.value = true
  try {
    // Backend should: remove TrackingList row, and deactivate TrackedTicker if unused
    await api.post('/market-masters/watchlist/remove/', { ticker })

    triggerToast(`Removed [${ticker}] from watchlist.`, "success")
    await fetchDashboardData()
  } catch (err) {
    const msg = err?.response?.data?.error || "Unable to remove ticker from watchlist."
    triggerErrorModal(msg)
  } finally {
    isActionProcessing.value = false
  }
}

const portfolioMarketValue = computed(() => {
  const p = selectedPortfolio.value
  if (!p) return 0

  const assets = p.assets || []
  const assetsValue = assets.reduce((sum, a) => {
    const qty = Number(a.quantity || 0)
    const live = getLivePriceNumber(a.ticker) || Number(a.average_buy_price || 0)
    return sum + (qty * live)
  }, 0)

  return Number(p.cash_balance || 0) + assetsValue
})

// Prefer backend field if available; fallback to current cash as baseline
const initialCapital = computed(() => {
  const p = selectedPortfolio.value
  if (!p) return 0
  return Number(p.initial_budget || p.starting_budget || p.initial_cash || p.cash_balance || 0)
})

const performancePct = computed(() => {
  const base = initialCapital.value
  if (!base || base <= 0) return 0
  return ((portfolioMarketValue.value - base) / base) * 100
})

const performancePctText = computed(() => {
  const v = performancePct.value
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
})

const performanceValueText = computed(() => {
  const delta = portfolioMarketValue.value - initialCapital.value
  const sign = delta > 0 ? '+' : ''
  return `${sign}$${Math.abs(delta).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

const performanceCardBg = computed(() => {
  return performancePct.value >= 0
    ? 'linear-gradient(135deg, #065f46 0%, #10b981 100%)'
    : 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)'
})


const submitNewPortfolio = async () => {
  const f = newPortfolioForm.value
  const cleanName = (f.name || '').trim()

  isActionProcessing.value = true
  try {
    await api.post('/market-masters/hub/', {
      name: cleanName,
      custom_budget: f.customBudget,                 // backend expects custom_budget
      portfolio_type: f.portfolio_type,              // "DYNAMIC" | "STATIC"
      trading_level: f.trading_level,                // "BASIC" | "ADVANCED"
      start_time: f.start_time || null,              // datetime-local string
      trade_cutoff_time: f.trade_cutoff_time || null,
      end_time: f.end_time || null
    })

    triggerToast(
      `Portfolio "${cleanName || 'My Portfolio'}" created successfully.`,
      'success'
    )

    isCreateModalActive.value = false

    await fetchDashboardData()

    // reset 
    newPortfolioForm.value = {
      name: '',
      customBudget: 100000,
      portfolio_type: 'DYNAMIC',
      trading_level: 'BASIC',
      start_time: '',
      trade_cutoff_time: '',
      end_time: ''
    }
  } catch (err) {
    console.error(err)
    const msg = err?.response?.data?.error || 'Portfolio creation failed.'
    triggerErrorModal(`Deployment Failed: ${msg}`)
  } finally {
    isActionProcessing.value = false
  }
}

// 📦 Returns the total quantity of shares the student holds for the selected ticker
const maxSellableQuantity = computed(() => {
  if (!selectedPortfolio.value || !tradeForm.value.ticker || typeof tradeForm.value.ticker !== 'string') return 0
  
  const searchTicker = tradeForm.value.ticker.toUpperCase().trim()
  const match = selectedPortfolio.value.assets.find(
    a => a.ticker.toUpperCase().trim() === searchTicker
  )
  return match ? parseFloat(match.quantity) : 0
})

// 🧮 FIXED COST & PROCEEDS COMPUTATION VECTORS
const computedTotalImpact = computed(() => {
  if (computedGrossPrincipal.value === 0) return 0
  
  if (tradeForm.value.action === 'SELL') {
    // 📉 FOR SELLS: Proceeds are calculated as Gross Value MINUS the transaction fee
    const netProceeds = computedGrossPrincipal.value - 10.00
    return Math.max(0, netProceeds)
  } else {
    // 📈 FOR BUYS/SHORTS/COVERS: Fee is an extra cost added to the order total
    return computedGrossPrincipal.value + 10.00
  }
})

// 🧼 Clears out input numbers when a new asset is selected to reset form rule validation blocks
const clearQuantityField = () => {
  tradeForm.value.quantity = null
  if (tradeFormRef.value) {
    tradeFormRef.value.resetValidation()
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
    return dateObj.toLocaleTimeString('en-US', { month: 'short', day: '2-digit', hour12: false, hour: '2-digit', minute: '2-digit' })
  }
  return 'Pending'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
    nyseClock.value.message = `Opens in: ${padTime(hLeft)}h ${padTime(mLeft)}m`
  } 
  // 🔒 CASE D: Weekday post 04:00 PM closing bell
  else {
    nyseClock.value.message = 'Market closed. Reopens tomorrow.'
  }
}


// transaction dialog
// Main state controller structure maps
const isRefreshingPortfolio = ref(false)

const isRulesDialogOpen = ref(false)

// 🧼 Reset fields back to clean baseline parameters
const clearOrderFields = () => {
  tradeForm.value.ticker = ''
  tradeForm.value.quantity = null
  tradeForm.value.targetPrice = null
  tradeForm.value.requestedLeverage = 1
  tradeForm.value.stopLossPrice = null
  if (tradeFormRef.value) {
    tradeFormRef.value.resetValidation()
  }
}

// AUTOMATIC CLEANER: Clears input state when tabs are switched
watch(() => tradeForm.value.action, (newAction) => {
  // If an advanced tab is active but the portfolio doesn't allow leverage, force-reset to BUY
  if (['SHORT', 'COVER'].includes(newAction) && !canUseAdvancedActions.value) {
    tradeForm.value.action = 'BUY'
  }
  clearOrderFields()
  if (tradeFormRef.value) {
    tradeFormRef.value.reset()
  }
})

watch(
  () => selectedPortfolio.value,
  async (val) => {
    if (val) await renderPortfolioVizCharts()
    else destroyVizCharts()
  },
  { deep: true }
)

watch(
  () => marketPrices.value,
  async () => {
    if (selectedPortfolio.value) await renderPortfolioVizCharts()
  },
  { deep: true }
)

// INTERCEPTOR: Receives ticker strings from custom TickerSearchBar selections safely
const handleTerminalAssetSelection = (tickerData) => {
  if (!tickerData) return
  
  // Safeguard: Check if it's a direct text string or an internal object payload
  if (typeof tickerData === 'string') {
    tradeForm.value.ticker = tickerData.toUpperCase()
  } else if (tickerData.ticker) {
    tradeForm.value.ticker = tickerData.ticker.toUpperCase()
  } else if (tickerData.symbol) {
    tradeForm.value.ticker = tickerData.symbol.toUpperCase()
  }
}

// 🔄 Hits the Django detail workspace route manually to fetch updated asset records
const manuallyRefreshPortfolio = async (explicitId = null) => {
  const targetId = explicitId || selectedPortfolio.value?.id
  if (!targetId) return
  isRefreshingPortfolio.value = true
  try {
    const res = await api.get(`/market-masters/portfolios/${targetId}/`)
    selectedPortfolio.value = res.data
  } catch {
    triggerErrorModal("Unable to successfully synchronize portfolio balance parameters.")
  } finally {
    isRefreshingPortfolio.value = false
  }
}

// DIALOG DISPATCH ACTION 
const inspectPortfolio = async (portfolioId) => {
  if (!portfolioId) {
    console.error('inspectPortfolio called without portfolioId:', portfolioId)
    return
  }

  isTradeProcessing.value = true
  try {
    const res = await api.get(`/market-masters/portfolios/${portfolioId}/`)
    selectedPortfolio.value = res.data
    portfolioDialog.value.isOpen = true

    await fetchPortfolioPnlSeries(portfolioId)
  } catch (err) {
    console.error('Failed to inspect portfolio:', err?.response?.data || err)
    triggerToast('Unable to open portfolio view.', 'error') 
  } finally {
    isTradeProcessing.value = false
  }
}

// REAL-TIME COST COMPUTATION VECTORS
// 🧮 FIXED COST & PROCEEDS CALCULATOR
const computedGrossPrincipal = computed(() => {
  if (!tradeForm.value.ticker || !tradeForm.value.quantity) return 0
  
  const quantityValue = parseFloat(tradeForm.value.quantity) || 0
  if (quantityValue <= 0) return 0

  if (tradeForm.value.orderType === 'LIMIT') {
    const limitTarget = parseFloat(tradeForm.value.targetPrice) || 0
    return limitTarget * quantityValue
  } else {
    // Dynamically look up the live cached price using our helper function
    const rawPrice = getLivePrice(tradeForm.value.ticker)
    // Strip localized commas if present, then convert to a floating number
    const livePrice = parseFloat(String(rawPrice).replace(/,/g, '')) || 0
    return livePrice * quantityValue
  }
})

// ⚡ KILL EXECUTOR: Retracts a resting pending limit order from active database rows
const killWorkingOrder = async (orderId) => {
  if (!orderId) return
  if (!confirm("Are you sure you want to retract this working market order contract?")) return
  
  try {
    // Hits the custom cancellation endpoint we registered in Django's urls.py
    const res = await api.post(`/market-masters/orders/${orderId}/cancel/`)
    triggerToast(res.data.message || "Limit order cancelled successfully.", "success")
    
    // Instantly refresh the local workspace metrics tables to show the change
    if (selectedPortfolio.value?.id) {
      manuallyRefreshPortfolio(selectedPortfolio.value.id)
      fetchDashboardData() // Syncs global hub balances as well
    }
  } catch (err) {
    console.error("Order cancellation failure:", err)
    const backendMsg = err.response?.data?.error || "Unable to retract order contract parameters."
    triggerErrorModal(`Retraction Refused: ${backendMsg}`)
  }
}


// STEP 1: submit button handler (always opens confirmation)
const submitOrder = async () => {
  const { valid } = await tradeFormRef.value.validate()
  if (!valid) return

  const targetTicker = (tradeForm.value.ticker || "").toUpperCase().trim()
  if (!targetTicker) return

  isTradeProcessing.value = true
  try {
    // Use your search endpoint to resolve/provision live quote preview
    const res = await api.get(`/market-masters/search/?ticker=${encodeURIComponent(targetTicker)}`)

    const livePrice = Number(res.data?.current_price || 0)
    const qty = Number(tradeForm.value.quantity || 0)
    const fee = 10
    const gross = livePrice * qty

    const isCredit = ['SELL', 'SHORT'].includes(tradeForm.value.action)
    const totalImpact = isCredit ? (gross - fee) : (gross + fee)

    quoteData.value = {
      ticker: targetTicker,
      name: res.data?.name || targetTicker,
      live_price: livePrice,
      quantity: qty,
      tx_fee: fee,
      gross_principal: gross,
      total_impact: totalImpact,
      trade_type: tradeForm.value.action,
      order_type: tradeForm.value.orderType,
      target_price: tradeForm.value.orderType === 'LIMIT'
        ? Number(tradeForm.value.targetPrice || 0)
        : null,
      requested_leverage: tradeForm.value.action === 'SHORT'
        ? Number(tradeForm.value.requestedLeverage || 1)
        : null,
      stop_loss_price: tradeForm.value.action === 'SHORT' && tradeForm.value.stopLossPrice
        ? Number(tradeForm.value.stopLossPrice)
        : null
    }

    isQuoteModalActive.value = true
  } catch (err) {
    console.error("Quote precheck failed:", err?.response?.data || err)
    triggerErrorModal(err?.response?.data?.error || "Unable to fetch quote for this symbol.")
  } finally {
    isTradeProcessing.value = false
  }
}

const confirmAndRouteOrder = async () => {
  if (!quoteData.value) return

  isTradeProcessing.value = true
  try {
    const payload = {
      portfolio_id: selectedPortfolio.value.id,
      ticker: quoteData.value.ticker,
      quantity: tradeForm.value.quantity,
      trade_type: tradeForm.value.action,
      order_type: tradeForm.value.orderType
    }

    if (tradeForm.value.orderType === 'LIMIT') {
      payload.target_price = tradeForm.value.targetPrice
    }

    if (tradeForm.value.action === 'SHORT') {
      payload.requested_leverage = Number(tradeForm.value.requestedLeverage || 1)
      payload.stop_loss_price = tradeForm.value.stopLossPrice
        ? Number(tradeForm.value.stopLossPrice)
        : null
    }

    const res = await api.post('/market-masters/trade/execute/', payload)
    const data = res.data || {}

    if (data.queued) {
      triggerToast(
        `🕒 Market closed: your MARKET ${payload.trade_type} order for ${payload.ticker} is queued for next NYSE open.`,
        "warning"
      )
    } else {
      triggerToast(data.message || "Order completed successfully.", "success")
    }

    isQuoteModalActive.value = false
    quoteData.value = null
    clearOrderFields()
    await fetchDashboardData()
    manuallyRefreshPortfolio(payload.portfolio_id)
  } catch (err) {
    console.error("Trade execute failed:", err?.response?.data || err)

    const d = err?.response?.data
    const firstFieldError =
      d && typeof d === 'object'
        ? Object.entries(d)
            .flatMap(([, v]) => Array.isArray(v) ? v : [v])
            .find(v => typeof v === 'string')
        : null

    triggerErrorModal(
      d?.error ||
      firstFieldError ||
      "Transaction declined due to portfolio constraints."
    )
  } finally {
    isTradeProcessing.value = false
  }
}

const cancelQuoteConfirmation = () => {
  isQuoteModalActive.value = false
  quoteData.value = null
}



// portfolio health calculations
// DYNAMIC FINANCIAL CALCULATORS

// 1. Computes total spending potential based on the account's cash balance and leverage multiplier
const maxPurchasingPower = computed(() => {
  const cash = parseFloat(selectedPortfolio.value?.cash_balance || 0)
  const multiplier = parseInt(selectedPortfolio.value?.leverage_setting || 1)
  return cash * multiplier
})

// 2. Tracks maximum allowed margin credit room before order entries are rejected
const maxBorrowLimit = computed(() => {
  const cash = parseFloat(selectedPortfolio.value?.cash_balance || 0)
  const multiplier = parseInt(selectedPortfolio.value?.leverage_setting || 1)
  return cash * (multiplier - 1)
})

// 3. Detects if an active order entry will require debt financing
const marginLoanRequired = computed(() => {
  const cash = parseFloat(selectedPortfolio.value?.cash_balance || 0)
  if (computedTotalImpact.value <= cash) return 0
  return computedTotalImpact.value - cash
})

// 4. Calculates the live margin profile safety ratio (Matching backend loops)
const liveMarginRatio = computed(() => {
  if (!selectedPortfolio.value) return 1.0
  
  const cash = parseFloat(selectedPortfolio.value.cash_balance || 0)
  const debt = parseFloat(selectedPortfolio.value.borrowed_funds_balance || 0)
  
  let longValue = 0
  let shortValue = 0
  
  // Calculate aggregate asset values using live pricing feeds
  if (selectedPortfolio.value.assets) {
    selectedPortfolio.value.assets.forEach(asset => {
      const livePrice = parseFloat(getLivePrice(asset.ticker)) || 0
      const value = livePrice * parseFloat(asset.quantity)
      
      if (asset.position_type === 'LONG') {
        longValue += value
      } else if (asset.position_type === 'SHORT') {
        shortValue += value
      }
    })
  }
  
  const netEquity = cash + longValue - shortValue - debt
  const totalGrossExposure = longValue + shortValue
  
  if (totalGrossExposure === 0) return 1.0 // Fully liquid, zero liquidation risk
  
  const ratio = netEquity / totalGrossExposure
  // Clamp the return output boundaries safely between 0% and 100% for the progress indicator
  return Math.max(0, Math.min(1, ratio))
})

// BUY-only effective spending power shown to student
const buyPowerDisplay = computed(() => {
  if (!selectedPortfolio.value) return 0
  const isAdvanced =
    selectedPortfolio.value.trading_level === 'ADVANCED' &&
    Number(selectedPortfolio.value.leverage_setting || 1) > 1

  const cash = Number(selectedPortfolio.value.cash_balance || 0)
  return isAdvanced ? Number(maxPurchasingPower.value || 0) : cash
})

// Remaining room after current BUY draft
const buyHeadroomDisplay = computed(() => {
  if (tradeForm.value.action !== 'BUY') return 0
  return Math.max(0, Number(buyPowerDisplay.value || 0) - Number(computedTotalImpact.value || 0))
})

// 🎨 DYNAMIC RISK ELEMENT COLORS
const healthStatusColor = computed(() => {
  if (liveMarginRatio.value <= 0.20) return 'text-rose-400 font-weight-black'
  if (liveMarginRatio.value <= 0.40) return 'text-amber-400'
  return 'text-emerald-accent-3'
})

const healthBarColor = computed(() => {
  if (liveMarginRatio.value <= 0.20) return 'error'      // Deep Red
  if (liveMarginRatio.value <= 0.40) return 'warning'    // Warning Amber
  return 'success'                                       // Secure Emerald Green
})

let dashboardIntervalId = null

onMounted(() => {
  fetchDashboardData()
  dashboardIntervalId = setInterval(fetchDashboardData, 60000)
  updateNYSECountdownClock()
  clockIntervalId = setInterval(updateNYSECountdownClock, 1000)
})

onBeforeUnmount(() => {
  if (clockIntervalId) clearInterval(clockIntervalId)
  if (dashboardIntervalId) clearInterval(dashboardIntervalId)

  destroyVizCharts()

  Object.values(sparklineCharts.value || {}).forEach(c => { try { c?.destroy?.() } catch {} })
  sparklineCharts.value = {}

  Object.values(chartInstances.value || {}).forEach(c => { try { c?.destroy?.() } catch {} })
  chartInstances.value = {}
})


</script>

<style scoped>
/* WATCHLIST FLEXBOX MODAL OVERWRITES */
.dialog-content-row {
  min-height: 0;
  height: auto;
  overflow: visible;
}

.dialog-col-left,
.dialog-col-right {
  overflow: visible;
}

/* Desktop split-pane behavior only on lg+ */
@media (min-width: 1280px) {
  .dialog-content-row {
    height: calc(100vh - 96px); /* toolbar + summary alert area */
    overflow: hidden;
  }

  .dialog-col-left,
  .dialog-col-right {
    height: 100%;
    overflow-y: auto;
  }
}

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

.hub-header { max-width: 1160px; margin: 30px auto; padding: 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.hub-header h1 { font-size: 2.2rem; color: #2c3e50; margin: 0; }
.subtitle { color: #7f8c8d; margin-top: 5px; }

.macro-index-box {
  display: flex;
  flex-wrap: wrap;        /* allows cards to wrap instead of overflow */
  gap: 15px;
  background: #fff;
  padding: 12px 18px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  width: 580px;            /* ensures it fills the column instead of forcing a fixed width */
  box-sizing: border-box; /* prevents padding from expanding width */
}

/* Add margin so the second column visually matches the first */
.enhanced-macro-box {
  margin: 2px 52px;
}

/* Make ticker visually dominant */
.index-ticker {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2d3748;
}

/* Secondary description text */
.index-desc {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 500;
}

/* Slightly more padding for balance */
.index-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 120px;        /* fixed width */
  height: 100px;    /* consistent height */
  padding: 10px 16px;
  border-right: 1px solid #edf2f7;
  transition: all 0.3s ease;
  overflow: hidden;    /* prevents text spill */
}
.index-card:last-child {
  border-right: none;
}

/* Keep your existing value styling */
.index-value {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin-top: 6px;
}

/* Keep your trend colors */
.index-card.trend-up {
  background: rgba(46, 204, 113, 0.05);
  border-radius: 6px;
}

.index-card.trend-down {
  background: rgba(231, 76, 60, 0.05);
  border-radius: 6px;
}


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

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #f4f6f7; padding-bottom: 10px; }
.card-header h2 { margin: 0; font-size: 1.3rem; }
.card-instruction { background: #fcf8e3; color: #c09853; border: 1px solid #fbeed5; padding: 10px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 20px; }

.portfolio-row { display: flex; justify-content: space-between; align-items: center; border: 1px solid #eaeded; border-radius: 6px; padding: 15px; margin-bottom: 12px; }
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

/* Custom Content Formatting for the Vuetify Popover Window */
.vuetify-tooltip-content {
  padding: 12px 14px;
  font-family: 'Inter', sans-serif;
  line-height: 1.45;
  display: grid;
  row-gap: 10px;
}

/* Header */
.vuetify-tooltip-content .tooltip-header {
  margin-bottom: 2px;
}

/* Metrics block */
.vuetify-tooltip-content .tooltip-body {
  display: grid;
  row-gap: 8px;
}

/* Label/value rows */
.vuetify-tooltip-content .metric-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.vuetify-tooltip-content .metric-label {
  color: #94a3b8;           /* slate-400 */
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.vuetify-tooltip-content .metric-value {
  color: #e2e8f0;           /* slate-200 */
  font-size: 0.78rem;
  font-weight: 600;
  text-align: right;
  line-height: 1.35;
}

/* Main 48h delta number */
.vuetify-tooltip-content .perf-value {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

/* Chart container spacing */
.vuetify-tooltip-content .relative-chart-wrapper {
  margin-top: 4px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 10px;
  padding: 6px;
  background: rgba(15, 23, 42, 0.55);
}

/* Empty/loading states inside chart area */
.vuetify-tooltip-content .chart-state-msg {
  color: #94a3b8;
  font-size: 0.73rem;
  font-style: italic;
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

/* Small ticker subtitle string layout for the countdown readout */
.clock-countdown-msg {
  font-size: 0.7rem;
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
.scrollable-dialog {
  width: min(760px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
}

.scrollable-dialog .dialog-body {
  max-height: calc(90vh - 72px); /* header offset */
  overflow-y: auto;
  padding-bottom: 16px;
}

.dialog-content-row {
  min-height: calc(100vh - 48px);
  height: auto;            /* allow content growth */
  overflow: visible;       /* don't clip stacked cols */
}
</style>