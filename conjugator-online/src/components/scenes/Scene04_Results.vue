<template>
  <v-container v-if="results" fluid class="pa-4 bg-white min-h-screen text-slate-800">
    
    <!-- Heading (Visible on larger resolutions) -->
    <v-row v-if="$vuetify.display.lgAndUp" class="my-6" justify="center">
      <h1 class="text-h4 font-weight-black text-slate-900 tracking-tight">Conjugation Game Results</h1>
    </v-row>

    <v-row align="start" justify="center" class="mt-2 ga-0">
      
      <!-- Left Column: Summary Metrics Display & Data Chart Wheel -->
      <v-col cols="12" lg="4" class="pr-lg-4">
        <v-card class="pa-5 rounded-xl border mb-4" flat color="white">
          <v-card-title class="px-0 pt-0 text-subtitle-1 font-weight-black text-slate-900 d-flex align-center">
            <v-icon color="primary" class="mr-2" size="20">mdi-google-analytics</v-icon>
            Performance Metrics
          </v-card-title>
          
          <v-card-text class="px-0 pb-0 text-body-2 text-slate-600">
            <!-- Accuracy summary metric tile -->
            <div class="bg-slate-50 border rounded-xl pa-4 mb-3">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">Accuracy</div>
              <div class="text-h5 font-weight-black text-slate-900 leading-none">
                {{ percentCorrect }}% <span class="text-caption text-slate-500 font-weight-bold ml-1">Score</span>
              </div>
              <div class="text-caption text-slate-500 mt-1 font-weight-medium">
                Successfully resolved {{ finalStats.correct_count }} out of {{ totalRounds }} verbs.
              </div>
            </div>

            <!-- Speed summary metric tile -->
            <div class="bg-slate-50 border rounded-xl pa-4">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">Pace Velocity</div>
              <div class="text-h5 font-weight-black text-slate-900 leading-none d-flex align-baseline">
                {{ avgTimePerPrompt }}s <span class="text-caption text-slate-500 font-weight-bold ml-1">avg round</span>
              </div>
              <div v-if="parseFloat(String(avgTimePerPrompt)) < 10 && parseFloat(String(percentCorrect)) > 70" class="text-caption text-success font-weight-bold mt-2 d-flex align-center">
                <v-icon size="14" class="mr-1" color="success">mdi-star-face</v-icon>
                Excellent reflex mastery and accuracy!
              </div>
            </div>

            <!-- Suspicious Activity Alert -->
            <div v-if="finalStats.is_suspicious" class="mt-4 bg-red-lighten-5 border border-error rounded-xl pa-3">
              <div class="d-flex align-center mb-1">
                <v-icon color="error" size="18" class="mr-1">mdi-alert-circle-outline</v-icon>
                <span class="text-caption font-weight-bold text-error">Suspicious Activity Detected</span>
              </div>
              <div class="text-xxs text-slate-600">
                <span class="font-weight-bold">Score:</span> {{ (finalStats.suspicious_score * 100).toFixed(0) }}%
                <br>
                <span class="font-weight-bold">Flags:</span> {{ finalStats.suspicious_flags.join(', ') || 'None' }}
              </div>
            </div>

            <!-- D3 Visual Anchor Container -->
            <v-responsive max-width="320" class="mx-auto mt-6">
              <div id="pie-chart" class="d3-pie-stage-canvas"></div>
            </v-responsive>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column: Expansion Panels with Custom Carousel -->
      <v-col cols="12" lg="8" class="pl-lg-4">
        <v-expansion-panels multiple variant="accordion" class="results-accordion-group">
          
          <!-- Panel A: Correct Answers Carousel -->
          <v-expansion-panel class="border rounded-xl mb-3 overflow-visible" elevation="0">
            <v-expansion-panel-title class="bg-slate-50 font-weight-black text-slate-800 py-4">
              <v-icon color="success" class="mr-2" size="20">mdi-check-circle-outline</v-icon>
              Correct Answers ({{ correctResults.length }})
            </v-expansion-panel-title>
            
            <v-expansion-panel-text class="pt-4 px-4 pb-4">
              <div v-if="correctResults.length === 0" class="pa-4">
                <v-alert type="info" variant="tonal" class="rounded-xl text-body-2" density="comfortable">No correct answers recorded this round 😢</v-alert>
              </div>
              
              <div v-else class="carousel-wrapper">
                <!-- Navigation Controls -->
                <div class="d-flex align-center justify-space-between mb-4 carousel-controls">
                  <v-btn
                    icon="mdi-chevron-left"
                    variant="outlined"
                    color="slate-600"
                    density="comfortable"
                    :disabled="correctScrollPosition === 0"
                    @click="scrollCorrect('left')"
                  />
                  <span class="text-caption text-slate-500 font-weight-bold flex-grow-1 text-center">
                    Showing {{ Math.min(visibleCardsCount, correctResults.length) }} of {{ correctResults.length }}
                  </span>
                  <v-btn
                    icon="mdi-chevron-right"
                    variant="outlined"
                    color="slate-600"
                    density="comfortable"
                    :disabled="cannotScrollCorrectRight"
                    @click="scrollCorrect('right')"
                  />
                </div>

                <!-- Carousel Container with Grid -->
                <div class="carousel-grid-container">
                  <div 
                    class="carousel-grid"
                    :style="{ transform: `translateX(-${correctScrollPosition * (100 / visibleCardsCount)}%)` }"
                  >
                    <v-card
                      v-for="(result, index) in correctResults"
                      :key="'correct-' + index"
                      class="result-deck-card border rounded-xl pa-4 bg-white accent-border-success carousel-card"
                      flat
                    >
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-caption font-weight-black text-slate-400 text-uppercase">
                          Q{{ result.prompt_number }}
                        </span>
                        <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
                          {{ result.elapsed_time }}s
                        </v-chip>
                      </div>
                      
                      <div class="text-center bg-slate-50 border rounded-lg py-2 my-2">
                        <div class="text-xxs font-weight-bold text-slate-400 leading-none">Your Answer</div>
                        <div class="text-body-2 font-weight-black text-success mt-1">
                          <em>{{ result.user_answer || '—' }}</em>
                        </div>
                      </div>

                      <div class="text-xxs font-weight-bold text-slate-400 mt-3 mb-1">Parameters</div>
                      <div class="prompt-meta-mini rounded-lg border pa-2 bg-white text-xxs">
                        <div class="d-flex justify-space-between mb-0.5"><span class="text-slate-400">Verb:</span><span class="font-weight-bold text-slate-800">{{ result.verb }}</span></div>
                        <div class="d-flex justify-space-between mb-0.5"><span class="text-slate-400">Subject:</span><span class="font-weight-bold text-slate-700">{{ result.person }}</span></div>
                        <div class="d-flex justify-space-between mb-0.5"><span class="text-slate-400">Tense:</span><span class="font-weight-bold text-slate-700 text-truncate">{{ result.tense }}</span></div>
                        <div class="d-flex justify-space-between"><span class="text-slate-400">Type:</span><span class="font-weight-bold text-slate-700">{{ result.sentence_type }}</span></div>
                      </div>

                      <!-- Difficulty Score -->
                      <div v-if="result.difficulty_score" class="text-xxs text-slate-500 mt-2 pt-2 border-t">
                        <span class="font-weight-bold">Difficulty:</span> {{ (result.difficulty_score * 100).toFixed(0) }}%
                      </div>
                    </v-card>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Panel B: Incorrect Answers Carousel -->
          <v-expansion-panel class="border rounded-xl overflow-visible" elevation="0">
            <v-expansion-panel-title class="bg-slate-50 font-weight-black text-slate-800 py-4">
              <v-icon color="error" class="mr-2" size="20">mdi-close-circle-outline</v-icon>
              Incorrect Answers ({{ wrongResults.length }})
            </v-expansion-panel-title>
            
            <v-expansion-panel-text class="pt-4 px-4 pb-4">
              <div v-if="wrongResults.length === 0" class="pa-4">
                <v-alert type="success" variant="tonal" class="rounded-xl text-body-2" density="comfortable">
                  Flawless execution! No incorrect answers recorded. 🌟
                </v-alert>
              </div>

              <div v-else class="carousel-wrapper">
                <!-- Navigation Controls -->
                <div class="d-flex align-center justify-space-between mb-4 carousel-controls">
                  <v-btn
                    icon="mdi-chevron-left"
                    variant="outlined"
                    color="slate-600"
                    density="comfortable"
                    :disabled="wrongScrollPosition === 0"
                    @click="scrollWrong('left')"
                  />
                  <span class="text-caption text-slate-500 font-weight-bold flex-grow-1 text-center">
                    Showing {{ Math.min(visibleCardsCount, wrongResults.length) }} of {{ wrongResults.length }}
                  </span>
                  <v-btn
                    icon="mdi-chevron-right"
                    variant="outlined"
                    color="slate-600"
                    density="comfortable"
                    :disabled="cannotScrollWrongRight"
                    @click="scrollWrong('right')"
                  />
                </div>

                <!-- Carousel Container with Grid -->
                <div class="carousel-grid-container">
                  <div 
                    class="carousel-grid"
                    :style="{ transform: `translateX(-${wrongScrollPosition * (100 / visibleCardsCount)}%)` }"
                  >
                    <v-card
                      v-for="(result, index) in wrongResults"
                      :key="'wrong-' + index"
                      class="result-deck-card border rounded-xl pa-4 bg-white carousel-card d-flex flex-column"
                      :class="isTypoRound(result) ? 'accent-border-info' : 'accent-border-error'"
                      flat
                    >
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-caption font-weight-black text-slate-400 text-uppercase">
                          Q{{ result.prompt_number }}
                        </span>
                        <v-chip
                          size="x-small"
                          :color="isTypoRound(result) ? 'info' : 'error'"
                          variant="flat"
                          class="font-weight-bold"
                        >
                          {{ isTypoRound(result) ? 'Typo' : 'Wrong' }}
                        </v-chip>
                      </div>
                      
                      <div class="text-center bg-slate-50 border rounded-lg py-2 my-2">
                        <div class="text-xxs font-weight-bold text-slate-400 leading-none">Your Submission</div>
                        <div class="text-body-2 font-weight-black mt-1" :class="isTypoRound(result) ? 'text-info' : 'text-error'">
                          <em v-if="result.user_answer">"{{ result.user_answer }}"</em>
                          <span v-else class="text-xxs font-weight-bold text-slate-400">No answer</span>
                        </div>
                      </div>

                      <!-- Typo Pending Notice -->
                      <div v-if="isTypoRound(result)" class="bg-blue-init-lighten pa-2 rounded-lg text-center mb-2 border border-blue-100">
                        <p class="text-xxs text-slate-600 font-weight-bold ma-0">Typo pending staff review</p>
                        <div v-if="result.typo_lev_min" class="text-xxs text-slate-500 mt-1">
                          Match distance: {{ result.typo_lev_min }}
                        </div>
                      </div>

                      <div class="text-xxs font-weight-bold text-slate-400 mt-2 mb-1">Target</div>
                      <div class="prompt-meta-mini rounded-lg border pa-2 bg-white text-xxs mb-2">
                        <div class="d-flex justify-space-between mb-0.5"><span class="text-slate-400">Verb:</span><span class="font-weight-bold text-slate-800">{{ result.verb }}</span></div>
                        <div class="d-flex justify-space-between mb-0.5"><span class="text-slate-400">Subject:</span><span class="font-weight-bold text-slate-700">{{ result.person }}</span></div>
                        <div class="d-flex justify-space-between mb-0.5"><span class="text-slate-400">Tense:</span><span class="font-weight-bold text-slate-700 text-truncate">{{ result.tense }}</span></div>
                        <div class="d-flex justify-space-between"><span class="text-slate-400">Type:</span><span class="font-weight-bold text-slate-700">{{ result.sentence_type }}</span></div>
                      </div>

                      <div class="text-xxs text-slate-500 font-weight-medium mb-2">
                        <span class="font-weight-bold text-slate-700">Acceptable:</span> 
                        <span class="text-success font-weight-bold"><em>{{ result.acceptable_answers.join(', ') }}</em></span>
                      </div>

                      <!-- Error Classification -->
                      <div v-if="result.error_types && result.error_types.length" class="text-xxs text-slate-500 mb-2 pb-2 border-b">
                        <span class="font-weight-bold text-slate-700">Errors:</span>
                        <span v-for="(err, i) in result.error_types" :key="i" class="text-slate-600">
                          {{ typeof err === 'string' ? err : err.type }} {{ typeof err !== 'string' && err.confidence ? `(${(err.confidence * 100).toFixed(0)}%)` : '' }}{{ (i as number) < result.error_types.length - 1 ? ', ' : '' }}
                        </span>
                      </div>

                      <!-- Difficulty Score -->
                      <div v-if="result.difficulty_score" class="text-xxs text-slate-500 mb-2">
                        <span class="font-weight-bold">Difficulty:</span> {{ (result.difficulty_score * 100).toFixed(0) }}%
                      </div>

                      <!-- Honeypot Status -->
                      <div v-if="result.honeypot_triggered" class="text-xxs bg-red-lighten-5 border border-error rounded px-2 py-1 mb-2 text-error font-weight-bold">
                        🚨 Honeypot: {{ result.honeypot_reasons.join(', ') }}
                      </div>

                      <v-btn
                        block
                        size="x-small"
                        variant="tonal"
                        color="primary"
                        class="mt-auto rounded-lg text-none font-weight-bold text-xxs"
                        prepend-icon="mdi-robot-outline"
                        @click="openTutorForRound(result)"
                      >
                        AI Help
                      </v-btn>
                    </v-card>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Global Action Controls -->
    <v-row no-gutters class="d-flex justify-center align-center mt-10 ga-3 pb-8">
      <v-btn color="primary" height="44" class="px-6 rounded-xl font-weight-bold text-none elevation-1" prepend-icon="mdi-refresh" @click="goToScene('Scene02_Settings')">
        Play Another Session
      </v-btn>
      <v-btn :to="{ path: '/my-data', query: { tab: 'conjugation-game' } }" height="44" variant="outlined" color="slate-600" class="px-6 rounded-xl font-weight-bold text-none bg-white">
        Go to My Dashboard
      </v-btn>
      <HomeButton />
    </v-row>
  </v-container>

  <!-- AI Tutor Chat Component Modal -->
  <v-dialog v-model="aiOpen" max-width="560px" scrollable transition="dialog-bottom-transition">
    <v-card class="rounded-xl border bg-white text-slate-800" v-if="aiContext">
      <v-card-title class="pa-4 d-flex align-center border-b bg-slate-50">
        <v-avatar color="blue-lighten-5" size="36" class="mr-3">
          <v-icon color="primary" size="20">mdi-robot-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-black line-height-tight">AI Grammar Tutor</div>
          <div class="text-caption text-slate-500">Post-round syntax diagnostic</div>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" density="comfortable" color="slate-500" @click="aiOpen = false" />
      </v-card-title>

      <!-- Context Info -->
      <div class="pa-4 bg-slate-50 border-b">
        <div class="text-overline font-weight-bold text-slate-400 mb-2 tracking-wider">Target Failure Profile</div>
        <div class="bg-white border rounded-xl pa-3 text-center text-caption font-weight-medium">
          <v-row no-gutters class="mb-2">
            <v-col cols="6" class="border-r pb-1">
              <span class="text-slate-400 block mb-0.5">Prompt Formula</span>
              <span class="font-weight-black text-slate-800 text-uppercase">{{ aiContext.verb }}</span> ({{ aiContext.person }})
            </v-col>
            <v-col cols="6" class="pb-1">
              <span class="text-slate-400 block mb-0.5">Tense Style</span>
              <span class="font-weight-bold text-slate-700">{{ aiContext.tense }}</span>
            </v-col>
          </v-row>
          <v-divider class="my-1.5"></v-divider>
          <v-row no-gutters>
            <v-col cols="6" class="border-r pt-1 text-error">
              <span class="text-slate-400 block mb-0.5">Your Submission</span>
              <span class="font-weight-black">"{{ aiContext.student_answer || 'Empty' }}"</span>
            </v-col>
            <v-col cols="6" class="pt-1 text-success">
              <span class="text-slate-400 block mb-0.5">Acceptable Target</span>
              <span class="font-weight-black">{{ aiContext.acceptable_answers.join(' / ') }}</span>
            </v-col>
          </v-row>
        </div>
      </div>

      <v-card-text class="pa-4 text-body-2 line-height-relaxed">
        <AiTutorChatDialog
          v-model="aiOpen"
          title="AI Grammar Tutor"
          :context="aiContext"
          :build-initial-user-message="buildInitialPrompt"
          :show-context-preview="false"
          :reset-on-context-change="true"
          api-url="/llm/chat/"
          :max-tokens="250"
          :temperature="0.4"
          embed-mode
        />
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 bg-slate-50">
        <v-btn block color="primary" variant="flat" height="40" class="rounded-xl font-weight-bold text-none" @click="aiOpen = false">
          Done, Close Tutor
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import * as d3 from 'd3';
import api from '@/axios';
import HomeButton from '../HomeButton.vue';
import AiTutorChatDialog from '../AiTutorChatDialog.vue';

