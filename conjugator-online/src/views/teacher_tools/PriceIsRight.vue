<template>
  <v-container fluid class="pa-6 max-width-game-container">
    <!-- Setup Dialog -->
    <v-dialog v-model="showSetupDialog" persistent max-width="760">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-black">Setup: The Price Is Right</v-card-title>
        <v-divider />
        <v-card-text class="pt-4">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="playerCount" type="number" label="Number of players (1–4)" min="1" max="4" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-slider v-model="roundCount" min="8" max="15" step="1" thumb-label color="indigo" />
              <div class="text-caption">Selected: {{ roundCount }} rounds</div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row dense>
            <v-col v-for="(name, idx) in visiblePlayerNames" :key="idx" cols="12" md="6">
              <v-text-field v-model="playerNames[idx]" :label="`Player ${idx + 1} name`" variant="outlined" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="indigo" @click="confirmSetup">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Warning -->
    <v-dialog v-model="showWarningDialog" persistent max-width="520">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-black">Classroom Rule</v-card-title>
        <v-divider />
        <v-card-text class="py-6">
          <div class="text-body-1 font-weight-bold">Put all phones and computers away.</div>
          <div class="text-caption mt-2">Students answer orally; teacher enters guesses.</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="indigo" @click="startGame">Start game</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Round Result (blocking) -->
    <v-dialog v-model="showRoundResultDialog" persistent max-width="620">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-black">Round {{ currentRound }} Result</v-card-title>
        <v-divider />
        <v-card-text v-if="lastRoundResult">
          <v-alert type="success" variant="tonal" class="mb-3">
            🏅 Winner: <strong>{{ lastRoundResult.winnerName }}</strong> (+1 point)
          </v-alert>
          <div class="mb-2">Correct value: <strong>{{ formatByType(lastRoundResult.actual, lastRoundResult.type) }}</strong></div>
          <v-list density="compact" bg-color="transparent">
            <v-list-item
              v-for="line in lastRoundResult.lines"
              :key="line.playerId"
              :title="`${line.name}: ${formatByType(line.guess, lastRoundResult.type)} (${formatPct(line.deviationPct)})`"
            />
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="indigo" @click="continueAfterRound">
            {{ currentRound >= roundCount ? 'See final ranking' : 'Next round' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Live Game -->
    <div v-if="gameStarted && !gameComplete">
      <v-card class="mb-4 pa-4 rounded-xl border">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-overline font-weight-bold">Round</div>
            <div class="text-h6 font-weight-black">{{ currentRound }} / {{ roundCount }}</div>
          </div>
          <v-btn variant="text" :to="{ name: 'teacher-tools' }" prepend-icon="mdi-arrow-left">Back</v-btn>
        </div>
      </v-card>

      <v-row dense class="mb-4">
        <v-col v-for="p in players" :key="p.id" cols="12" md="6" lg="3">
          <v-card class="pa-3 rounded-lg border" :style="{ borderColor: p.colorHex, borderWidth: '2px' }">
            <div class="d-flex justify-space-between align-center">
              <div class="font-weight-black" :style="{ color: p.colorHex }">{{ p.name }}</div>
              <v-chip :color="p.color" size="small" class="text-white">{{ p.points }} pts</v-chip>
            </div>
            <div class="text-caption mt-1">Avg deviation: <strong>{{ formatPct(p.avgDeviationPct) }}</strong></div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="pa-5 rounded-xl border mb-4">
        <v-row dense>
          <v-col cols="12" md="5">
            <v-img :src="currentQuestion?.image" height="250" cover class="rounded-lg border" />
          </v-col>
          <v-col cols="12" md="7">
            <div class="text-overline font-weight-bold mb-2">Prompt</div>
            <div class="text-h6 font-weight-black mb-2">{{ currentQuestion?.prompt }}</div>
            <div class="text-caption">{{ currentQuestion?.unitHint }}</div>
          </v-col>
        </v-row>
      </v-card>

      <v-card class="pa-5 rounded-xl border">
        <div class="text-subtitle-2 font-weight-bold mb-2">Entry order rotates each round:</div>
        <v-row dense>
          <v-col v-for="p in orderedPlayersForRound" :key="p.id" cols="12" md="6">
            <v-text-field
              v-model="roundGuesses[p.id]"
              :label="`${p.name} guess`"
              :color="p.color"
              variant="outlined"
              @update:model-value="(v) => onGuessInput(p.id, String(v ?? ''))"
              :placeholder="inputPlaceholder"
            />
          </v-col>
        </v-row>
        <div class="d-flex justify-end mt-2">
          <v-btn color="success" prepend-icon="mdi-check-circle" @click="evaluateRound">Check round</v-btn>
        </div>
      </v-card>
    </div>

    <!-- Final Results Page -->
    <div v-else-if="gameComplete">
      <v-card class="pa-6 rounded-xl border">
        <div class="text-overline font-weight-bold mb-1">Game complete</div>
        <h2 class="text-h4 font-weight-black mb-4">Final Ranking</h2>

        <v-alert type="info" variant="tonal" class="mb-4">
          Ranking uses: points → lower avg deviation → combined normalized metric.
        </v-alert>

        <v-row dense>
          <v-col v-for="(p, i) in rankedPlayers" :key="p.id" cols="12" md="6">
            <v-card class="pa-4 rounded-lg border" :style="{ borderColor: p.colorHex, borderWidth: '2px' }">
              <div class="d-flex justify-space-between">
                <strong>{{ i + 1 }}. {{ p.name }}</strong>
                <v-chip :color="p.color" size="small" class="text-white">{{ p.points }} pts</v-chip>
              </div>
              <div class="text-caption mt-2">Avg deviation: <strong>{{ formatPct(p.avgDeviationPct) }}</strong></div>
              <div class="text-caption">Combined score: <strong>{{ p.combinedScore.toFixed(3) }}</strong></div>
            </v-card>
          </v-col>
        </v-row>

        <v-alert type="success" variant="tonal" class="mt-4">
          🏆 Winner: <strong>{{ finalWinner?.name }}</strong>
        </v-alert>

        <div class="d-flex flex-wrap ga-3 mt-4">
          <v-btn color="indigo" @click="restart">Play again</v-btn>
          <v-btn variant="outlined" :to="{ name: 'teacher-tools' }">Back to Teacher Tools</v-btn>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue"

type QuestionType = "year" | "integer" | "money" | "decimal"
type QItem = { id: string; prompt: string; value: number; unitHint?: string; image: string; type: QuestionType }
type Player = {
  id: string; name: string; points: number; deviations: number[]; avgDeviationPct: number;
  orderIndex: number; combinedScore: number; color: string; colorHex: string
}

const showSetupDialog = ref(true)
const showWarningDialog = ref(false)
const showRoundResultDialog = ref(false)
const gameStarted = ref(false)
const gameComplete = ref(false)

const playerCount = ref(2)
const roundCount = ref(10)
const playerNames = ref(["Player 1", "Player 2", "Player 3", "Player 4"])
const visiblePlayerNames = computed(() => playerNames.value.slice(0, Math.min(4, Math.max(1, playerCount.value))))

const currentRound = ref(1)
const roundGuesses = reactive<Record<string, string>>({})
const players = ref<Player[]>([])
const usedQuestionIds = ref(new Set<string>())
const currentQuestion = ref<QItem | null>(null)
const questionPool = ref<QItem[]>([])

const lastRoundResult = ref<null | {
  winnerName: string
  actual: number
  type: QuestionType
  lines: { playerId: string; name: string; guess: number; deviationPct: number }[]
}>(null)

const palette = [
  { color: "indigo", colorHex: "#3949AB" },
  { color: "deep-orange", colorHex: "#F4511E" },
  { color: "teal", colorHex: "#00897B" },
  { color: "purple", colorHex: "#8E24AA" },
]

const questions: QItem[] = [
  { id: "q1", prompt: "Population of Canada (2026)", value: 41000000, unitHint: "people", image: "/images/price-is-right/q1.jpg", type: "integer" },
  { id: "q2", prompt: "Length of the Nile", value: 6650, unitHint: "km", image: "/images/price-is-right/q2.jpg", type: "integer" },
  { id: "q3", prompt: "Price of 1 ounce of gold at end of 2025", value: 2060.00, unitHint: "USD", image: "/images/price-is-right/q3.jpg", type: "money" },
  { id: "q4", prompt: "Year the Berlin Wall fell", value: 1989, unitHint: "year", image: "/images/price-is-right/q4.jpg", type: "year" },
  { id: "q5", prompt: "Year the first iPhone was released", value: 2007, unitHint: "year", image: "/images/price-is-right/q5.jpg", type: "year" },
  { id: "q6", prompt: "Approximate GDP of Canada", value: 2200000000000, unitHint: "USD", image: "/images/price-is-right/q6.jpg", type: "integer" },
  { id: "q7", prompt: "Length of a marathon", value: 42.195, unitHint: "km", image: "/images/price-is-right/q7.jpg", type: "decimal" },
  { id: "q8", prompt: "Year the UN was founded", value: 1945, unitHint: "year", image: "/images/price-is-right/q8.jpg", type: "year" },
]

const orderedPlayersForRound = computed(() => {
  const n = players.value.length || 1
  return [...players.value].sort((a, b) =>
    ((a.orderIndex + currentRound.value - 1) % n) - ((b.orderIndex + currentRound.value - 1) % n)
  )
})

const inputPlaceholder = computed(() => {
  switch (currentQuestion.value?.type) {
    case "year": return "e.g. 1999"
    case "money": return "e.g. 2'060.00"
    case "decimal": return "e.g. 48.795"
    default: return "e.g. 41'000'000"
  }
})

const rankedPlayers = computed(() => {
  const arr = [...players.value]
  const maxPoints = Math.max(...arr.map(p => p.points), 1)
  const maxDev = Math.max(...arr.map(p => p.avgDeviationPct || 0), 1)

  arr.forEach(p => {
    const normPoints = (maxPoints - p.points) / maxPoints
    const normDev = (p.avgDeviationPct || 0) / maxDev
    p.combinedScore = normPoints + normDev
  })

  arr.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (a.avgDeviationPct !== b.avgDeviationPct) return a.avgDeviationPct - b.avgDeviationPct
    return a.combinedScore - b.combinedScore
  })
  return arr
})

