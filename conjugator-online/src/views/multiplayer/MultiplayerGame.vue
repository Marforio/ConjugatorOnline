<template>
  <v-container fluid class="game-bg pa-4">
    <div class="mx-auto" style="max-width: 980px">
      <!-- Connection banner -->
      <v-slide-y-transition>
        <v-alert v-if="store.wsStatus !== 'open' && phase !== 'done'" type="warning" variant="tonal" rounded="xl"
                 density="compact" class="mb-3">
          <v-progress-circular size="16" width="2" indeterminate class="mr-2" />
          {{ store.wsStatus === 'closed' ? 'Disconnected. ' + (store.lastError ?? '') : 'Reconnecting…' }}
        </v-alert>
      </v-slide-y-transition>

      <!-- Live scoreboard -->
      <TransitionGroup name="rank" tag="div" class="d-flex flex-wrap ga-3 mb-4 justify-center">
        <v-card v-for="(p, i) in scoreboard" :key="p.id" rounded="xl" class="score-chip pa-3"
                :class="{ me: p.isMe }" :style="{ borderColor: playerColor(p.colorIdx) }" min-width="200">
          <div class="d-flex align-center">
            <v-avatar size="32" :color="playerColor(p.colorIdx)" class="mr-2">
              <span class="text-caption font-weight-black text-white">{{ p.name.slice(0, 2).toUpperCase() }}</span>
            </v-avatar>
            <div class="text-body-2 font-weight-black text-truncate flex-grow-1">
              {{ MEDALS[i] ?? '' }} {{ p.name }}<span v-if="p.isMe"> (you)</span>
            </div>
            <v-icon v-if="store.finishedPlayers.includes(p.id)" color="success" size="18">mdi-flag-checkered</v-icon>
          </div>
          <div class="d-flex justify-space-between mt-2 text-subtitle-2 font-weight-black">
            <span class="text-success">✅ {{ p.correct }}</span>
            <span class="text-error">❌ {{ p.wrong }}</span>
          </div>
          <v-progress-linear :model-value="p.pct" height="6" rounded :color="playerColor(p.colorIdx)" class="mt-2" />
        </v-card>
      </TransitionGroup>

      <!-- Prompt counter -->
      <div v-if="phase === 'playing'" class="text-center mb-2">
        <v-chip color="primary" variant="flat" class="font-weight-black">
          Prompt {{ Math.min(currentIndex + 1, total) }} / {{ total }}
        </v-chip>
        <v-chip class="ml-2" variant="tonal" :color="store.mode === 'race' ? 'orange' : 'blue'">
          {{ store.mode === 'race' ? '🏃 Race' : '⏱️ Synchronized' }}
        </v-chip>
      </div>

      <!-- Card stage -->
      <div v-if="phase === 'playing'" class="d-flex flex-column align-center">
        <div class="card-viewport mb-5">
          <Transition name="deal-card" @after-enter="revealCard">
            <div v-if="cardInFlight" class="card-box">
              <div class="flipper" :class="{ revealed: cardFlippedOpen }">
                <v-card class="card-hull card-back d-flex flex-column align-center justify-center rounded-xl" elevation="6">
                  <v-icon size="56" color="white" class="float-icon">mdi-school</v-icon>
                  <span class="text-overline text-white font-weight-bold mt-2">Language Labs</span>
                </v-card>

                <v-card class="card-hull card-front pa-5 d-flex flex-column align-center rounded-xl" elevation="4">
                  <component :is="PromptBody" v-if="currentPrompt" :prompt="currentPrompt" :settings="store.gameSettings" />
                </v-card>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Answer -->
        <div class="w-100" style="max-width: 460px">
          <v-text-field ref="answerRef" v-model="answer" label="Your answer" variant="outlined" rounded="xl"
                        hide-details autocomplete="off" :disabled="submitted || !cardFlippedOpen"
                        @keyup.enter="submitAnswer" />
          <div class="d-flex justify-center mt-4">
            <v-btn color="primary" size="large" width="180" rounded="xl" class="font-weight-black"
                   :disabled="submitted || !cardFlippedOpen || !answer.trim()" @click="submitAnswer">
              {{ currentIndex + 1 >= total ? 'FINISH' : 'SUBMIT' }}
            </v-btn>
          </div>

          <!-- Synchronized waiting -->
          <v-expand-transition>
            <v-card v-if="submitted && !feedback && store.mode === 'synchronized'" rounded="xl" class="pa-4 mt-4 text-center" variant="tonal" color="primary">
              <div class="text-subtitle-2 font-weight-bold mb-2">Waiting for the others…</div>
              <v-progress-linear :model-value="syncPct" height="10" rounded color="primary" />
              <div class="text-caption mt-1">{{ store.roundProgress.answered }} / {{ store.roundProgress.total }} answered</div>
            </v-card>
          </v-expand-transition>

          <!-- Feedback -->
          <v-expand-transition>
            <v-alert v-if="feedback" :type="feedback.is_correct ? 'success' : 'error'" variant="flat" rounded="xl"
                     class="mt-4 feedback" :icon="feedback.is_correct ? 'mdi-party-popper' : 'mdi-close-octagon'">
              <div class="text-h6 font-weight-black">{{ feedback.is_correct ? 'Correct! 🎉' : 'Not quite…' }}</div>
              <div v-if="!feedback.is_correct && feedback.correct_answers?.length" class="text-body-2">
                Expected: <strong>{{ feedback.correct_answers[0] }}</strong>
              </div>
              <div v-if="roundResults.length" class="d-flex flex-wrap ga-2 mt-3">
                <v-chip v-for="r in roundResults" :key="r.user_id" size="small" variant="flat"
                        :color="r.is_correct ? 'white' : 'red-lighten-4'">
                  {{ r.is_correct ? '✅' : '❌' }} {{ r.username }}
                </v-chip>
              </div>
            </v-alert>
          </v-expand-transition>
        </div>
      </div>

      <!-- Waiting for others to finish (race) -->
      <v-card v-else-if="phase === 'waiting'" rounded="xl" class="pa-10 text-center mt-6" elevation="4">
        <div class="text-h2 mb-2">🏁</div>
        <div class="text-h5 font-weight-black mb-2">You've finished!</div>
        <div class="text-body-1 text-medium-emphasis mb-4">Waiting for the other players…</div>
        <v-progress-circular indeterminate color="primary" />
      </v-card>

      <!-- Loading -->
      <div v-else-if="phase === 'loading'" class="text-center pa-16">
        <v-progress-circular indeterminate size="56" color="primary" />
      </div>
    </div>

    <!-- Countdown overlay -->
    <v-overlay :model-value="phase === 'countdown'" persistent class="align-center justify-center countdown-overlay" scrim="#1e1b4b" opacity=".92">
      <div class="text-center">
        <div class="text-overline text-white mb-4">Get ready!</div>
        <Transition name="count" mode="out-in">
          <div :key="count" class="count-number" :class="{ go: count === 0 }">
            {{ count === 0 ? 'GO!' : count }}
          </div>
        </Transition>
      </div>
    </v-overlay>

    <!-- Game over overlay -->
    <v-overlay :model-value="phase === 'done'" persistent class="align-center justify-center" scrim="#1e1b4b" opacity=".9">
      <div class="text-center text-white">
        <div class="text-h1 mb-2">🏆</div>
        <div class="text-h4 font-weight-black">Game over!</div>
        <div class="text-body-1 mt-2">Calculating results…</div>
      </div>
    </v-overlay>

    <v-snackbar v-model="snack.show" :color="snack.color" location="top" timeout="2500">{{ snack.text }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useMultiplayerStore } from '@/stores/multiplayer';
