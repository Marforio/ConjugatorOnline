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
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedPack"
                :items="[
                  { title: 'Pack 1', value: 'pack1' },
                  { title: 'Pack 2', value: 'pack2' },
                  { title: 'Pack 3', value: 'pack3' },
                  { title: 'Pack 4', value: 'pack4' },
                  { title: 'Pack 5', value: 'pack5' },
                  { title: 'Pack 6', value: 'pack6' },
                  { title: 'Pack 7', value: 'pack7' },
                  { title: 'Pack 8', value: 'pack8' },
                  { title: 'Pack 9', value: 'pack9' },
                  { title: 'Pack 10', value: 'pack10' },
                  { title: 'Pack 11', value: 'pack11' },
                  { title: 'Pack 12', value: 'pack12' },
                ]"
                label="Question pack"
                variant="outlined"
              />
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
            🏅 Winner{{ lastRoundResult.winnerNames.length > 1 ? 's' : '' }}:
            <strong>{{ lastRoundResult.winnerNames.join(", ") }}</strong>
            (+1 point each)
          </v-alert>
          <div class="mb-2">Correct value: <strong>{{ formatByType(lastRoundResult.actual, lastRoundResult.type) }}</strong></div>
          <v-list density="comfortable" bg-color="transparent" class="rounded-lg border">
            <v-list-item
              v-for="(line, idx) in lastRoundResult.lines"
              :key="line.playerId"
            >
              <template #prepend>
                <v-chip
                  size="small"
                  :color="idx === 0 ? 'success' : 'default'"
                  :variant="idx === 0 ? 'flat' : 'outlined'"
                  class="mr-2"
                >
                  #{{ idx + 1 }}
                </v-chip>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ line.name }}
                <span v-if="idx === 0"> 🏅</span>
              </v-list-item-title>

              <v-list-item-subtitle>
                Guess: {{ formatByType(line.guess, lastRoundResult.type) }}
                • Off by: {{ formatByType(Math.abs(line.guess - lastRoundResult.actual), lastRoundResult.type) }}
                ({{ formatPct(line.deviationPct) }})
              </v-list-item-subtitle>
            </v-list-item>
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
      <v-card class="mb-4 pa-4 rounded-xl border" style="margin-left: 20%;">
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
            <div class="text-caption mt-1">Avg deviation: <strong>{{ formatPct(p.avgDeviationPct) }} (% from correct value)</strong></div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="pa-5 rounded-xl border mb-4">
        <v-row dense>
          <v-col cols="6" md="3">
            <v-img :src="currentQuestion?.image" height="250" cover class="rounded-lg border" />
          </v-col>
          <v-col cols="6" md="9">
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
type PackId =
  | "pack1" | "pack2" | "pack3" | "pack4" | "pack5" | "pack6"
  | "pack7" | "pack8" | "pack9" | "pack10" | "pack11" | "pack12"

type QItem = {
  id: string
  prompt: string
  value: number
  unitHint?: string
  image: string
  type: QuestionType
  pack: PackId
}
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
const selectedPack = ref<PackId>("pack1")
const visiblePlayerNames = computed(() => playerNames.value.slice(0, Math.min(4, Math.max(1, playerCount.value))))

const currentRound = ref(1)
const roundGuesses = reactive<Record<string, string>>({})
const players = ref<Player[]>([])
const usedQuestionIds = ref(new Set<string>())
const currentQuestion = ref<QItem | null>(null)
const questionPool = ref<QItem[]>([])

