<template>
  <v-card class="pa-6 mx-auto my-4 text-slate-100 bg-slate-900 rounded-xl" max-width="1000" elevation="6">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <div class="text-h5 font-weight-bold tracking-tight text-primary d-flex align-center ga-2">
          <v-icon icon="mdi-space-invaders" color="primary" /> Space Invaders Mode
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
          <div class="text-overline text-slate-400 line-height-1">Progress</div>
          <div class="text-h6 font-weight-bold text-amber-400 line-height-1">{{ itemsRemaining }} / {{ totalItems }}</div>
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
      
      <v-snackbar
        v-model="showWrongAnswerFeedback"
        color="error"
        location="top"
        timeout="1200"
        class="font-weight-bold"
      >
        <v-icon icon="mdi-close-circle" class="mr-2" />
        You shot the correct answer!
      </v-snackbar>

      <v-snackbar
        v-model="showRoundCompleteFeedback"
        color="success"
        location="top"
        timeout="800"
        class="font-weight-bold"
      >
        <v-icon icon="mdi-check-circle" class="mr-2" />
        All distractors destroyed! Next round incoming...
      </v-snackbar>

      <!-- 🌟 Instructions Dialog -->
      <v-dialog v-model="showInstructions" max-width="500" persistent>
        <v-card class="bg-slate-800 rounded-xl">
          <v-card-title class="text-center pt-6">
            <v-icon icon="mdi-book-open" size="48" color="primary" class="d-block mb-3" />
            <div class="text-h5 font-weight-bold text-slate-100">Mission Briefing</div>
          </v-card-title>
          <v-card-text class="text-center py-6 text-slate-300">
            <div class="text-body-2 mb-4">
              Four answer options will descend in formation, bouncing left and right like enemy invaders.
            </div>
            <div class="text-body-2 mb-4">
              <strong class="text-green-400">ONE is correct</strong> (shown in green).
            </div>
            <div class="text-body-2 mb-4">
              <strong class="text-red-400">THREE are distractors</strong> (shown in red).
            </div>
            <div class="text-body-2 mb-6">
              Use <strong class="text-blue-300">← → arrow keys</strong> to move your ship and press <strong class="text-yellow-300">SPACEBAR</strong> to shoot down the distractors.
            </div>
            <div class="text-body-2 text-error font-weight-bold">
              ⚠️ Don't shoot the correct answer!
            </div>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn color="primary" variant="flat" size="large" class="rounded-lg font-weight-bold" @click="startGameAfterInstructions">
              Understood! Launch Mission
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <div v-if="gameState !== 'playing'" class="position-absolute inset-0 d-flex flex-column align-center justify-center bg-slate-950-b70 backdrop-blur-sm px-4 text-center">
        <template v-if="gameState === 'idle'">
          <div class="text-h4 font-weight-bold mb-2">Defend Against Distractors!</div>
          <p class="text-body-2 text-slate-400 max-width-500 mb-6">
            Shoot down the wrong answer options while protecting the correct one!
          </p>
          <v-btn color="primary" size="large" prepend-icon="mdi-play" class="rounded-lg font-weight-bold" @click="showInstructions = true">
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
                <div class="text-subtitle-1 text-slate-300 mb-2">Shields collapsed!</div>
                <div class="text-h6 text-emerald-400 mb-2">Final Score: {{ score }}</div>
                <div class="text-body-2 text-slate-400 mb-4">
                  Completed {{ roundsWon }} / {{ totalItems }} questions
                </div>
              </v-card-text>
              <v-card-actions class="justify-center pb-6 gap-3">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-restart" class="rounded-lg font-weight-bold" @click="showInstructions = true">
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
                <div class="text-subtitle-1 text-slate-300 mb-2">You defended all {{ totalItems }} questions!</div>
                <div class="text-h6 text-emerald-400 mb-2">Final Score: {{ score }}</div>
                <div class="text-body-2 text-slate-400 mb-4">
                  Perfect accuracy: {{ accuracy }}%
                </div>
              </v-card-text>
              <v-card-actions class="justify-center pb-6 gap-3">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-restart" class="rounded-lg font-weight-bold" @click="showInstructions = true">
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
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, nextTick, watch } from "vue";
import { getAcceptedAnswers } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";

interface OptionChip {
  id: string;
  text: string;
  isCorrect: boolean;
  y: number;
  x: number;
  width: number;
  height: number;
  direction: number; // 1 for right, -1 for left
}

