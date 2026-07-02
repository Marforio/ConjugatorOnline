<template>
  <v-col cols="12" md="6" class="d-flex">
    <v-card
      class="pa-5 d-flex flex-column justify-space-between bg-orange-panel rounded-xl border-orange w-100 shadow-sm"
      elevation="0"
    >
      <div>
        <v-card-title class="text-h5 font-weight-black text-orange-header d-flex align-center pb-1">
          <v-icon class="me-3 mb-1 text-orange-icon" size="26">mdi-chart-pie</v-icon>
          Error Analysis
        </v-card-title>
        <v-card-subtitle class="font-weight-medium text-orange-subtitle">
          <span v-if="totalErrors > 0">
            Across <strong>{{ totalErrors }} error{{ totalErrors !== 1 ? 's' : '' }}</strong> in your last 10 games
          </span>
          <span v-else class="text-grey-darken-2">
            Play more games to analyze your error patterns
          </span>
        </v-card-subtitle>
        <v-divider class="my-3 border-orange alpha-divider" />
      </div>

      <!-- Chart Container -->
      <div v-if="totalErrors > 0" class="flex-grow-1 d-flex flex-column justify-center">
        <div class="d-flex justify-center align-center gap-6">
          <!-- Pie Chart -->
          <div class="flex-shrink-0">
            <svg
              :width="chartSize"
              :height="chartSize"
              :viewBox="`0 0 ${chartSize} ${chartSize}`"
              class="cursor-pointer"
            >
              <g :transform="`translate(${chartSize / 2}, ${chartSize / 2})`">
                <path
                  v-for="(slice, i) in slices"
                  :key="i"
                  :d="slice.path"
                  :fill="slice.color"
                  :stroke="selectedErrorType === slice.data.type ? '#ffffff' : 'none'"
                  :stroke-width="selectedErrorType === slice.data.type ? '3' : '0'"
                  class="transition-all duration-200 cursor-pointer hover:opacity-80"
                  @click="selectError(slice.data.type)"
                  @mouseover="hoveredError = slice.data.type"
                  @mouseleave="hoveredError = null"
                />
              </g>
            </svg>
          </div>

          <!-- Legend -->
          <div class="flex-grow-1 overflow-y-auto" style="max-height: 280px;">
            <div
              v-for="(item, i) in errorCounts"
              :key="i"
              class="mb-3 pb-3 border-b border-orange-100 last:border-0 cursor-pointer transition-colors duration-150"
              :class="selectedErrorType === item.type ? 'bg-orange-50 px-2 rounded' : ''"
              @click="selectError(item.type)"
              @mouseover="hoveredError = item.type"
              @mouseleave="hoveredError = null"
            >
              <div class="d-flex align-center gap-2 mb-1">
                <div
                  class="flex-shrink-0 rounded"
                  :style="{
                    width: '12px',
                    height: '12px',
                    backgroundColor: colorScale(i),
                  }"
                />
                <span class="text-xs font-weight-bold text-grey-darken-3">
                  {{ formatErrorCode(item.type) }}
                </span>
                <span class="text-xxs text-grey-darken-1 font-weight-bold ms-auto me-2">
                  {{ item.percentage }}% ({{ item.count }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Error Details -->
        <v-expand-transition>
          <div v-if="selectedErrorDetail" class="mt-4 pt-4 border-t border-orange-200">
            <div class="text-xs font-weight-bold text-orange-header mb-2">
              {{ formatErrorCode(selectedErrorDetail.type) }}
            </div>
            <div class="text-xs leading-relaxed text-grey-darken-2 mb-3">
              {{ selectedErrorDetail.label }}
            </div>

            <!-- Examples -->
            <div v-if="selectedExamples.length" class="bg-orange-50 rounded-lg pa-2 mb-3">
              <div class="text-xxs font-weight-bold text-orange-header mb-2">Recent Examples:</div>
              <div
                v-for="(example, i) in selectedExamples.slice(0, 3)"
                :key="i"
                class="text-xxs mb-2 last:mb-0 pb-2 last:pb-0 border-b border-orange-100 last:border-0"
              >
                <div class="text-grey-darken-3 mb-1">
                  <span class="font-weight-bold">{{ example.verb }}</span>
                  <span class="text-grey-darken-1">({{ example.tense }})</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-error font-code">You: "{{ example.user_answer }}"</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-success font-code">Expected: "{{ example.acceptable_answers[0] }}"</span>
                </div>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-body-2 text-medium-emphasis my-auto py-8">
        <v-icon size="48" color="grey-lighten-1" class="mb-2 d-block">mdi-chart-pie-outline</v-icon>
        Complete more conjugation games to see your error patterns.
      </div>

      <v-card-actions v-if="totalErrors > 0" class="d-flex justify-end pt-3 border-top border-orange gap-2">
        <v-btn
          size="small"
          variant="text"
          color="orange-darken-2"
          class="text-none font-weight-bold"
          @click="resetSelection"
        >
          Clear
        </v-btn>
        <v-btn
          size="small"
          variant="tonal"
          color="orange-darken-2"
          class="text-none font-weight-bold"
          @click="downloadReport"
        >
          <v-icon size="16" class="me-1">mdi-download</v-icon>
          Report
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as d3 from 'd3';

interface ErrorDetail {
  type: string;
  label: string;
  category: string;
  count: number;
  percentage: number;
}

interface ErrorExample {
  verb: string;
  tense: string;
  user_answer: string;
  acceptable_answers: string[];
}

const props = defineProps({
  sessions: {
    type: Array,
    required: true,
  },
});

const chartSize = 220;
const selectedErrorType = ref<string | null>(null);
const hoveredError = ref<string | null>(null);

// Category colors
const categoryColors: Record<string, string> = {
  morphology: '#f59e0b',  // amber
  syntax: '#3b82f6',      // blue
  semantics: '#8b5cf6',   // violet
  other: '#6b7280',       // grey
};

// Compute error statistics from sessions
const errorCounts = computed(() => {
  const errorMap = new Map<string, { count: number; label: string; category: string; examples: ErrorExample[] }>();
  let totalCount = 0;

  // Collect last 10 games
  const recentSessions = (props.sessions as any[]).slice(0, 10);

  recentSessions.forEach((session: any) => {
    if (!session.rounds) return;
    session.rounds.forEach((round: any) => {
      if (!round.is_correct && round.error_details?.length) {
        round.error_details.forEach((err: any) => {
          if (!errorMap.has(err.type)) {
            errorMap.set(err.type, {
              count: 0,
              label: err.label,
              category: err.category,
              examples: [],
            });
          }
          const item = errorMap.get(err.type)!;
          item.count += 1;
          totalCount += 1;

          // Store up to 5 examples per error type
          if (item.examples.length < 5) {
            item.examples.push({
              verb: round.verb,
              tense: round.tense,
              user_answer: round.user_answer,
              acceptable_answers: round.acceptable_answers,
            });
          }
        });
      }
    });
  });

  // Convert to sorted array
  return Array.from(errorMap.entries())
    .map(([type, data]) => ({
      type,
      count: data.count,
      percentage: Math.round((data.count / totalCount) * 100),
      label: data.label,
      category: data.category,
      examples: data.examples,
    }))
    .sort((a, b) => b.count - a.count);
});

const totalErrors = computed(() =>
  errorCounts.value.reduce((sum, item) => sum + item.count, 0)
);

const selectedErrorDetail = computed(() => {
  if (!selectedErrorType.value) return null;
  return errorCounts.value.find((item) => item.type === selectedErrorType.value) || null;
});

const selectedExamples = computed(() =>
  selectedErrorDetail.value?.examples || []
);

// Color scale
const colorScale = (index: number) => {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
  ];
  return colors[index % colors.length];
};

// Generate pie slices
const slices = computed(() => {
  if (errorCounts.value.length === 0) return [];

  const total = totalErrors.value;
  const pie = d3.pie<ErrorDetail>()
    .value((d) => d.count)
    .sort(null);

  const radius = (chartSize / 2) * 0.75;
  const arc = d3.arc<d3.PieArcDatum<ErrorDetail>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  return pie(errorCounts.value).map((pieArc, i) => ({
    path: arc(pieArc) || '',
    color: colorScale(i),
    data: pieArc.data,
  }));
});

// Helper functions
function formatErrorCode(code: string): string {
  return code
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    morphology: 'Word Formation',
    syntax: 'Sentence Structure',
    semantics: 'Meaning',
    other: 'Other',
  };
  return labels[category] || 'Other';
}

function categoryColor(category: string): string {
  return categoryColors[category] || 'grey';
}

function selectError(type: string) {
  selectedErrorType.value = selectedErrorType.value === type ? null : type;
}

function resetSelection() {
  selectedErrorType.value = null;
}

function downloadReport() {
  const reportData = errorCounts.value.map((err) => ({
    'Error Type': formatErrorCode(err.type),
    'Count': err.count,
    'Percentage': `${err.percentage}%`,
    'Category': formatCategory(err.category),
  }));

  const csv = [
    ['Error Distribution Report', new Date().toLocaleDateString()],
    [],
    Object.keys(reportData[0]).join(','),
    ...reportData.map(row => Object.values(row).join(',')),
  ].map(row => Array.isArray(row) ? row.join(',') : row).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `error-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.alpha-divider {
  opacity: 0.3;
}

.hover\:opacity-80:hover {
  opacity: 0.8;
}

/* Custom scroll for examples */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>