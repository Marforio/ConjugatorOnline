<template>
  <v-container fluid class="bg-grey-lighten-4 min-h-screen pa-6">
    <!-- Header banner block -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-black text-slate-800 mb-1">Market Masters: Teacher Panel 🎓</h1>
        <p class="text-subtitle-1 text-slate-500">
          Create competitions for your students and monitor their performance.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- 🏆 LEFT SIDE: TOURNAMENT DEPLOYMENT CONTROLS -->
      <v-col cols="12" md="5">
        <v-card variant="flat" class="pa-5 border bg-white rounded-lg">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-2">Launch New Competition 🏆</h2>
          <v-alert type="info" variant="tonal" density="compact" class="text-caption mb-4">
            Setting minimum asset counts prevents students from placing all their capital into a single volatile asset.
          </v-alert>

          <v-form @submit.prevent="handleCreateCompetition">
            <v-text-field
              v-model="newComp.name"
              label="Competition Name"
              placeholder="e.g., Finance 101: Fall Alpha Challenge"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            ></v-text-field>

            <v-row>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model.number="newComp.budget"
                  label="Starting Capital ($)"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model.number="newComp.min_assets_required"
                  label="Min Assets Required"
                  type="number"
                  min="1"
                  max="10"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- ⚙️ NEW: COMPETITION COMPLEXITY TOGGLE -->
            <v-select
              v-model="newComp.trading_mode"
              label="Competition Complexity Level"
              :items="[
                { title: '🟢 Basic Mode (Cash Only - Buy/Sell)', value: 'BASIC' },
                { title: '🔥 Advanced Mode (Margin Shorting & Leverage)', value: 'ADVANCED' }
              ]"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            ></v-select>

            <!-- 📈 NEW: CONDITIONAL GLOBAL LEVERAGE CAP CONFIGURATION -->
            <v-expand-transition>
              <div v-if="newComp.trading_mode === 'ADVANCED'" class="bg-grey-lighten-4 rounded pa-3 mb-4 border">
                <div class="text-caption font-weight-bold text-slate-700 mb-1 d-flex justify-space-between">
                  <span>Max Global Portfolio Leverage Cap:</span>
                  <span class="text-primary font-weight-black">{{ newComp.leverage_setting }}x Multiplier</span>
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
                ></v-slider>
                <div class="text-slate-400 mt-1" style="font-size: 0.65rem; line-height: 1.2;">
                  *Applies as a total exposure safety constraint across the entire portfolio balance ($TotalExposure \le NetEquity \times Leverage$).
                </div>
              </div>
            </v-expand-transition>

            <v-text-field
              v-model="newComp.join_start_time"
              label="Registration Window Starts"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              persistent-placeholder
              required
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newComp.join_end_time"
              label="Registration Window Closes (Strict Lock)"
              type="datetime-local"
              variant="outlined"
              density="comfortable"
              persistent-placeholder
              required
              class="mb-4"
            ></v-text-field>

            <v-btn type="submit" color="success" block size="large" class="font-weight-bold">
              Deploy Competition / Get Code
            </v-btn>
          </v-form>
        </v-card>

        <v-card variant="flat" class="pa-5 border bg-white rounded-lg mt-6">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-2">Add students to competition</h2>
          <p class="text-caption text-slate-500 mb-4">
            Create investment portfolios within the competition for your students
          </p>

          <v-form @submit.prevent="handleEnrollStudent">
            <v-select
              v-model="enrollmentForm.competition_id"
              label="Target Competition Pool"
              :items="competitions"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            ></v-select>

            <v-select
              v-model="enrollmentForm.student_id"
              label="Select Student from Roster"
              :items="userStore.teacherRoster"
              :item-title="item => `${item.first_name} ${item.last_name} (${item.initials})`"
              item-value="id"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            ></v-select>

            <v-text-field
              v-model="enrollmentForm.portfolio_name"
              label="Custom Portfolio Name (Optional)"
              placeholder="e.g., Alpha Growth Fund"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              hide-details
            ></v-text-field>

            <v-btn type="submit" color="primary" block class="font-weight-bold" :loading="isEnrolling">
              Provision Portfolio Profile
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- 📊 RIGHT SIDE: REAL-TIME TOURNAMENT MONITORING -->
      <v-col cols="12" md="7">
        <v-card variant="flat" class="pa-5 border bg-white rounded-lg">
          <h2 class="text-h6 font-weight-bold text-slate-800 mb-4 border-b pb-2">Active Tournaments & Classroom Status 📊</h2>
          
          <v-row v-if="competitions.length === 0">
            <v-col cols="12" class="text-center py-8 text-slate-400 border border-dashed rounded-lg">
              <v-icon size="large" class="mb-2">mdi-trophy-outline</v-icon>
              <div>No active competitions created yet. Use the deployment engine to spin up a session.</div>
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
                  <h3 class="text-subtitle-1 font-weight-bold text-slate-800">{{ comp.name }}</h3>
                  <div class="d-flex align-center gap-2 mt-1">
                    <v-chip size="x-small" color="grey-darken-1" variant="flat">ID: {{ comp.id }}</v-chip>
                    <v-chip size="x-small" color="success" variant="flat">${{ parseFloat(comp.budget).toLocaleString() }}</v-chip>
                    <v-chip size="x-small" :color="comp.trading_mode === 'ADVANCED' ? 'purple' : 'teal'" variant="flat">
                      {{ comp.trading_mode || 'BASIC' }}
                    </v-chip>
                    <v-chip size="x-small" :color="comp.is_joinable ? 'blue' : 'error'" variant="flat">
                      {{ comp.is_joinable ? 'Open' : 'Locked' }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-slate-400 mt-1">
                    Closes: {{ formatDate(comp.join_end_time) }}
                  </div>
                </div>
                <v-btn color="primary" size="small" class="font-weight-bold" @click="fetchCompetitionDetails(comp.id)">
                  View Metrics
                </v-btn>
              </div>
            </v-list-item>
          </v-list>

          <!-- CLASS PERFORMANCE DRILL DOWN INSIGHTS -->
          <v-expand-transition>
            <div v-if="selectedCompDetails" class="border-t-2 pt-4 mt-4">
              <div class="d-flex justify-space-between align-center mb-3">
                <h3 class="text-subtitle-1 font-weight-bold text-slate-800">
                  Class Performance: {{ selectedCompDetails.name }}
                </h3>
                <v-btn variant="text" color="error" size="small" compact @click="selectedCompDetails = null">Clear</v-btn>
              </div>

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
                  <v-row v-if="!selectedCompDetails.portfolios?.length" class="ma-0">
                    <v-col class="text-center text-slate-400 py-4">No student records enrolled inside this session.</v-col>
                  </v-row>
                  <tr v-for="portfolio in selectedCompDetails.portfolios" :key="portfolio.id">
                    <td class="font-mono text-primary font-weight-bold">{{ portfolio.student_web_id }}</td>
                    <td>{{ portfolio.student_initials }}</td>
                    <td class="font-mono">${{ parseFloat(portfolio.cash_balance).toLocaleString() }}</td>
                    <td class="font-mono" :class="parseFloat(portfolio.borrowed_funds_balance) > 0 ? 'text-rose-600 font-weight-bold' : 'text-slate-400'">
                      ${{ parseFloat(portfolio.borrowed_funds_balance || 0).toFixed(2) }}
                    </td>
                    <td class="font-mono font-weight-black text-right text-slate-900">${{ calculatePortfolioValue(portfolio) }}</td>
                    <td class="text-center">
                      <v-chip 
                        size="x-small" 
                        :color="portfolio.assets.length < selectedCompDetails.min_assets_required ? 'warning' : 'success'" 
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{ portfolio.assets.length }} / {{ selectedCompDetails.min_assets_required }}
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
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '@/axios';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const competitions = ref([])
const selectedCompId = ref(null)
const selectedCompDetails = ref(null)
const isEnrolling = ref(false)
const enrollmentForm = ref({
  competition_id: null,
  student_id: null,
  portfolio_name: ''
})

