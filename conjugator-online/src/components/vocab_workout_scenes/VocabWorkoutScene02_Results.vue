<template>
  <v-container v-if="results" fluid class="pa-4 pa-md-6 bg-white min-h-screen text-slate-800">
    <v-card class="mx-auto border rounded-xl bg-white" max-width="1000" flat>
      
      <div class="pa-4 pa-md-5 border-b bg-slate-50 rounded-t-xl d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-4">
        <div>
          <v-card-title class="pa-0 text-h6 font-weight-black text-slate-900 leading-none mb-1">
            VocabWorkout Session Over
          </v-card-title>
          <div class="text-caption text-slate-500">
            Mode: <span class="font-weight-black text-slate-700 text-capitalize">{{ results?.mode }}</span> 
            • Vector: <span class="font-weight-bold text-primary">{{ results?.front_field }} ➔ {{ results?.back_field }}</span>
          </div>
        </div>

        <div class="d-flex align-center ga-2 w-100 w-sm-auto justify-end">
          <RouterLink :to="{ name: 'student-data', query: { tab: 'vocabulary' } }" class="text-decoration-none">
            <v-btn variant="outlined" color="slate-600" size="small" height="36" class="rounded-lg text-none font-weight-bold bg-white">
              Go to Dashboard
            </v-btn>
          </RouterLink>
          
          <v-btn color="primary" size="small" height="36" class="rounded-lg text-none font-weight-black tracking-wide elevation-1" prepend-icon="mdi-refresh" @click="goToSettings">
            New Session
          </v-btn>
        </div>
      </div>

      <v-card-text class="pa-4 pa-md-5">
        
        <v-row dense class="mb-6">
          <v-col cols="12" sm="4">
            <div class="bg-slate-50 border rounded-xl pa-4 h-100 text-center text-sm-left">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">Success Criteria</div>
              <div class="text-h5 font-weight-black text-success d-flex align-center justify-center justify-sm-start">
                <v-icon size="20" class="mr-1.5" color="success">mdi-check-circle-outline</v-icon>
                {{ results?.correct_count ?? 0 }} <span class="text-caption font-weight-bold text-slate-400 ml-1">passed</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <div class="bg-slate-50 border rounded-xl pa-4 h-100 text-center text-sm-left">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">Errors Resolved</div>
              <div class="text-h5 font-weight-black text-error d-flex align-center justify-center justify-sm-start">
                <v-icon size="20" class="mr-1.5" color="error">mdi-close-circle-outline</v-icon>
                {{ results?.wrong_count ?? 0 }} <span class="text-caption font-weight-bold text-slate-400 ml-1">failed</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <div class="bg-slate-50 border rounded-xl pa-4 h-100 d-flex flex-column justify-center align-center align-sm-start">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1 w-100 text-center text-sm-left">Workout Scope</div>
              <div class="d-flex align-center justify-space-between w-100 flex-column flex-sm-row ga-2">
                <span class="text-subtitle-1 font-weight-black text-slate-900 leading-none">
                  {{ results?.total_items ?? 0 }} Terms Total
                </span>
                <v-btn variant="tonal" size="x-small" height="26" color="primary" class="rounded-lg font-weight-bold text-none px-2">
                  Full Session Log
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-5 border-opacity-40" />

        <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-3 px-1">Round-by-Round Execution Trace</div>

        <div class="border rounded-xl overflow-hidden shadow-sm">
          <v-table density="comfortable" class="results-technical-table text-slate-700">
            <thead>
              <tr class="bg-slate-50 text-slate-400">
                <th class="font-weight-black text-xxs uppercase text-center width-index-col">#</th>
                <th class="font-weight-black text-xxs uppercase">Lexical Key / Term</th>
                <th class="font-weight-black text-xxs uppercase min-w-prompt-col">Active Prompt Clue</th>
                <th class="font-weight-black text-xxs uppercase">Submitted Attempt Strings</th>
                <th class="font-weight-black text-xxs uppercase text-center width-status-col">Outcome</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr v-for="(g, i) in groupedRounds" :key="i" class="hover-row-state">
                <td class="text-center font-weight-bold text-slate-400 text-caption tabular-nums">
                  {{ i + 1 }}
                </td>

                <td>
                  <span class="text-body-2 font-weight-black text-slate-900 text-uppercase tracking-wide">
                    {{ g.term }}
                  </span>
                </td>

                <td class="text-wrap font-italic text-slate-600 text-caption leading-tight py-2">
                  {{ g.prompt }}
                </td>

                <td class="py-2">
                  <div class="d-inline-flex flex-wrap ga-1.5 max-w-attempts-cell">
                    <div 
                      v-for="(a, j) in g.attempts" 
                      :key="j"
                      class="text-caption font-weight-medium px-2 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700"
                    >
                      "{{ a.user_answer || 'Empty Submission' }}"
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex ga-1.5 justify-center align-center flex-wrap">
                    <span v-for="(a, j) in g.attempts" :key="j">
                      <v-chip
                        v-if="a.is_correct === true"
                        size="x-small"
                        color="success"
                        variant="flat"
                        class="font-weight-black px-1.5 rounded"
                      >
                        OK
                      </v-chip>
                      <v-chip
                        v-else-if="a.is_correct === false"
                        size="x-small"
                        color="error"
                        variant="flat"
                        class="font-weight-black px-1.5 rounded"
                      >
                        ERR
                      </v-chip>
                      <v-chip
                        v-else
                        size="x-small"
                        color="slate-300"
                        variant="flat"
                        class="font-weight-bold px-1.5 rounded text-slate-500"
                      >
                        —
                      </v-chip>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  results: { type: Object, default: null },
});

const emit = defineEmits(["changeScene"]);

function goToSettings() {
  emit("changeScene", "VocabWorkoutScene00_Settings");
}

const groupedRounds = computed(() => {
  const rounds = Array.isArray(props.results?.rounds) ? props.results.rounds : [];
  const map = new Map();

  for (const r of rounds) {
    const key = r.prompt;

    if (!map.has(key)) {
      map.set(key, {
        term: r.term,
        prompt: r.prompt,
        attempts: []
      });
    }

    map.get(key).attempts.push({
      user_answer: r.user_answer,
      expected: r.expected,
      is_correct: r.is_correct
    });
  }

  return Array.from(map.values());
});

const rounds = computed(() => Array.isArray(props.results?.rounds) ? props.results.rounds : []);
</script>

<style scoped>
.min-h-screen { min-height: 100vh; }
.text-xxs { font-size: 0.7rem !important; letter-spacing: 0.5px; }
.leading-none { line-height: 1 !important; }
.leading-tight { line-height: 1.3 !important; }

/* ==========================================
   📊 CUSTOM DATA ROW GRID TABLES FIXES
   ========================================== */
.results-technical-table {
  background-color: #ffffff !important;
}

.results-technical-table th {
  border-bottom: 2px solid #e2e8f0 !important;
  height: 40px !important;
}

.results-technical-table td {
  border-bottom: 1px solid #f1f5f9 !important;
  font-size: 0.85rem !important;
  height: auto !important;
  vertical-align: middle !important;
}

.hover-row-state:hover {
  background-color: #f8fafc !important;
}

/* Hard-boundary layout controls preventing text-string overflows */
.width-index-col { width: 44px; }
.width-status-col { width: 110px; text-align: center; }
.min-w-prompt-col { min-width: 180px; max-width: 240px; }
.max-w-attempts-cell { max-width: 320px; }

.font-mono {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}

.text-slate-900 { color: #0f172a; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
</style>