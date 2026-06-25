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
          <div class="text-overline text-slate-400 line-height-1 mb-1">Shields / Lives</div>
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
          <div class="text-h6 font-weight-bold text-amber-400 line-height-1">{{ itemsRemaining }} / 30</div>
        </div>
        <div>
          <div class="text-overline text-slate-400 line-height-1">Score</div>
          <div class="text-h6 font-weight-bold text-emerald-400 line-height-1">{{ score }}</div>
        </div>
      </div>
    </div>

    <div ref="stageContainer" class="game-stage-wrapper position-relative rounded-lg overflow-hidden bg-slate-950 mb-4 border border-slate-800">
      <canvas ref="gameCanvas" class="d-block w-100 h-100"></canvas>
      
      <div v-if="gameState !== 'playing'" class="position-absolute inset-0 d-flex flex-column align-center justify-center bg-slate-950-b70 backdrop-blur-sm px-4 text-center">
        <template v-if="gameState === 'idle'">
          <div class="text-h4 font-weight-bold mb-2">Defend Your Vocabulary!</div>
          <p class="text-body-2 text-slate-400 max-width-500 mb-6">
            30 randomized terms will rain down as asteroids. Type their correct translation target form and press <strong>Enter</strong> to blast them away!
          </p>
          <v-btn color="primary" size="large" prepend-icon="mdi-play" class="rounded-lg font-weight-bold" @click="startGame">
            Launch Mission
          </v-btn>
        </template>

        <template v-else-if="gameState === 'gameover'">
          <v-icon icon="mdi-alert-octagon" size="64" color="error" class="mb-3 animate-pulse" />
          <div class="text-h4 font-weight-bold text-error mb-1">Mission Failed</div>
          <div class="text-subtitle-1 text-slate-300 mb-4">Shields collapsed! Final Score: {{ score }}</div>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-restart" class="rounded-lg font-weight-bold" @click="startGame">
            Try Again
          </v-btn>
        </template>

        <template v-else-if="gameState === 'victory'">
          <v-icon icon="mdi-trophy" size="64" color="amber" class="mb-3" />
          <div class="text-h4 font-weight-bold text-amber-400 mb-1">Victory Achieved!</div>
          <div class="text-subtitle-1 text-slate-300 mb-4">You completely defended all 30 words. Final Score: {{ score }}</div>
          <v-btn color="primary" prepend-icon="mdi-restart" class="rounded-lg font-weight-bold" @click="startGame">
            Play Again
          </v-btn>
        </template>
      </div>
    </div>

    <v-row dense align="center">
      <v-col cols="12">
        <v-text-field
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
          ref="inputField"
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
import { ref, computed, onBeforeUnmount, onMounted, nextTick } from "vue";
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

const props = defineProps<{
  rawVocabItems: any[];
  gameSettings: any;
}>();

const emit = defineEmits<{
  (e: "goBack"): void;
}>();

// Engine Component Hooks
const gameCanvas = ref<HTMLCanvasElement | null>(null);
const stageContainer = ref<HTMLDivElement | null>(null);
const inputField = ref<any>(null);

const gameState = ref<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
const userInput = ref("");
const score = ref(0);
const lives = ref(3); // 🌟 Player Health Metric Tracker

// Game Play Loops Properties
let itemPool: any[] = [];
let activeAsteroids: AsteroidItem[] = [];
let particles: ExplosionParticle[] = []; // 🌟 Shard tracking grid array
let animationFrameId: number | null = null;
let lastSpawnTime = 0;
const spawnInterval = 3400; // Giving slightly more pacing breathing room

const itemsRemaining = computed(() => {
  return itemPool.length + activeAsteroids.length;
});

const currentVectorLabel = computed(() => {
  const from = String(props.gameSettings?.frontField || "definition").replace(/_/g, " ");
  const to = String(props.gameSettings?.backField || "term").replace(/_/g, " ");
  return `${from.charAt(0).toUpperCase() + from.slice(1)} ➔ ${to.charAt(0).toUpperCase() + to.slice(1)}`;
});

/* =====================================================
   GAME ENGINE ACTIONS / CORE FLOWS
===================================================== */
function startGame() {
  gameState.value = 'playing';
  score.value = 0;
  lives.value = 3;
  userInput.value = "";
  activeAsteroids = [];
  particles = [];
  
  const shuffled = [...props.rawVocabItems].sort(() => 0.5 - Math.random());
  itemPool = shuffled.slice(0, 30);
  lastSpawnTime = Date.now();

  nextTick(() => {
    initCanvasSize();
    if (inputField.value) inputField.value.focus();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
  });
}

function initCanvasSize() {
  if (!gameCanvas.value || !stageContainer.value) return;
  gameCanvas.value.width = stageContainer.value.clientWidth;
  gameCanvas.value.height = 420;
}