interface Bullet {
  x: number;
  y: number;
  active: boolean;
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
  planItems: any[];
  gameSettings: any;
}>();

const emit = defineEmits<{
  (e: "goBack"): void;
  (e: "recordScore", payload: any): void;
}>();

const gameCanvas = ref<HTMLCanvasElement | null>(null);
const stageContainer = ref<HTMLDivElement | null>(null);

const gameState = ref<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
const score = ref(0);
const lives = ref(3);
const roundsWon = ref(0);
const correctAnswersInRound = ref(0);
const showGameOverDialog = ref(false);
const showVictoryDialog = ref(false);
const showWrongAnswerFeedback = ref(false);
const showRoundCompleteFeedback = ref(false);
const showInstructions = ref(false);
const totalItems = ref(30);

let itemPool: any[] = [];
let currentRoundOptions: OptionChip[] = [];
let particles: ExplosionParticle[] = [];
let animationFrameId: number | null = null;
let baseChipSpeed = 0.5;
let audioContext: AudioContext | null = null;
let musicOscillators: OscillatorNode[] = [];

// Player ship
let playerX = 0;
let playerWidth = 50;
let playerHeight = 40;
let playerSpeed = 4;
let keysPressed: Record<string, boolean> = {};
let bullets: Bullet[] = [];

const itemsRemaining = computed(() => {
  return totalItems.value - roundsWon.value;
});

const difficultyLevel = computed(() => {
  const level = Math.floor(correctAnswersInRound.value / 5) + 1;
  return `Lvl ${level}`;
});

const accuracy = computed(() => {
  if (totalItems.value === 0) return 0;
  return Math.round((roundsWon.value / totalItems.value) * 100);
});

const currentVectorLabel = computed(() => {
  const from = String(props.gameSettings?.frontField || "definition").replace(/_/g, " ");
  const to = String(props.gameSettings?.backField || "term").replace(/_/g, " ");
  return `${from.charAt(0).toUpperCase() + from.slice(1)} ➔ ${to.charAt(0).toUpperCase() + to.slice(1)}`;
});

watch(difficultyLevel, () => {
  if (gameState.value === 'playing') {
    stopBackgroundMusic();
    playBackgroundMusic();
  }
});

