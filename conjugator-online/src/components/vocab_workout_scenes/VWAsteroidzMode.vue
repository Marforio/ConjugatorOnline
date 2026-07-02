<template>
  <v-card class="pa-6 mx-auto my-4 text-slate-100 bg-slate-900 rounded-xl" max-width="1000" elevation="6">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <div class="text-h5 font-weight-bold tracking-tight text-primary d-flex align-center ga-2">
          <v-icon icon="mdi-rocket-launch" color="primary" /> Asteroidz Mode
        </div>
        <div class="text-caption text-slate-400">
          Target Vector: <span class="text-secondary font-weight-bold">{{ currentVectorLabel }}</span>
        </div>
      </div>
      
      <div class="d-flex ga-6 text-right align-center">
        <div>
          <div class="text-overline text-slate-400 line-height-1 mb-1">Lives</div>
          <div class="d-flex ga-1 justify-end">
            <v-icon 
              v-for="n in 3" 
              :key="n" 
              :icon="n <= lives ? 'mdi-heart' : 'mdi-heart-broken'" 
              :color="n <= lives ? 'error' : 'slate-600'" 
              size="small"
            />
          </div>
        </div>
        <div>
          <div class="text-overline text-slate-400 line-height-1">Remaining</div>
          <div class="text-h6 font-weight-bold text-amber-400 line-height-1">{{ itemsRemaining }}</div>
        </div>
        <div>
          <div class="text-overline text-slate-400 line-height-1">Score</div>
          <div class="text-h6 font-weight-bold text-emerald-400 line-height-1">{{ score }}</div>
        </div>
        <div>
          <div class="text-overline text-slate-400 line-height-1">Difficulty</div>
          <div class="text-h6 font-weight-bold text-blue-400 line-height-1">{{ difficultyLevel }}</div>
        </div>
      </div>
    </div>

    <div ref="stageContainer" class="game-stage-wrapper position-relative rounded-lg overflow-hidden bg-slate-950 mb-4 border border-slate-800">
      <canvas ref="gameCanvas" class="d-block w-100 h-100"></canvas>
      
      <!-- 🌟 Wrong Answer Feedback Toast -->
      <v-snackbar
        v-model="showWrongAnswerFeedback"
        color="error"
        location="top"
        timeout="1200"
        class="font-weight-bold"
      >
        <v-icon icon="mdi-close-circle" class="mr-2" />
        Wrong answer! Try again.
      </v-snackbar>
      
      <div v-if="gameState !== 'playing'" class="position-absolute inset-0 d-flex flex-column align-center justify-center bg-slate-950-b70 backdrop-blur-sm px-4 text-center">
        <template v-if="gameState === 'idle'">
          <div class="text-h4 font-weight-bold mb-2">Defend Your Vocabulary!</div>
          <p class="text-body-2 text-slate-400 max-width-500 mb-6">
            All {{ totalItems }} randomized terms will rain down as asteroids. Type their correct translation target form and press <strong>Enter</strong> to blast them away!
          </p>
          <v-btn color="primary" size="large" prepend-icon="mdi-play" class="rounded-lg font-weight-bold" @click="startGame">
            Launch Mission
          </v-btn>
        </template>

        <template v-else-if="gameState === 'gameover'">
          <v-dialog v-model="showGameOverDialog" max-width="500" persistent>
            <v-card class="bg-slate-800 rounded-xl">
              <v-card-title class="text-center pt-6">
                <v-icon icon="mdi-alert-octagon" size="64" color="error" class="d-block mb-3" />
                <div class="text-h4 font-weight-bold text-error">Mission Failed</div>
              </v-card-title>
              <v-card-text class="text-center py-4">
                <div class="text-subtitle-1 text-slate-300 mb-2">Great Sorrow! Much Sadness!</div>
                <div class="text-h6 text-emerald-400 mb-2">Final Score: {{ score }}</div>
                <div class="text-body-2 text-slate-400 mb-4">
                  Destroyed {{ destroyedAsteroids }} / {{ totalItems }} asteroids ({{ accuracy }}%)
                </div>
              </v-card-text>
              <v-card-actions class="justify-center pb-6 gap-3">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-restart" class="rounded-lg font-weight-bold" @click="startGame">
                  Try Again
                </v-btn>
                <v-btn color="slate-600" variant="outlined" prepend-icon="mdi-arrow-left" class="rounded-lg font-weight-bold" @click="goBackToSettings">
                  Back to Settings
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-else-if="gameState === 'victory'">
          <v-dialog v-model="showVictoryDialog" max-width="500" persistent>
            <v-card class="bg-slate-800 rounded-xl">
              <v-card-title class="text-center pt-6">
                <v-icon icon="mdi-trophy" size="64" color="amber" class="d-block mb-3" />
                <div class="text-h4 font-weight-bold text-amber-400">Victory Achieved!</div>
              </v-card-title>
              <v-card-text class="text-center py-4">
                <div class="text-subtitle-1 text-slate-300 mb-2">You completely defended all {{ totalItems }} words!</div>
                <div class="text-h6 text-emerald-400 mb-2">Final Score: {{ score }}</div>
                <div class="text-body-2 text-slate-400 mb-4">
                  Perfect accuracy: {{ accuracy }}%
                </div>
              </v-card-text>
              <v-card-actions class="justify-center pb-6 gap-3">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-restart" class="rounded-lg font-weight-bold" @click="startGame">
                  Play Again
                </v-btn>
                <v-btn color="slate-600" variant="outlined" prepend-icon="mdi-arrow-left" class="rounded-lg font-weight-bold" @click="goBackToSettings">
                  Back to Settings
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </div>
    </div>

    <v-row dense align="center">
      <v-col cols="12">
        <v-text-field
          ref="inputField"
          v-model="userInput"
          :disabled="gameState !== 'playing'"
          placeholder="Type corresponding translation target here..."
          variant="solo-filled"
          flat
          bg-color="slate-800"
          density="comfortable"
          hide-details
          class="font-weight-medium rounded-lg"
          @keydown.enter="fireLaser"
          autocomplete="off"
        >
          <template #append-inner>
            <kbd class="px-2 py-1 text-caption bg-slate-700 rounded text-slate-300 font-weight-bold elevation-1">ENTER</kbd>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, nextTick, watch } from "vue";