const backendResults = ref<any>(null);
const props = defineProps({
  results: { type: Object, required: true },
});

const emit = defineEmits(['changeScene']);

// Carousel state
const correctScrollPosition = ref(0);
const wrongScrollPosition = ref(0);
const visibleCardsCount = ref(3);

// AI tutor state
const aiOpen = ref(false);
const aiContext = ref<any>(null);


const cannotScrollCorrectRight = computed(() => {
  return correctScrollPosition.value >= correctResults.value.length - visibleCardsCount.value;
});

const cannotScrollWrongRight = computed(() => {
  return wrongScrollPosition.value >= wrongResults.value.length - visibleCardsCount.value;
});


const percentIncorrect = computed(() => {
  const total = totalRounds.value;
  if (!total) return 0;
  return ((finalStats.value?.wrong_count || 0) / total * 100).toFixed(0);
});


// Methods
function goToScene(sceneName: string) {
  emit('changeScene', sceneName);
}

function scrollCorrect(direction: 'left' | 'right') {
  if (direction === 'left') {
    correctScrollPosition.value = Math.max(0, correctScrollPosition.value - 1);
  } else {
    correctScrollPosition.value = Math.min(
      correctResults.value.length - visibleCardsCount.value,
      correctScrollPosition.value + 1
    );
  }
}