import { playerColor, MEDALS } from './multiplayerMeta';
import { promptBodyFor } from './prompts';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const store = useMultiplayerStore();

const myPromptIndex = computed(() => store.myPromptIndex);

const arenaId = route.params.arenaId as string;
const myId = computed(() => String(userStore.user?.id));

type Phase = 'loading' | 'countdown' | 'playing' | 'waiting' | 'done';
const phase = ref<Phase>('loading');
const count = ref(3);

const currentIndex = ref(0);
const answer = ref('');
const submitted = ref(false);
const feedback = ref<any>(null);
const roundResults = ref<any[]>([]);
const cardInFlight = ref(false);
const cardFlippedOpen = ref(false);
const answerRef = ref<any>(null);
const snack = ref({ show: false, text: '', color: 'info' });

let promptStartedAt = 0;
const timers = new Set<ReturnType<typeof setTimeout>>();
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const total = computed(() => store.prompts.length);
const currentPrompt = computed(() => store.prompts[currentIndex.value]);

// ---------- card content (works for conjugation and generic engines) ----------
const PromptBody = computed(() => promptBodyFor(store.gameName));

// ---------- scoreboard ----------

const scoreboard = computed(() =>
  Object.keys(store.playerNames)
    .map((id, idx) => {
      const s = store.scores[id] ?? { correct: 0, wrong: 0 };
      return {
        id,
        colorIdx: idx,
        name: store.playerNames[id],
        correct: s.correct,
        wrong: s.wrong,
        pct: total.value ? ((s.correct + s.wrong) / total.value) * 100 : 0,
        isMe: id === myId.value,
      };
    })
    .sort((a, b) => b.correct - a.correct || a.wrong - b.wrong)
);

