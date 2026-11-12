<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, shallowRef } from 'vue'
import api from '@/axios'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, Legend)

const props = defineProps<{ open: boolean; ticker: string | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const ranges: Array<'1W'|'1M'|'3M'|'6M'|'1Y'|'5Y'> = ['1W','1M','3M','6M','1Y','5Y']
const range = ref<'1W'|'1M'|'3M'|'6M'|'1Y'|'5Y'>('1M')

const loading = ref(false)
const errorMsg = ref('')
const points = ref<{ date: string; close: number }[]>([])
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
let chart: Chart<'line'> | null = null
let historyRequestId = 0

const destroyChart = () => {
  if (chart) {
    chart.destroy()
    chart = null
  }
}

const buildChart = async (requestId: number) => {
  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => setTimeout(resolve, 30))
  if (requestId !== historyRequestId || !props.open) return

  const canvas = canvasRef.value
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.warn('canvasRef is not a canvas yet:', canvas)
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.warn('No 2D context from canvas')
    return
  }

  destroyChart()

  const labels = points.value.map(p => p.date)
  const values = points.value.map(p => Number(p.close || 0))
  const first = values[0] ?? 0
  const last = values.length ? values[values.length - 1] : 0
  const color = last >= first ? '#10b981' : '#ef4444'
  console.log(points.value.length)
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25,
        fill: false,
      }],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const i = items?.[0]?.dataIndex ?? 0
            const raw = labels[i]
            const d = new Date(`${raw}T00:00:00Z`)
            return Number.isNaN(d.getTime())
              ? String(raw)
              : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
          },
          label: (ctx) => `$${Number(ctx.parsed.y).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          autoSkip: true,
          maxTicksLimit: range.value === '1W' ? 7 : range.value === '1M' ? 6 : 8,
          maxRotation: 0,
          minRotation: 0,
          callback: (value) => {
            const raw = labels[Number(value)]
            if (!raw) return ''
            const date = new Date(`${raw}T00:00:00Z`)
            if (Number.isNaN(date.getTime())) return raw

            if (range.value === '1W') {
              return date.toLocaleDateString('en-US', {
                weekday: 'short',
                timeZone: 'UTC',
              })
            }
            if (range.value === '1M' || range.value === '3M') {
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
              })
            }
            return date.toLocaleDateString('en-US', {
              month: 'short',
              year: '2-digit',
              timeZone: 'UTC',
            })
          }
        }
      },
      y: {
        display: true,
        ticks: {
          maxTicksLimit: 6,
          callback: (v) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        }
      }
    }
  }
  })
}

const load = async (requestId: number, ticker: string, selectedRange: string) => {
  loading.value = true
  errorMsg.value = ''
  points.value = []
  destroyChart()

  try {
    const { data } = await api.get('/market-masters/assets/history/', {
      params: { ticker, range: selectedRange },
    })
    if (requestId !== historyRequestId) return

    if (Array.isArray(data.points)) {
      points.value = data.points
    } else if (Array.isArray(data.labels) && Array.isArray(data.prices)) {
      points.value = data.labels.map((date: string, i: number) => ({
        date,
        close: Number(data.prices[i]),
      }))
    } else {
      throw new Error('Unexpected history response')
    }

    loading.value = false
    await nextTick()
    if (requestId !== historyRequestId) return

    if (points.value.length) await buildChart(requestId)
  } catch (e: any) {
    if (requestId !== historyRequestId) return
    errorMsg.value = e?.response?.data?.error || 'Could not load history.'
    points.value = []
    loading.value = false
    destroyChart()
  }
}

watch(
  () => [props.open, props.ticker, range.value] as const,
  ([open, ticker, selectedRange]) => {
    const requestId = ++historyRequestId
    if (open && ticker) {
      void load(requestId, ticker, selectedRange)
    } else {
      loading.value = false
      destroyChart()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  ++historyRequestId
  destroyChart()
})

</script>

<template>
  <teleport to="body">
    <div v-if="open" class="mm-modal-backdrop" @click.self="emit('close')">
      <div class="mm-modal">
        <div class="mm-modal-header">
          <h3>{{ ticker }} History</h3>
          <button class="mm-close" @click="emit('close')">✕</button>
        </div>

        <div class="mm-ranges">
          <button
            v-for="r in ranges"
            :key="r"
            class="mm-range-btn"
            :class="{ active: range === r }"
            @click="range = r"
          >
            {{ r }}
          </button>
        </div>

        <div v-if="loading" class="mm-state">Loading chart...</div>
        <div v-else-if="errorMsg" class="mm-state mm-error">{{ errorMsg }}</div>
        <div v-else-if="!points.length" class="mm-state">No historical data available.</div>
        <div v-else class="mm-chart-wrap">
          <div class="text-caption">
            Latest available history: {{ points[points.length - 1].date }}
          </div>
          <div style="height:360px;">
            <canvas ref="canvasRef"></canvas>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.mm-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,.55); z-index: 30000; display:flex; align-items:center; justify-content:center; padding:16px; }
.mm-modal { width:min(900px,96vw); max-height:88vh; overflow:auto; background:#fff; border-radius:12px; box-shadow:0 20px 50px rgba(2,8,23,.35); padding:16px; }
.mm-modal-header { display:flex; align-items:center; justify-content:space-between; }
.mm-close { border:none; background:transparent; font-size:20px; cursor:pointer; }
.mm-ranges { display:flex; gap:8px; margin:10px 0 14px; }
.mm-range-btn { border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; padding:6px 10px; cursor:pointer; }
.mm-range-btn.active { background:#dbeafe; border-color:#60a5fa; }
.mm-state { padding:16px 4px; color:#475569; }
.mm-error { color:#b91c1c; }
.mm-chart-wrap { position: relative; width: 100%; height: 360px; min-height: 360px; }
.mm-chart-wrap canvas { display: block; width: 100% !important; height: 100% !important; }
</style>