function scrollWrong(direction: 'left' | 'right') {
  if (direction === 'left') {
    wrongScrollPosition.value = Math.max(0, wrongScrollPosition.value - 1);
  } else {
    wrongScrollPosition.value = Math.min(
      wrongResults.value.length - visibleCardsCount.value,
      wrongScrollPosition.value + 1
    );
  }
}

function isTypoRound(round: any): boolean {
  if (!round) return false;
  return round.typo_detected === true && !round.is_correct;
}

async function openTutorForRound(round: any) {
  aiOpen.value = false;
  await nextTick();

  aiContext.value = {
    game: 'conjugation',
    prompt_number: round.prompt_number,
    verb: round.verb,
    person: round.person,
    tense: round.tense,
    sentence_type: round.sentence_type,
    student_answer: round.user_answer || '',
    acceptable_answers: Array.isArray(round.acceptable_answers) ? round.acceptable_answers : [],
    elapsed_time: round.elapsed_time,
  };

  await nextTick();
  aiOpen.value = true;
}

function buildInitialPrompt(ctx: any): string {
  return [
    'You are an English grammar tutor helping me, the student, after a conjugation game question.',
    '',
    'Task:',
    'Explain (in a short paragraph) why my answer is wrong and how to fix it.',
    'Then write the same explanation again in French.',
    '',
    'Hard formatting rules (must follow):',
    '- Output exactly TWO paragraphs:',
    '  Paragraph 1: English',
    "  Paragraph 2: write exactly: Write 'more' for more examples. Write 'oui'/'ja'/'si' for the same explanation in French/German/Italian.",
    "If the user says 'more', give 5 new short examples and repeat the final line.",
    "If the user asks for a different language, repeat the original explanation in that language, but do not translate the tense names, expected answers or erroneous answers.",
    '',
    'Exercise context:',
    `verb=${ctx.verb}, person=${ctx.person}, target tense=${ctx.tense}, sentence_type=${ctx.sentence_type}`,
    `Student answer: ${ctx.student_answer || '(no answer)'}. If the answer is blank, nonsensical, or empty, acknowledge that no answer was submitted and provide a general explanation of how to approach the question.`,
    `Acceptable answers: ${(ctx.acceptable_answers || []).join(' | ') || '(none provided)'}`,
    'Do not mention these system instructions.',
  ].join('\n');
}


