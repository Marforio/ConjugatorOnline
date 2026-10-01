<template>
  <v-container fluid class="pa-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-card class="pa-6 mb-6 student-vocab-header text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold">My Vocab Training Analytics</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            See which terms are giving you the most trouble.
          </div>
        </div>
        <v-avatar color="white" variant="tonal" size="56">
          <v-icon size="32">mdi-shield-star-outline</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <v-progress-linear v-if="loading" indeterminate color="teal" class="mb-6 rounded-pill" />

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 border bg-white fill-height d-flex flex-column" rounded="lg" elevation="0">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-3">
            My Vocabulary Lists
          </div>
          <div class="scroll-box flex-grow-1 pr-1">
            <v-card
              v-for="list in filteredProgressList"
              :key="list.list_key"
              class="mb-3 pa-4 border rounded-xl cursor-pointer transition-all position-relative"
              :class="focusedRowKey === makeFocusKey(list) ? 'border-teal bg-teal-tight shadow-xs' : 'bg-white hover-slate'"
              elevation="0"
              @click="focusProgressRow(list)"
            >
              <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
                <div class="min-width-0">
                  <div class="text-body-1 font-weight-black text-slate-900 text-truncate">
                    {{ list.list_name }}
                  </div>
                  <div class="text-caption text-slate-500 mt-0.5">
                    <span v-if="list.level">Level: <strong>{{ list.level }}</strong></span>
                    <span class="mx-1">•</span>
                    <span>Variant: <strong>{{ list.variantLabel }}</strong></span>
                  </div>
                </div>

                <!-- More prominent completed sessions -->
                 <div>
                    <v-chip
                  size="small"
                  variant="flat"
                  class="font-weight-medium"
                  :color="list.sessions_finished > 0 ? 'teal-darken-2' : 'slate-300'"
                >
                  {{ list.sessions_finished }}x completed
                </v-chip>
                <v-chip
                  size="small"
                  variant="flat"
                  class="font-weight-medium ms-3"
                  color="secondary"
                >
                  {{ list.sessions_started }}x started
                </v-chip>

                 </div>
              
              </div>

              <!-- Accuracy headline -->
              <div class="d-flex align-center justify-space-between mt-4 mb-1">
                <div class="text-caption font-weight-bold text-slate-600 uppercase tracking-wider">
                  Global Accuracy
                </div>
                <div
                  class="text-body-2 font-weight-black"
                  :class="
                    list.accuracy >= 90 ? 'text-blue-darken-2' :
                    list.accuracy >= 75 ? 'text-green-darken-2' :
                    list.accuracy >= 50 ? 'text-orange-darken-2' :
                    'text-yellow-darken-3'
                  "
                >
                  {{ list.accuracy }}%
                </div>
              </div>

              <v-progress-linear
                :model-value="list.accuracy"
                :color="
                  list.accuracy >= 90 ? 'blue-darken-2' :
                  list.accuracy >= 75 ? 'green' :
                  list.accuracy >= 50 ? 'orange' :
                  'yellow-darken-2'
                "
                height="8"
                rounded
                class="mb-2"
              />
              <!-- <v-btn
                size="small"
                color="amber-darken-2"
                variant="flat"
                class="text-none font-weight-bold mt-2"
                @click.stop="focusProgressRow(list); openWrongReviewForFocusedVariant()"
              >
                <v-icon start size="16">mdi-lightbulb-on-outline</v-icon>
                Review my wrong answers
              </v-btn> -->

              <!-- Optional secondary mastery line (if you still want it) -->
              <div class="d-flex justify-space-between text-caption text-slate-500 text-caption mt-1">
                <span>Correct: {{ list.masteredCount }} out of {{ list.totalCount }} attempts</span>
              </div>
            </v-card>            
            <div v-if="filteredProgressList.length === 0 && !loading" class="text-center text-slate-400 py-12">
                        <v-icon size="40" class="mb-2 text-slate-300">mdi-text-box-remove-outline</v-icon>
                        <div class="text-body-2">No matches under your current filter.</div>
                      </div>
          </div>


        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 border bg-white fill-height d-flex flex-column" rounded="lg" elevation="0">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-3">
            The most difficult terms (Error Analysis)
          </div>

          <div v-if="focusedListDisplayName" class="flex-grow-1 d-flex flex-column">
            <div class="bg-teal-light border border-teal-soft rounded-xl pa-4 mb-4">
              <div class="text-subtitle-2 font-weight-bold text-teal-darken-4">
                List: <span class="font-weight-black underline">{{ focusedListDisplayName }}</span>
              </div>
              <div class="text-caption text-teal-darken-3 mt-0.5">
                These are the terms you answered incorrectly most frequently.
              </div>
            </div>

            <div class="scroll-box flex-grow-1">
              <v-table density="comfortable" class="bg-white border rounded-xl overflow-hidden shadow-xs">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="font-weight-bold text-slate-700">Vocabulary Word</th>
                    <th class="font-weight-bold text-slate-700 text-center" style="width: 110px;">My Errors</th>
                    <th class="font-weight-bold text-slate-700 text-center" style="width: 110px;">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in highErrorTerms.terms" :key="item.item_key">
                    <tr class="item-tr">
                      <td class="font-weight-bold text-slate-900 pb-2">
                        <v-icon start size="16" :color="item.accuracy_pct >= 75 ? 'success' : 'red-lighten-1'">
                          {{ item.accuracy_pct >= 75 ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
                        </v-icon>
                        {{ item.term_readable }}

                        <div v-if="item.wrong_submissions && item.wrong_submissions.length > 0" class="mt-1 ps-5 d-block text-caption">
                          <span class="text-slate-400 font-weight-medium uppercase mr-1" style="font-size: 9px; letter-spacing: 0.5px;">My Typos / Mistakes:</span>
                          <v-chip 
                            v-for="(myMistake, idx) in item.wrong_submissions" 
                            :key="idx" 
                            size="x-small" 
                            color="red-darken-1" 
                            variant="tonal" 
                            class="font-weight-bold mr-1 mb-1 bg-red-lighten-5 font-mono"
                          >
                            "{{ myMistake }}"
                          </v-chip>
                        </div>
                      </td>
                      <td class="text-center font-weight-bold text-red-darken-3 bg-red-tight vertical-middle">
                        {{ item.wrong_count }}
                      </td>
                      <td class="text-center font-weight-black vertical-middle">
                        <span :class="item.accuracy_pct >= 75 ? 'text-green-darken-2' : (item.accuracy_pct >= 50 ? 'text-orange-darken-2' : 'text-red-darken-2')">
                          {{ item.accuracy_pct }}%
                        </span>
                      </td>
                    </tr>
                  </template>
                  
                  <tr v-if="!highErrorTerms.terms || highErrorTerms.terms.length === 0">
                    <td colspan="3" class="text-center text-slate-400 py-8">
                      Great job! No spelling mistake history recorded on this list yet.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>

          <div v-else class="text-center text-slate-400 py-12 border border-dashed rounded-xl bg-white fill-height d-flex flex-column align-center justify-center flex-grow-1">
            <v-icon size="48" class="text-slate-200 mb-2">mdi-gesture-tap-button</v-icon>
            <div class="text-body-2">Select a vocabulary list from the left panel.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="reviewDialog" persistent max-width="760">
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="font-weight-bold">Wrong-answer review: {{ reviewListLabel }}</span>
      <v-btn icon="mdi-close" variant="text" @click="reviewDialog = false" />
    </v-card-title>

    <v-card-text>
      <div v-if="reviewLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="amber-darken-2" />
        <div class="text-caption mt-2">Generating your review questions... Please wait about 30 seconds...</div>
      </div>

      <div v-else-if="!reviewFinished && reviewRounds.length">
        <div class="text-caption mb-2">Question {{ reviewIndex + 1 }} / {{ reviewRounds.length }}</div>
        <div class="text-body-1 font-weight-bold mb-4">{{ reviewRounds[reviewIndex].question }}</div>
        <v-text-field
          v-model="reviewInput"
          label="Your answer"
          @keydown.enter.prevent="submitReviewAnswer"
        />
      </div>

      <div v-else-if="reviewFinished">
        <div class="text-h6 font-weight-bold">Done! Score: {{ reviewScore }}%</div>
        <div class="text-caption mt-1">
          {{ reviewResults.filter(r => r.correct).length }} / {{ reviewResults.length }} correct
        </div>
      </div>

      <div v-else class="text-caption text-slate-500">
        No reviewable wrong prompts found for this list.
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
          v-if="!reviewFinished && reviewRounds.length && !roundFeedback"
          color="primary"
          @click="submitReviewAnswer"
        >
          Submit
        </v-btn>

        <v-btn
          v-if="!reviewFinished && reviewRounds.length && roundFeedback"
          color="primary"
          @click="nextReviewQuestion"
        >
          {{ reviewIndex >= reviewRounds.length - 1 ? "Finish" : "Next" }}
        </v-btn>
      <v-btn variant="text" @click="reviewDialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-container>
  <v-alert v-if="roundFeedback" :type="roundFeedback.correct ? 'success' : 'error'" variant="tonal" class="mt-3">
  <div><strong>{{ roundFeedback.correct ? "Correct" : "Not quite" }}</strong></div>
  <div>Your answer: {{ roundFeedback.user || "—" }}</div>
  <div>Expected: {{ roundFeedback.expected.join(" / ") }}</div>
</v-alert>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/axios';

interface ProgressListRecord {
  list_key: string
  list_name: string
  domain: string | null
  mode: string
  level: string | null
  track_key: string
  sessions_started: number
  sessions_finished: number
  total_attempts: number
  correct_count: number
  wrong_count: number
  accuracy: number
  masteredCount: number
  totalCount: number
  masteryPct: number
  variantLabel: string
}

interface WrongPromptRow {
  list_key: string
  list_name: string
  domain: string | null
  item_key: string
  term: string
  prompt_field: string
  answer_field: string
  prompt_text: string
  wrong_count: number
  last_seen_at: string
  last_user_answer: string | null
  expected: string[]
}

interface AIReviewQuestion {
  item_key: string
  question: string
}

interface ReviewRoundRow {
  item_key: string
  term: string
  prompt_field: string
  prompt_text: string
  expected: string[]
  question: string
}

type ReviewPromptContext = {
  list_name: string
  track_key: string
  level: string | null
  variant_label: string
}

const reviewDialog = ref(false)
const reviewLoading = ref(false)
const reviewRounds = ref<ReviewRoundRow[]>([])
const reviewIndex = ref(0)
const reviewInput = ref("")
const reviewFinished = ref(false)
const reviewResults = ref<ReviewResult[]>([])

type ReviewResult = {
  item_key: string
  term: string
  question: string
  expected: string[]
  user_answer: string
  correct: boolean
}
const reviewListLabel = ref("")

// UI States
const loading = ref(false);

const focusedListRecord = computed(() =>
  filteredProgressList.value.find(r => makeFocusKey(r) === focusedRowKey.value) || null
)

const focusedListDisplayName = computed(() =>
  focusedListRecord.value?.list_name || ""
)

function makeFocusKey(row: { list_key: string; track_key?: string; level?: string | null }) {
  return `${row.list_key}::${row.track_key || "none"}::${row.level || "all"}`
}

const focusedRowKey = ref<string | null>(null)

const focusedVariantLabel = computed(() =>
  variantLabelFromTrackKey(focusedListRecord.value?.track_key || "")
)
const searchListQuery = ref('');

// Dynamic Data Store Arrays
const progressRecordsPool = ref<any[]>([]);
const activeSessionsPool = ref<any[]>([]);

// 🌟 UPDATED STATE: Dictionary structure maps total metrics and array rows together cleanly
const highErrorTerms = ref<{ total_completions: number; terms: any[] }>({
  total_completions: 0,
  terms: []
});

// Aggregate native my-work elements into UI presentation blocks
const filteredProgressList = computed<ProgressListRecord[]>(() => {
  const query = searchListQuery.value?.trim().toLowerCase();
  
  const formattedList = progressRecordsPool.value.map(p => {
    const matchSession = activeSessionsPool.value.find(s => s.list_key === p.list_key && s.level === p.level && s.track_key === p.track_key);
    
    const masteredCount = matchSession ? (matchSession.mastered_item_ids?.length || 0) : (p.correct_count || 0);
    const totalCount = matchSession ? (matchSession.all_item_ids?.length || 0) : (p.total_attempts || 0);
    const masteryPct = totalCount > 0 ? Math.round((masteredCount * 100) / totalCount) : (p.accuracy ? Math.round(p.accuracy) : 0);

    return {
      list_key: p.list_key,
      list_name: p.list_name,
      variantLabel: p.variant_label || variantLabelFromTrackKey(p.track_key),
      domain: p.domain,
      mode: p.mode,
      level: p.level,
      track_key: p.track_key,
      sessions_started: p.sessions_started || 0,
      sessions_finished: p.sessions_finished || 0,
      total_attempts: p.total_attempts || 0,
      correct_count: p.correct_count || 0,
      wrong_count: p.wrong_count || 0,
      accuracy: p.accuracy || 0,
      masteredCount,
      totalCount,
      masteryPct: Math.min(100, masteryPct)
    };
  });

  return formattedList
    .filter(l => !query || l.list_key.toLowerCase().includes(query))
    .sort((a, b) => a.list_key.localeCompare(b.list_key, undefined, { numeric: true, sensitivity: 'base' }));
});

function focusProgressRow(row: ProgressListRecord) {
  focusedRowKey.value = makeFocusKey(row)
}


function variantLabelFromTrackKey(tk: string): string {
  const k = String(tk || "").trim();
  const map: Record<string, string> = {
    to_infinitive: "Definition/Translation → Infinitive",
    to_term: "Definition/Translation → Term",
    to_past_simple: "Infinitive → Past simple",
    to_past_particple: "Infinitive → Past participle",
    to_past_participle: "Infinitive → Past participle",
    to_past_forms: "Infinitive → Both past forms",
  };
  return map[k] || (k ? k.replace(/_/g, " ") : "Unspecified variant");
}

async function buildAIWrongReviewQuestions(
  rows: WrongPromptRow[],
  ctx: ReviewPromptContext
): Promise<AIReviewQuestion[]> {
  const prompt = `
Return JSON only (no markdown), using EXACT schema:
{
  "questions": [
    { "item_key": "string", "question": "string" }
  ]
}

Context:
- list_name: ${ctx.list_name}
- variant_track_key: ${ctx.track_key}
- variant_label: ${ctx.variant_label}
- level: ${ctx.level || "all"}

Rules:
- IMPORTANT: Output MUST be raw JSON only. Do not use markdown fences. Do not add commentary.
- You are returning questions for a vocabulary review quiz. The target audience is intermediate English learners.
- If prompt_field is "definition", the question must include two distinct clues.
- If prompt_field is "French", "Italian", or "German", ask in that language for the English translation.
- Do NOT return answers.

INPUT_ROWS:
${JSON.stringify(rows.map(r => ({
  item_key: r.item_key,
  term: r.term,
  prompt_field: r.prompt_field,
  prompt_text: r.prompt_text
})))}
`.trim()

  const res = await api.post("/llm/chat/", {
    model: "google/gemma-4-31B-turbo-TEE",
    messages: [
      { role: "system", content: "Return strict JSON only." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1200,
    temperature: 0.3,
    stream: false,
  })

  const raw = String(res.data?.content || "").trim()

  function safeExtractJson(text: string): any {
    try { return JSON.parse(text) } catch {}

    const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/i)
    if (fenced?.[1]) {
      try { return JSON.parse(fenced[1]) } catch {}
    }

    const firstBrace = text.indexOf("{")
    const lastBrace = text.lastIndexOf("}")
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)) } catch {}
    }

    throw new Error("AI did not return valid JSON")
  }

  const parsed = safeExtractJson(raw)
  return Array.isArray(parsed?.questions) ? parsed.questions as AIReviewQuestion[] : []
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function fallbackQuestion(r: WrongPromptRow): string {
  if (r.prompt_field?.toLowerCase() === "french") {
    return `Quelle est la traduction anglaise de « ${r.prompt_text} » ?`
  }
  if (r.prompt_field?.toLowerCase() === "german") {
    return `Was ist die englische Übersetzung von „${r.prompt_text}“?`
  }
  if (r.prompt_field?.toLowerCase() === "italian") {
    return `Qual è la traduzione inglese di « ${r.prompt_text} »?`
  }
  return `What is the correct term for: ${r.prompt_text || r.term}?`
}

