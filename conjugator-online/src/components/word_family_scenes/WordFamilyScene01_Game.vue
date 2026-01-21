<!-- src/components/word_families/word_families_scenes/WordFamiliesScene01_Game.vue -->
<template>
  <v-container fluid class="pa-3 d-flex justify-center">

    <!-- Floating feedback -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="px-4 py-2" width="720" min-height="660" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/WordFamilies.png" max-width="420" />
        </div>

        <div class="d-flex justify-center">
            <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>{{ numRounds }} rounds</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-clock" /></template>
            <v-list-item-title>
              30 seconds per round
            </v-list-item-title>
          </v-list-item>
          
          
          <v-list-item>
            <template #prepend><v-icon icon="mdi-gamepad-variant-outline" /></template>
            <v-list-item-title class="text-wrap">
              Mode: <strong class="text-capitalize">{{ mode }}</strong> for the <strong class="text-capitalize">{{ category }} </strong> vocabulary set
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-if="mode === 'writing'">
            <template #prepend><v-icon icon="mdi-pencil" /></template>
            <v-list-item-title>
              Write the missing words
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-else>
            <template #prepend><v-icon icon="mdi-cursor-move" /></template>
            <v-list-item-title>
              Drag words to matching sentences
            </v-list-item-title>
          </v-list-item>
        </v-list>

        </div>
        
        <div class="d-flex justify-center" style="margin-top: 4rem;">
          <v-btn color="success" @click="begin" :disabled="!hasAnyPrompts">Start</v-btn>
        </div>

        <div v-if="!hasAnyPrompts" class="text-caption text-center mt-4">
          No prompts loaded. Go back and try again.
        </div>
        <div class="d-flex justify-center mt-8">
            <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large" class="ms-3">
              <v-icon color="grey-darken-3" size="large">
                mdi-arrow-left-circle
              </v-icon>
            </v-btn>
          </RouterLink>
        </div>
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">

        <div v-if="!hasPrompt" class="p-6 text-center">
          <v-progress-circular indeterminate />
          <div class="text-caption mt-3">Loading prompts…</div>
        </div>

        <template v-else>
          <!-- TOP -->
          <div class="game-top">
            <div class="d-flex justify-space-between mb-2">
              <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
              <div v-if="mode === 'writing'" class="text-subtitle-2">
                Fill in the missing words
              </div>
              <div v-else class="text-subtitle-2">
                Match words to sentences
              </div>
              <div class="text-subtitle-2 timer-pill" :class="timerClass">⏱ {{ timeLeft }} s</div>
            </div>
          </div>

          <!-- MIDDLE -->
          <div class="game-middle">

            <!-- WRITING MODE -->
            <template v-if="mode === 'writing'">
              <v-card class="pa-3 mt-4" elevation="0">
                <v-card-title>
                <span style="font-size: 1.1rem;">Word family:<span class="ms-2 text-uppercase font-weight-bold"> {{ currentPrompt.key }}</span></span></v-card-title>
                <v-divider class="my-2 mb-5" />

                <v-row v-for="it in currentPrompt.items" :key="it.pos" class="mb-2">
                  <v-col cols="12" md="8" style="padding-left: 10%;">
                    <div class="text-caption text-medium-emphasis text-uppercase">
                      {{ it.pos }}
                    </div>
                    <div class="text-wrap">
                      {{ it.sentence }}
                    </div>
                  </v-col>

                  <v-col cols="12" md="4" ref="writingInputsWrap" style="padding-right: 7%;">
                    <v-text-field
                      v-model="writingAnswers[it.pos]"
                      :label="`Type the ${it.pos}`"
                      hide-details
                      density="compact"
                      :disabled="inputLocked"
                      @keyup.enter="submit"
                    />
                  </v-col>
                </v-row>
              </v-card>
              <div class="d-flex justify-center mt-8">
                  <v-btn color="primary" @click="submit" :disabled="inputLocked">
                    Submit
                  </v-btn>
                </div>
            </template>

            <!-- MATCHING MODE (HYBRID) -->
            <template v-else>
              <v-card class="pa-3" elevation="3">
                <v-card-title class="d-flex justify-space-between align-center">
                  <span style="font-size: 1.1rem;">Word family:<span class="ms-2 text-uppercase font-weight-bold"> {{ currentPrompt.key }}</span></span>
                  <span class="text-caption">
                    Drag word chips (or tap a row, then the chip)
                  </span>
                </v-card-title>

                <v-divider class="my-2" />

                <!-- Sentence rows + drop slots -->
                <div class="match-rows">
                  <div
                    v-for="it in currentPrompt.items"
                    :key="it.pos"
                    class="match-row"
                    :class="{ selected: selectedPos === it.pos }"
                    @click="selectPos(it.pos)"
                  >
                    <div class="row-left">
                      <div class="pos-pill">{{ it.pos }}</div>
                      <div class="sentence">{{ it.sentence }}</div>
                    </div>

                    <div class="row-right">
                      <!-- SLOT: draggable list with max 1 -->
                      <draggable
                        :list="slots[it.pos]"
                        item-key="id"
                        :group="dragGroup"
                        :sort="false"
                        class="slot"
                        @change="onDragChange(it.pos)"
                      >
                        <template #item="{ element }">
                          <v-chip
                            class="ma-1"
                            color="primary"
                            variant="flat"
                            closable
                            @click.stop="clearSlot(it.pos)"
                            @click:close.stop="clearSlot(it.pos)"
                          >
                            {{ element.text }}
                          </v-chip>
                        </template>

                        <template #footer>
                          <div v-if="slots[it.pos].length === 0" class="slot-placeholder">
                            Drop here
                          </div>
                        </template>
                      </draggable>
                    </div>
                  </div>
                </div>

                <v-divider class="my-2" />

                <!-- Word bank -->

                <draggable
                  :list="bank"
                  item-key="id"
                  :group="dragGroup"
                  class="bank"
                  @change="onBankChange"
                >
                  <template #item="{ element }">
                    <v-chip
                      class="ma-1"
                      variant="outlined"
                      :color="selectedPos ? 'secondary' : undefined"
                      @click="tapChip(element)"
                    >
                      {{ element.text }}
                    </v-chip>
                  </template>
                </draggable>

                <div class="d-flex justify-center mt-2">
                  <v-btn
                    color="primary"
                    @click="submit"
                    :disabled="inputLocked || !allSlotsFilled"
                  >
                    Submit
                  </v-btn>
                </div>
              </v-card>
            </template>

          </div>

          <!-- BOTTOM -->
          <div class="game-bottom mt-4">
            <v-progress-linear :model-value="progressValue" height="10" class="mb-3" color="primary" />

            <div class="d-flex justify-space-between align-center">
              <RouterLink :to="{ name: 'games' }">
                <v-btn icon elevation="0" class="ms-3">
                  <v-icon color="grey-darken-3">
                    mdi-arrow-left-circle
                  </v-icon>
                </v-btn>
              </RouterLink>
              <div class="d-flex justify-space-between">
                <div class="me-4">✅ {{ rightCount }}</div>
                <div class="me-4">❌ {{ wrongCount }}</div>
                <div class="me-4">Remaining: {{ remaining }}</div>
              </div>
              
            </div>
          </div>
        </template>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="640">
      <v-card color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          Wrong <v-icon icon="mdi-emoticon-sad-outline" />
        </v-card-title>

        <v-card-text>
          <div class="text-caption text-medium-emphasis mb-2">
            Round {{ lastPromptNumber }} • Word family <strong>{{ lastKey }}</strong>
          </div>

          <div v-for="it in lastItems" :key="it.pos" class="mb-2">
            <div>
              <v-card-title class="text-uppercase">{{ it.pos }}</v-card-title>
              <v-card-subtitle>Your answer: <strong>{{ it.user || "—" }}</strong> • <span v-if="it.user === it.correct" style="color: green;">Right!</span ><span v-else style="color: red">Wrong!</span> <span v-if="it.user != it.correct">• Correct answer: <strong>{{ it.correct }}</strong> </span> </v-card-subtitle>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn ref="wrongOkButton" color="secondary" @click="acknowledgeWrong">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import api from "@/axios";
