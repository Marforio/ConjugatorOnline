<template>
  <v-container fluid class="trophy-room">
    <!-- 2x2 grid (Vuetify will wrap cols automatically) -->
    <v-row class="align-stretch">
      <!-- 1) Conjugator achievements -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="2" class="pa-4 mb-6 card-fixed trophy-card">
          <v-card-title class="text-h5">
            <v-icon class="me-3">mdi-controller</v-icon>Conjugator achievements
          </v-card-title>

          <v-card-text>
            <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
            <v-alert v-else-if="error" type="error" class="mb-4">{{ error }}</v-alert>

            <template v-else>
              <v-list v-if="conjugatorAchievements.length">
                <template v-for="(achievement, index) in conjugatorAchievements" :key="achievement.id">
                  <v-list-item class="py-2">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        {{ achievement.name }}
                        <v-icon
                          class="ms-2"
                          :icon="achievementIcons[achievement.criteria_key] || 'mdi-star'"
                        />
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-wrap">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle>
                        <strong>Achieved on:</strong> {{ formatDate(achievement.achieved_on) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider v-if="index < conjugatorAchievements.length - 1" class="my-3" />
                </template>
              </v-list>

              <div v-else class="text-center mt-6">
                <h2 class="text-h6">No conjugator achievements yet</h2>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 2) Vocabulary achievements -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="2" class="pa-4 mb-6 card-fixed trophy-card">
          <v-card-title class="text-h5">
            <v-icon class="me-3">mdi-cards-outline</v-icon>Vocabulary achievements
          </v-card-title>

          <v-card-text>
            <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
            <v-alert v-else-if="error" type="error" class="mb-4">{{ error }}</v-alert>

            <template v-else>
              <v-list v-if="vocabularyAchievements.length">
                <template v-for="(achievement, index) in vocabularyAchievements" :key="achievement.id">
                  <v-list-item class="py-2">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        {{ achievement.name }}
                        <v-icon class="ms-2" icon="mdi-bookmark-check" />
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-wrap">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle>
                        <strong>Achieved on:</strong> {{ formatDate(achievement.achieved_on) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider v-if="index < vocabularyAchievements.length - 1" class="my-3" />
                </template>
              </v-list>

              <div v-else class="text-center mt-6">
                <h2 class="text-h6">No vocabulary achievements yet</h2>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 3) Other game achievements -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="2" class="pa-4 card-fixed trophy-card">
          <v-card-title class="text-h5">
            <v-icon class="me-3">mdi-gamepad-circle</v-icon>Other game achievements
          </v-card-title>

          <v-card-text>
            <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
            <v-alert v-else-if="error" type="error" class="mb-4">{{ error }}</v-alert>

            <template v-else>
              <v-list v-if="otherGameAchievements.length">
                <template v-for="(achievement, index) in otherGameAchievements" :key="achievement.id">
                  <v-list-item class="py-2">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        {{ achievement.name }}
                        <v-icon class="ms-2" icon="mdi-star" />
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-wrap">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle>
                        <strong>Achieved on:</strong> {{ formatDate(achievement.achieved_on) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider v-if="index < otherGameAchievements.length - 1" class="my-3" />
                </template>
              </v-list>

              <div v-else class="text-center mt-6">
                <h2 class="text-h6">No other game achievements yet</h2>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 4) Roadmap (last card) -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="2" class="pa-4 card-fixed trophy-card">
          <v-card-title class="text-h5 mb-1">
            <v-icon class="me-3">mdi-road-variant</v-icon>Roadmap to advanced level
          </v-card-title>

          <v-card-subtitle class="mb-5">
            Milestones reached in SPEAKING exercises without reading from notes
          </v-card-subtitle>

          <v-card-text>
            <v-expansion-panels multiple>
              <v-expansion-panel
                v-for="(items, category) in groupedRoadmap"
                :key="category"
                :class="getProgressColorClass(getCategoryProgress(String(category)).percent)"
              >
                <v-expansion-panel-title>
                  {{ category }} —
                  <span class="ms-2 text-caption">
                    {{ getCategoryProgress(String(category)).percent }}% complete
                  </span>
                  <span
                    class="ms-3"
                    v-if="getCategoryProgress(String(category)).percent === 100"
                  >
                    Done! Great job!
                  </span>
                  <span
                    class="ms-3"
                    v-else-if="getCategoryProgress(String(category)).percent > 75"
                  >
                    Almost there!
                  </span>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-list>
                    <v-list-item v-for="{ key, item } in items" :key="key">
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-medium">
                          {{ item.pretty_title }}
                        </v-list-item-title>

                        <v-list-item class="px-0">
                          <v-icon
                            class="me-2"
                            :color="achievedKeys.has(key) ? 'green-accent-4' : 'grey'"
                          >
                            {{
                              achievedKeys.has(key)
                                ? "mdi-checkbox-marked"
                                : "mdi-checkbox-blank-outline"
                            }}
                          </v-icon>
                          {{ item.description }}
                        </v-list-item>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue"
import api from "@/axios"
import { useUserStore } from "@/stores/user"

interface Achievement {
  id: number
  student: number
  student_username: string
  name: string
  description: string
  evidence: string
  criteria_key: string
  achieved_on: string
  manually_created: boolean
}

interface RoadmapItem {
  pretty_title: string
  description: string
  category?: string
}

interface GroupedRoadmap {
  [category: string]: { key: string; item: RoadmapItem }[]
}

const userStore = useUserStore()

const achievements = ref<Achievement[]>([])
const automaticAchievements = ref<Achievement[]>([])
const manualAchievements = ref<Achievement[]>([])
const achievedKeys = ref<Set<string>>(new Set())
const roadmap = ref<Record<string, RoadmapItem>>({})
const loading = ref(true)
const error = ref<string | null>(null)

const achievementIcons = ref<Record<string, string>>({
  "10_correct_prompts": "mdi-compass",
  "200_correct_prompts": "mdi-arm-flex",
  "500_correct_prompts": "mdi-medal",
  "750_correct_prompts": "mdi-school",
  "1000_correct_prompts": "mdi-brain",
  "1250_correct_prompts": "mdi-wizard-hat",
  "1500_correct_prompts": "mdi-crown",
  "2000_correct_prompts": "mdi-fire",
})

/**
 * ---- Grouping helpers (based on backend naming conventions) ----
 */
const isConjugatorAchievement = (a: Achievement) => {
  const k = (a.criteria_key || "").toLowerCase()

  // cumulative correct thresholds
  if (k.endsWith("_correct_prompts")) return true

  // irregular verbs discovery/mastery tiers
  // e.g. "basic75_discovery_past_simple", "master110_mastery_present_perfect"
  if (k.includes("_discovery_") || k.includes("_mastery_")) return true
  if (k.startsWith("basic75_") || k.startsWith("master110_") || k.startsWith("all_")) return true

  // health tier achievements
  if (k.startsWith("health_tier_")) return true

  return false
}

const isVocabularyAchievement = (a: Achievement) => {
  const k = (a.criteria_key || "").toLowerCase()
  // e.g. vw_write_complete_..., vw_write_complete_3x_..., vw_quiz_perfect20_...
  return k.startsWith("vw_")
}

// Everything automatic that is not conjugator or vocab becomes "Other games"
const conjugatorAchievements = computed(() =>
  automaticAchievements.value.filter(isConjugatorAchievement)
)

const vocabularyAchievements = computed(() =>
  automaticAchievements.value.filter(isVocabularyAchievement)
)

const otherGameAchievements = computed(() =>
  automaticAchievements.value.filter(
    (a) => !isConjugatorAchievement(a) && !isVocabularyAchievement(a)
  )
)

const groupedRoadmap = computed<GroupedRoadmap>(() => {
  const groups: GroupedRoadmap = {}
  for (const [key, item] of Object.entries(roadmap.value)) {
    const category = item.category || "Uncategorized"
    if (!groups[category]) groups[category] = []
    groups[category].push({ key, item })
  }
  return groups
})

const fetchRoadmap = async () => {
  try {
    const res = await fetch("/data/achievements.json")
    roadmap.value = await res.json()
  } catch (err) {
    console.error("Failed to load roadmap:", err)
  }
}

const fetchAchievements = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<Achievement[]>("/achievements/")
    achievements.value = res.data

    // keep your old split (manual achievements power the roadmap checkmarks)
    automaticAchievements.value = res.data
      .filter((a) => String(a.manually_created) === "false")
      .sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime())

    manualAchievements.value = res.data.filter((a) => String(a.manually_created) === "true")
    achievedKeys.value = new Set(manualAchievements.value.map((a) => a.criteria_key))

    await fetchRoadmap()
  } catch (err) {
    console.error("Failed to fetch achievements:", err)
    error.value = "Failed to load achievements."
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

const getCategoryProgress = (category: string) => {
  const items = groupedRoadmap.value[category] || []
  const total = items.length || 0
  const achieved = items.filter(({ key }) => achievedKeys.value.has(key)).length
  const percent = total ? Math.round((achieved / total) * 100) : 0
  return { total, achieved, percent }
}

const getProgressColorClass = (percent: number): string => {
  if (percent >= 100) return "bg-green-lighten-1"
  if (percent >= 75) return "bg-light-green-lighten-2"
  if (percent >= 50) return "bg-light-green-lighten-3"
  if (percent >= 25) return "bg-lime-lighten-4"
  if (percent > 0) return "bg-lime-lighten-5"
  return ""
}

onMounted(() => {
  fetchAchievements()
})

/**
 * (keeping your existing courseProgram bits untouched)
 */
const coursePrograms: Record<string, string> = {
  A: "Architecture",
  M: "Mechanical engineering",
  I: "Computer science",
  E: "Electrical engineering",
  1: "Business English Year",
  2: "Business English Year",
}

const courseProgram = computed(() => {
  const enrolledArray = userStore.enrolledCourses || []
  const enrolled = Array.isArray(enrolledArray) ? enrolledArray.join("") : String(enrolledArray)
  const firstChar = enrolled.charAt(0)
  const firstTwoChars = enrolled.slice(0, 2)

  if (firstTwoChars === "EM") return "Electrical or Mechanical"
  return coursePrograms[firstChar] || null
})
</script>

<style scoped>


.trophy-card {
  position: relative;
  border: 1px solid rgba(212, 175, 55, 0.35);
  background:
    linear-gradient(180deg, #ffffff 0%, #fffaf0 100%);
  box-shadow:
    0 6px 18px rgba(180, 150, 60, 0.12);
}

.trophy-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    linear-gradient(
      120deg,
      transparent 20%,
      rgba(255, 235, 160, 0.35) 40%,
      rgba(255, 215, 120, 0.2) 50%,
      transparent 70%
    );

  opacity: 0.5;
}

.trophy-card .v-card-title {
  color: #b38b00;
  font-weight: 600;
}

.trophy-card .v-icon {
  color: #caa600;
}


.v-list-item-subtitle {
  margin-top: 4px;
}

/* pick one height for all 4 */
.card-fixed {
  height: 520px;      /* or whatever */
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* makes the card body scroll if it overflows */
.card-fixed .v-card-text {
  flex: 1 1 auto;
  overflow: auto;
}

</style>
