<template>
  <v-container fluid class="trophy-room pa-4 pa-sm-6">
    <!-- 2x2 scannable structural grid layout -->
    <v-row class="align-stretch">
      
      <!-- 1) Conjugator achievements -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="3" class="pa-4 mb-6 card-fixed trophy-card border-gold d-flex flex-column">
          <v-card-title class="text-h5 d-flex align-center font-weight-bold pb-3 flex-shrink-0">
            <v-icon size="28" class="me-3 color-gold-icon">mdi-controller</v-icon>
            Conjugator Achievements
          </v-card-title>
          <v-divider class="mb-4 alpha-divider flex-shrink-0" />

          <!-- Inner scroll container boundary tracking block -->
          <v-card-text class="flex-grow-1 overflow-y-auto custom-scroll-container">
            <v-progress-linear v-if="loading" indeterminate color="amber-darken-2" class="mb-4 rounded" height="6" />
            <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4" closable>{{ error }}</v-alert>

            <template v-else>
              <v-list v-if="conjugatorAchievements.length" class="bg-transparent pa-0">
                <template v-for="(achievement, index) in conjugatorAchievements" :key="achievement.id">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-list-item 
                      v-bind="props"
                      class="py-3 px-4 my-1 rounded-lg transition-all"
                      :class="{ 'bg-amber-lighten-5 elevation-1': isHovering }"
                    >
                      <template #prepend>
                        <v-avatar color="amber-lighten-4" class="me-3">
                          <v-icon :icon="achievementIcons[achievement.criteria_key] || 'mdi-star'" color="amber-darken-3" />
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-bold text-wrap text-subtitle-1 text-grey-darken-4">
                        {{ achievement.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-wrap text-body-2 text-grey-darken-1 mt-1">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle class="text-caption text-medium-emphasis mt-2 d-flex align-center">
                        <v-icon size="14" class="me-1">mdi-calendar-check</v-icon>
                        <span>Achieved: <strong>{{ formatDate(achievement.achieved_on) }}</strong></span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-hover>
                  <v-divider v-if="index < conjugatorAchievements.length - 1" class="my-2 opacity-40" />
                </template>
              </v-list>

              <div v-else class="text-center py-12 d-flex flex-column align-center justify-center h-100 opacity-60">
                <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-trophy-outline</v-icon>
                <h3 class="text-h6 font-weight-medium text-grey-darken-2">No conjugator achievements yet</h3>
                <p class="text-caption text-neutral mt-1">Keep practicing variations to unlock milestones!</p>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 2) Vocabulary achievements -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="3" class="pa-4 mb-6 card-fixed trophy-card border-gold d-flex flex-column">
          <v-card-title class="text-h5 d-flex align-center font-weight-bold pb-3 flex-shrink-0">
            <v-icon size="28" class="me-3 color-gold-icon">mdi-cards-outline</v-icon>
            Vocabulary Achievements
          </v-card-title>
          <v-divider class="mb-4 alpha-divider flex-shrink-0" />

          <v-card-text class="flex-grow-1 overflow-y-auto custom-scroll-container">
            <v-progress-linear v-if="loading" indeterminate color="amber-darken-2" class="mb-4 rounded" height="6" />
            <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4" closable>{{ error }}</v-alert>

            <template v-else>
              <v-list v-if="vocabularyAchievements.length" class="bg-transparent pa-0">
                <template v-for="(achievement, index) in vocabularyAchievements" :key="achievement.id">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-list-item 
                      v-bind="props"
                      class="py-3 px-4 my-1 rounded-lg transition-all"
                      :class="{ 'bg-amber-lighten-5 elevation-1': isHovering }"
                    >
                      <template #prepend>
                        <v-avatar color="orange-lighten-4" class="me-3">
                          <v-icon icon="mdi-bookmark-check" color="orange-darken-3" />
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-bold text-wrap text-subtitle-1 text-grey-darken-4">
                        {{ achievement.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-wrap wrap-fix text-body-2 text-grey-darken-1 mt-1">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle class="text-caption text-medium-emphasis mt-2 d-flex align-center">
                        <v-icon size="14" class="me-1">mdi-calendar-check</v-icon>
                        <span>Achieved: <strong>{{ formatDate(achievement.achieved_on) }}</strong></span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-hover>
                  <v-divider v-if="index < vocabularyAchievements.length - 1" class="my-2 opacity-40" />
                </template>
              </v-list>

              <div v-else class="text-center py-12 d-flex flex-column align-center justify-center h-100 opacity-60">
                <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-book-open-blank-variant</v-icon>
                <h3 class="text-h6 font-weight-medium text-grey-darken-2">No vocabulary achievements yet</h3>
                <p class="text-caption text-neutral mt-1">Complete targeted item workouts to reveal badges.</p>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 3) Other game achievements -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="3" class="pa-4 mb-6 mb-lg-0 card-fixed trophy-card border-gold d-flex flex-column">
          <v-card-title class="text-h5 d-flex align-center font-weight-bold pb-3 flex-shrink-0">
            <v-icon size="28" class="me-3 color-gold-icon">mdi-gamepad-circle</v-icon>
            Other Game Achievements
          </v-card-title>
          <v-divider class="mb-4 alpha-divider flex-shrink-0" />

          <v-card-text class="flex-grow-1 overflow-y-auto custom-scroll-container">
            <v-progress-linear v-if="loading" indeterminate color="amber-darken-2" class="mb-4 rounded" height="6" />
            <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4" closable>{{ error }}</v-alert>

            <template v-else>
              <v-list v-if="otherGameAchievements.length" class="bg-transparent pa-0">
                <template v-for="(achievement, index) in otherGameAchievements" :key="achievement.id">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-list-item 
                      v-bind="props"
                      class="py-3 px-4 my-1 rounded-lg transition-all"
                      :class="{ 'bg-amber-lighten-5 elevation-1': isHovering }"
                    >
                      <template #prepend>
                        <v-avatar color="purple-lighten-4" class="me-3">
                          <v-icon icon="mdi-star" color="purple-darken-3" />
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-bold text-subtitle-1 text-grey-darken-4">
                        {{ achievement.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="wrap-fix text-body-2 text-grey-darken-1 mt-1">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle class="text-caption text-medium-emphasis mt-2 d-flex align-center">
                        <v-icon size="14" class="me-1">mdi-calendar-check</v-icon>
                        <span>Achieved: <strong>{{ formatDate(achievement.achieved_on) }}</strong></span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-hover>
                  <v-divider v-if="index < otherGameAchievements.length - 1" class="my-2 opacity-40" />
                </template>
              </v-list>

              <div v-else class="text-center py-12 d-flex flex-column align-center justify-center h-100 opacity-60">
                <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-gamepad-variant-outline</v-icon>
                <h3 class="text-h6 font-weight-medium text-grey-darken-2">No alternative game achievements yet</h3>
                <p class="text-caption text-neutral mt-1">Unlock badges by exploring additional modules.</p>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 4) Roadmap -->
      <v-col cols="12" lg="6" class="d-flex">
        <v-card elevation="3" class="pa-4 card-fixed trophy-card border-gold d-flex flex-column">
          <div class="flex-shrink-0">
            <v-card-title class="text-h5 d-flex align-center font-weight-bold pb-1">
              <v-icon size="28" class="me-3 color-gold-icon">mdi-road-variant</v-icon>
              Roadmap to Advanced Level
            </v-card-title>

            <v-card-subtitle class="mb-3 text-wrap text-caption text-medium-emphasis">
              Milestones reached in SPEAKING exercises without reading from notes
            </v-card-subtitle>
            <v-divider class="mb-4 alpha-divider" />
          </div>

          <v-card-text class="flex-grow-1 overflow-y-auto custom-scroll-container">
            <v-expansion-panels multiple variant="accordion" class="custom-panels">
              <v-expansion-panel
                v-for="(items, category) in groupedRoadmap"
                :key="category"
                :class="getProgressColorClass(getCategoryProgress(String(category)).percent)"
                class="mb-2 rounded border"
              >
                <v-expansion-panel-title class="font-weight-bold">
                  <div class="d-flex align-center justify-space-between w-100 pe-4">
                    <span>{{ category }}</span>
                    <v-chip 
                      size="small" 
                      variant="flat" 
                      :color="getCategoryProgress(String(category)).percent === 100 ? 'success' : 'amber-darken-2'"
                      class="font-weight-bold text-caption"
                    >
                      {{ getCategoryProgress(String(category)).percent }}% Done
                    </v-chip>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="bg-white border-top pa-0">
                  <v-list class="pa-0">
                    <v-list-item v-for="{ key, item } in items" :key="key" class="py-3 px-4 border-bottom">
                      <div class="d-flex align-start w-100">
                        <v-icon
                          class="me-3 mt-1"
                          size="22"
                          :color="achievedKeys.has(key) ? 'success' : 'grey-lighten-1'"
                        >
                          {{ achievedKeys.has(key) ? "mdi-checkbox-marked-circle" : "mdi-radiobox-blank" }}
                        </v-icon>
                        
                        <div class="flex-grow-1">
                          <h4 class="font-weight-bold text-subtitle-2 text-grey-darken-4">
                            {{ item.pretty_title }}
                          </h4>
                          <p class="text-caption text-grey-darken-1 mt-1 text-wrap line-height-sm">
                            {{ item.description }}
                          </p>
                        </div>
                      </div>
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

const isConjugatorAchievement = (a: Achievement) => {
  const k = (a.criteria_key || "").toLowerCase()
  if (k.endsWith("_correct_prompts")) return true
  if (k.includes("_discovery_") || k.includes("_mastery_")) return true
  if (k.startsWith("basic75_") || k.startsWith("master110_") || k.startsWith("all_")) return true
  if (k.startsWith("health_tier_")) return true
  return false
}

const isVocabularyAchievement = (a: Achievement) => {
  const k = (a.criteria_key || "").toLowerCase()
  return k.startsWith("vw_")
}

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
    const params: any = {}
    
    // ==========================================
    // 🎯 TAILORED LOOKUP RESTRICTION INJECTED HERE
    // ==========================================
    if (userStore.isStaff) {
      params.student = userStore.studentId
    }

    const res = await api.get<Achievement[]>("/achievements/", { params })
    achievements.value = res.data

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
  if (!dateStr) return "—"
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
  if (percent >= 100) return "status-complete"
  if (percent >= 75) return "status-high"
  if (percent >= 50) return "status-mid"
  if (percent >= 25) return "status-low"
  return "status-started"
}

onMounted(() => {
  fetchAchievements()
})

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
  border-radius: 12px !important;
  background: linear-gradient(180deg, #ffffff 0%, #fffcf5 100%) !important;
  box-shadow: 0 4px 20px rgba(200, 160, 40, 0.08) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.border-gold {
  border: 1px solid rgba(218, 165, 32, 0.3) !important;
}

.alpha-divider {
  border-color: rgba(218, 165, 32, 0.15) !important;
}

.color-gold-icon {
  color: #caa600 !important;
}

.trophy-card .v-card-title {
  color: #a37f00;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.line-height-sm {
  line-height: 1.4 !important;
}

.border-top {
  border-top: 1px solid #f0f0f0 !important;
}

.border-bottom {
  border-bottom: 1px solid #f5f5f5 !important;
}
.border-bottom:last-child {
  border-bottom: none !important;
}

/* Roadmap expansion panel contextual alerts styles mapping options */
.status-complete { background-color: #e8f5e9 !important; border-color: #c8e6c9 !important; }
.status-high { background-color: #f1f8e9 !important; border-color: #dcedc8 !important; }
.status-mid { background-color: #f9fbe7 !important; border-color: #f0f4c3 !important; }
.status-low { background-color: #fffde7 !important; border-color: #fff9c4 !important; }
.status-started { background-color: #fff8e1 !important; border-color: #ffecb3 !important; }

.custom-panels :deep(.v-expansion-panel-title) {
  padding: 12px 16px !important;
  min-height: 48px !important;
}

.card-fixed {
  height: 540px !important;
  width: 100%;
}

.card-fixed .v-card-text {
  flex: 1 1 auto;
  overflow-y: auto;
}

.wrap-fix { 
  white-space: normal !important; 
}
</style>