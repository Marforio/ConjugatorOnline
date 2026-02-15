<!-- VocabDashboard.vue -->
<template>
  <v-container fluid>
    <!-- Panel controls -->
    <div class="d-flex justify-center my-4">
      <v-window-controls v-model="activePanel" length="2" />
    </div>

    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn
        variant="text"
        @click="activePanel = 0"
        :disabled="activePanel === 0"
        class="d-flex align-center ga-2"
      >
        <v-icon>mdi-chevron-left</v-icon>
        <span class="ms-3">Feedback / notebook</span>
      </v-btn>

      <v-btn
        variant="text"
        @click="activePanel = 1"
        :disabled="activePanel === 1"
        class="d-flex align-center ga-2"
      >
        <span class="me-3">Vocab workout progress</span>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <v-window v-model="activePanel">
      <!-- PANEL 1: Feedback / notebook (DEFAULT) -->
      <v-window-item :value="0">
        <v-row>
          <!-- Vocab Table -->
          <v-col cols="12" md="8">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="text-h5 mb-5">
                <v-icon class="me-3">mdi-notebook</v-icon>My vocabulary notebook
              </v-card-title>

              <v-card-text>
                <v-data-table
                  :items="userStore.processedVocab"
                  :columns="userStore.vocabTableHeaders"
                  :loading="userStore.loadingVocab"
                  class="elevation-1"
                  loading-text="Loading vocab entries..."
                  item-value="vocab_id"
                  dense
                />
                <div v-if="userStore.vocabError" class="text-error mt-4">
                  {{ userStore.vocabError }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Add Vocab Form -->
          <v-col cols="12" md="4">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="text-h5">
                <v-icon class="me-3 mb-2">mdi-notebook-plus</v-icon>Add New Vocab
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="submitNewVocab">
                  <v-text-field v-model="newVocab.correct" label="Correct" required />
                  <v-text-field v-model="newVocab.incorrect" label="Incorrect" />
                  <v-textarea v-model="newVocab.comment" label="Comment" rows="2" />
                  <v-btn type="submit" color="primary" class="mt-3">Submit</v-btn>
                </v-form>

                <div v-if="formError" class="text-error mt-2">{{ formError }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-divider style="margin-top: 100px; margin-bottom: 50px;" />

        <!-- Flip Card -->
        <v-row justify="center" style="margin-bottom: 200px;">
          <v-col cols="8" lg="6" xl="5">
            <h3 class="text-h4 text-center mb-6">
              <v-icon class="me-3 mb-2">mdi-repeat</v-icon>Use your vocabulary
            </h3>

            <div class="flip-container" :class="{ flipped: isFlipped }" @click="flipCard">
              <div class="flipper">
                <!-- Front side -->
                <v-card
                  class="front pa-4 d-flex flex-column justify-space-between bg-cyan-lighten-4"
                  elevation="2"
                  style="min-height: 430px;"
                >
                  <v-card-text
                    v-if="currentVocabItem"
                    class="d-flex flex-column align-center justify-center text-center"
                    style="flex-grow: 1;"
                  >
                    <div class="text-caption text-muted mb-2">What is the correct way to say this?</div>
                    <div class="text-h2 font-weight-light font-italic mb-4">
                      {{ currentVocabItem.incorrect }}
                    </div>
                    <div class="text-caption text-muted">
                      Can you use this word in a sentence about your life?
                    </div>
                  </v-card-text>

                  <v-card-text v-else class="text-center text-caption text-muted mt-6">
                    No vocabulary entries yet.
                  </v-card-text>

                  <v-card-actions class="d-flex justify-end">
                    <v-btn
                      color="black"
                      size="large"
                      @click.stop="nextVocabItem"
                      :disabled="!userStore.vocab.length"
                    >
                      Next word
                      <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <!-- Back side -->
                <v-card
                  class="back pa-4 d-flex flex-column justify-space-between bg-cyan-lighten-4"
                  elevation="2"
                  style="min-height: 430px;"
                >
                  <v-card-text
                    v-if="currentVocabItem"
                    class="d-flex flex-column align-center justify-center text-center text-caption"
                    style="flex-grow: 1;"
                  >
                    <div class="text-caption text-muted mb-2">The correct form of the word is:</div>
                    <div class="text-h2">{{ currentVocabItem.correct }}</div>
                  </v-card-text>

                  <v-card-text v-else class="text-center text-caption text-muted mt-6">
                    No vocabulary entries yet.
                  </v-card-text>

                  <v-card-actions class="d-flex justify-end">
                    <v-btn
                      color="black"
                      size="large"
                      @click.stop="nextVocabItem"
                      :disabled="!userStore.vocab.length"
                    >
                      Next word
                      <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- PANEL 2: My progress -->
      <v-window-item :value="1">
        <VWMyProgressPanel
          :completionTarget="COMPLETION_TARGET"
          title="My progress"
          subtitle="Continue an ongoing session or review your progress"
          @continue="continueSession"
          @start="startNewSessionForList"
        />
      </v-window-item>
    </v-window>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/axios";
import { useUserStore } from "@/stores/user";

import VWMyProgressPanel from "@/components/vocab_workout_scenes/VWMyProgressPanel.vue";

const router = useRouter();
const userStore = useUserStore();

const activePanel = ref(0);

/** Flip card state */
const currentVocabItem = ref<{ correct: string; incorrect: string } | null>(null);
const isFlipped = ref(false);

/** Form state */
const newVocab = ref({
  correct: "",
  incorrect: "",
  comment: "",
});
const formError = ref<string | null>(null);

async function submitNewVocab() {
  formError.value = null;
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
  } catch (err: any) {
    console.error("Failed to submit vocab:", err);
    formError.value = "Failed to submit vocab entry.";
  }
}

function nextVocabItem() {
  const vocabList = userStore.vocab ?? [];
  if (!vocabList.length) {
    currentVocabItem.value = null;
    return;
  }
  const randomIndex = Math.floor(Math.random() * vocabList.length);
  const selected = vocabList[randomIndex];
  currentVocabItem.value = {
    correct: selected.correct ?? "",
    incorrect: selected.incorrect ?? "",
  };
}

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

/**
 * ✅ These handlers now match the Settings page semantics:
 * - continueSession(sessionId) -> emitStartGame({ resumeSessionId, resume: true })
 * - startNewSessionForList(listKey, level, trackKey) -> emitStartGame({...})
 *
 * Note: VWMyProgressPanel may emit @start either as (listKey, level, trackKey)
 * OR as a single object { listKey, level, trackKey } depending on your version.
 * This handler supports both.
 */

const COMPLETION_TARGET = 3;
const START_PAYLOAD_KEY = "vw_start_payload";
const DEBUG_VW = false;
function d(...args: any[]) {
  if (DEBUG_VW) console.log("[VocabDashboard]", ...args);
}

function goToWorkoutWithPayload(payload: any) {
  d("goToWorkoutWithPayload called with:", payload);

  const json = JSON.stringify(payload);
  sessionStorage.setItem(START_PAYLOAD_KEY, json);

  // Verify it was written
  const check = sessionStorage.getItem(START_PAYLOAD_KEY);
  d("stored payload raw:", check);

  router.push({ name: "vocabworkout" }).then(() => {
    d("router.push resolved -> currentRoute:", router.currentRoute.value.fullPath);
  }).catch((e) => {
    console.error("[VocabDashboard] router.push error:", e);
  });
}

function continueSession(sessionId: number) {
  d("continueSession sessionId:", sessionId);
  goToWorkoutWithPayload({ resumeSessionId: sessionId, resume: true });
}

function startNewSessionForList(a: any, b?: any, c?: any) {
  d("startNewSessionForList raw args:", a, b, c);

  const listKey = typeof a === "object" ? a.listKey : a;
  const level = typeof a === "object" ? a.level ?? null : b ?? null;
  const trackKey = typeof a === "object" ? a.trackKey ?? null : c ?? null;

  const payload = {
    listKey,
    level,
    mode: "write",
    frontField: "definition",
    backField: "term",
    trackKey,
    resume: false,
  };

  d("start payload:", payload);
  goToWorkoutWithPayload(payload);
}



onMounted(async () => {
  await userStore.fetchVocabDashboardData();
  nextVocabItem();
});
</script>

<style scoped>
.flip-container {
  perspective: 1000px;
  position: relative;
  height: 430px;
}
.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.flipped .flipper {
  transform: rotateY(180deg);
}
.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.back {
  transform: rotateY(180deg);
}
</style>
