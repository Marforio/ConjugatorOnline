<template>
  <v-container fluid class="bg-grey-lighten-4 min-h-screen pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-black text-slate-800 mb-1">Market Masters: Teacher Panel 🎓</h1>
        <p class="text-subtitle-1 text-slate-500">
          1) Create competitions, 2) enroll students, 3) monitor and finalize results.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <!-- STEP 1 -->
        <v-card variant="flat" class="pa-5 border bg-white rounded-lg">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-2">
            <v-icon class="me-1">mdi-numeric-1-box</v-icon>
            Launch New Competition
          </h2>

          <v-form @submit.prevent="handleCreateCompetition">
            <v-text-field
              v-model="newComp.name"
              label="Competition Name"
              placeholder="e.g., Finance 101: Fall Alpha Challenge"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            />

            <v-row>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model="uiCustomBudget"
                  @input="onBudgetInput"
                  label="Starting Capital ($)"
                  type="text"
                  inputmode="decimal"
                  placeholder="100'000.00"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model.number="newComp.min_assets_required"
                  label="Min Assets Required"
                  type="number"
                  min="1"
                  max="20"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>

            <!-- NEW: decoupled trading level -->
            <v-select
              v-model="newComp.trading_level"
              label="Competition Level"
              :items="[
                { title: '🟢 Basic Level (BUY/SELL only)', value: 'BASIC' },
                { title: '🔥 Advanced Level (BUY/SELL/SHORT/COVER)', value: 'ADVANCED' }
              ]"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <!-- NEW: decoupled portfolio structure -->
            <v-select
              v-model="newComp.portfolio_type"
              label="Portfolio Mode"
              :items="[
                { title: '📌 Static (cutoff applies)', value: 'STATIC' },
                { title: '⚡ Dynamic (active until end time)', value: 'DYNAMIC' }
              ]"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <v-expand-transition>
              <div v-if="isAdvancedLevel" class="bg-grey-lighten-4 rounded pa-3 mb-4 border">
                <div class="text-caption font-weight-bold text-slate-700 mb-1 d-flex justify-space-between">
                  <span>Max Leverage:</span>
                  <span class="text-primary font-weight-black">{{ newComp.leverage_setting }}x</span>
                </div>
                <v-slider
                  v-model="newComp.leverage_setting"
                  :min="1"
                  :max="10"
                  :step="1"
                  thumb-label
                  color="primary"
                  track-color="grey-lighten-2"
                  hide-details
                />
              </div>
            </v-expand-transition>

            <v-text-field
              v-model="newComp.start_time"
              label="Competition Start Date"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            />

            <v-expand-transition>
              <v-text-field
                v-if="isStaticMode"
                v-model="newComp.trade_cutoff_time"
                label="Trade Cutoff Date (Static only)"
                type="datetime-local"
                variant="outlined"
                density="comfortable"
                required
                class="mb-3"
                hint="After this time, allocations are locked until competition end."
                persistent-hint
              />
            </v-expand-transition>

            <v-text-field
              v-model="newComp.end_time"
              label="Competition End Date (Winner Declared)"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              required
              class="mb-4"
            />

            <v-btn type="submit" color="success" block size="large" class="font-weight-bold" :loading="isCreating">
              Create Competition
            </v-btn>
          </v-form>
        </v-card>

        <!-- STEP 2 -->
        <v-card variant="flat" class="pa-5 border bg-white rounded-lg mt-6">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-2">
            <v-icon class="me-1">mdi-numeric-2-box</v-icon>
            Add students to competition
          </h2>
          <p class="text-caption text-slate-500 mb-4">
            Select a competition and enroll one or more students from your roster.
          </p>

          <v-form @submit.prevent="handleEnrollStudents">
            <v-select
              v-model="enrollmentForm.competition_id"
              label="Select Competition"
              :items="competitions"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #append>
                    <v-chip size="x-small" variant="flat" color="primary">
                      {{ competitionStatus(item.raw) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-select
              v-model="enrollmentForm.student_ids"
              label="Select Students (Multi-select)"
              :items="userStore.teacherRoster"
              :item-title="item => `${item.first_name} ${item.last_name} (${item.initials})`"
              item-value="id"
              variant="outlined"
              density="comfortable"
              multiple
              chips
              closable-chips
              class="mb-4"
            />

            <v-btn type="submit" color="primary" block class="font-weight-bold" :loading="isEnrolling">
              Enroll Selected Students
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- RIGHT: STEP 3 -->
      <v-col cols="12" md="7">
        <v-card variant="flat" class="pa-5 border bg-white rounded-lg">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-4 border-b pb-2">
            <v-icon class="me-2">mdi-numeric-3-box</v-icon>
            Monitor Competitions
          </h2>

          <v-row v-if="competitions.length === 0">
            <v-col cols="12" class="text-center py-8 text-slate-400 border border-dashed rounded-lg">
              <v-icon size="large" class="mb-2">mdi-trophy-outline</v-icon>
              <div>No competitions yet. Create one from Step 1.</div>
            </v-col>
          </v-row>

          <v-list v-else variant="outlined" class="pa-0 border rounded-lg mb-6 max-h-60 overflow-y-auto">
            <v-list-item
              v-for="comp in competitions"
              :key="comp.id"
              :active="selectedCompId === comp.id"
              active-color="primary"
              class="border-b last-border-0 pa-4"
            >
              <div class="d-flex justify-space-between align-center w-100">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold text-slate-800">Competition: {{ comp.name }}</h3>
                  <div class="d-flex align-center gap-2 mt-1 flex-wrap">
                    <v-chip size="x-small" color="grey-darken-1" variant="flat">ID: {{ comp.id }}</v-chip>
                    <v-chip size="x-small" color="success" variant="flat">
                      ${{ Number(comp.budget || 0).toLocaleString() }}
                    </v-chip>
                    <v-chip size="x-small" :color="comp.portfolio_type === 'DYNAMIC' ? 'purple' : 'teal'" variant="flat">
                      {{ comp.portfolio_type }}
                    </v-chip>
                    <v-chip size="x-small" color="primary" variant="flat">
                      {{ competitionStatus(comp) }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-slate-400 mt-1">
                    Start: {{ formatDate(comp.start_time) }} · End: {{ formatDate(comp.end_time) }}
                    <span v-if="comp.portfolio_type === 'STATIC' && comp.trade_cutoff_time">
                      · Cutoff: {{ formatDate(comp.trade_cutoff_time) }}
                    </span>
                  </div>
                </div>
                <v-btn color="primary" size="small" class="font-weight-bold" @click="fetchCompetitionDetails(comp.id)">
                  View Ranking
                </v-btn>
              </div>
            </v-list-item>
          </v-list>

          <v-expand-transition>
            <div v-if="selectedCompDetails" class="border-t-2 pt-4 mt-4">
              <div class="d-flex justify-space-between align-center mb-3">
                <h3 class="text-subtitle-1 font-weight-bold text-slate-800">
                  Performance in {{ selectedCompDetails.name }}
                </h3>
                <div class="d-flex align-center gap-2">
                  <v-btn
                    v-if="!selectedCompDetails.is_finalized"
                    color="deep-purple"
                    size="small"
                    class="font-weight-bold"
                    :loading="isFinalizing"
                    @click="handleFinalizeCompetition"
                  >
                    Finalize Winner
                  </v-btn>
                  <v-btn variant="text" color="error" size="small" @click="selectedCompDetails = null">Clear</v-btn>
                </div>
              </div>

              <v-alert
                v-if="selectedCompDetails.is_finalized"
                type="success"
                variant="tonal"
                class="mb-3"
              >
                Winner declared
                <strong v-if="selectedCompDetails.winner_portfolio">
                  (Portfolio ID: {{ selectedCompDetails.winner_portfolio }})
                </strong>
                <span v-if="selectedCompDetails.winner_declared_at">
                  on {{ formatDate(selectedCompDetails.winner_declared_at) }}.
                </span>
              </v-alert>

              <v-table density="comfortable" class="border rounded text-caption">
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th class="font-weight-bold">Student Code</th>
                    <th class="font-weight-bold">Initials</th>
                    <th class="font-weight-bold">Available Cash</th>
                    <th class="font-weight-bold">Outstanding Debt</th>
                    <th class="font-weight-bold text-right">Portfolio Value</th>
                    <th class="font-weight-bold text-center">Assets Held</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!selectedCompDetails.portfolios?.length">
                    <td colspan="6" class="text-center text-slate-400 py-4">
                      No student portfolios enrolled in this competition.
                    </td>
                  </tr>
                  <tr v-for="portfolio in selectedCompDetails.portfolios || []" :key="portfolio.id">
                    <td class="font-mono text-primary font-weight-bold">{{ portfolio.student_web_id }}</td>
                    <td>{{ portfolio.student_initials }}</td>
                    <td class="font-mono">${{ Number(portfolio.cash_balance || 0).toLocaleString() }}</td>
                    <td class="font-mono" :class="Number(portfolio.borrowed_funds_balance || 0) > 0 ? 'text-rose-600 font-weight-bold' : 'text-slate-400'">
                      ${{ Number(portfolio.borrowed_funds_balance || 0).toFixed(2) }}
                    </td>
                    <td class="font-mono font-weight-black text-right text-slate-900">
                      ${{ calculatePortfolioValue(portfolio) }}
                    </td>
                    <td class="text-center">
                      <v-chip
                        size="x-small"
                        :color="(portfolio.assets?.length || 0) < selectedCompDetails.min_assets_required ? 'warning' : 'success'"
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{ portfolio.assets?.length || 0 }} / {{ selectedCompDetails.min_assets_required }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3500" location="top right">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const competitions = ref([])
const selectedCompId = ref(null)
const selectedCompDetails = ref(null)

const isCreating = ref(false)
const isEnrolling = ref(false)
const isFinalizing = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const showToast = (text, color = 'success') => {
  snackbar.value = { show: true, text, color }
}

// STEP 2: bulk enrollment model
const enrollmentForm = ref({
  competition_id: null,
  student_ids: [] // multi-select
})

// STEP 1: create competition model
const newComp = ref({
  name: '',
  budget: 100000,
  min_assets_required: 3,
  trading_level: 'BASIC',   
  portfolio_type: 'STATIC', 
  leverage_setting: 1,
  start_time: '',
  trade_cutoff_time: '',
  end_time: ''
})

const isStaticMode = computed(() => newComp.value.portfolio_type === 'STATIC')
const isAdvancedLevel = computed(() => newComp.value.trading_level === 'ADVANCED')

const uiCustomBudget = ref("100'000.00")

const onBudgetInput = (e) => {
  uiCustomBudget.value = formatWithApostrophes(e.target.value, "money")
}

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

const parseFormattedMoney = (raw) => {
  const cleaned = String(raw ?? '').replace(/'/g, '').replace(/,/g, '').trim()
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : NaN
}

watch(uiCustomBudget, (v) => {
  uiCustomBudget.value = formatWithApostrophes(v, "money")
})

const fetchCompetitions = async () => {
  try {
    const res = await api.get('/market-masters/competitions/')
    competitions.value = res.data || []
  } catch (err) {
    console.error('Failed loading competitions:', err)
    showToast('Failed to load competitions.', 'error')
  }
}

const fetchCompetitionDetails = async (id) => {
  selectedCompId.value = id
  try {
    const res = await api.get(`/market-masters/competitions/${id}/`)
    selectedCompDetails.value = res.data
  } catch (err) {
    console.error('Failed to load competition metrics payload:', err)
    showToast('Unable to load competition metrics.', 'error')
  }
}

onMounted(async () => {
  await userStore.ensureUserLoaded()
  await fetchCompetitions()
})

const validateCompetitionPayload = () => {
  const c = newComp.value
  if (!c.name?.trim()) return 'Competition name is required.'
  if (!c.start_time || !c.end_time) return 'Start and end time are required.'

  const start = new Date(c.start_time)
  const end = new Date(c.end_time)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Invalid start or end datetime.'
  if (end <= start) return 'End time must be after start time.'

  if (isStaticMode.value) {
    if (!c.trade_cutoff_time) return 'Trade cutoff is required for static competitions.'
    const cutoff = new Date(c.trade_cutoff_time)
    if (Number.isNaN(cutoff.getTime())) return 'Invalid trade cutoff datetime.'
    if (cutoff < start || cutoff > end) return 'Trade cutoff must be between start and end time.'
    c.leverage_setting = 1 // hard-enforce in UI
  }
  return null
}

const handleCreateCompetition = async () => {
  const validationError = validateCompetitionPayload()
  if (validationError) {
    showToast(validationError, 'warning')
    return
  }

  isCreating.value = true
  const parsedBudget = parseFormattedMoney(uiCustomBudget.value)
    if (!Number.isFinite(parsedBudget) || parsedBudget < 1000) {
      showToast('Starting capital must be a valid number >= 1000.', 'warning')
      return
    }
  try {
    const payload = {
        name: newComp.value.name.trim(),
        budget: parsedBudget,
        min_assets_required: newComp.value.min_assets_required,
        start_time: newComp.value.start_time,
        end_time: newComp.value.end_time,
        trade_cutoff_time: isStaticMode.value ? newComp.value.trade_cutoff_time : null,
        portfolio_type: newComp.value.portfolio_type,         // STATIC/DYNAMIC
        trading_level: newComp.value.trading_level,           // BASIC/ADVANCED
        max_leverage_tier: isAdvancedLevel.value
          ? parseInt(newComp.value.leverage_setting || 1, 10)
          : 1
      }

    await api.post('/market-masters/competitions/', payload)
    showToast('Competition created successfully!')

    newComp.value = {
      name: '',
      budget: uiCustomBudget.value,
      min_assets_required: 3,
      trading_level: 'BASIC',
      portfolio_type: 'STATIC',
      leverage_setting: 1,
      start_time: '',
      trade_cutoff_time: '',
      end_time: ''
    }

    await fetchCompetitions()
  } catch (err) {
    console.error('Backend validation rejection errors:', err?.response?.data || err)
    showToast(err?.response?.data?.error || 'Failed to create competition.', 'error')
  } finally {
    isCreating.value = false
  }
}

const handleEnrollStudents = async () => {
  const { competition_id, student_ids } = enrollmentForm.value
  if (!competition_id || !student_ids?.length) {
    showToast('Select a competition and at least one student.', 'warning')
    return
  }

  isEnrolling.value = true
  try {
    // If backend currently supports only one student_id per request, loop.
    // Later you can replace this with one bulk endpoint.
    await Promise.all(
      student_ids.map(student_id =>
        api.post('/market-masters/teacher/allocate/', { competition_id, student_id })
      )
    )

    showToast(`Enrolled ${student_ids.length} student(s) successfully.`)
    enrollmentForm.value.student_ids = []

    if (selectedCompId.value === competition_id) {
      await fetchCompetitionDetails(competition_id)
    }
  } catch (err) {
    console.error('Enrollment error logged:', err?.response?.data || err)
    showToast(err?.response?.data?.error || 'Unable to enroll selected students.', 'error')
  } finally {
    isEnrolling.value = false
  }
}

const handleFinalizeCompetition = async () => {
  if (!selectedCompId.value) return
  isFinalizing.value = true
  try {
    await api.post(`/market-masters/competitions/${selectedCompId.value}/finalize/`, { force: false })
    showToast('Competition finalized. Winner declared.')
    await fetchCompetitionDetails(selectedCompId.value)
    await fetchCompetitions()
  } catch (err) {
    console.error('Finalize error:', err?.response?.data || err)
    showToast(err?.response?.data?.error || 'Could not finalize competition.', 'error')
  } finally {
    isFinalizing.value = false
  }
}

const calculatePortfolioValue = (portfolio) => {
  // For now fallback to cash; replace with backend-provided net_value when available.
  return Number(portfolio.cash_balance || 0).toLocaleString()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const competitionStatus = (comp) => {
  if (comp.is_finalized) return 'Finalized'
  if (!comp.start_time || !comp.end_time) return 'Unknown'

  const now = new Date()
  const start = new Date(comp.start_time)
  const end = new Date(comp.end_time)

  if (now < start) return 'Scheduled'
  if (now > end) return 'Ended'

  if (comp.portfolio_type === 'STATIC' && comp.trade_cutoff_time) {
    const cutoff = new Date(comp.trade_cutoff_time)
    if (now > cutoff) return 'Trading Closed'
  }
  return 'Active'
}
</script>

<style scoped>
.max-h-60 {
  max-height: 400px;
}
.gap-2 {
  gap: 8px;
}
.font-mono {
  font-family: monospace;
}
</style>