async function openWrongReviewForFocusedVariant() {
  const rec = focusedListRecord.value
  if (!rec) return

  reviewDialog.value = true
  reviewLoading.value = true
  reviewFinished.value = false
  reviewResults.value = []
  reviewRounds.value = []
  reviewIndex.value = 0
  reviewInput.value = ""
  roundFeedback.value = null

  try {
    const r = await api.get("/vocab-workout-sessions/wrong-prompts/", {
      params: {
        list_key: rec.list_key,
        track_key: rec.track_key || undefined,
        level: rec.level || undefined,
        mode: "write",
        days: 180,
        limit: 60,
      }
    })

    const rows: WrongPromptRow[] = Array.isArray(r.data) ? r.data : []
    const clean = rows.filter(x => {
      const t = String(x.prompt_text ?? "").trim()
      return t !== "" && !/^[—-]+$/.test(t)
    })

    const capped = shuffleInPlace([...clean]).slice(0, 12)

    let aiQs: AIReviewQuestion[] = []
    try {
      aiQs = await buildAIWrongReviewQuestions(capped, {
        list_name: rec.list_name,
        track_key: rec.track_key || "",
        level: rec.level || null,
        variant_label: focusedVariantLabel.value,
      })
    } catch (e) {
      console.warn("AI question generation failed, falling back:", e)
      aiQs = capped.map(r => ({ item_key: r.item_key, question: fallbackQuestion(r) }))
    }

    const qMap = new Map(aiQs.map(q => [q.item_key, q.question]))
    reviewRounds.value = capped.map((r) => ({
      item_key: r.item_key,
      term: r.term,
      prompt_field: r.prompt_field,
      prompt_text: r.prompt_text,
      expected: Array.isArray(r.expected) && r.expected.length ? r.expected : [r.term],
      question: qMap.get(r.item_key) || fallbackQuestion(r),
    }))
  } catch (e) {
    console.error("Failed opening review:", e)
    reviewRounds.value = []
  } finally {
    reviewLoading.value = false
  }
}