import { getFrontText, getAcceptedAnswers } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";

interface AsteroidItem {
  id: string;
  promptText: string;
  validAnswers: string[];
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  radiusPoints: number[];
  rotation: number;
}

interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface CrashEffect {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  ringRadius: number;
}

const props = defineProps<{
  rawVocabItems: any[];
  gameSettings: any;
}>();

const emit = defineEmits<{
  (e: "goBack"): void;
  (e: "recordScore", payload: any): void;
}>();

// Engine Component Hooks
const gameCanvas = ref<HTMLCanvasElement | null>(null);
const stageContainer = ref<HTMLDivElement | null>(null);
const inputField = ref<any>(null);

const gameState = ref<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
const userInput = ref("");
const score = ref(0);
const lives = ref(3);
const correctAnswersInRound = ref(0);
const destroyedAsteroids = ref(0);
const showGameOverDialog = ref(false);
const showVictoryDialog = ref(false);
const showWrongAnswerFeedback = ref(false); // 🌟 Wrong answer toast
const totalItems = ref(30); // Default, will be set on start

// Game Play Loops Properties
let itemPool: any[] = [];
let activeAsteroids: AsteroidItem[] = [];
let particles: ExplosionParticle[] = [];
let crashEffects: CrashEffect[] = [];
let animationFrameId: number | null = null;
let lastSpawnTime = 0;
let spawnInterval = 2800; // 🌟 Faster spawning (was 3400)
let baseAsteroidSpeed = 0.5; // 🌟 Faster base speed (was 0.25)
let audioContext: AudioContext | null = null;
let musicOscillators: OscillatorNode[] = [];
let currentMusicTrack = 0;