const lastRoundResult = ref<null | {
  winnerNames: string[]
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
  // PACK 1
  { id: "q1", pack: "pack1", prompt: "Population of Canada (2026)", value: 41000000, unitHint: "people", image: "/images/price-is-right/q1.jpg", type: "integer" },
  { id: "q4", pack: "pack1", prompt: "Year the Berlin Wall fell", value: 1989, unitHint: "year", image: "/images/price-is-right/q4.jpg", type: "year" },
  { id: "q12", pack: "pack1", prompt: "Speed of light", value: 299792458, unitHint: "m/s", image: "/images/price-is-right/q12.jpg", type: "integer" },
  { id: "q13", pack: "pack1", prompt: "Population of Japan (2026)", value: 124000000, unitHint: "people", image: "/images/price-is-right/q13.jpg", type: "integer" },
  { id: "q21", pack: "pack1", prompt: "Area of Argentina", value: 2780400, unitHint: "km²", image: "/images/price-is-right/q21.jpg", type: "integer" },
  { id: "q24", pack: "pack1", prompt: "Year the Internet became publicly available", value: 1991, unitHint: "year", image: "/images/price-is-right/q24.jpg", type: "year" },
  { id: "q27", pack: "pack1", prompt: "Year the first Star Wars movie was released", value: 1977, unitHint: "year", image: "/images/price-is-right/q27.jpg", type: "year" },
  { id: "q52", pack: "pack1", prompt: "Length of the Aare River", value: 295, unitHint: "km", image: "/images/price-is-right/q52.jpg", type: "integer" },
  { id: "q54", pack: "pack1", prompt: "Height of the Dufourspitze (highest peak in Switzerland)", value: 4634, unitHint: "m", image: "/images/price-is-right/q54.jpg", type: "integer" },
  { id: "q62", pack: "pack1", prompt: "Year Windows Vista was released", value: 2007, unitHint: "year", image: "/images/price-is-right/q62.jpg", type: "year" },
  { id: "q69", pack: "pack1", prompt: "Year Spotify launched", value: 2006, unitHint: "year", image: "/images/price-is-right/q69.jpg", type: "year" },
  { id: "q82", pack: "pack1", prompt: "Transfer fee for Kylian Mbappé to PSG (2018)", value: 180000000, unitHint: "EUR", image: "/images/price-is-right/q82.jpg", type: "integer" },
  { id: "q83", pack: "pack1", prompt: "Transfer fee for Philippe Coutinho to Barcelona (2018)", value: 145000000, unitHint: "EUR", image: "/images/price-is-right/q83.jpg", type: "integer" },
  { id: "q104", pack: "pack1", prompt: "Melting point of silver", value: 962, unitHint: "°C", image: "/images/price-is-right/q104.jpg", type: "integer" },
  { id: "q109", pack: "pack1", prompt: "Melting point of zinc", value: 420, unitHint: "°C", image: "/images/price-is-right/q109.jpg", type: "integer" },
  { id: "q32", pack: "pack1", prompt: "Population of Brazil (2026)", value: 214000000, unitHint: "people", image: "/images/price-is-right/q32.jpg", type: "integer" },

  // PACK 2 - 14
  { id: "q8", pack: "pack2", prompt: "Year the UN was founded", value: 1945, unitHint: "year", image: "/images/price-is-right/q8.jpg", type: "year" },
  { id: "q15", pack: "pack2", prompt: "Height of Mount Fuji", value: 3776, unitHint: "m", image: "/images/price-is-right/q15.jpg", type: "integer" },
  { id: "q25", pack: "pack2", prompt: "Diameter of Earth", value: 12742, unitHint: "km", image: "/images/price-is-right/q25.jpg", type: "integer" },
  { id: "q33", pack: "pack2", prompt: "Capacity of BCF Arena (Fribourg, Switzerland)", value: 9372, unitHint: "people", image: "/images/price-is-right/q33.jpg", type: "integer" },
  { id: "q35", pack: "pack2", prompt: "Number of countries in the world (2026)", value: 195, unitHint: "countries", image: "/images/price-is-right/q35.jpg", type: "integer" },
  { id: "q38", pack: "pack2", prompt: "Population of Germany (2026)", value: 84000000, unitHint: "people", image: "/images/price-is-right/q38.jpg", type: "integer" },
  { id: "q45", pack: "pack2", prompt: "Year of Napoleon's death", value: 1821, unitHint: "year", image: "/images/price-is-right/q45.jpg", type: "year" },
  { id: "q47", pack: "pack2", prompt: "Atomic number of the element molybdenum", value: 42, unitHint: "atomic number", image: "/images/price-is-right/q47.jpg", type: "integer" },
  { id: "q50", pack: "pack2", prompt: "Height of the Statue of Liberty", value: 93, unitHint: "m", image: "/images/price-is-right/q50.jpg", type: "integer" },
  { id: "q65", pack: "pack2", prompt: "Year Nestlé was founded", value: 1866, unitHint: "year", image: "/images/price-is-right/q65.jpg", type: "year" },
  { id: "q84", pack: "pack2", prompt: "Transfer fee for João Félix to Atlético Madrid (2019)", value: 126000000, unitHint: "EUR", image: "/images/price-is-right/q84.jpg", type: "integer" },
  { id: "q86", pack: "pack2", prompt: "Transfer fee for Jack Grealish to Manchester City (2021)", value: 117000000, unitHint: "EUR", image: "/images/price-is-right/q86.jpg", type: "integer" },
  { id: "q96", pack: "pack2", prompt: "Boiling point of ethanol", value: 78, unitHint: "°C", image: "/images/price-is-right/q96.jpg", type: "integer" },
  { id: "q107", pack: "pack2", prompt: "Melting point of lead", value: 327, unitHint: "°C", image: "/images/price-is-right/q107.jpg", type: "integer" },

  // PACK 3
  { id: "q2", pack: "pack3", prompt: "Length of the Nile", value: 6650, unitHint: "km", image: "/images/price-is-right/q2.jpg", type: "integer" },
  { id: "q3", pack: "pack3", prompt: "Melting point of gold", value: 1064, unitHint: "°C", image: "/images/price-is-right/q3.jpg", type: "integer" },
  { id: "q5", pack: "pack3", prompt: "Year the first iPhone was released", value: 2007, unitHint: "year", image: "/images/price-is-right/q5.jpg", type: "year" },
  { id: "q6", pack: "pack3", prompt: "Approximate GDP of Canada", value: 2200000000000, unitHint: "USD", image: "/images/price-is-right/q1.jpg", type: "integer" },
  { id: "q7", pack: "pack3", prompt: "Length of a marathon, in miles", value: 26.219, unitHint: "miles", image: "/images/price-is-right/q7.jpg", type: "decimal" },
  { id: "q16", pack: "pack3", prompt: "Year the Canton of Fribourg joined the Confederation", value: 1481, unitHint: "year", image: "/images/price-is-right/q16.jpg", type: "year" },
  { id: "q17", pack: "pack3", prompt: "Number of bones in the adult human body", value: 206, unitHint: "bones", image: "/images/price-is-right/q17.jpg", type: "integer" },
  { id: "q20", pack: "pack3", prompt: "Area of Australia", value: 7692024, unitHint: "km²", image: "/images/price-is-right/q20.jpg", type: "integer" },
  { id: "q26", pack: "pack3", prompt: "Price of an ounce of gold at the end of 2025", value: 4320, unitHint: "USD", image: "/images/price-is-right/q26.jpg", type: "integer" },
  { id: "q40", pack: "pack3", prompt: "Circumference of Earth", value: 40075, unitHint: "km", image: "/images/price-is-right/q25.jpg", type: "integer" },
  { id: "q67", pack: "pack3", prompt: "Year Nintendo released the original Game Boy", value: 1989, unitHint: "year", image: "/images/price-is-right/q67.jpg", type: "year" },
  { id: "q81", pack: "pack3", prompt: "Transfer fee for Neymar to PSG (2017)", value: 222000000, unitHint: "EUR", image: "/images/price-is-right/q81.jpg", type: "integer" },
  { id: "q87", pack: "pack3", prompt: "Transfer fee for Cristiano Ronaldo to Real Madrid (2009)", value: 94000000, unitHint: "EUR", image: "/images/price-is-right/q87.jpg", type: "integer" },
  { id: "q105", pack: "pack3", prompt: "Melting point of copper", value: 1085, unitHint: "°C", image: "/images/price-is-right/q105.jpg", type: "integer" },
  { id: "q110", pack: "pack3", prompt: "Melting point of platinum", value: 1768, unitHint: "°C", image: "/images/price-is-right/q110.jpg", type: "integer" },

  // PACK 4
  { id: "q9", pack: "pack4", prompt: "Height of Mount Everest", value: 8848, unitHint: "m", image: "/images/price-is-right/q9.jpg", type: "integer" },
  { id: "q10", pack: "pack4", prompt: "Distance from Earth to the Moon", value: 384400, unitHint: "km", image: "/images/price-is-right/q10.jpg", type: "integer" },
  { id: "q11", pack: "pack4", prompt: "Year the Titanic sank", value: 1912, unitHint: "year", image: "/images/price-is-right/q11.jpg", type: "year" },
  { id: "q14", pack: "pack4", prompt: "Length of the Amazon River", value: 6400, unitHint: "km", image: "/images/price-is-right/q14.jpg", type: "integer" },
  { id: "q18", pack: "pack4", prompt: "Area of France", value: 551695, unitHint: "km²", image: "/images/price-is-right/q18.jpg", type: "integer" },
  { id: "q22", pack: "pack4", prompt: "Depth of the Mariana Trench (deepest point in the ocean)", value: 10994, unitHint: "m", image: "/images/price-is-right/q22.jpg", type: "integer" },
  { id: "q23", pack: "pack4", prompt: "Population of Australia (2026)", value: 27000000, unitHint: "people", image: "/images/price-is-right/q23.jpg", type: "integer" },
  
  { id: "q37", pack: "pack4", prompt: "Number of cows in the world (2026)", value: 1550000000, unitHint: "cows", image: "/images/price-is-right/q37.jpg", type: "integer" },
  { id: "q42", pack: "pack4", prompt: "Year the first vaccine was developed", value: 1796, unitHint: "year", image: "/images/price-is-right/q42.jpg", type: "year" },
  { id: "q89", pack: "pack4", prompt: "Transfer fee for Paul Pogba to Manchester United (2016)", value: 105000000, unitHint: "EUR", image: "/images/price-is-right/q89.jpg", type: "integer" },
  { id: "q90", pack: "pack4", prompt: "Transfer fee for Ousmane Dembélé to Barcelona (2017)", value: 105000000, unitHint: "EUR", image: "/images/price-is-right/q90.jpg", type: "integer" },
  { id: "q94", pack: "pack4", prompt: "Boiling point of hydrogen at sea level", value: -253, unitHint: "°C", image: "/images/price-is-right/q94.jpg", type: "integer" },
  { id: "q102", pack: "pack4", prompt: "Melting point of iron", value: 1538, unitHint: "°C", image: "/images/price-is-right/q102.jpg", type: "integer" },
  { id: "q106", pack: "pack4", prompt: "Melting point of aluminum", value: 660, unitHint: "°C", image: "/images/price-is-right/q106.jpg", type: "integer" },
  { id: "q602", pack: "pack4", prompt: "Value of pi (π) to 10 decimal places", value: 3.1415926535, unitHint: "", image: "/images/price-is-right/q60.jpg", type: "decimal" },

  // PACK 5
  { id: "q28", pack: "pack5", prompt: "Length of the Great Wall of China", value: 21196, unitHint: "km", image: "/images/price-is-right/q28.jpg", type: "integer" },
  { id: "q29", pack: "pack5", prompt: "Average distance Earth travels around the Sun per year", value: 940000000, unitHint: "km", image: "/images/price-is-right/q29.jpg", type: "integer" },
  { id: "q30", pack: "pack5", prompt: "Area of Egypt", value: 1002450, unitHint: "km²", image: "/images/price-is-right/q30.jpg", type: "integer" },
  { id: "q31", pack: "pack5", prompt: "Height of Mount Kilimanjaro", value: 5895, unitHint: "m", image: "/images/price-is-right/q31.jpg", type: "integer" },
  { id: "q39", pack: "pack5", prompt: "Area of the canton of Valais", value: 5226, unitHint: "km²", image: "/images/price-is-right/q39.jpg", type: "integer" },
  { id: "q48", pack: "pack5", prompt: "Atomic number of the element silver", value: 47, unitHint: "atomic number", image: "/images/price-is-right/q48.jpg", type: "integer" },
  { id: "q53", pack: "pack5", prompt: "Height of the Matterhorn", value: 4478, unitHint: "m", image: "/images/price-is-right/q53.jpg", type: "integer" },
  { id: "q58", pack: "pack5", prompt: "Length of Lake Neuchâtel", value: 38.3, unitHint: "km", image: "/images/price-is-right/q58.jpg", type: "decimal" },
  { id: "q61", pack: "pack5", prompt: "Year Google was founded", value: 1998, unitHint: "year", image: "/images/price-is-right/q61.jpg", type: "year" },
  { id: "q68", pack: "pack5", prompt: "Year Apple released the first MacBook Air", value: 2008, unitHint: "year", image: "/images/price-is-right/q68.jpg", type: "year" },
  { id: "q85", pack: "pack5", prompt: "Transfer fee for Enzo Fernández to Chelsea (2023)", value: 121000000, unitHint: "EUR", image: "/images/price-is-right/q85.jpg", type: "integer" },
  { id: "q88", pack: "pack5", prompt: "Transfer fee for Gareth Bale to Real Madrid (2013)", value: 101000000, unitHint: "EUR", image: "/images/price-is-right/q88.jpg", type: "integer" },
  { id: "q92", pack: "pack5", prompt: "Boiling point of nitrogen at sea level", value: -196, unitHint: "°C", image: "/images/price-is-right/q92.jpg", type: "integer" },
  { id: "q95", pack: "pack5", prompt: "Area of the Canton of Fribourg", value: 1672, unitHint: "km²", image: "/images/price-is-right/q16.jpg", type: "integer" },
  { id: "q108", pack: "pack5", prompt: "Melting point of tin", value: 232, unitHint: "°C", image: "/images/price-is-right/q108.jpg", type: "integer" },
  { id: "q601", pack: "pack5", prompt: "Value of pi (π) to 10 decimal places", value: 3.1415926535, unitHint: "", image: "/images/price-is-right/q60.jpg", type: "decimal" },

  // PACK 6  - 12
  { id: "q34", pack: "pack6", prompt: "Speed of sound in air", value: 343, unitHint: "m/s", image: "/images/price-is-right/q34.jpg", type: "integer" },
  { id: "q41", pack: "pack6", prompt: "Number of moons orbiting Jupiter", value: 115, unitHint: "moons", image: "/images/price-is-right/q41.jpg", type: "integer" },
  { id: "q43", pack: "pack6", prompt: "Height of the Burj Khalifa", value: 828, unitHint: "m", image: "/images/price-is-right/q43.jpg", type: "integer" },
  { id: "q44", pack: "pack6", prompt: "Population of Mexico (2026)", value: 130000000, unitHint: "people", image: "/images/price-is-right/q44.jpg", type: "integer" },
  { id: "q46", pack: "pack6", prompt: "Total population of Bengal tigers in the wild (2026)", value: 3000, unitHint: "tigers", image: "/images/price-is-right/q46.jpg", type: "integer" },
  { id: "q56", pack: "pack6", prompt: "Area of Lake Geneva", value: 580, unitHint: "km²", image: "/images/price-is-right/q56.jpg", type: "integer" },
  { id: "q60", pack: "pack6", prompt: "Value of pi (π) to 10 decimal places", value: 3.1415926535, unitHint: "", image: "/images/price-is-right/q60.jpg", type: "decimal" },
  { id: "q63", pack: "pack6", prompt: "Year Amazon was founded", value: 1994, unitHint: "year", image: "/images/price-is-right/q63.jpg", type: "year" },
  { id: "q66", pack: "pack6", prompt: "Price of Crédit Suisse acquisition by UBS (2023)", value: 3000000000, unitHint: "CHF", image: "/images/price-is-right/q66.jpg", type: "decimal" },
  { id: "q70", pack: "pack6", prompt: "Year Adobe Photoshop was first released", value: 1990, unitHint: "year", image: "/images/price-is-right/q70.jpg", type: "year" },
  { id: "q97", pack: "pack6", prompt: "Boiling point of mercury", value: 357, unitHint: "°C", image: "/images/price-is-right/q97.jpg", type: "integer" },
  { id: "q101", pack: "pack6", prompt: "Depth of Lake Baikal at its deepest point", value: 1642, unitHint: "m", image: "/images/price-is-right/q101.jpg", type: "integer" },

  // PACK 7  - 12
  { id: "q55", pack: "pack7", prompt: "Area of Switzerland", value: 41285, unitHint: "km²", image: "/images/price-is-right/q55.jpg", type: "integer" },
  { id: "q57", pack: "pack7", prompt: "Height of the Jungfrau", value: 4158, unitHint: "m", image: "/images/price-is-right/q57.jpg", type: "integer" },
  { id: "q59", pack: "pack7", prompt: "Population of Zurich (city proper, 2026)", value: 440000, unitHint: "people", image: "/images/price-is-right/q59.jpg", type: "integer" },
  { id: "q64", pack: "pack7", prompt: "Year Facebook launched", value: 2004, unitHint: "year", image: "/images/price-is-right/q64.jpg", type: "year" },
  { id: "q36", pack: "pack2", prompt: "Year the first commercial airplane flight took place", value: 1914, unitHint: "year", image: "/images/price-is-right/q36.jpg", type: "year" },
  { id: "q65", pack: "pack7", prompt: "Population of Geneva (2026) (canton)", value: 210000, unitHint: "people", image: "/images/price-is-right/q65.jpg", type: "integer" },
  { id: "q49", pack: "pack7", prompt: "Distance from Earth to the Sun", value: 149600000, unitHint: "km", image: "/images/price-is-right/q29.jpg", type: "integer" },
  { id: "q51", pack: "pack7", prompt: "Length of the Rhine River within Switzerland", value: 375, unitHint: "km", image: "/images/price-is-right/q51.jpg", type: "integer" },
  { id: "q91", pack: "pack7", prompt: "Boiling point of oxygen at sea level", value: -183, unitHint: "°C", image: "/images/price-is-right/q91.jpg", type: "integer" },
  { id: "q19", pack: "pack7", prompt: "Height of the Eiffel Tower", value: 330, unitHint: "m", image: "/images/price-is-right/q19.jpg", type: "integer" },
  { id: "q113", pack: "pack7", prompt: "Distance from New York to London by air", value: 5555, unitHint: "km", image: "/images/price-is-right/q113.jpg", type: "integer" },
  { id: "q114", pack: "pack7", prompt: "Market capitalization of Tesla at the end of 2025", value: 1600000000, unitHint: "USD", image: "/images/price-is-right/q114.jpg", type: "integer" },
  { id: "q115", pack: "pack7", prompt: "Market capitalization of Nestlé at the end of 2025", value: 202500000, unitHint: "CHF", image: "/images/price-is-right/q65.jpg", type: "integer" },

  // PACK 8
  { id: "q110", pack: "pack8", prompt: "Year the HEIA-FR (Haute École d'Ingénierie et d'Architecture Fribourg) was founded", value: 1896, unitHint: "year", image: "/images/price-is-right/q110.jpg", type: "year" },
  { id: "q111", pack: "pack8", prompt: "Height of the highest mountain in Britain (Ben Nevis)", value: 1345, unitHint: "m", image: "/images/price-is-right/q111.jpg", type: "integer" },
  { id: "q112", pack: "pack8", prompt: "Height of the highest building in Switzerland (Roche Tower 2)", value: 205, unitHint: "m", image: "/images/price-is-right/q112.jpg", type: "integer" },
  { id: "q115", pack: "pack8", prompt: "Market capitalization of Apple at the end of 2025", value: 4150000000, unitHint: "USD", image: "/images/price-is-right/q115.jpg", type: "integer" },
  { id: "q116", pack: "pack8", prompt: "Distance from Paris to Berlin by air", value: 857, unitHint: "km", image: "/images/price-is-right/q116.jpg", type: "integer" },
  

 // PACK 9

 { id: "q118", pack: "pack9", prompt: "Distance from Los Angeles to New York by air", value: 3935, unitHint: "km", image: "/images/price-is-right/q117.jpg", type: "integer" }
  //  add questions about CEO salaries, flight distance from point a to b, 
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
  const packQuestions = questions.filter(q => q.pack === selectedPack.value)
    if (packQuestions.length < roundCount.value) {
      alert(`Selected pack has only ${packQuestions.length} questions. Reduce rounds or choose another pack.`)
      return
    }
    questionPool.value = shuffle([...packQuestions]).slice(0, roundCount.value)
  pickNextQuestion()
  resetInputs()
}

