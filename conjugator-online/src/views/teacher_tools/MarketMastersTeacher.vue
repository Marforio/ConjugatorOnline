<template>
  <div class="teacher-dashboard-container">
    <header class="dashboard-header">
      <h1>Market Masters: Instructor Panel 🎓</h1>
      <p class="subtitle">Set tournament boundaries, issue start budgets, and track classroom performance metrics.</p>
    </header>

    <div class="teacher-grid">
      
      <section class="control-panel-card">
        <h2>Launch New Competition 🏆</h2>
        <p class="panel-instruction">
          Define explicit guardrails. Setting asset minimums prevents students from placing all their capital into a single volatile cryptocurrency.
        </p>

        <form @submit.prevent="handleCreateCompetition" class="creation-form">
          <div class="form-group">
            <label>Tournament Name</label>
            <input 
              type="text" 
              v-model="newComp.name" 
              placeholder="e.g., Finance 101: Fall Alpha Challenge" 
              required 
              class="form-control"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Starting Capital ($)</label>
              <input 
                type="number" 
                v-model="newComp.budget" 
                placeholder="100000" 
                required 
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Min Assets Required</label>
              <input 
                type="number" 
                v-model="newComp.min_assets_required" 
                min="1" 
                max="10" 
                required 
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Registration Window Starts</label>
            <input 
              type="datetime-local" 
              v-model="newComp.join_start_time" 
              required 
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Registration Window Closes (Strict Lock)</label>
            <input 
              type="datetime-local" 
              v-model="newComp.join_end_time" 
              required 
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-success full-width">
            Deploy Live Tournament Code
          </button>
        </form>
      </section>

      <section class="control-panel-card">
        <h2>Active Tournaments & Status Monitoring 📊</h2>
        
        <div v-if="competitions.length === 0" class="empty-state">
          <p>No active competitions created yet. Use the form on the left to spin up your first tournament.</p>
        </div>

        <div v-else class="competitions-wrapper">
          <div 
            v-for="comp in competitions" 
            :key="comp.id" 
            class="comp-monitor-row"
            :class="{ 'selected': selectedCompId === comp.id }"
          >
            <div class="comp-summary-info">
              <h3>{{ comp.name }}</h3>
              <div class="meta-badges">
                <span class="badge id-badge">ID: {{ comp.id }}</span>
                <span class="badge balance-badge">${{ parseFloat(comp.budget).toLocaleString() }}</span>
                <span :class="['badge', comp.is_joinable ? 'open' : 'closed']">
                  {{ comp.is_joinable ? 'Open Registration' : 'Locked' }}
                </span>
              </div>
              <p class="dates-meta">
                Closes: {{ formatDate(comp.join_end_time) }}
              </p>
            </div>
            
            <div class="comp-summary-actions">
              <button class="btn btn-primary btn-sm" @click="fetchCompetitionDetails(comp.id)">
                View Classroom Metrics
              </button>
            </div>
          </div>
        </div>

        <div v-if="selectedCompDetails" class="insights-section">
          <div class="insights-header">
            <h3>Class Performance: {{ selectedCompDetails.name }}</h3>
            <button class="close-text" @click="selectedCompDetails = null">Clear</button>
          </div>

          <table class="teacher-metrics-table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Initials</th>
                <th>Available Cash</th>
                <th>Portfolio Value</th>
                <th>Assets Held</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="portfolio in selectedCompDetails.portfolios" :key="portfolio.id">
                <td class="font-mono">{{ portfolio.student_web_id }}</td>
                <td>{{ portfolio.student_initials }}</td>
                <td class="font-mono">${{ parseFloat(portfolio.cash_balance).toLocaleString() }}</td>
                <td class="font-mono font-bold">${{ calculatePortfolioValue(portfolio) }}</td>
                <td>
                  <span class="holding-count-indicator" :class="{ 'warning': portfolio.assets.length < selectedCompDetails.min_assets_required }">
                    {{ portfolio.assets.length }} / {{ selectedCompDetails.min_assets_required }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const competitions = ref([])
const selectedCompId = ref(null)
const selectedCompDetails = ref(null)

const newComp = ref({
  name: '',
  budget: 100000,
  min_assets_required: 3,
  join_start_time: '',
  join_end_time: ''
})

const fetchTeacherDashboard = async () => {
  try {
    // Expected endpoint back from your custom Django view handles list retrieval
    const res = await axios.get('/api/teacher/market-masters/competitions/')
    competitions.value = res.data
  } catch (err) {
    console.error("Failed to recover instructor dashboard contexts:", err)
  }
}

onMounted(() => {
  fetchTeacherDashboard()
})

const handleCreateCompetition = async () => {
  try {
    await axios.post('/api/teacher/market-masters/competitions/', newComp.value)
    alert("New structural tournament instance launched successfully!")
    // Reset form fields
    newComp.value = { name: '', budget: 100000, min_assets_required: 3, join_start_time: '', join_end_time: '' }
    fetchTeacherDashboard()
  } catch (err) {
    alert("Rejection on model parameters processing. Verify date structures format matches Django timezone validations.")
  }
}

const fetchCompetitionDetails = async (id) => {
  selectedCompId.value = id
  try {
    // Requests extended operational fields, returning sub-array records for portfolios
    const res = await axios.get(`/api/teacher/market-masters/competitions/${id}/`)
    selectedCompDetails.value = res.data
  } catch (err) {
    console.error("Failed to load competition metrics payload:", err)
  }
}

const calculatePortfolioValue = (portfolio) => {
  // Placeholder logic processing: in real view, cross-reference assets array total values
  return parseFloat(portfolio.cash_balance).toLocaleString()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.teacher-dashboard-container {
  padding: 30px 20px;
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}
.dashboard-header { max-width: 1200px; margin: 0 auto 30px auto; }
.dashboard-header h1 { color: #2c3e50; font-size: 2rem; margin: 0; }
.subtitle { color: #7f8c8d; margin-top: 5px; }

.teacher-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 30px;
}
.control-panel-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.control-panel-card h2 { margin-top: 0; font-size: 1.3rem; color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; }
.panel-instruction { background: #e8f4f8; color: #2980b9; padding: 12px; border-radius: 4px; font-size: 0.85rem; line-height: 1.4; margin-bottom: 20px; }

/* REUSABLE FORM GROUP SYSTEM */
.creation-form { display: flex; flex-direction: column; gap: 15px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: bold; color: #34495e; margin-bottom: 6px; }
.form-control { width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box; font-size: 0.9rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

/* COMP DATA DISPLAY ROW */
.competitions-wrapper { display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; }
.comp-monitor-row { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #fdfefe; border: 1px solid #e2e8f0; border-radius: 6px; transition: all 0.2s; }
.comp-monitor-row.selected { border-color: #3498db; background: #f4f9fd; }
.comp-summary-info h3 { margin: 0 0 6px 0; font-size: 1.05rem; color: #2c3e50; }
.meta-badges { display: flex; gap: 8px; margin-bottom: 6px; }
.badge { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: white; text-transform: uppercase; }
.id-badge { background: #7f8c8d; }
.balance-badge { background: #27ae60; }
.badge.open { background: #3498db; }
.badge.closed { background: #e74c3c; }
.dates-meta { margin: 0; font-size: 0.75rem; color: #95a5a6; }

/* LIVE CLASSROOM INSIGHTS TABLE */
.insights-section { margin-top: 30px; border-top: 2px dashed #bdc3c7; padding-top: 20px; }
.insights-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.insights-header h3 { margin: 0; font-size: 1.15rem; color: #2c3e50; }
.close-text { background: transparent; border: none; color: #e74c3c; cursor: pointer; font-weight: bold; }
.teacher-metrics-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left; }
.teacher-metrics-table th, .teacher-metrics-table td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
.teacher-metrics-table th { background: #f8f9fa; color: #7f8c8d; font-weight: bold; }

.font-mono { font-family: monospace; font-size: 0.95rem; }
.font-bold { font-weight: bold; }
.holding-count-indicator { font-weight: bold; color: #27ae60; }
.holding-count-indicator.warning { color: #e67e22; background: #fef5ed; padding: 2px 4px; border-radius: 4px; }

/* CORE ACTION BUTTONS TOOLKIT */
.btn { padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; }
.btn-sm { padding: 6px 12px; font-size: 0.8rem; }
.btn-primary { background: #3498db; color: white; }
.btn-success { background: #2ecc71; color: white; }
.full-width { width: 100%; }
.empty-state { padding: 30px; text-align: center; border: 2px dashed #cbd5e0; color: #718096; border-radius: 6px; }
</style>