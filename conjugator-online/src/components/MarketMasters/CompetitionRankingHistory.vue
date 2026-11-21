<template>
  <div class="border rounded-lg pa-4 mt-4">
    <div class="d-flex align-center justify-space-between ga-2 mb-2">
      <div>
        <div class="text-subtitle-1 font-weight-bold">
          Ranking evolution
        </div>
        <div class="text-caption text-medium-emphasis">
          No ranking snapshots are available after the first seven days yet.
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
  competitionStart: {
    type: String,
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

    // First seven New York calendar dates, including the start date.
    const start = new Date(props.competitionStart)
    if (Number.isNaN(start.getTime())) {
      throw new Error('Invalid competition start date')
    }

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(start)

    const part = type => parts.find(p => p.type === type)?.value
    const cutoff = new Date(Date.UTC(
      Number(part('year')),
      Number(part('month')) - 1,
      Number(part('day')) + 7
    )).toISOString().slice(0, 10)

    const firstIndex = dates.findIndex(date => date >= cutoff)
    if (firstIndex === -1) return

    const chartDates = dates.slice(firstIndex)

    // Select the five highest-ranked participants on the latest day.
    const latestIndex = dates.length - 1
    const visibleSeries = series
      .filter(row =>
        Array.isArray(row.ranks) &&
        Number.isInteger(row.ranks[latestIndex])
      )
      .sort((a, b) => a.ranks[latestIndex] - b.ranks[latestIndex])
      .slice(0, 5)
      .map(row => ({
        ...row,
        ranks: row.ranks.slice(firstIndex),
      }))

    if (!chartDates.length || !visibleSeries.length) return

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
      data: { labels: chartDates, datasets },
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