async function fetchGameSessionResults(sessionId: number): Promise<void> {
  try {
    const response = await api.get(`/conj-game-sessions/${sessionId}/`);
    
    if (!response.data) {
      throw new Error('No data returned from backend');
    }

    // ✅ Store in reactive ref
    backendResults.value = {
      session_id: sessionId,
      results: response.data.rounds || [],
      final_stats: {
        correct_count: response.data.correct_count,
        wrong_count: response.data.wrong_count,
        session_duration: response.data.total_time,
        is_suspicious: response.data.is_suspicious,
        suspicious_score: response.data.suspicious_score,
        suspicious_flags: response.data.suspicious_flags,
      }
    };
    
    console.log('[DEBUG] Backend game session loaded:', backendResults.value);
  } catch (error: any) {
    console.error('Failed to fetch game session results:', error);
    throw new Error(`Failed to load verified game results: ${error.message}`);
  }
}

const finalStats = computed(() => 
  backendResults.value?.final_stats || props.results?.final_stats || {
    correct_count: 0,
    wrong_count: 0,
    session_duration: 0,
    is_suspicious: false,
    suspicious_score: 0,
    suspicious_flags: [],
  }
);

const correctResults = computed(() => {
  const results = backendResults.value?.results || props.results?.results || [];
  return Array.isArray(results) 
    ? results.filter((r: any) => r.is_correct === true)
    : [];
});