const syncPct = computed(() =>
  store.roundProgress.total ? (store.roundProgress.answered / store.roundProgress.total) * 100 : 0
);

// ---------- helpers ----------
function later(fn: () => void, ms: number) {
  const t = setTimeout(() => {
    timers.delete(t);
    fn();
  }, ms);
  timers.add(t);
}

function toast(text: string, color = 'info') {
  snack.value = { show: true, text, color };
}

// ---------- countdown ----------
function startCountdown() {
  const ends = store.countdownEndsAt;
  if (!ends || ends - Date.now() <= 0) return beginPlaying();

  phase.value = 'countdown';
  const tick = () => {
    const ms = ends - Date.now();
    if (ms <= 0) {
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      count.value = 0; // "GO!"
      later(beginPlaying, 650);
    } else {
      count.value = Math.ceil(ms / 1000);
    }
  };
  tick();
  countdownTimer = setInterval(tick, 100);
}

function beginPlaying() {
  store.countdownEndsAt = null;
  phase.value = 'playing';
  currentIndex.value = 0;
  dealCard();
}

// ---------- card flow ----------
function dealCard() {
  cardFlippedOpen.value = false;
  cardInFlight.value = false;
  later(() => (cardInFlight.value = true), 60);
}

async function revealCard() {
  cardFlippedOpen.value = true;
  promptStartedAt = Date.now(); // timer starts when the card is readable
  await nextTick();
  later(() => answerRef.value?.$el?.querySelector('input')?.focus(), 150);
}

function goToIndex(next: number) {
  feedback.value = null;
  roundResults.value = [];
  answer.value = '';
  submitted.value = false;
  if (next >= total.value) {
    phase.value = 'waiting';
    return;
  }
  currentIndex.value = next;
  dealCard();
}

function submitAnswer() {
  if (!store.gameHydrated) return;
  if (phase.value !== 'playing' || submitted.value || !cardFlippedOpen.value || !answer.value.trim()) return;
  const elapsed = Math.max(0, (Date.now() - promptStartedAt) / 1000);
  if (!store.sendAnswer(currentIndex.value, answer.value.trim(), Number(elapsed.toFixed(2)))) {
    toast('Connection lost, please wait…', 'warning');
    return;
  }
  submitted.value = true;
}

// ---------- server events ----------
const unsubscribe = store.subscribe((msg) => {
  if (phase.value === 'done') return;

  if (msg.type === 'answer_submitted' && store.mode === 'race' && String(msg.user_id) === myId.value) {
    if (msg.prompt_index !== currentIndex.value) return;
    feedback.value = msg;
    later(() => goToIndex(currentIndex.value + 1), 1500);
  } else if (msg.type === 'round_complete' && msg.prompt_index === currentIndex.value) {
    const mine = (msg.results ?? []).find((r: any) => String(r.user_id) === myId.value);
    feedback.value = mine ?? { is_correct: false, correct_answers: [] };
    roundResults.value = msg.results ?? [];
    later(() => goToIndex(msg.prompt_index + 1), 2800);
  } else if (msg.type === 'game_finished') {
    phase.value = 'done';
    later(() => router.replace({ name: 'MultiplayerResults', params: { arenaId } }), 1800);
  } else if (msg.type === 'error') {
    if (submitted.value && !feedback.value) submitted.value = false; // allow retry
    toast(msg.message, 'error');
  } else if (msg.type === '_fatal') {
    toast('Connection refused by the server.', 'error');
  }
});