const roundFeedback = ref<null | {
  correct: boolean
  expected: string[]
  user: string
}>(null)

function normalizeAnswer(s: string) {
  return String(s ?? "").trim().toLowerCase()
}

function submitReviewAnswer() {
  const row = reviewRounds.value[reviewIndex.value]
  if (!row) return

  const user = reviewInput.value
  const ok = row.expected.some(a => normalizeAnswer(a) === normalizeAnswer(user))

  roundFeedback.value = { correct: ok, expected: row.expected, user }

  reviewResults.value.push({
    item_key: row.item_key,
    term: row.term,
    question: row.question,
    expected: row.expected,
    user_answer: user,
    correct: ok
  })
}

function nextReviewQuestion() {
  roundFeedback.value = null
  reviewInput.value = ""

  if (reviewIndex.value >= reviewRounds.value.length - 1) {
    reviewFinished.value = true
  } else {
    reviewIndex.value += 1
  }
}

const reviewScore = computed(() => {
  if (!reviewResults.value.length) return 0
  const c = reviewResults.value.filter(r => r.correct).length
  return Math.round((c * 100) / reviewResults.value.length)
})


// Reactively fetch new aggregated data blocks whenever list focuses change
watch(focusedListRecord, async (rec) => {
  if (!rec) {
    highErrorTerms.value = { total_completions: 0, terms: [] }
    return
  }
  loading.value = true
  try {
    const response = await api.get('/vocab-workout-sessions/list-errors/', {
      params: {
        list_key: rec.list_key,
        track_key: rec.track_key || undefined,
        level: rec.level || undefined,
      }
    })
    highErrorTerms.value = response.data || { total_completions: 0, terms: [] }
  } catch (err) {
    console.error("Failed to fetch error breakdown:", err)
    highErrorTerms.value = { total_completions: 0, terms: [] }
  } finally {
    loading.value = false
  }
}, { immediate: true })

