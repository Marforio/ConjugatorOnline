<template>
  <v-container fluid>
    <v-card elevation="2" class="pa-4">
      <v-card-title class="text-h5">Achievements</v-card-title>

      <v-card-text>
        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

        <v-alert v-else-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <v-list v-else>
          <v-list-item
            v-for="achievement in achievements"
            :key="achievement.id"
            class="mb-4"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ achievement.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ achievement.description }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <strong>Achieved on:</strong> {{ formatDate(achievement.achieved_on) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <div v-if="achievements.length === 0" class="text-center mt-8">
          <h2 class="text-h6">No achievements yet</h2>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import api from "@/axios";

interface Achievement {
  id: number
  student: number
  student_username: string
  name: string
  description: string
  criteria_key: string
  achieved_on: string
  manually_created: boolean
}

const achievements = ref<Achievement[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchAchievements = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<Achievement[]>('/achievements/')
    achievements.value = res.data
  } catch (err) {
    console.error('Failed to fetch achievements:', err)
    error.value = 'Failed to load achievements.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
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