const itemsRemaining = computed(() => {
  return totalItems.value - destroyedAsteroids.value;
});

const difficultyLevel = computed(() => {
  const level = Math.floor(correctAnswersInRound.value / 5) + 1;
  return `Lvl ${level}`;
});

const accuracy = computed(() => {
  if (totalItems.value === 0) return 0;
  return Math.round((destroyedAsteroids.value / totalItems.value) * 100);
});

const currentVectorLabel = computed(() => {
  const from = String(props.gameSettings?.frontField || "definition").replace(/_/g, " ");
  const to = String(props.gameSettings?.backField || "term").replace(/_/g, " ");
  return `${from.charAt(0).toUpperCase() + from.slice(1)} ➔ ${to.charAt(0).toUpperCase() + to.slice(1)}`;
});

// 🌟 Watch for difficulty level changes to switch music
watch(difficultyLevel, () => {
  if (gameState.value === 'playing') {
    stopBackgroundMusic();
    playBackgroundMusic();
  }
});

/* =====================================================
   🎵 MULTIPLE RETRO MUSIC TRACKS
===================================================== */
const musicTracks = [
  {
    name: "Classic 8-bit",
    pattern: [
      { freq: 110, duration: 0.3 },
      { freq: 110, duration: 0.3 },
      { freq: 147, duration: 0.3 },
      { freq: 147, duration: 0.3 },
      { freq: 110, duration: 0.3 },
      { freq: 110, duration: 0.3 },
      { freq: 147, duration: 0.3 },
      { freq: 185, duration: 0.3 },
    ],
  },
  {
    name: "Space Invaders",
    pattern: [
      { freq: 262, duration: 0.2 },
      { freq: 262, duration: 0.2 },
      { freq: 196, duration: 0.2 },
      { freq: 196, duration: 0.2 },
      { freq: 220, duration: 0.2 },
      { freq: 220, duration: 0.2 },
      { freq: 175, duration: 0.2 },
      { freq: 175, duration: 0.2 },
      { freq: 262, duration: 0.2 },
      { freq: 262, duration: 0.2 },
      { freq: 196, duration: 0.2 },
      { freq: 196, duration: 0.2 },
    ],
  },
  {
    name: "Galaga",
    pattern: [
      { freq: 330, duration: 0.15 },
      { freq: 330, duration: 0.15 },
      { freq: 330, duration: 0.15 },
      { freq: 165, duration: 0.3 },
      { freq: 330, duration: 0.15 },
      { freq: 330, duration: 0.15 },
      { freq: 330, duration: 0.15 },
      { freq: 165, duration: 0.3 },
      { freq: 350, duration: 0.15 },
      { freq: 350, duration: 0.15 },
      { freq: 350, duration: 0.15 },
      { freq: 175, duration: 0.3 },
    ],
  },
  {
    name: "Pac-Man",
    pattern: [
      { freq: 440, duration: 0.1 },
      { freq: 440, duration: 0.1 },
      { freq: 349, duration: 0.1 },
      { freq: 349, duration: 0.1 },
      { freq: 297, duration: 0.1 },
      { freq: 297, duration: 0.1 },
      { freq: 440, duration: 0.1 },
      { freq: 440, duration: 0.1 },
      { freq: 349, duration: 0.1 },
      { freq: 349, duration: 0.1 },
      { freq: 297, duration: 0.1 },
      { freq: 297, duration: 0.1 },
    ],
  },
];

function selectMusicTrackForDifficulty(): number {
  const level = Math.floor(correctAnswersInRound.value / 5);
  return level % musicTracks.length;
}

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
}

function stopBackgroundMusic() {
  musicOscillators.forEach((osc) => {
    try {
      osc.stop();
    } catch (e) {}
  });
  musicOscillators = [];
}

