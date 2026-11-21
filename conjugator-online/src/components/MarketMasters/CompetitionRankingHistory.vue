<template>
  <div class="border rounded-lg pa-4 mt-4">
    <div class="d-flex align-center justify-space-between ga-2 mb-2">
      <div>
        <div class="text-subtitle-1 font-weight-bold">
          Ranking evolution
        </div>
        <div class="text-caption text-medium-emphasis">
          Latest available snapshot per New York day. Rank 1 is at the top.
        </div>
      </div>

      <v-btn
        variant="text"
        size="small"
        color="primary"
        :loading="loading"
        @click="loadHistory"
      >
        Refresh
      </v-btn>
    </div>

    <div v-if="loading" class="py-4 text-caption">
      Loading ranking history...
    </div>

    <v-alert v-else-if="error" type="warning" variant="tonal" density="compact">
      {{ error }}
    </v-alert>

    <div v-else-if="!hasData" class="py-4 text-caption text-medium-emphasis">
      No competition snapshots are available yet.
    </div>

    <div v-else style="height: 340px">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import api from '@/axios'

const props = defineProps({
  competitionId: {
    type: [Number, String],
    required: true,
  },
})

const canvasRef = ref(null)
const loading = ref(false)
const error = ref('')
const hasData = ref(false)

let chart = null
let requestId = 0

function destroyChart() {
  chart?.destroy()
  chart = null
}

async function loadHistory() {
  const id = props.competitionId
  const currentRequest = ++requestId

  destroyChart()
  hasData.value = false
  error.value = ''

  if (!id) {
    loading.value = false
    return
  }

  loading.value = true

  try {
    const { data } = await api.get(
      `/market-masters/competitions/${id}/ranking-history/`
    )

    if (currentRequest !== requestId) return

    const dates = data.dates
    const series = data.series

    if (!Array.isArray(dates) || !Array.isArray(series)) {
      throw new Error('Invalid ranking history response')
    }

    const visibleSeries = series.filter(
      row => Array.isArray(row.ranks) && row.ranks.some(rank => rank != null)
    )

    if (!dates.length || !visibleSeries.length) return

    hasData.value = true
    loading.value = false
    await nextTick()

    if (currentRequest !== requestId || !canvasRef.value) return

    const datasets = visibleSeries.map((row, index) => {
      const color = `hsl(${Math.round(index * 137.508) % 360}, 70%, 42%)`

      return {
        label: row.label,
        data: row.ranks,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 6,
        spanGaps: false,
      }
    })

    chart = new Chart(canvasRef.value, {
      type: 'line',
      data: { labels: dates, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: true },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: context =>
                `${context.dataset.label}: rank ${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
              maxRotation: 0,
            },
            grid: { display: false },
          },
          y: {
            reverse: true,
            min: 1,
            max: Math.max(2, series.length),
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Rank' },
          },
        },
      },
    })
  } catch (err) {
    if (currentRequest !== requestId) return
    console.error('Failed to load ranking history:', err)
    hasData.value = false
    error.value = 'Unable to load ranking history.'
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

watch(() => props.competitionId, loadHistory, { immediate: true })

onBeforeUnmount(() => {
  requestId++
  destroyChart()
})
</script>