onMounted(async () => {
  try {
    if (!store.prompts.length || store.arenaId !== arenaId) {
      const arena = await store.hydrateFromRest(arenaId);
      if (arena.status === 'finished') return router.replace({ name: 'MultiplayerResults', params: { arenaId } });
      if (arena.status === 'waiting') return router.replace({ name: 'MultiplayerArena', params: { arenaId } });
    }
    await store.hydrateFromRest(arenaId).catch(() => {});
    await store.connect(arenaId);
    store.requestState();

    // wait until first arena_state has been processed
    const waitStart = Date.now();
    while (!store.gameHydrated && Date.now() - waitStart < 3000) {
      await new Promise((r) => setTimeout(r, 50));
    }

    currentIndex.value = myPromptIndex.value;
    startCountdown();
  } catch (err) {
    console.error('Failed to load game:', err);
    router.replace({ name: 'MultiplayerLobby' });
  }
});

watch(myPromptIndex, (idx) => {
  if (phase.value === 'playing' || phase.value === 'loading' || phase.value === 'countdown') {
    if (idx !== currentIndex.value) {
      currentIndex.value = idx;
      submitted.value = false;
      answer.value = '';
      feedback.value = null;
      roundResults.value = [];
      // optionally re-deal card only when actively playing
      if (phase.value === 'playing') dealCard();
    }
  }
});

onBeforeUnmount(() => {
  unsubscribe();
  timers.forEach(clearTimeout);
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped>
.game-bg { min-height: 100vh; background: linear-gradient(160deg, #eef2ff 0%, #faf5ff 50%, #fdf2f8 100%); }

/* scoreboard */
.score-chip { border: 2px solid; transition: transform .2s; }
.score-chip.me { box-shadow: 0 0 0 3px rgba(99, 102, 241, .25); }
.rank-move, .rank-enter-active, .rank-leave-active { transition: all .5s ease; }
.rank-enter-from, .rank-leave-to { opacity: 0; transform: translateY(20px); }

/* card */
.card-viewport { width: min(460px, 92vw); height: 360px; perspective: 1200px; position: relative; }
.card-box { width: 100%; height: 100%; }
.flipper { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.175, .885, .32, 1.2); }
.flipper.revealed { transform: rotateY(180deg); }
.card-hull { position: absolute; inset: 0; backface-visibility: hidden; }
.card-front { transform: rotateY(180deg); background: #fff; border: 1px solid #e2e8f0; }
.card-back { background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #ec4899) !important; border: 6px solid #fff; }
.card-title { font-size: clamp(2rem, 7vw, 3rem); line-height: 1.1; }
.float-icon { animation: float 2s infinite ease-in-out; }
@keyframes float { 50% { transform: scale(1.08) rotate(4deg); } }

.deal-card-enter-from { opacity: 0; transform: translate3d(160px, -280px, -300px) scale(.4) rotate(25deg); }
.deal-card-enter-active { transition: all .45s cubic-bezier(.25, 1, .5, 1); }
.deal-card-enter-to { opacity: 1; transform: none; }

.feedback { animation: pop .35s ease; }
@keyframes pop { from { transform: scale(.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* countdown */
.count-number { font-size: 14rem; line-height: 1; font-weight: 900; color: #fff; text-shadow: 0 0 60px #818cf8; }
.count-number.go { color: #4ade80; text-shadow: 0 0 60px #22c55e; }
.count-enter-active { transition: all .35s cubic-bezier(.2, 1.4, .4, 1); }
.count-leave-active { transition: all .2s ease-in; }
.count-enter-from { opacity: 0; transform: scale(2.2); }
.count-leave-to { opacity: 0; transform: scale(.4); }
@media (max-width: 600px) { .count-number { font-size: 9rem; } }
</style>