/* =====================================================
   🎵 DIFFERENT RETRO MUSIC TRACKS (Not Asteroidz)
===================================================== */
const musicTracks = [
  {
    name: "Defender",
    pattern: [
      { freq: 220, duration: 0.25 },  // A3
      { freq: 246, duration: 0.25 },  // B3
      { freq: 220, duration: 0.25 },
      { freq: 246, duration: 0.25 },
      { freq: 220, duration: 0.25 },
      { freq: 246, duration: 0.25 },
      { freq: 196, duration: 0.25 },  // G3
      { freq: 220, duration: 0.25 },
    ],
  },
  {
    name: "Centipede",
    pattern: [
      { freq: 415, duration: 0.15 },  // G#4
      { freq: 370, duration: 0.15 },  // F#4
      { freq: 329, duration: 0.15 },  // E4
      { freq: 293, duration: 0.15 },  // D4
      { freq: 329, duration: 0.15 },
      { freq: 370, duration: 0.15 },
      { freq: 415, duration: 0.15 },
      { freq: 370, duration: 0.15 },
    ],
  },
  {
    name: "Asteroids Classic",
    pattern: [
      { freq: 523, duration: 0.1 },   // C5
      { freq: 523, duration: 0.1 },
      { freq: 440, duration: 0.1 },   // A4
      { freq: 440, duration: 0.1 },
      { freq: 392, duration: 0.1 },   // G4
      { freq: 392, duration: 0.1 },
      { freq: 349, duration: 0.1 },   // F4
      { freq: 349, duration: 0.1 },
      { freq: 329, duration: 0.1 },   // E4
      { freq: 329, duration: 0.1 },
      { freq: 293, duration: 0.1 },   // D4
      { freq: 293, duration: 0.1 },
    ],
  },
  {
    name: "Tempest",
    pattern: [
      { freq: 300, duration: 0.2 },
      { freq: 300, duration: 0.2 },
      { freq: 450, duration: 0.2 },
      { freq: 300, duration: 0.2 },
      { freq: 300, duration: 0.2 },
      { freq: 300, duration: 0.2 },
      { freq: 450, duration: 0.2 },
      { freq: 600, duration: 0.2 },
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

function playSoundEffect(type: "laser" | "hit" | "crash" | "gameover" | "lifeup" | "wrong" | "roundcomplete") {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.15, now);

  const osc = audioContext.createOscillator();
  osc.connect(gain);

  if (type === "laser") {
    // 🌟 Laser sound
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
  } else if (type === "hit") {
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  } else if (type === "wrong") {
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  } else if (type === "roundcomplete") {
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  } else if (type === "crash") {
    osc.frequency.setValueAtTime(150, now);
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
  }
}

function startGameAfterInstructions() {
  showInstructions.value = false;
  startGame();
}

function startGame() {
  gameState.value = "playing";
  score.value = 0;
  lives.value = 3;
  roundsWon.value = 0;
  correctAnswersInRound.value = 0;
  showGameOverDialog.value = false;
  showVictoryDialog.value = false;
  bullets = [];
  keysPressed = {};

  const shuffled = [...props.planItems].sort(() => 0.5 - Math.random());
  totalItems.value = shuffled.length;
  itemPool = [...shuffled];
  baseChipSpeed = 0.5;

  initAudio();
  playBackgroundMusic();

  nextTick(() => {
    initCanvasSize();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    spawnNewRound();
    animationFrameId = requestAnimationFrame(gameLoop);
  });
}

function initCanvasSize() {
  if (!gameCanvas.value || !stageContainer.value) return;
  gameCanvas.value.width = stageContainer.value.clientWidth;
  gameCanvas.value.height = 500;
  playerX = gameCanvas.value.width / 2 - playerWidth / 2;
}

function goBackToSettings() {
  stopBackgroundMusic();
  emit("goBack");
}

function spawnNewRound() {
  if (itemPool.length === 0) {
    gameState.value = "victory";
    showVictoryDialog.value = true;
    emit("recordScore", {
      score: score.value,
      accuracy: accuracy.value,
      totalItems: totalItems.value,
      roundsWon: roundsWon.value,
      difficulty: difficultyLevel.value,
      gameSettings: props.gameSettings,
      won: true,
    });
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    return;
  }

  const item = itemPool.shift();
  if (!item) return;

  const frontField = props.gameSettings?.frontField || "definition";
  const backField = props.gameSettings?.backField || "term";

  let correctAnswer = "";
  const isCustom = !!item.additional_data;

  if (isCustom) {
    correctAnswer =
      backField === "term"
        ? item.term
        : item.additional_data?.[backField] || item[backField] || "—";
  } else {
    const answers = getAcceptedAnswers(item, backField as any);
    correctAnswer = answers[0] || item.term;
  }

  // Generate 3 random wrong options + 1 correct
  const wrongOptions = props.planItems
    .filter((it: any) => it.id !== item.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((it: any) => {
      const isCustom2 = !!it.additional_data;
      if (isCustom2) {
        return it.additional_data?.[backField] || it[backField] || it.term;
      } else {
        const answers = getAcceptedAnswers(it, backField as any);
        return answers[0] || it.term;
      }
    });

  const allOptions = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random());

  // 🌟 Spawn in 4 vertical columns
  const canvasWidth = gameCanvas.value?.width || 800;
  const chipWidth = 120;
  const spacing = canvasWidth / 4;

  currentRoundOptions = allOptions.map((text, idx) => ({
    id: `option-${idx}`,
    text: String(text),
    isCorrect: text === correctAnswer,
    y: -80,
    x: spacing * idx + (spacing - chipWidth) / 2,
    width: chipWidth,
    height: 50,
    direction: idx % 2 === 0 ? 1 : -1, // Alternate left/right
  }));

  particles = [];
}

function createExplosion(x: number, y: number, color: string) {
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.5 + Math.random() * 2,
      color,
      alpha: 1,
      decay: 0.02 + Math.random() * 0.02,
    });
  }
}

