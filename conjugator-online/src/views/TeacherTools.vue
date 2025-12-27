<template>
  <v-container fluid class="mt-5 pa-4 d-flex flex-column justify-center align-center">
    <v-row align="stretch" justify="center" class="game-grid" dense>
  <!-- Pronunciation Challenge -->
  <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
    <div
      class="image-tile"
      @click="openDialog('Pronunciation Challenge')"
    >
      <div class="tile-frame">
        <v-img
          src="/images/banners/PronunciationChallenge.png"
          class="tile-image"
          cover
        />
      </div>
    </div>
  </v-col>

    <!-- Prove It! -->
  <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
    <div
      class="image-tile"
      @click="openDialog('Prove it!')"
    >
      <div class="tile-frame">
        <v-img
          src="/images/banners/ProveIt.png"
          class="tile-image"
          cover
        />
      </div>
    </div>
  </v-col>
  
  <!-- Spelling Bee -->
  <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
    <div
      class="image-tile"
      @click="openDialog('Spelling Bee')"
    >
      <div class="tile-frame">
        <v-img
          src="/images/banners/SpellingBee.png"
          class="tile-image"
          cover
        />
      </div>
    </div>
  </v-col>
</v-row>


    <!-- Back Button -->
    <div class="d-flex justify-center mt-6">
      <RouterLink :to="{ name: 'home' }">
        <v-btn icon elevation="0" size="x-large">
          <v-icon size="x-large" color="black">
            mdi-arrow-left-circle
          </v-icon>
        </v-btn>
      </RouterLink>
    </div>

    <!-- STUDENT SELECTION DIALOG -->
    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <v-card-title>
          Select Student
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="mb-3 text-caption">
            Game: <strong>{{ selectedGame }}</strong>
          </div>

          <v-select
            label="Student"
            :items="studentOptions"
            item-title="label"
            item-value="webid"
            v-model="selectedStudent"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>

        <v-card-actions class="d-flex justify-end">
          <v-btn variant="text" @click="closeDialog">
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!selectedStudent"
            @click="launchGame"
          >
            Start
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '@/axios'

const router = useRouter()

// ---------------------------
// STATE
// ---------------------------
const showDialog = ref(false)
const selectedGame = ref<string | null>(null)
const selectedStudent = ref<string | null>(null)

// ---------------------------
// STUDENT LIST
// ---------------------------
const studentOptions = ref<
  { webid: string; initials: string; label: string }[]
>([])

onMounted(async () => {
  try {
    const res = await api.get('/students/')
    studentOptions.value = res.data
      .filter((s: any) => s.web_id && s.web_id.length <= 20)
      .sort((a: any, b: any) => a.web_id.localeCompare(b.web_id))
      .map((s: any) => ({
        webid: s.web_id,
        initials: s.initials,
        label: `${s.web_id} — ${s.initials}`,
      }))
  } catch (err) {
    console.error('Failed to load students:', err)
  }
})

// ---------------------------
// UI ACTIONS
// ---------------------------
function openDialog(gameName: string) {
  selectedGame.value = gameName
  selectedStudent.value = null
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
}

// ---------------------------
// Launch Game
// ---------------------------
function launchGame() {
  if (!selectedGame.value || !selectedStudent.value) return

  router.push({
    name: 'classroom-challenges',
    query: {
      game: selectedGame.value,
      student: selectedStudent.value,
    },
  })

  showDialog.value = false
}
</script>

<style scoped>
.game-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
/* shared link wrapper */
.image-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.image-tile:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

/* ✅ enforce consistent aspect ratio via parent wrapper */
.tile-frame {
  width: 90%;
  border-radius: 12px;
  overflow: hidden;
  max-height: 14rem; /* keeps everything uniform */
}

/* inner v-img should just fill the box */
.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.disabled-tile {
  opacity: 0.5;
  pointer-events: none;
  cursor: default;
}
</style>