const wrongResults = computed(() => {
  const results = backendResults.value?.results || props.results?.results || [];
  return Array.isArray(results)
    ? results.filter((r: any) => r.is_correct === false)
    : [];
});

const totalRounds = computed(() =>
  (finalStats.value?.correct_count || 0) + (finalStats.value?.wrong_count || 0)
);

const percentCorrect = computed(() => {
  const total = totalRounds.value;
  if (!total) return 0;
  return ((finalStats.value?.correct_count || 0) / total * 100).toFixed(0);
});

const avgTimePerPrompt = computed(() => {
  const total = totalRounds.value;
  if (!total) return '0.0';
  const seconds = finalStats.value?.session_duration || 0;
  return (seconds / total).toFixed(1);
});

const chartData = computed(() => [
  { label: 'Correct', value: finalStats.value?.correct_count ?? 0 },
  { label: 'Wrong', value: finalStats.value?.wrong_count ?? 0 },
]);

function renderPieChart() {
  const container = d3.select('#pie-chart').node() as HTMLElement;
  if (!container) return;
  
  const containerWidth = container.getBoundingClientRect().width;
  const size = Math.min(containerWidth - 25, 240);
  const radius = Math.min(size, size) / 2;

  d3.select('#pie-chart').selectAll('*').remove();

  const svg = d3
    .select('#pie-chart')
    .append('svg')
    .attr('width', size)
    .attr('height', size)
    .append('g')
    .attr('transform', `translate(${size / 2}, ${size / 2})`);

  const color = d3
    .scaleOrdinal()
    .domain(['Correct', 'Wrong'])
    .range(['#10b981', '#ef4444']);

  const pie = d3.pie<any>().value((d) => d.value);
  const dataReady = pie(chartData.value);

  const arc = d3.arc<any>().innerRadius(radius * 0.55).outerRadius(radius);

  svg
    .selectAll('path')
    .data(dataReady)
    .join('path')
    .attr('d', (d) => arc(d) as string)
    .attr('fill', (d) => color(d.data.label) as string)
    .attr('stroke', '#ffffff')
    .style('stroke-width', '3px');

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .style('font-size', '22px')
    .style('font-weight', '900')
    .style('fill', '#0f172a')
    .text(`${percentCorrect.value}%`);
}