// Primary dataset setup loop initialization loader
async function fetchStudentWorkoutDataProfile() {
  loading.value = true;
  try {
    const response = await api.get('/vocab-workout-sessions/my-work/');
    
    progressRecordsPool.value = response.data?.progress || [];
    activeSessionsPool.value = response.data?.active_sessions || [];
    
    if (filteredProgressList.value.length) {
  focusProgressRow(filteredProgressList.value[0])
}
  } catch (err) {
    console.error("Failed to unpack my-work portfolio records:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStudentWorkoutDataProfile();
});
</script>

<style scoped>
.student-vocab-header {
  background: linear-gradient(135deg, #0284c7 0%, #0f766e 100%);
  position: relative;
  overflow: hidden;
}
.student-vocab-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-5deg);
  pointer-events: none;
}
.scroll-box {
  max-height: 600px;
  overflow-y: auto;
}
.hover-slate {
  transition: all 0.15s ease-in-out;
}
.hover-slate:hover {
  background-color: #f8fafc !important;
  border-color: #cbd5e1 !important;
}
.border-teal {
  border-color: #0d9488 !important;
}
.border-teal-soft {
  border-color: #99f6e4 !important;
}
.bg-teal-tight {
  background-color: #f0fdfa !important;
}
.teal-light {
  background-color: #f0fdfa !important;
}
.bg-red-tight {
  background-color: #fef2f2 !important;
  color: #991b1b !important;
}
.shadow-xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}
.border-b {
  border-bottom: 1px solid #f1f5f9 !important;
}
.vertical-middle {
  vertical-align: middle !important;
}
.font-mono {
  font-family: monospace, monospace !important;
}
.underline {
  text-decoration: underline;
}
.min-vh-100 {
  min-height: 100vh;
}
</style>