function onGuessInput(playerId: string, raw: string) {
  roundGuesses[playerId] = formatByQuestionType(raw, currentQuestion.value?.type ?? "integer")
}

function formatByQuestionType(raw: string, type: QuestionType): string {
  const hasMinus = raw.trim().startsWith("-")
  const cleaned = raw.replace(/[^0-9.]/g, "")
  if (!cleaned) return hasMinus ? "-" : ""

  const [intRaw, decRaw = ""] = cleaned.split(".")
  const intNoLeading = intRaw.replace(/^0+(?=\d)/, "") || "0"

  if (type === "year") {
    const y = intNoLeading.slice(0, 4)
    return `${hasMinus ? "-" : ""}${y}`
  }

  const grouped = intNoLeading.replace(/\B(?=(\d{3})+(?!\d))/g, "'")
  const sign = hasMinus ? "-" : ""

  if (type === "integer") return `${sign}${grouped}`
  if (type === "money") return `${sign}${grouped}${decRaw.length ? "." + decRaw.slice(0, 2) : ""}`
  return `${sign}${grouped}${decRaw.length ? "." + decRaw.slice(0, 3) : ""}` // decimal
}

function parseGuess(input: string, type: QuestionType): number | null {
  if (!input) return null
  const normalized = input.replace(/'/g, "").trim()
  if (!normalized || normalized === "-") return null

  // allow leading minus, but reject weird forms
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null

  const n = Number(normalized)
  if (!Number.isFinite(n)) return null

  if (type === "year" && (!Number.isInteger(n) || normalized.replace("-", "").length > 4)) return null
  if (type === "integer" && !Number.isInteger(n)) return null
  return n
}

function evaluateRound() {
  if (!currentQuestion.value) return
  const actual = currentQuestion.value.value
  const type = currentQuestion.value.type

  const lines: { playerId: string; name: string; guess: number; deviationPct: number; absError: number }[] = []

  // Parse all guesses
  for (const p of orderedPlayersForRound.value) {
    const n = parseGuess(roundGuesses[p.id], type)
    if (n === null) return
    const absError = Math.abs(n - actual)
    const deviationPct = actual === 0 ? 0 : (absError / Math.abs(actual)) * 100
    lines.push({ playerId: p.id, name: p.name, guess: n, deviationPct, absError })
  }

  // Disallow identical numeric guesses in the same round
  // Only enforce unique guesses for non-year questions
    if (type !== "year") {
      const seen = new Set<number>()
      for (const line of lines) {
        if (seen.has(line.guess)) {
          alert("Duplicate guesses are only allowed for year questions. Please enter unique answers.")
          return
        }
        seen.add(line.guess)
      }
    }

  lines.sort((a, b) => a.absError - b.absError)

  const bestAbsError = lines[0].absError
  const winners = lines.filter(l => l.absError === bestAbsError)

  winners.forEach(w => {
    const wp = players.value.find(p => p.id === w.playerId)
    if (wp) wp.points += 1
  })

  lines.forEach(line => {
    const pl = players.value.find(p => p.id === line.playerId)
    if (!pl) return
    pl.deviations.push(line.deviationPct)
    pl.avgDeviationPct = pl.deviations.reduce((a, b) => a + b, 0) / pl.deviations.length
  })

  lastRoundResult.value = {
    winnerNames: winners.map(w => w.name),
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