onMounted(async () => {
  try {
    // Extract session ID from results
    const sessionId = props.results?.session_id;
    
    if (sessionId) {
      await fetchGameSessionResults(sessionId);
    }
    
    renderPieChart();
  } catch (error) {
    console.error('Error loading results:', error);
    // Fall back to local results if backend fetch fails
    renderPieChart();
  }
});
</script>

<style scoped>
.min-h-screen { 
  min-height: 100vh; 
}
.line-height-tight { 
  line-height: 1.2; 
}
.line-height-relaxed { 
  line-height: 1.6; 
}

#pie-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* ==========================================
   CAROUSEL STYLING WITH CSS GRID
   ========================================== */
.carousel-wrapper {
  position: relative;
}

.carousel-controls {
  gap: 8px;
}

.carousel-grid-container {
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
}

.carousel-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 1fr);
  gap: 16px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  padding: 8px 0;
}

/* Responsive column sizes */
@media (min-width: 1920px) {
  .carousel-grid {
    grid-auto-columns: minmax(300px, 1fr);
  }
}

@media (max-width: 960px) {
  .carousel-grid {
    grid-auto-columns: minmax(280px, 1fr);
  }
}

@media (max-width: 600px) {
  .carousel-grid {
    grid-auto-columns: minmax(100%, 1fr);
  }
}

.carousel-card {
  min-height: 240px;
  flex-shrink: 0;
  width: 100%;
  max-width: 300px;
}

/* ==========================================
   RESULTS CARD ACCENT STYLING
   ========================================== */
.result-deck-card {
  border-width: 1px !important;
  border-top-width: 5px !important;
}

.accent-border-success { 
  border-color: #e2e8f0 !important; 
  border-top-color: #10b981 !important; 
}

.accent-border-error { 
  border-color: #e2e8f0 !important; 
  border-top-color: #ef4444 !important; 
}

.accent-border-info { 
  border-color: #e2e8f0 !important; 
  border-top-color: #0ea5e9 !important; 
}

.prompt-meta-mini div:last-child {
  margin-bottom: 0 !important;
}

.bg-blue-init-lighten {
  background-color: rgba(14, 165, 233, 0.06);
}

.text-xxs {
  font-size: 0.7rem !important;
}

/* ==========================================
   COLOR UTILITIES
   ========================================== */
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
</style>