import draggable from "vuedraggable";

import { checkRoundAnswers } from "@/assets/scripts/word_families/WordFamilyPromptEngine";

const ROUND_SECONDS = 30;
const WARN_SECONDS = 10;
const DANGER_SECONDS = 4;


const props = defineProps({
  prompts: { type: Array, required: true },
  gameSettings: { type: Object, default: null }, // { mode, track, numRounds }
});

const emit = defineEmits(["gameOver"]);

const mode = computed(() => props.gameSettings?.mode || "writing");
const category = computed(() => props.gameSettings?.track || "all" );

const numRounds = computed(() => (Array.isArray(props.prompts) ? props.prompts.length : 0));
const hasAnyPrompts = computed(() => numRounds.value > 0);

const currentRound = ref(0);
const currentPrompt = computed(() => props.prompts?.[currentRound.value] || null);
const hasPrompt = computed(() => !!currentPrompt.value);

const gameStarted = ref(false);

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(0);

const inputLocked = ref(false);
const INPUT_COOLDOWN_MS = 450;

const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

// Timer

const timerClass = computed(() => {
  if (!gameStarted.value) return "";
  if (timeLeft.value <= DANGER_SECONDS) return "timer-danger";
  if (timeLeft.value <= WARN_SECONDS) return "timer-warn";
  return "timer-ok";
});