const finalWinner = computed(() => rankedPlayers.value[0] ?? null)

function confirmSetup() {
  playerCount.value = Math.min(4, Math.max(1, Number(playerCount.value || 1)))
  roundCount.value = Math.min(15, Math.max(8, Number(roundCount.value || 10)))

  players.value = Array.from({ length: playerCount.value }).map((_, i) => ({
    id: `p${i + 1}`,
    name: (playerNames.value[i] || `Player ${i + 1}`).trim() || `Player ${i + 1}`,
    points: 0,
    deviations: [],
    avgDeviationPct: 0,
    orderIndex: i,
    combinedScore: 0,
    color: palette[i].color,
    colorHex: palette[i].colorHex,
  }))

  showSetupDialog.value = false
  showWarningDialog.value = true
}

function startGame() {
  showWarningDialog.value = false
  gameStarted.value = true
  gameComplete.value = false
  currentRound.value = 1
  usedQuestionIds.value = new Set()
  questionPool.value = shuffle([...questions])
  pickNextQuestion()
  resetInputs()
}

function onGuessInput(playerId: string, raw: string) {
  roundGuesses[playerId] = formatByQuestionType(raw, currentQuestion.value?.type ?? "integer")
}

function formatByQuestionType(raw: string, type: QuestionType): string {
  const cleaned = raw.replace(/[^0-9.]/g, "")
  if (!cleaned) return ""

  const [intRaw, decRaw = ""] = cleaned.split(".")
  const intNoLeading = intRaw.replace(/^0+(?=\d)/, "")

  if (type === "year") {
    return intNoLeading.slice(0, 4)
  }

  const grouped = intNoLeading.replace(/\B(?=(\d{3})+(?!\d))/g, "'")

  if (type === "integer") return grouped
  if (type === "money") return `${grouped}${decRaw.length ? "." + decRaw.slice(0, 2) : ""}`
  return `${grouped}${decRaw.length ? "." + decRaw.slice(0, 3) : ""}` // decimal
}