/* =====================================================
   DYNAMIC SPAWNER WITH PRECISE ADAPTER DIRECTION
===================================================== */
function spawnAsteroid() {
  if (itemPool.length === 0 || !gameCanvas.value) return;

  const item = itemPool.pop();
  const frontField = props.gameSettings?.frontField || "definition";
  const backField = props.gameSettings?.backField || "term";

  // 🌟 FIX: Fetch fields dynamically via engine helpers matching settings configuration rules
  let promptText = "";
  let validAnswers: string[] = [];

  // Safe checks distinguishing custom dynamic backend records from hardcoded elements
  const isCustom = !!item.additional_data;

  if (isCustom) {
    // Custom backend parsing paths
    promptText = frontField === "term" ? item.term : (item.additional_data?.[frontField] || item[frontField] || "—");
    
    if (backField === "term") {
      validAnswers = [item.term];
    } else {
      const val = item.additional_data?.[backField] || item[backField];
      validAnswers = Array.isArray(val) ? val.map(String) : val ? [String(val)] : [];
    }
  } else {
    // Hardcoded registry formatting blueprints
    promptText = getFrontText(item, frontField);
    validAnswers = getAcceptedAnswers(item, backField as any);
  }

  // Final emergency falls to clean string references
  if (!promptText || promptText === "—") promptText = item.term || "—";
  if (!validAnswers.length && item.term) validAnswers = [item.term];

  const canvasWidth = gameCanvas.value.width;
  const rockWidth = 150;
  
  const x = Math.max(20, Math.random() * (canvasWidth - rockWidth - 20));
  const y = -40;
  
  // 🌟 VELOCITY ADJUSTMENT: Slower, uniform physics metrics (0.25 - 0.55 acceleration scales)
  const speed = 0.25 + Math.random() * 0.3; 

  const pointsCount = 8;
  const radiusPoints: number[] = [];
  for (let i = 0; i < pointsCount; i++) {
    radiusPoints.push(35 + Math.random() * 15);
  }

  activeAsteroids.push({
    id: item.id || String(Math.random()),
    promptText,
    validAnswers,
    x,
    y,
    speed,
    width: rockWidth,
    height: 55,
    radiusPoints
  });
}

/* =====================================================
   PARTICLE EXPLOSION SPARK EFFECTS TRIGGER
===================================================== */
function createExplosion(x: number, y: number) {
  const particleCount = 20;
  // Mix fiery orange sparks with primary dashboard tracking colors
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
      decay: 0.02 + Math.random() * 0.02
    });
  }
}

/* =====================================================
   INTERACTION SHOOT BLOCKS (LASER EVALUATIONS)
===================================================== */
function fireLaser() {
  const typed = userInput.value.trim().toLowerCase();
  if (!typed || gameState.value !== 'playing') return;

  let hitIndex = -1;

  for (let i = 0; i < activeAsteroids.length; i++) {
    const asteroid = activeAsteroids[i];
    const isMatch = asteroid.validAnswers.some(ans => ans.trim().toLowerCase() === typed);

    if (isMatch) {
      hitIndex = i;
      break;
    }
  }

  if (hitIndex !== -1) {
    const targetRock = activeAsteroids[hitIndex];
    
    // 🌟 Trigger visual shard explosions right at the center coordinates of the rock
    createExplosion(targetRock.x + targetRock.width / 2, targetRock.y + targetRock.height / 2);

    activeAsteroids.splice(hitIndex, 1);
    score.value += 100;
    userInput.value = ""; 

    checkVictoryCondition();
  }
}

function checkVictoryCondition() {
  if (itemPool.length === 0 && activeAsteroids.length === 0 && lives.value > 0) {
    gameState.value = 'victory';
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }
}

/* =====================================================
   MAIN ENGINE CANVAS ANIMATION loops TICKER
===================================================== */
function gameLoop() {
  if (gameState.value !== 'playing') return;

  const canvas = gameCanvas.value;
  if (!canvas) {
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const now = Date.now();
  if (now - lastSpawnTime > spawnInterval && itemPool.length > 0) {
    spawnAsteroid();
    lastSpawnTime = now;
  }

  // 🌟 ANIMATE AND DRAW CRASH EXPLOSION SHARDS
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
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

    // 🌟 LIVES & COLLISION CONDITION: Drop life points when asteroid impacts bottom line bounds
    if (rock.y > canvas.height - 15) {
      activeAsteroids.splice(i, 1);
      lives.value -= 1; // Take a life away

      if (lives.value <= 0) {
        gameState.value = 'gameover'; // Terminal shield collapse failure trigger
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        return;
      }
      
      checkVictoryCondition();
      continue;
    }

    // Render rock geometry
    ctx.save();
    ctx.translate(rock.x + rock.width / 2, rock.y + rock.height / 2);
    
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
    
    ctx.fillStyle = '#334155'; // slate-700
    ctx.strokeStyle = '#64748b'; // slate-500
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // Render inner text prompt labels
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let txt = rock.promptText;
    if (txt.length > 18) txt = txt.substring(0, 15) + "...";
    ctx.fillText(txt, 0, 0);

    ctx.restore();
  }

  // Draw Warning Shield Impact Base Grid Threshold bounds
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 4);
  ctx.lineTo(canvas.width, canvas.height - 4);
  ctx.strokeStyle = '#ef4444'; // Red-500 threat lines
  ctx.lineWidth = 3;
  ctx.stroke();

  if (gameState.value === 'playing') {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

onMounted(() => {
  startGame();
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.game-stage-wrapper {
  height: 420px;
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
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

</style>