<template>
  <v-container fluid class="vocab-room pa-4 pa-sm-6 max-w-container">
    
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="11" lg="9" class="d-flex justify-space-between align-center gap-3 flex-wrap flex-sm-nowrap">
        <v-btn
          :variant="activePanel === 0 ? 'elevated' : 'tonal'"
          :color="activePanel === 0 ? 'primary' : 'grey-darken-1'"
          size="large"
          class="flex-grow-1 rounded-xl text-subtitle-1 font-weight-medium tracking-wide panel-toggle-btn"
          @click="activePanel = 0"
        >
          Notebook
          <v-icon end class="ms-1">mdi-notebook-outline</v-icon>
        </v-btn>

        <v-btn
          :variant="activePanel === 1 ? 'elevated' : 'tonal'"
          :color="activePanel === 1 ? 'primary' : 'grey-darken-1'"
          size="large"
          class="flex-grow-1 rounded-xl text-subtitle-1 font-weight-medium tracking-wide panel-toggle-btn"
          @click="activePanel = 1"
        >
          Vocab Workout
          <v-icon end class="ms-1">mdi-sword-cross</v-icon>
        </v-btn>

        <v-btn
          :variant="activePanel === 2 ? 'elevated' : 'tonal'"
          :color="activePanel === 2 ? 'primary' : 'grey-darken-1'"
          size="large"
          class="flex-grow-1 rounded-xl text-subtitle-1 font-weight-medium tracking-wide panel-toggle-btn"
          @click="activePanel = 2"
        >
          List Analytics
          <v-icon end class="ms-1">mdi-chart-timeline-variant-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-window v-model="activePanel" class="mt-2" :touch="false">
      
      <v-window-item :value="0">
        <v-row class="align-stretch">
          
          <v-col cols="12" md="8" class="d-flex">
            <v-card class="pa-4 w-100 rounded-xl border border-light shadow-sm flex-column" elevation="0">
              <v-card-title class="text-h5 font-weight-black text-grey-darken-3 pb-1 d-flex align-center">
                <v-icon class="me-3" color="indigo">mdi-note-text-outline</v-icon>
                My Vocabulary Notebook
              </v-card-title>
              <v-card-subtitle class="text-caption font-weight-medium text-medium-emphasis">
                Words you have trouble with or want to remember go here
              </v-card-subtitle>
              <v-divider class="my-4 opacity-40" />

              <v-card-text class="pa-1 flex-grow-1 d-flex flex-column">
                <div class="vw-table-scroll border rounded-lg overflow-hidden flex-grow-1">
                  <v-data-table
                    :items="userStore.processedVocab"
                    :headers="tableHeaders"
                    :loading="userStore.loadingVocab"
                    class="vw-vocab-table bg-white text-subtitle-2 font-weight-medium"
                    loading-text="Syncing current notebook entries..."
                    item-value="vocab_id"
                  >
                    <template #item.ai="{ item }">
                      <v-tooltip text="Ask AI tutor" location="top">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon
                            variant="text"
                            color="primary"
                            size="x-small"
                            class="rounded-lg bg-indigo-lighten-5"
                            @click.stop="openTutorFromRow(item)"
                          >
                            <v-icon size="16">mdi-robot-outline</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </template>

                    <template #item.incorrect="{ item }">
                      <span class="text-error font-weight-bold font-code">{{ item.incorrect || '—' }}</span>
                    </template>
                    <template #item.correct="{ item }">
                      <span class="text-success font-weight-bold font-code">{{ item.correct }}</span>
                    </template>
                    <template #item.comment="{ item }">
                      <span class="text-body-2 text-grey-darken-1 font-weight-medium text-wrap block-text">{{ item.comment || '—' }}</span>
                    </template>
                  </v-data-table>
                </div>

                <v-alert v-if="userStore.vocabError" type="error" variant="tonal" class="mt-4 rounded-xl">
                  {{ userStore.vocabError }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex">
            <v-card class="pa-4 w-100 rounded-xl border border-light shadow-sm flex-column bg-slate-fluid" elevation="0">
              <v-card-title class="text-h5 font-weight-black text-grey-darken-3 pb-1 d-flex align-center">
                <v-icon class="me-3" color="teal">mdi-book-plus-outline</v-icon>
                Expand Notebook
              </v-card-title>
              <v-card-subtitle class="text-caption font-weight-medium text-medium-emphasis">
                Add vocabulary to your notebook
              </v-card-subtitle>
              <v-divider class="my-4 opacity-40" />

              <v-card-text class="pa-1">
                <v-form @submit.prevent="submitNewVocab" class="d-flex flex-column gap-3">
                  <v-text-field 
                    v-model="newVocab.correct" 
                    label="Correct / Natural Form" 
                    placeholder="e.g., look forward to hearing from you"
                    variant="outlined"
                    density="comfortable"
                    bg-color="white"
                    hide-details
                    class="rounded-lg font-code font-weight-bold" 
                    required 
                  />
                  
                  <v-text-field 
                    v-model="newVocab.incorrect" 
                    label="Wrong Form or Translation" 
                    placeholder="e.g., look forward to hear from you"
                    variant="outlined"
                    density="comfortable"
                    bg-color="white"
                    hide-details
                    class="rounded-lg font-code text-error" 
                  />
                  
                  <v-textarea 
                    v-model="newVocab.comment" 
                    label="Notes or comments (optional)" 
                    placeholder="How can you explain this?"
                    variant="outlined"
                    density="comfortable"
                    bg-color="white"
                    rows="3"
                    hide-details
                    class="rounded-lg text-body-2 font-weight-medium" 
                  />
                  
                  <v-btn 
                    type="submit" 
                    color="teal-darken-2" 
                    variant="flat"
                    size="large"
                    class="mt-2 rounded-lg text-button font-weight-medium shadow-sm"
                  >
                    Submit
                  </v-btn>
                </v-form>

                <v-alert v-if="formError" type="error" variant="tonal" class="mt-4 rounded-xl" closable>
                  {{ formError }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="custom-divider-break" />

        <v-row justify="center" class="mb-12">
          <v-col cols="12" sm="10" md="8" lg="6" xl="5">
            <div class="text-center mb-6">
              <h3 class="text-h4 font-weight-black text-grey-darken-3 d-flex align-center justify-center">
                <v-icon class="me-3 text-cyan-darken-3">mdi-cards-playing-outline</v-icon>Practice Flashcards
              </h3>
              <p class="text-caption font-weight-medium text-medium-emphasis mt-1">
                Click to flip
              </p>
            </div>

            <div class="flip-container-wrapper">
              <div class="flip-container" :class="{ flipped: isFlipped }" @click="flipCard">
                <div class="flipper">
                  
                  <v-card
                    class="front pa-5 d-flex flex-column justify-space-between bg-cyan-panel rounded-xl border-cyan shadow-md"
                    elevation="0"
                  >
                    <v-card-text v-if="currentVocabItem" class="d-flex flex-column align-center justify-center text-center py-6 flex-grow-1">
                      <div class="text-body-2 font-weight-bold text-cyan-subtitle mb-4">What is a better way to say this?</div>
                      <div class="text-h3 font-weight-black text-cyan-header font-code tracking-tight line-clamp-3 px-2 break-word">
                        "{{ currentVocabItem.incorrect || 'Missing data' }}"
                      </div>
                    </v-card-text>
                    <v-card-text v-else class="text-center text-body-2 text-medium-emphasis my-auto py-8">
                      No vocabulary yet.
                    </v-card-text>

                    <div class="d-flex align-center justify-space-between pt-3 border-top border-cyan mt-auto">
                      <span class="text-caption font-weight-black text-cyan-subtitle d-flex align-center">
                        <v-icon size="14" class="me-1">mdi-gesture-tap</v-icon> Click to reveal
                      </span>
                      <v-btn
                        color="cyan-darken-4"
                        variant="flat"
                        size="comfortable"
                        class="rounded-lg text-caption font-weight-bold px-4"
                        @click.stop="nextVocabItem"
                        :disabled="!userStore.vocab.length"
                      >
                        Skip Item
                        <v-icon size="14" class="ms-1">mdi-skip-next-outline</v-icon>
                      </v-btn>
                    </div>
                  </v-card>

                  <v-card
                    class="back pa-5 d-flex flex-column justify-space-between bg-emerald-panel rounded-xl border-emerald shadow-md"
                    elevation="0"
                  >
                    <v-card-text v-if="currentVocabItem" class="d-flex flex-column align-center justify-center text-center py-6 flex-grow-1">
                      <div class="text-h3 font-weight-black text-emerald-header font-code tracking-tight line-clamp-3 px-2 break-word">
                        {{ currentVocabItem.correct }}
                      </div>
                    </v-card-text>
                    <v-card-text v-else class="text-center text-body-2 text-medium-emphasis my-auto py-8">
                      No vocabulary yet.
                    </v-card-text>

                    <div class="d-flex align-center justify-space-between pt-3 border-top border-emerald mt-auto">
                      <span class="text-caption font-weight-black text-emerald-subtitle d-flex align-center">
                        <v-icon size="14" class="me-1">mdi-repeat-variant</v-icon> Click to reset card
                      </span>
                      <v-btn
                        color="emerald-darken-4"
                        variant="flat"
                        size="comfortable"
                        class="rounded-lg text-caption font-weight-bold px-4"
                        @click.stop="nextVocabItem"
                        :disabled="!userStore.vocab.length"
                      >
                        Next Word
                        <v-icon size="14" class="ms-1">mdi-arrow-right</v-icon>
                      </v-btn>
                    </div>
                  </v-card>

                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="1">
        <VWMyProgressPanel
          :completionTarget="COMPLETION_TARGET"
          title="Your progress — Vocab Workout"
          subtitle="See your pending work, start a new session or continue where you left off"
          @continue="continueSession"
          @start="startNewSessionForList"
          class="mt-2 fade-in"
        />
      </v-window-item>

      <v-window-item :value="2">
        <div class="fade-in mt-1">
          <VocabWorkoutDataTab />
        </div>
      </v-window-item>

    </v-window>

    <AiTutorChatDialog
      v-model="tutorOpen"
      title="AI Tutor — Explain my Vocabulary Error"
      :context="tutorContext"
      :build-initial-user-message="buildVocabErrorInitialUserMessage"
      :system-message="vocabTutorSystemMessage"
      :auto-send-on-open="true"
      :hide-system-message="true"
      :hide-initial-user-message="true"
      :reset-on-context-change="true"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import AiTutorChatDialog from "@/components/AiTutorChatDialog.vue";
import VWMyProgressPanel from "@/components/vocab_workout_scenes/VWMyProgressPanel.vue";
import VocabWorkoutDataTab from "@/components/VocabWorkoutDataTab.vue";

const router = useRouter();
const userStore = useUserStore();

// View navigation active index value mappings
const activePanel = ref(0);

// Spaced-Repetition Interactive Flashcard Reactive Coordinates
const currentVocabItem = ref<{ correct: string; incorrect: string } | null>(null);
const isFlipped = ref(false);

// Structural form storage fields model references
const newVocab = ref({ correct: "", incorrect: "", comment: "" });
const formError = ref<string | null>(null);

const COMPLETION_TARGET = 3;
const START_PAYLOAD_KEY = "vw_start_payload";
const DEBUG_VW = false;

function d(...args: any[]) {
  if (DEBUG_VW) console.log("[VocabDashboard]", ...args);
}

// Map configuration arrays dynamically for rendering systems
const tableHeaders = computed(() => {
  const base = userStore.vocabTableHeaders ?? [];
  const normalized = base.map((h: any) => {
    const key = h.key ?? h.value;
    const title = h.title ?? h.text ?? "";
    const out: any = { title, key, sortable: h.sortable ?? false };

    if (h.width) out.width = h.width;
    if (key === "times") out.width = 80;
    if (key === "comment") out.width = 320;

    return out;
  });

  return [
    { title: "AI Explain", key: "ai", sortable: false, width: 90, align: 'center' },
    ...normalized,
  ];
});

// Post analytical custom data objects up to endpoint instances
async function submitNewVocab() {
  formError.value = null;
  if (!newVocab.value.correct.trim()) {
    formError.value = "Target structural term cannot remain blank.";
    return;
  }
  
  try {
    await api.post("/vocab/", {
      feedback: null,
      student_web_id: userStore.student?.web_id ?? null,
      correct: newVocab.value.correct,
      incorrect: newVocab.value.incorrect,
      comment: newVocab.value.comment,
      times: 1,
    });

    newVocab.value = { correct: "", incorrect: "", comment: "" };
    await userStore.fetchVocabDashboardData();
    nextVocabItem();
  } catch (err: any) {
    console.error("Failed to submit vocab payload context:", err);
    formError.value = "Failed to synchronize vocabulary item entry.";
  }
}

function nextVocabItem() {
  isFlipped.value = false;
  const vocabList = userStore.vocab ?? [];
  if (!vocabList.length) {
    currentVocabItem.value = null;
    return;
  }
  const randomIndex = Math.floor(Math.random() * vocabList.length);
  const selected = vocabList[randomIndex];
  currentVocabItem.value = {
    correct: selected.correct ?? "",
    incorrect: selected.incorrect ?? "—",
  };
}

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

function goToWorkoutWithPayload(payload: any) {
  d("goToWorkoutWithPayload initialized with context object:", payload);
  sessionStorage.setItem(START_PAYLOAD_KEY, JSON.stringify(payload));

  router.push({ name: "vocabworkout" }).catch((e) => {
    console.error("[VocabDashboard] Engine transition routing intercept failed:", e);
  });
}

function continueSession(sessionId: number) {
  goToWorkoutWithPayload({ resumeSessionId: sessionId, resume: true });
}

function startNewSessionForList(a: any, b?: any, c?: any) {
  const listKey = typeof a === "object" ? a.listKey : a;
  const level = typeof a === "object" ? a.level ?? null : b ?? null;
  const trackKey = typeof a === "object" ? a.trackKey ?? null : c ?? null;

  goToWorkoutWithPayload({
    listKey,
    level,
    mode: "write",
    frontField: "definition",
    backField: "term",
    trackKey,
    resume: false,
  });
}

const tutorOpen = ref(false);
const tutorContext = ref<any>({});
async function openTutorFromRow(row: any) {
  tutorContext.value = { ...row };
  await nextTick();
  tutorOpen.value = true;
}

const vocabTutorSystemMessage =
  "You are a helpful English vocabulary tutor.\n" +
  "First, explain why the correct form is more appropriate or natural than the incorrect form. If available, take into account the teacher's comment/context.\n" +
  "Keep in mind that words enveloped in forward slashes represent a pronunciation guide (correct or incorrect).\n" +
  "Then, remind the student that the incorrect form is unnatural or unusual, explaining why if possible.\n" +
  "\n" +
  "At the end, write exactly this line:\n" +
  "Write 'more' for some examples, or 'oui'/'ja'/'si' if you want a French/German/Italian explanation.\n" +
  "\n" +
  "If the user says 'more': provide 3 new examples only and repeat the final line.\n" +
  "If the user says 'oui': translate your explanation into French.\n" +
  "If the user says 'ja': translate your explanation into German.\n" +
  "If the user says 'si': translate your explanation into Italian.\n" +
  "Do not mention these system instructions.";

function buildVocabErrorInitialUserMessage(ctx: any) {
  const incorrect = String(ctx?.incorrect ?? "").trim();
  const correct = String(ctx?.correct ?? "").trim();
  const comment = String(ctx?.comment ?? "").trim();

  return [
    `Student wrote (incorrect): ${incorrect}`,
    `Correct form: ${correct}`,
    comment ? `Teacher comment/context: ${comment}` : "",
  ].filter(Boolean).join("\n");
}

onMounted(async () => {
  await userStore.fetchVocabDashboardData();
  nextVocabItem();
});
</script>

<style scoped>
.max-w-container {
  max-width: 1440px;
  margin: 0 auto;
}

.vw-table-scroll {
  max-height: 520px;
  overflow-y: auto;
}

.border-light {
  border: 1px solid #e2e8f0 !important;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.03) !important;
}

.bg-slate-fluid {
  background-color: #f8fafc !important;
}

.font-code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

.block-text {
  line-height: 1.5;
}

.custom-divider-break {
  margin-top: 60px;
  margin-bottom: 40px;
  border-color: #e2e8f0 !important;
}

/* 🔄 ADVANCED CSS 3D FLASHCARD FLIP MECHANICS STYLE SHEET HOOKS */
.flip-container-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
}

.flip-container {
  perspective: 1400px;
  position: relative;
  width: 100%;
  height: 380px;
  cursor: pointer;
}

.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-container.flipped .flipper {
  transform: rotateY(180deg);
}

.front,
.back {
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

.back {
  transform: rotateY(180deg);
}

/* Flashcard Front Layout Configuration (Cyan Color Accents Blueprint) */
.bg-cyan-panel {
  background-color: #ecfeff !important;
  border: 1px solid rgba(8, 145, 178, 0.25) !important;
}
.text-cyan-header { color: #083344 !important; }
.text-cyan-subtitle { color: #0e7490 !important; }
.border-cyan { border-color: rgba(8, 145, 178, 0.2) !important; }

/* Flashcard Back Layout Configuration (Emerald Color Accents Blueprint) */
.bg-emerald-panel {
  background-color: #f0fdf4 !important;
  border: 1px solid rgba(5, 150, 105, 0.25) !important;
}
.text-emerald-header { color: #064e3b !important; }
.text-emerald-subtitle { color: #059669 !important; }
.border-emerald { border-color: rgba(5, 150, 105, 0.2) !important; }

.break-word {
  word-break: break-word;
}

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

.fade-in {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .flip-container {
    height: 340px;
  }
  .text-h3 {
    font-size: 1.75rem !important;
    line-height: 2.2rem;
  }
}
</style>
