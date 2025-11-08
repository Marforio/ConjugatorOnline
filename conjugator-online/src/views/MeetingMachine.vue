<template>
  <v-container fluid class="pa-0 d-flex" style="height: 100vh;">
    <!-- Sidebar -->
    <div v-if="simulationRunning">
    <v-navigation-drawer
        v-if="$vuetify.display.smAndUp"
        permanent
        width="340"
        class="pa-4 d-flex flex-column"
        >
        <div class="sidebar-header text-center mt-6 mb-6">
            <h2 class="text-h5 font-weight-bold">Meeting Machine</h2>
            <div class="text-body-1">5:30 meeting simulations</div>
        </div>

        <v-spacer />
        <v-divider />
        <v-spacer />

        <div class="phases-list d-flex flex-column justify-center">
            <div
            v-for="(phase, i) in phases"
            :key="phase.name"
            :class="['phase-row d-flex align-center px-3 py-2 mb-2', currentPhaseIndex === i ? 'active' : 'inactive']"
            >
            <div class="phase-index me-3">{{ i + 1 }}</div>
            <div class="phase-content">
                <div class="phase-name">{{ phase.name }}</div>
                <div v-if="phase.item" class="phase-item text-caption">{{ phase.item }}</div>
            </div>
            </div>
        </div>

        <v-spacer />
        <v-divider />
        <v-spacer />

        <div class="mt-auto d-flex justify-center">
            <RouterLink :to="{ name: 'tools' }">
            <v-btn icon elevation="0" size="x-large">
                <v-icon color="grey-darken-3" size="x-large">mdi-arrow-left-circle</v-icon>
            </v-btn>
            </RouterLink>
        </div>

        <v-spacer />
        </v-navigation-drawer>
    </div>

    <!-- Main area -->
    <v-container fluid class="d-flex flex-column justify-center align-center pa-6">
        <div v-if="simulationOver" class="text-center">
            <h1 class="text-h4 font-weight-bold mb-6">Simulation Over</h1>
            <div class="d-flex flex-column align-center gap-4">
                <v-btn color="success" large @click="startSimulation">Do another simulation</v-btn>
                <RouterLink :to="{ name: 'tools' }">
                <v-btn color="primary" large>Back to Tools</v-btn>
                </RouterLink>
                <RouterLink :to="{ name: 'home' }">
                <v-btn color="secondary" large>Language Labs Home</v-btn>
                </RouterLink>
            </div>
        </div>
        <div v-else-if="!simulationRunning" class="text-center" style="max-width: 900px">
        <v-list class="mb-4">
          <div style="margin-bottom: 50px;">
            <v-alert
                border="start"
                elevation="1"
                class="mb-6"
                style="background-color: #e3f2fd; color: #0d47a1;"
                density="compact"
                icon=""
                >
                <v-list-item class="text-body-1 pa-0">
                    <span class="font-weight-bold" style="font-size: 1.2rem;">Situation:</span> The meeting chair is the founder of <a href="https://www.sun-ways.ch/en" target="_blank">Sun Ways</a>, a start-up that makes solar panels for railways (panels installed between the train tracks). The two meeting participants are his/her two most important and trusted employees. The company has 17 employees in total. The company is not profitable yet and is burning through the capital it raised from investors. It needs to grow and become less dependent on support from the CFF/SBB.
                </v-list-item>
            </v-alert>
          </div>
        <v-list-item class="text-h5 text-center font-weight-medium mt-6">This meeting's agenda</v-list-item>  
        <v-list-item class="mt-3 mb-6">
            <v-table>
                    <tbody>
                    <tr>
                        <td class="font-weight-medium">Starting the meeting</td>
                        <td>30 s</td>
                        <td class="font-italic">Rules and priorities</td>
                    </tr>
                    <tr>
                        <td class="font-weight-medium">Item 1</td>
                        <td>90 s</td>
                        <td class="font-italic">{{ phases[1].item }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-medium">Item 2</td>
                        <td>90 s</td>
                        <td class="font-italic">{{ phases[2].item }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-medium">Item 3</td>
                        <td>90 s</td>
                        <td class="font-italic">{{ phases[3].item }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-medium">Wrapping up</td>
                        <td>30 s</td>
                        <td class="font-italic">Summary, decisions and next steps</td>
                    </tr>
                    </tbody>
            </v-table>
          </v-list-item>
          <v-list-item class="text-body-1 font-weight-bold">5 minutes 30 seconds total</v-list-item>
        </v-list>
        <div class=" w-100 d-flex flex-column align-end">
            <p class="text-caption">{{ simulationCode }}</p>
        </div>
        <v-btn color="success" large @click="startSimulation">START SIMULATION</v-btn>
        <div class="mt-4 d-flex justify-center">
            <RouterLink :to="{ name: 'tools' }">
            <v-btn icon elevation="0" size="large">
                <v-icon color="grey-darken-3" size="x-large">mdi-arrow-left-circle</v-icon>
            </v-btn>
            </RouterLink>
        </div>
      </div>


      <div v-else class="d-flex flex-column align-center w-100">
        <!-- Top-right digital timer and phase timer -->
        <div class=" w-100 d-flex flex-column align-start">
            <p class="text-caption">{{ simulationCode }}</p>
        </div>
        <div class="timer-row w-100 d-flex flex-column align-end mb-6 pe-8">
          <div class="digital-timer">{{ formattedTime }}</div>
          <div class="phase-timer">This part: <strong>{{ formattedPhaseTime }}</strong></div>
        </div>

        <!-- Big circular gauge -->
        <div
          class="gauge-wrapper"
          :style="{ width: gaugeSize + 'px', height: gaugeSize + 'px' }"
        >
          <svg :width="gaugeSize" :height="gaugeSize" :viewBox="`0 0 ${viewBox} ${viewBox}`" role="img" aria-label="Meeting progress gauge">
            <!-- Background arcs (each segment separately) -->
            <g v-for="(seg, idx) in segments" :key="'bg-' + idx">
              <path
                v-if="seg.trimSpanDeg > 0"
                :d="arcPathAngles(seg.trimStart, seg.trimEnd)"
                fill="none"
                stroke="#e6e6e6"
                :stroke-width="strokeWidth"
                stroke-linecap="round"
                stroke-opacity="0.95"
              />
            </g>

            <!-- Foreground progress arcs (each segment separately) -->
            <g v-for="(seg, idx) in segments" :key="'fg-' + idx">
              <path
                v-if="seg.trimSpanDeg > 0"
                :d="arcPathAngles(seg.trimStart, seg.trimEnd)"
                fill="none"
                :stroke="phases[idx].color"
                :stroke-width="strokeWidth"
                stroke-linecap="round"
                :stroke-dasharray="seg.arcLen + ' ' + (circumference + 1000)"
                :stroke-dashoffset="progressDashOffset(idx, seg.arcLen)"
                style="transition: stroke-dashoffset 0.35s linear;"
              />
            </g>
          </svg>

          <!-- Center text block - EXACTLY centered -->
          <div class="gauge-center">
            <div class="phase-center-name">{{ currentPhase.name }}</div>
            <div v-if="currentPhase.item" class="phase-center-item">{{ currentPhase.item }}</div>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls mt-1 d-flex gap-4">
          <v-btn v-if="!paused" color="warning" @click="pauseSimulation">PAUSE</v-btn>
          <v-btn v-else color="info" @click="resumeSimulation">RESUME</v-btn>
          <v-btn color="error" @click="stopSimulation">STOP</v-btn>
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue';

const PROMPTS = {
  'Tier 1': [  // Budget, monetary or investment decision
    'Where should we do the end of year retreat?',
    'How should we spend our marketing budget?',
    'Who stole the cookie from the cookie jar?',
  ],
  'Tier 2': [  // Strategy, marketing or business decision
    'We lost money. How should we communicate this?',
    'Our system has been hacked, how shall we handle it?',
    'How can we regain client trust after a major failure?',
  ],
  'Tier 3': [   // 
    'Who is the best hockey player ever?',
    'Which Swiss hockey team is the best ever?',
    'Who is the greatest football player of all time?',
  ],
};

// total time in seconds
const TOTAL = 330; // 5:30

// reactive state
const simulationRunning = ref(false);
const simulationOver = ref(false);
const paused = ref(false);
const timeLeft = ref(TOTAL);
let tickInterval = null;

// choose items for the three discussion items (visible from start)
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

const phases = reactive([
  { name: 'Starting the meeting', start: TOTAL, end: 300, color: '#4caf50', item: 'Welcome & rules' },
  { name: 'Item 1', start: 300, end: 210, color: '#0288d1', item: pick(PROMPTS['Tier 1']) },
  { name: 'Item 2', start: 210, end: 120, color: '#ffb300', item: pick(PROMPTS['Tier 2']) },
  { name: 'Item 3', start: 120, end: 30, color: '#e53935', item: pick(PROMPTS['Tier 3']) },
  { name: 'Wrapping Up', start: 30, end: 0, color: '#8e24aa', item: 'Decisions & next steps' },
]);

// derived
const elapsed = computed(() => TOTAL - timeLeft.value); // seconds elapsed from 0..TOTAL
const currentPhaseIndex = computed(() => {
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    const startElapsed = TOTAL - p.start; // elapsed at phase start
    const endElapsed = TOTAL - p.end;     // elapsed at phase end
    if (elapsed.value >= startElapsed && elapsed.value < endElapsed) return i;
  }
  if (timeLeft.value <= 0) return phases.length - 1;
  return 0;
});
const currentPhase = computed(() => phases[currentPhaseIndex.value]);
const simulationCode = computed(() => {
  const getIndex = (tier, item) => PROMPTS[tier].indexOf(item);

  const item1Index = getIndex('Tier 1', phases[1].item);
  const item2Index = getIndex('Tier 2', phases[2].item);
  const item3Index = getIndex('Tier 3', phases[3].item);

  return `${item1Index}_${item2Index}_${item3Index}`;
});


// formatting
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = Math.floor(timeLeft.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

// Phase time left (for current phase)
const phaseTimeLeft = computed(() => {
  const p = currentPhase.value;
  // timeLeft counts down; phase end is p.end (seconds remaining for session)
  const remain = Math.max(0, timeLeft.value - p.end);
  return remain;
});
const formattedPhaseTime = computed(() => {
  const sec = Math.max(0, Math.floor(phaseTimeLeft.value));
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

// SVG geometry
const viewBox = 100;
const cx = 50, cy = 50;
const radius = 38; // px in viewBox units
const circumference = 2 * Math.PI * radius;

// stroke width (in same viewBox units) — increasing this increases the end-cap width
const strokeWidth = 3; // tune visually

// compute per-phase static angles and trimmed arcs (so the visual segment lengths are visible from the start)
const baseSegments = phases.map(p => {
  const duration = p.start - p.end;
  const spanDeg = (duration / TOTAL) * 360;
  return { duration, spanDeg };
});

// compute minimum gap in degrees to accommodate rounded caps so they don't overlap.
// approximate cap angular extension: halfStroke/radius in radians -> degrees
const capAngleDeg = ( (strokeWidth / 2) / radius ) * (180 / Math.PI);
const requestedGapDeg = 2; // desired visible gap
const gapDeg = Math.max(requestedGapDeg, Math.ceil(capAngleDeg * 2) + 0.5); // ensure gap > cap extensions

// build segments with cumulative angles
let cum = -90; // start at top
const segments = baseSegments.map((s, i) => {
  const startDeg = cum;
  const endDeg = cum + s.spanDeg;
  // trim ends by half gap
  const trimStart = startDeg + gapDeg / 2;
  const trimEnd = endDeg - gapDeg / 2;
  const trimSpanDeg = Math.max(0, trimEnd - trimStart);
  const arcLen = (trimSpanDeg / 360) * circumference;
  cum = endDeg;
  return {
    index: i,
    rawStart: startDeg,
    rawEnd: endDeg,
    trimStart,
    trimEnd,
    trimSpanDeg,
    arcLen
  };
});

// helpers for svg math
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPathAngles(startAngle, endAngle) {
  if (endAngle <= startAngle) {
    const p = polarToCartesian(cx, cy, radius, startAngle);
    return `M ${p.x.toFixed(3)} ${p.y.toFixed(3)}`; // degenerate path
  }
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  let delta = endAngle - startAngle;
  if (delta < 0) delta += 360;
  const largeArcFlag = delta > 180 ? 1 : 0;
  const sweepFlag = 1; // clockwise
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

// compute progress dashoffset for a phase index
function progressDashOffset(idx, arcLen) {
  const p = phases[idx];
  const seg = segments[idx];
  if (!seg || seg.arcLen <= 0) return `${seg.arcLen}px`;
  const startElapsed = TOTAL - p.start;
  const phaseDuration = p.start - p.end;
  const elapsedInside = Math.max(0, Math.min(elapsed.value - startElapsed, phaseDuration)); // clamp
  const frac = Math.max(0, Math.min(1, elapsedInside / phaseDuration));
  const remaining = seg.arcLen * (1 - frac);
  return `${remaining}px`;
}

// gauge size responsive
const gaugeSize = Math.min(Math.max(window.innerHeight * 0.72, 360), window.innerWidth * 0.78);

// controls
function startSimulation() {
  simulationOver.value = false;
  timeLeft.value = TOTAL;
  simulationRunning.value = true;
  paused.value = false;
  clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    if (!paused.value) {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(tickInterval);
        simulationRunning.value = false;
        simulationOver.value = true; 
      }
    }
  }, 1000);
}

function pauseSimulation() { paused.value = true; }
function resumeSimulation() { paused.value = false; }

function stopSimulation() {
  paused.value = false;
  simulationRunning.value = false;
  simulationOver.value = false;
  clearInterval(tickInterval);
  timeLeft.value = TOTAL;
  
}

// cleanup
onUnmounted(() => clearInterval(tickInterval));
</script>

<style scoped>
/* layout */
.sidebar-header { padding-bottom: 4px; }
.phases-list { width: 100%; padding-top: 8px; padding-bottom: 8px; }

/* phase rows */
.phase-row {
  border-radius: 8px;
}
.phase-row.inactive {
  background: transparent;
  color: #666;
}
.phase-row.active {
  background: #f1f8ff;
  border-left: 6px solid #1976d2;
  color: #111;
}

/* index */
.phase-index {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #eee;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #333;
}

/* name + item */
.phase-name { font-size: 1.05rem; font-weight: 600; }
.phase-item { font-size: 0.85rem; color: #666; margin-top: 2px; }

/* gauge styles */
.gauge-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -70px; /* nudge circle slightly higher in the viewport */
}
.gauge-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 60%;
  pointer-events: none;
}
.phase-center-name {
  font-size: 1.6rem;
  font-weight: 700;
}
.phase-center-item {
  margin-top: 6px;
  font-size: 1.5rem;
  color: #444;
}

/* digital timer */
.digital-timer {
  font-family: 'Roboto Mono', monospace;
  font-size: 2.1rem; /* slightly larger */
  font-weight: 700;
  padding: 8px 14px;
  background: rgba(0,0,0,0.03);
  border-radius: 8px;
}
.phase-timer {
  font-family: 'Roboto Mono', monospace;
  font-size: 1.5rem;
  margin-top: 6px;
  color: #333;
}

/* controls spacing */
.controls > * { min-width: 110px; }

.text-center h1 {
  color: #1a237e;
  letter-spacing: 0.5px;
}


/* responsive adjustments */
@media (max-width: 960px) {
  .phase-name { font-size: 1rem; }
  .phase-center-name { font-size: 1.25rem; }
  .digital-timer { font-size: 1.6rem; }
  .phase-timer { font-size: 0.95rem; }
}
</style>