function fireBullet() {
  if (gameState.value !== "playing") return;

  playSoundEffect("laser");
  bullets.push({
    x: playerX + playerWidth / 2 - 2,
    y: gameCanvas.value?.height! - playerHeight - 10,
    active: true,
  });
}

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

  // 🌟 Update player position
  if (keysPressed["ArrowLeft"]) {
    playerX = Math.max(0, playerX - playerSpeed);
  }
  if (keysPressed["ArrowRight"]) {
    playerX = Math.min(canvas.width - playerWidth, playerX + playerSpeed);
  }

  const speedMultiplier = 1 + (correctAnswersInRound.value / 5) * 0.1;
  const speed = baseChipSpeed * speedMultiplier;
  const bounceDistance = 60;

  // 🌟 Update and draw chips
  for (let i = currentRoundOptions.length - 1; i >= 0; i--) {
    const chip = currentRoundOptions[i];
    chip.y += speed;

    // 🌟 Bouncing left-right movement (Space Invaders style)
    chip.x += chip.direction * 0.8;
    if (chip.x <= 20 || chip.x >= canvas.width - chip.width - 20) {
      chip.direction *= -1;
    }

    // Check if chip passed bottom
    if (chip.y > canvas.height) {
      if (chip.isCorrect) {
        // Correct answer passed - lose a life
        lives.value -= 1;
        playSoundEffect("crash");

        if (lives.value <= 0) {
          gameState.value = "gameover";
          showGameOverDialog.value = true;
          playSoundEffect("gameover");
          emit("recordScore", {
            score: score.value,
            accuracy: accuracy.value,
            totalItems: totalItems.value,
            roundsWon: roundsWon.value,
            difficulty: difficultyLevel.value,
            gameSettings: props.gameSettings,
            won: false,
          });
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          return;
        }
      }

      currentRoundOptions.splice(i, 1);
      continue;
    }

    // Draw chip box
    ctx.fillStyle = chip.isCorrect ? "#10b981" : "#ef4444";
    ctx.fillRect(chip.x, chip.y, chip.width, chip.height);

    // Draw chip border
    ctx.strokeStyle = chip.isCorrect ? "#059669" : "#dc2626";
    ctx.lineWidth = 2;
    ctx.strokeRect(chip.x, chip.y, chip.width, chip.height);

    // Draw text
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let text = chip.text;
    if (text.length > 12) text = text.substring(0, 10) + "...";

    ctx.fillText(text, chip.x + chip.width / 2, chip.y + chip.height / 2);
  }

  // 🌟 Update and draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= 5;

    if (bullet.y < 0) {
      bullets.splice(i, 1);
      continue;
    }

    // Check collision with chips
    let hit = false;
    for (let j = currentRoundOptions.length - 1; j >= 0; j--) {
      const chip = currentRoundOptions[j];
      if (
        bullet.x >= chip.x &&
        bullet.x <= chip.x + chip.width &&
        bullet.y >= chip.y &&
        bullet.y <= chip.y + chip.height
      ) {
        hit = true;

        if (chip.isCorrect) {
          // Hit correct answer
          showWrongAnswerFeedback.value = true;
          playSoundEffect("wrong");
          lives.value -= 1;
          createExplosion(chip.x + chip.width / 2, chip.y + chip.height / 2, "#10b981");

          if (lives.value <= 0) {
            gameState.value = "gameover";
            showGameOverDialog.value = true;
            playSoundEffect("gameover");
            emit("recordScore", {
              score: score.value,
              accuracy: accuracy.value,
              totalItems: totalItems.value,
              roundsWon: roundsWon.value,
              difficulty: difficultyLevel.value,
              gameSettings: props.gameSettings,
              won: false,
            });
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            return;
          }
        } else {
          // Hit distractor
          playSoundEffect("hit");
          createExplosion(chip.x + chip.width / 2, chip.y + chip.height / 2, "#ef4444");
          score.value += 100;
          correctAnswersInRound.value += 1;

          if (score.value % 500 === 0 && lives.value < 3) {
            lives.value += 1;
            playSoundEffect("lifeup");
          }
        }

        currentRoundOptions.splice(j, 1);
        bullets.splice(i, 1);
        break;
      }
    }

    if (!hit) {
      // Draw bullet
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(bullet.x - 2, bullet.y, 4, 10);
    }
  }

  // Check if round won
  if (currentRoundOptions.every((opt) => opt.isCorrect)) {
    showRoundCompleteFeedback.value = true;
    playSoundEffect("roundcomplete");
    roundsWon.value += 1;

    setTimeout(() => {
      spawnNewRound();
    }, 600);
  }

  // Draw particles
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
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 🌟 Draw player ship
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(playerX + playerWidth / 2, canvas.height - playerHeight);
  ctx.lineTo(playerX, canvas.height);
  ctx.lineTo(playerX + playerWidth, canvas.height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw bottom red line
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

function handleKeyDown(event: KeyboardEvent) {
  keysPressed[event.key] = true;

  if (event.key === " ") {
    event.preventDefault();
    fireBullet();
  }
}

function handleKeyUp(event: KeyboardEvent) {
  keysPressed[event.key] = false;
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  stopBackgroundMusic();
  if (audioContext) {
    audioContext.close().catch(() => {});
  }
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
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
</style>