// ⚡ Baseline payload fields integrated with tracking rules
const newComp = ref({
  name: '',
  budget: 100000,
  min_assets_required: 3,
  trading_mode: 'BASIC', // Baseline setup mode selection option
  leverage_setting: 1,   // Defaults to 1x (No extra leverage)
  join_start_time: '',
  join_end_time: ''
})

onMounted(async () => {
  try {
    const res = await api.get('/market-masters/competitions/')
    competitions.value = res.data
    
    await userStore.ensureUserLoaded() 
  } catch (err) {
    console.error("Dashboard initialization exception:", err)
  }
})

const handleEnrollStudent = async () => {
  if (!enrollmentForm.value.competition_id || !enrollmentForm.value.student_id) return
  
  isEnrolling.value = true
  try {
    // Fire assignment parameters to our single endpoint route target
    await api.post('/market-masters/teacher/allocate/', enrollmentForm.value)
    
    alert("Student successfully assigned to tournament!")
    
    // Reset selection targets
    enrollmentForm.value.student_id = null
    enrollmentForm.value.portfolio_name = ''
    
    // Refresh table stats immediately if a competition is currently open/selected
    if (selectedCompId.value) {
      fetchCompetitionDetails(selectedCompId.value)
    }
  } catch (err) {
    console.error("Enrollment error logged:", err.response?.data)
    alert(err.response?.data?.error || "Unable to complete allocation parameters.")
  } finally {
    isEnrolling.value = false
  }
}

const handleCreateCompetition = async () => {
  try {
    // TRANSLATION LAYER: Map Vue states cleanly to your backend model attributes
    const payload = {
      name: newComp.value.name,
      budget: newComp.value.budget,
      min_assets_required: newComp.value.min_assets_required,
      join_start_time: newComp.value.join_start_time,
      join_end_time: newComp.value.join_end_time,
      
      // Basic mode maps to 'STATIC' portfolios, Advanced maps to 'DYNAMIC'
      portfolio_type: newComp.value.trading_mode === 'ADVANCED' ? 'DYNAMIC' : 'STATIC',
      
      // If basic mode is picked, cap leverage at 1x, otherwise use the slider's value
      max_leverage_tier: newComp.value.trading_mode === 'ADVANCED' ? parseInt(newComp.value.leverage_setting) : 1
    }

    await api.post('/market-masters/competitions/', payload)
    
    alert("New competition deployed successfully!")
    
    // Reset inputs back to baseline configurations
    newComp.value = { name: '', budget: 100000, min_assets_required: 3, trading_mode: 'BASIC', leverage_setting: 1, join_start_time: '', join_end_time: '' }
    fetchTeacherDashboard()
  } catch (err) {
    console.error("Backend validation rejection errors:", err.response?.data)
    alert("Failed to deploy tournament. Check console for field parameters errors.")
  }
}

const fetchCompetitionDetails = async (id) => {
  selectedCompId.value = id
  try {
    const res = await api.get(`/market-masters/competitions/${id}/`)
    selectedCompDetails.value = res.data
  } catch (err) {
    console.error("Failed to load competition metrics payload:", err)
  }
}

const calculatePortfolioValue = (portfolio) => {
  return parseFloat(portfolio.cash_balance).toLocaleString()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* 🧹 Extraneous pure CSS rule properties purged. Styles are now derived directly from Vuetify primitives! */
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