function playBackgroundMusic() {
  if (!audioContext || audioContext.state === "closed") return;

  stopBackgroundMusic();

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.1, now);

  const trackIndex = selectMusicTrackForDifficulty();
  const track = musicTracks[trackIndex];
  const pattern = track.pattern;

  let startTime = now;
  pattern.forEach(({ freq, duration }) => {
    const osc = audioContext!.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, startTime);
    osc.connect(gain);
    osc.start(startTime);
    osc.stop(startTime + duration);
    musicOscillators.push(osc);

    startTime += duration;
  });

  const totalDuration = pattern.reduce((sum, note) => sum + note.duration, 0) * 1000;
  if (gameState.value === "playing") {
    setTimeout(() => playBackgroundMusic(), totalDuration);
  }
}

function playSoundEffect(type: "hit" | "crash" | "gameover" | "lifeup" | "wrong") {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.15, now);

  const osc = audioContext.createOscillator();
  osc.connect(gain);

  if (type === "hit") {
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  } else if (type === "crash") {
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  } else if (type === "gameover") {
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  } else if (type === "lifeup") {
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  } else if (type === "wrong") {
    // 🌟 Wrong answer buzz
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  }
}

/* =====================================================
   GAME ENGINE ACTIONS / CORE FLOWS
===================================================== */
function startGame() {
  gameState.value = "playing";
  score.value = 0;
  lives.value = 3;
  correctAnswersInRound.value = 0;
  destroyedAsteroids.value = 0;
  userInput.value = "";
  activeAsteroids = [];
  particles = [];
  crashEffects = [];
  baseAsteroidSpeed = 0.35;
  showGameOverDialog.value = false;
  showVictoryDialog.value = false;

  const shuffled = [...props.rawVocabItems].sort(() => 0.5 - Math.random());
  totalItems.value = shuffled.length; // 🌟 Use actual vocab list length
  itemPool = shuffled;
  lastSpawnTime = Date.now();

  initAudio();
  playBackgroundMusic();

  nextTick(() => {
    initCanvasSize();
    if (inputField.value?.$el?.querySelector?.("input")) {
      inputField.value.$el.querySelector("input").focus();
    }
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
  });
}

function initCanvasSize() {
  if (!gameCanvas.value || !stageContainer.value) return;
  gameCanvas.value.width = stageContainer.value.clientWidth;
  gameCanvas.value.height = 500;
}

function goBackToSettings() {
  stopBackgroundMusic();
  emit("goBack");
}

/* =====================================================
   COLLISION DETECTION: Prevent asteroid overlap
===================================================== */
function isAsteroidCollidingWithOthers(
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  const padding = 60;
  for (const asteroid of activeAsteroids) {
    const dx = asteroid.x + asteroid.width / 2 - (x + width / 2);
    const dy = asteroid.y + asteroid.height / 2 - (y + height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = Math.max(asteroid.width, asteroid.height) + width + padding;

    if (distance < minDistance) {
      return true;
    }
  }
  return false;
}

/* =====================================================
   DYNAMIC SPAWNER WITH PRECISE ADAPTER DIRECTION
===================================================== */
function spawnAsteroid() {
  if (itemPool.length === 0 || !gameCanvas.value) return;

  const item = itemPool.pop();
  const frontField = props.gameSettings?.frontField || "definition";
  const backField = props.gameSettings?.backField || "term";

  let promptText = "";
  let validAnswers: string[] = [];

  const isCustom = !!item.additional_data;

  if (isCustom) {
    promptText =
      frontField === "term"
        ? item.term
        : item.additional_data?.[frontField] || item[frontField] || "—";

    if (backField === "term") {
      validAnswers = [item.term];
    } else {
      const val = item.additional_data?.[backField] || item[backField];
      validAnswers = Array.isArray(val) ? val.map(String) : val ? [String(val)] : [];
    }
  } else {
    promptText = getFrontText(item, frontField);
    validAnswers = getAcceptedAnswers(item, backField as any);
  }

  if (!promptText || promptText === "—") promptText = item.term || "—";
  if (!validAnswers.length && item.term) validAnswers = [item.term];

  const canvasWidth = gameCanvas.value.width;
  const rockWidth = 200;
  const rockHeight = 100;

  let x, y, attempts = 0;

  do {
    x = Math.max(20, Math.random() * (canvasWidth - rockWidth - 20));
    y = -rockHeight - 40;
    attempts++;
  } while (isAsteroidCollidingWithOthers(x, y, rockWidth, rockHeight) && attempts < 5);

  if (attempts >= 5) return;

  const speedMultiplier = 1 + (correctAnswersInRound.value / 5) * 0.15;
  const speed = baseAsteroidSpeed * speedMultiplier;

  const pointsCount = 8;
  const radiusPoints: number[] = [];
  for (let i = 0; i < pointsCount; i++) {
    radiusPoints.push(50 + Math.random() * 20);
  }

  activeAsteroids.push({
    id: item.id || String(Math.random()),
    promptText,
    validAnswers,
    x,
    y,
    speed,
    width: rockWidth,
    height: rockHeight,
    radiusPoints,
    rotation: Math.random() * Math.PI * 2,
  });
}

/* =====================================================
   PARTICLE EXPLOSION SPARK EFFECTS TRIGGER
===================================================== */
function createExplosion(x: number, y: number) {
  const particleCount = 25;
  const colors = ["#ff7a00", "#ffb400", "#38bdf8", "#f1f5f9"];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.5 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.02 + Math.random() * 0.02,
    });
  }
}

