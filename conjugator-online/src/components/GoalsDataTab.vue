<template>
  <v-container fluid>
    <v-row>
      <!-- Achievements Card -->
      <v-col cols="12" lg="6">
        <v-card elevation="2" class="pa-4 mb-6">
          <v-card-title class="text-h5">
            <v-icon class="me-3">mdi-trophy</v-icon>Achievements in the Conjugator
          </v-card-title>
          <v-card-text>
            <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
            <v-alert v-else-if="error" type="error" class="mb-4">
              {{ error }}
            </v-alert>
            <v-list v-else>
              <v-list-item
                v-for="(achievement, index) in automaticAchievements"
                :key="achievement.id"
                class="mb-4"
              >
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">
                    {{ achievement.name }}
                    <v-icon class="m-2" :icon="achievementIcons[achievement.criteria_key] || 'mdi-trophy'" />
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ achievement.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong>Achieved on:</strong> {{ formatDate(achievement.achieved_on) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-divider v-if="index < automaticAchievements.length - 1" class="my-4" />
              </v-list-item>
              
            </v-list>

            <div v-if="manualAchievements.length === 0 && automaticAchievements.length === 0" class="text-center mt-8">
              <h2 class="text-h6">No achievements yet</h2>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Roadmap Card -->
      <v-col cols="12" lg="6">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h5 mb-6">
            <v-icon class="me-3">mdi-road-variant</v-icon>Roadmap to advanced level
          </v-card-title>
          <v-card-text>
            <v-expansion-panels multiple>
              <v-expansion-panel
                v-for="(items, category) in groupedRoadmap"
                :key="category"
                :class="getProgressColorClass(getCategoryProgress(String(category)).percent)"
              >
                <v-expansion-panel-title>
                  {{ category }} — <span class="ms-2 text-caption"> {{ getCategoryProgress(String(category)).percent }}% complete</span> <span class="ms-3" v-if="getCategoryProgress(String(category)).percent === 100">Done! Great job!</span><span class="ms-3" v-else-if="getCategoryProgress(String(category)).percent > 75">Almost there!</span>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-list>
                    <v-list-item
                      v-for="{ key, item } in items"
                      :key="key"
                    >
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-medium">
                          {{ item.pretty_title }}
                        </v-list-item-title>
                        <v-list-item>
                          <v-icon class="me-2" :color="achievedKeys.has(key) ? 'green-accent-4' : 'grey'">
                            {{ achievedKeys.has(key) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
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
import { ref, onMounted, computed } from 'vue'
import api from "@/axios"

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
  "2000_correct_prompts": "mdi-fire"
})

const groupedRoadmap = computed<GroupedRoadmap>(() => {
  const groups: GroupedRoadmap = {}
  for (const [key, item] of Object.entries(roadmap.value)) {
    const category = item.category || 'Uncategorized'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push({ key, item })
  }
  return groups
})

const fetchAchievements = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<Achievement[]>('/achievements/')
    achievements.value = res.data
    automaticAchievements.value = res.data
      .filter(a => String(a.manually_created) === 'false')
      .sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime())

    manualAchievements.value = res.data.filter(a => String(a.manually_created) === 'true')
    achievedKeys.value = new Set(manualAchievements.value.map(a => a.criteria_key))
    await fetchRoadmap()
  } catch (err) {
    console.error('Failed to fetch achievements:', err)
    error.value = 'Failed to load achievements.'
  } finally {
    loading.value = false
  }
}

const fetchRoadmap = async () => {
  try {
    const res = await fetch('/data/achievements.json')
    roadmap.value = await res.json()
  } catch (err) {
    console.error('Failed to load roadmap:', err)
  }
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getCategoryProgress = (category: string) => {
  const items = groupedRoadmap.value[category]
  const total = items.length
  const achieved = items.filter(({ key }) => achievedKeys.value.has(key)).length
  const percent = Math.round((achieved / total) * 100)
  return { total, achieved, percent }
}
const getProgressColorClass = (percent: number): string => {
  if (percent >= 100) return 'bg-green-lighten-1'
  if (percent >= 75) return 'bg-light-green-lighten-2'
  if (percent >= 50) return 'bg-light-green-lighten-3'
  if (percent >= 25) return 'bg-lime-lighten-4'
  if (percent > 0) return 'bg-lime-lighten-5'
  return ''
}


onMounted(() => {
  fetchAchievements()
})

</script>

<style scoped>
.v-list-item-subtitle {
  margin-top: 4px;
}

</style>