const timeLeft = ref(ROUND_SECONDS);
const lastOutOfTime = ref(false);

let timer = null;
function startTimer() {
  stopTimer();
  timeLeft.value = ROUND_SECONDS;

  timer = setInterval(() => {
    if (!hasPrompt.value) return;
    if (showWrongDialog.value || inputLocked.value) return;

    timeLeft.value--;

    if (timeLeft.value <= 0) {
      timeLeft.value = 0;
      handleTimeOut();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function handleTimeOut() {
  if (!hasPrompt.value) return;
  if (inputLocked.value) return;

  inputLocked.value = true;
  stopTimer();
  lastOutOfTime.value = true;

  const p = currentPrompt.value;

  // build user answers map (same as submit)
  let userMap = { verb: "", noun: "", adjective: "", adverb: "" };

  if (mode.value === "matching") {
    p.items.forEach(it => {
      const chosen = slots.value[it.pos]?.[0]?.text ?? "";
      userMap[it.pos] = chosen;
    });
  } else {
    userMap = { ...writingAnswers.value };
  }

  const { allCorrect } = checkRoundAnswers(p, userMap);

  // record + show dialog if wrong (timeout counts as wrong)
  recordRound(p, userMap, allCorrect, true);

  if (allCorrect) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 900);
    next();
  } else {
    setWrongDialogData(userMap);
    showWrongDialog.value = true;
  }
}

/* -----------------------------
   Writing mode state
----------------------------- */
const writingAnswers = ref({ verb: "", noun: "", adjective: "", adverb: "" });
const writingInputsWrap = ref(null);

async function focusFirstWritingInput() {
  await nextTick();
  requestAnimationFrame(() => {
    if (inputLocked.value) return;
    // focus the first visible input
    const root = document.querySelector(".game-layout");
    const input = root?.querySelector?.("input");
    input?.focus?.();
    input?.select?.();
  });
}

/* -----------------------------
   Matching mode state (HYBRID)
----------------------------- */
const selectedPos = ref(null);

// draggable config
const dragGroup = { name: "wf-words", pull: true, put: true };

// Bank + slots use movable objects (never destroy)
function makeWordObj(it) {
  return { id: `${it.pos}-${it.answer}-${Math.random().toString(36).slice(2, 8)}`, text: it.answer, pos: it.pos };
}

const bank = ref([]); // WordObj[]
const slots = ref({
  verb: [],
  noun: [],
  adjective: [],
  adverb: [],
});

const allSlotsFilled = computed(() => {
  const p = currentPrompt.value;
  if (!p) return false;
  return p.items.every(it => (slots.value[it.pos]?.length || 0) === 1);
});

function resetMatchingState() {
  selectedPos.value = null;
  bank.value = [];
  slots.value = { verb: [], noun: [], adjective: [], adverb: [] };

  const p = currentPrompt.value;
  if (!p) return;

  // Build bank from all available items for that round
  bank.value = p.items.map(makeWordObj);
}

function selectPos(pos) {
  selectedPos.value = pos;
}

function clearSlot(pos) {
  const arr = slots.value[pos] || [];
  if (arr.length === 0) return;
  const word = arr.pop();
  if (word) bank.value.push(word);
}

/**
 * Tap-to-match:
 * - user taps a row -> selectedPos
 * - user taps a chip -> put it into selected slot (swap if occupied)
 */
function tapChip(word) {
  if (!selectedPos.value) return;

  // remove from bank
  const idx = bank.value.findIndex(w => w.id === word.id);
  if (idx === -1) return;
  bank.value.splice(idx, 1);

  const pos = selectedPos.value;

  // if slot occupied, return existing word to bank
  if ((slots.value[pos]?.length || 0) > 0) {
    const existing = slots.value[pos].pop();
    if (existing) bank.value.push(existing);
  }

  slots.value[pos].push(word);
}

/**
 * Keep slots max 1 for drag:
 * if slot gets > 1, move extras back to bank
 */
function onDragChange(pos) {
  const list = slots.value[pos] || [];
  while (list.length > 1) {
    const extra = list.pop();
    if (extra) bank.value.push(extra);
  }

  // also ensure a word isn't duplicated in multiple slots (rare, but safe)
  dedupeAcrossSlots();
}

function onBankChange() {
  // after drag, enforce dedupe
  dedupeAcrossSlots();
}

function dedupeAcrossSlots() {
  const seen = new Set();
  const all = ["verb", "noun", "adjective", "adverb"];

  all.forEach(pos => {
    const list = slots.value[pos] || [];
    slots.value[pos] = list.filter(w => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  });
}

/* -----------------------------
   Wrong dialog data
----------------------------- */
const lastPromptNumber = ref(0);
const lastKey = ref("");
const lastItems = ref([]); // [{pos, correct, user}]

watch(showWrongDialog, async (vis) => {
  if (vis) {
    await nextTick();
    wrongOkButton.value?.$el?.focus?.();
  }
});

function setWrongDialogData(userMap) {
  const p = currentPrompt.value;
  if (!p) return;

  lastPromptNumber.value = currentRound.value + 1;
  lastKey.value = p.key;

  lastItems.value = p.items.map(it => ({
    pos: it.pos,
    correct: it.answer,
    user: userMap[it.pos] ?? "",
  }));
}

/* -----------------------------
   Begin / round init
----------------------------- */
function begin() {
  if (!hasAnyPrompts.value) return;

  currentRound.value = 0;
  rightCount.value = 0;
  wrongCount.value = 0;
  remaining.value = numRounds.value;
  inputLocked.value = false;

  gameStarted.value = true;

  initRoundState();
  startTimer();

}

function initRoundState() {
  writingAnswers.value = { verb: "", noun: "", adjective: "", adverb: "" };

  if (mode.value === "matching") {
    resetMatchingState();
  } else {
    focusFirstWritingInput();
  }
  // reset and restart timer each round
startTimer();
lastOutOfTime.value = false;

}

// re-init when round changes
watch(currentRound, async () => {
  if (!gameStarted.value) return;
  await nextTick();
  initRoundState();
});

/* -----------------------------
   Submit logic (both modes)
----------------------------- */

const resultsStore = ref([]);
const startedAt = ref(null);

watch(gameStarted, (v) => {
  if (v) startedAt.value = new Date();
});

function submit() {
  if (!hasPrompt.value) return;
  if (inputLocked.value) return;

  inputLocked.value = true;

  const p = currentPrompt.value;

  // build user answers map for both modes
  let userMap = { verb: "", noun: "", adjective: "", adverb: "" };

  if (mode.value === "matching") {
    // from slots
    p.items.forEach(it => {
      const chosen = slots.value[it.pos]?.[0]?.text ?? "";
      userMap[it.pos] = chosen;
    });
  } else {
    // from text fields
    userMap = { ...writingAnswers.value };
  }

  const { allCorrect } = checkRoundAnswers(p, userMap);

  // store results 
  recordRound(p, userMap, allCorrect, false);


  if (allCorrect) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 900);
    next();
  } else {
    setWrongDialogData(userMap);
    showWrongDialog.value = true;
  }
}

function acknowledgeWrong() {
  showWrongDialog.value = false;
  stopTimer();
  stopTimer();
  next();
}

function next() {
  if (currentRound.value >= numRounds.value - 1) {
    finishGame();
    return;
  }

  currentRound.value++;
  unlockInputWithDelay();
}

function unlockInputWithDelay(delay = INPUT_COOLDOWN_MS) {
  setTimeout(async () => {
    inputLocked.value = false;

    // refocus only for writing mode
    if (mode.value === "writing") {
      await focusFirstWritingInput();
    }
  }, delay);
}

/* -----------------------------
   Recording + API posting
   - ONLY posting if writing mode
----------------------------- */

function joinAnswers(userMap, items) {
  // Keep consistent order with prompt.items
  return items.map(it => String(userMap[it.pos] ?? "").trim()).join(" | ");
}
function joinCorrect(items) {
  return items.map(it => String(it.answer ?? "").trim()).join(" | ");
}

function recordRound(round, userMap, isCorrect, outOfTime = false) {

  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  resultsStore.value.push({
    question: round.items.map(it => `${it.pos}: ${it.sentence}`).join(" || "),
    correct_answer: joinCorrect(round.items),
    prompt_number: roundNumber,
    user_answer: joinAnswers(userMap, round.items),
    is_correct: isCorrect,
    out_of_time: outOfTime,
    elapsed_time: secondsUsed,
    typo: false,
    typo_requested: false,
    typo_accepted: null,
  });

  isCorrect ? rightCount.value++ : wrongCount.value++;
  remaining.value--;
}

async function finishGame() {
  stopTimer();
  const finishedAt = new Date();
  const totalSeconds = startedAt.value
    ? Math.floor((finishedAt.getTime() - startedAt.value.getTime()) / 1000)
    : 0;

  const avg = resultsStore.value.length
    ? totalSeconds / resultsStore.value.length
    : 0;

  const payload = {
    game_name: "Word Families",
    total_rounds: numRounds.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startedAt.value ? startedAt.value.toISOString() : new Date().toISOString(),
    finished_at: finishedAt.toISOString(),
    total_time: totalSeconds,
    avg_time_per_prompt: parseFloat(avg.toFixed(2)),
    rounds: resultsStore.value,
  };

  // ✅ only post for writing mode
  if (mode.value === "writing") {
    try {
      await api.post("/other-games-sessions/", payload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Word Families post failed:", e?.response?.data || e);
    }
  }

  emit("gameOver", payload);
}

/* -----------------------------
   Keyboard: Enter submits; Enter in dialog continues
----------------------------- */
onMounted(() => {
  const handler = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (inputLocked.value) return;
    if (!gameStarted.value) return;

    if (showWrongDialog.value) acknowledgeWrong();
    else submit();
  };
  window.addEventListener("keydown", handler);
  onBeforeUnmount(() => window.removeEventListener("keydown", handler));
});
onBeforeUnmount(() => stopTimer());

</script>

<style scoped>
.game-layout { display: flex; flex-direction: column; height: 100%; }
.game-middle { flex: 1; }

.floating-feedback {
  position: fixed; top: 8vh; left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px; border-radius: 8px;
  background: #4caf50; color: white; z-index: 2000;
}

/* Matching UI */
.match-rows { display: flex; flex-direction: column; gap: 10px; }
.match-row {
  display: flex; gap: 12px; align-items: stretch;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  margin-left: 5%;
  margin-right: 5%;
}
.match-row.selected {
  outline: 2px solid rgba(25,118,210,0.4);
  background: rgba(25,118,210,0.06);
}
.row-left { flex: 1; }
.pos-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(0,0,0,0.06);
  margin-bottom: 6px;
}
.sentence { line-height: 1.25; }

.row-right { width: 220px; }
.slot {
  min-height: 44px;
  border: 2px dashed rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.slot-placeholder {
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(0,0,0,0.55);
}

.bank {
  min-height: 54px;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  justify-items: center;
}
</style>