/* =====================================================
   CRASH EFFECT: When asteroid reaches bottom
===================================================== */
function createCrashEffect(x: number, y: number) {
  crashEffects.push({
    x,
    y,
    age: 0,
    maxAge: 400,
    ringRadius: 10,
  });
}

/* =====================================================
   INTERACTION SHOOT BLOCKS (LASER EVALUATIONS)
===================================================== */
function fireLaser() {
  const typed = userInput.value.trim().toLowerCase();
  if (!typed || gameState.value !== "playing") return;

  let hitIndex = -1;

  for (let i = 0; i < activeAsteroids.length; i++) {
    const asteroid = activeAsteroids[i];
    const isMatch = asteroid.validAnswers.some(
      (ans) => ans.trim().toLowerCase() === typed
    );

    if (isMatch) {
      hitIndex = i;
      break;
    }
  }

  if (hitIndex !== -1) {
    const targetRock = activeAsteroids[hitIndex];

    createExplosion(
      targetRock.x + targetRock.width / 2,
      targetRock.y + targetRock.height / 2
    );
    playSoundEffect("hit");

    activeAsteroids.splice(hitIndex, 1);
    score.value += 100;
    correctAnswersInRound.value += 1;
    destroyedAsteroids.value += 1;
    userInput.value = "";

    // 🌟 Grant life every 500 points (5 correct answers)
    if (score.value > 0 && score.value % 500 === 0 && lives.value < 3) {
      lives.value += 1;
      playSoundEffect("lifeup");
    }

    // 🌟 Refocus input field after answer
    nextTick(() => {
      const input = inputField.value?.$el?.querySelector?.("input");
      if (input) input.focus();
    });

    checkVictoryCondition();
  } else {
    // 🌟 Wrong answer feedback
    playSoundEffect("wrong");
    showWrongAnswerFeedback.value = true;
  }
}

function checkVictoryCondition() {
  // 🌟 Victory only when ALL items are destroyed AND no asteroids remain
  if (itemPool.length === 0 && activeAsteroids.length === 0 && lives.value > 0) {
    gameState.value = "victory";
    showVictoryDialog.value = true;
    
    // 🌟 Emit score for leaderboard
    emit("recordScore", {
      score: score.value,
      accuracy: accuracy.value,
      totalItems: totalItems.value,
      destroyedAsteroids: destroyedAsteroids.value,
      difficulty: difficultyLevel.value,
      gameSettings: props.gameSettings,
    });

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }
}