function parseGuess(input: string, type: QuestionType): number | null {
  if (!input) return null
  const normalized = input.replace(/'/g, "").trim()
  if (!normalized) return null

  const n = Number(normalized)
  if (!Number.isFinite(n)) return null

  if (type === "year" && (!Number.isInteger(n) || normalized.length > 4)) return null
  if (type === "integer" && !Number.isInteger(n)) return null
  return n
}

function evaluateRound() {
  if (!currentQuestion.value) return
  const actual = currentQuestion.value.value
  const type = currentQuestion.value.type

  const lines: { playerId: string; name: string; guess: number; deviationPct: number; absError: number }[] = []

  for (const p of orderedPlayersForRound.value) {
    const n = parseGuess(roundGuesses[p.id], type)
    if (n === null) return
    const absError = Math.abs(n - actual)
    const deviationPct = actual === 0 ? 0 : (absError / Math.abs(actual)) * 100
    lines.push({ playerId: p.id, name: p.name, guess: n, deviationPct, absError })
  }

  lines.sort((a, b) => a.absError - b.absError)
  const winner = lines[0]
  const winnerPlayer = players.value.find(p => p.id === winner.playerId)
  if (winnerPlayer) winnerPlayer.points += 1

  lines.forEach(line => {
    const pl = players.value.find(p => p.id === line.playerId)
    if (!pl) return
    pl.deviations.push(line.deviationPct)
    pl.avgDeviationPct = pl.deviations.reduce((a, b) => a + b, 0) / pl.deviations.length
  })

  lastRoundResult.value = {
    winnerName: winner.name,
    actual,
    type,
    lines: lines.map(l => ({ playerId: l.playerId, name: l.name, guess: l.guess, deviationPct: l.deviationPct })),
  }

  showRoundResultDialog.value = true
}

function continueAfterRound() {
  showRoundResultDialog.value = false
  if (currentRound.value >= roundCount.value) {
    gameComplete.value = true
    gameStarted.value = false
    return
  }
  currentRound.value++
  pickNextQuestion()
  resetInputs()
}

function pickNextQuestion() {
  let q = questionPool.value.find(x => !usedQuestionIds.value.has(x.id))
  if (!q) {
    questionPool.value = shuffle([...questions])
    usedQuestionIds.value = new Set()
    q = questionPool.value[0]
  }
  currentQuestion.value = q
  usedQuestionIds.value.add(q.id)
}

function resetInputs() {
  Object.keys(roundGuesses).forEach(k => delete roundGuesses[k])
  orderedPlayersForRound.value.forEach(p => (roundGuesses[p.id] = ""))
}

function restart() {
  showSetupDialog.value = true
  showWarningDialog.value = false
  showRoundResultDialog.value = false
  gameStarted.value = false
  gameComplete.value = false
  currentRound.value = 1
  players.value = []
  Object.keys(roundGuesses).forEach(k => delete roundGuesses[k])
}

function formatByType(n: number, type: QuestionType) {
  if (type === "year") return `${Math.round(n)}`
  if (type === "money") {
    const [i, d] = n.toFixed(2).split(".")
    return `${Number(i).toLocaleString("en-US").replace(/,/g, "'")}.${d}`
  }
  if (type === "integer") return Math.round(n).toLocaleString("en-US").replace(/,/g, "'")
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(n).replace(/,/g, "'")
}

function formatPct(n: number) {
  return `${n.toFixed(2)}%`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
</script>

<style scoped>
.max-width-game-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>