/* =====================================================
   TEXT WRAPPING FOR ASTEROIDS
===================================================== */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/* =====================================================
   MAIN ENGINE CANVAS ANIMATION loops TICKER
===================================================== */
function gameLoop() {
  if (gameState.value !== "playing") return;

  const canvas = gameCanvas.value;
  if (!canvas) {
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const now = Date.now();
  if (now - lastSpawnTime > spawnInterval && itemPool.length > 0) {
    spawnAsteroid();
    lastSpawnTime = now;
  }

  // 🌟 RENDER CRASH EFFECTS (expanding rings)
  for (let i = crashEffects.length - 1; i >= 0; i--) {
    const effect = crashEffects[i];
    effect.age += 16;

    if (effect.age > effect.maxAge) {
      crashEffects.splice(i, 1);
      continue;
    }

    const progress = effect.age / effect.maxAge;
    const radius = 20 + progress * 120;
    const alpha = 1 - progress;

    ctx.save();
    ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.6})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 🌟 ANIMATE AND DRAW CRASH EXPLOSION SHARDS
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  // ANIMATE AND DRAW FALLING VOCAB ROCKS
  for (let i = activeAsteroids.length - 1; i >= 0; i--) {
    const rock = activeAsteroids[i];
    rock.y += rock.speed;
    rock.rotation += 0.008;

    // 🌟 LIVES & COLLISION CONDITION
    if (rock.y > canvas.height - 15) {
      createCrashEffect(rock.x + rock.width / 2, canvas.height - 10);
      playSoundEffect("crash");

      activeAsteroids.splice(i, 1);
      lives.value -= 1;

      if (lives.value <= 0) {
        gameState.value = "gameover";
        showGameOverDialog.value = true;
        playSoundEffect("gameover");
        
        // 🌟 Emit score even on loss
        emit("recordScore", {
          score: score.value,
          accuracy: accuracy.value,
          totalItems: totalItems.value,
          destroyedAsteroids: destroyedAsteroids.value,
          difficulty: difficultyLevel.value,
          gameSettings: props.gameSettings,
          won: false,
        });

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        return;
      }

      checkVictoryCondition();
      continue;
    }

    // Render rock geometry
    ctx.save();
    ctx.translate(rock.x + rock.width / 2, rock.y + rock.height / 2);
    ctx.rotate(rock.rotation);

    ctx.beginPath();
    const numPoints = rock.radiusPoints.length;
    for (let p = 0; p < numPoints; p++) {
      const angle = (p / numPoints) * Math.PI * 2;
      const r = rock.radiusPoints[p];
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = "#334155";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // 🌟 Render inner text prompt labels with wrapping
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxTextWidth = rock.width - 20;
    const lineHeight = 18;
    const lines = wrapText(ctx, rock.promptText, maxTextWidth, lineHeight);

    // 🌟 Truncate after many lines if still too long
    const maxLines = 3;
    const displayLines = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
      displayLines[displayLines.length - 1] += "...";
    }

    const totalHeight = displayLines.length * lineHeight;
    const startY = -totalHeight / 2 + lineHeight / 2;

    displayLines.forEach((line, idx) => {
      ctx.fillText(line, 0, startY + idx * lineHeight);
    });

    ctx.restore();
  }

  // Draw Warning Shield Impact Base Grid Threshold bounds
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 4);
  ctx.lineTo(canvas.width, canvas.height - 4);
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.stroke();

  if (gameState.value === "playing") {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

onMounted(() => {
  startGame();
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  stopBackgroundMusic();
  if (audioContext) {
    audioContext.close().catch(() => {});
  }
});
</script>

<style scoped>
.game-stage-wrapper {
  height: 500px;
  background-image: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
}
.bg-slate-950-b70 {
  background-color: rgba(2, 6, 23, 0.75);
}
.max-width-500 {
  max-width: 500px;
}
.line-height-1 {
  line-height: 1;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>