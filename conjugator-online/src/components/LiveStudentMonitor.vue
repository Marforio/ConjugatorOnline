<!-- LiveStudentMonitor.vue -->
<template>
  <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <div class="text-h5 font-weight-bold">
          <v-icon class="mr-2" :color="isPolling ? 'success' : 'grey'">
            {{ isPolling ? 'mdi-wifi' : 'mdi-wifi-off' }}
          </v-icon>
          Live Activity Monitor
        </div>
        <div class="text-caption text-medium-emphasis">
          Updates every {{ pollInterval / 1000 }} seconds
          • Last update: {{ formatLastUpdate }}
        </div>
      </div>
      
      <!-- Toggle polling on/off -->
      <v-btn
        :color="isPolling ? 'error' : 'success'"
        size="small"
        @click="togglePolling"
      >
        {{ isPolling ? 'Pause' : 'Resume' }}
      </v-btn>
    </div>

    <!-- Online Student Count -->
    <v-alert
      :type="onlineStudents.length > 0 ? 'success' : 'info'"
      variant="tonal"
      class="mb-4"
    >
      <div class="d-flex align-center">
        <v-icon size="32" class="mr-3">mdi-account-multiple</v-icon>
        <div>
          <div class="text-h6">
            {{ onlineStudents.length }} student{{ onlineStudents.length !== 1 ? 's' : '' }} online
          </div>
          <div class="text-caption">
            Active in the last 5 minutes
          </div>
        </div>
      </div>
    </v-alert>

    <!-- Student Grid -->
    <div v-if="onlineStudents.length > 0">
      <div class="text-subtitle-2 mb-3">Currently Active Students</div>
      
      <v-row dense>
        <v-col
          v-for="student in onlineStudents"
          :key="student.student_id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            variant="outlined"
            :class="['student-card', getActivityClass(student.seconds_ago)]"
          >
            <v-card-text class="pa-3">
              <div class="d-flex align-items-center">
                <!-- Avatar -->
                <v-avatar
                  :color="getActivityColor(student.last_activity_type)"
                  size="40"
                  class="mr-3"
                >
                  <span class="text-white font-weight-bold">
                    {{ student.initials }}
                  </span>
                </v-avatar>

                <!-- Info -->
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ student.initials }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ student.web_id }}
                  </div>
                </div>

                <!-- Activity indicator -->
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <v-icon
                        :color="getActivityColor(student.last_activity_type)"
                        size="24"
                      >
                        {{ getActivityIcon(student.last_activity_type) }}
                      </v-icon>
                    </div>
                  </template>
                  <span>{{ student.last_activity_name }}</span>
                </v-tooltip>
              </div>

              <!-- Time indicator -->
              <div class="mt-2">
                <v-chip
                  size="x-small"
                  :color="getTimeChipColor(student.seconds_ago)"
                  variant="tonal"
                >
                  <v-icon start size="12">mdi-clock-outline</v-icon>
                  {{ formatSecondsAgo(student.seconds_ago) }}
                </v-chip>
              </div>

              <!-- What they're doing -->
              <div class="text-caption text-medium-emphasis mt-2">
                {{ student.last_activity_name }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
      <div class="text-h6 mt-4 text-medium-emphasis">No students online</div>
      <div class="text-body-2 text-medium-emphasis">
        Students will appear here when they start practicing
      </div>
    </div>

    <!-- Recent Activity Feed (last 20 activities) -->
    <v-divider class="my-6" />
    
    <div class="text-subtitle-2 mb-3">Recent Activity (Last 5 minutes)</div>
    
    <v-timeline v-if="recentActivities.length > 0" density="compact" side="end">
      <v-timeline-item
        v-for="(activity, i) in recentActivities.slice(0, 20)"
        :key="i"
        :dot-color="getActivityColor(activity.activity_type)"
        size="small"
      >
        <template v-slot:icon>
          <v-icon size="12">{{ getActivityIcon(activity.activity_type) }}</v-icon>
        </template>
        
        <div class="d-flex align-items-center justify-space-between">
          <div class="text-caption">
            <strong>{{ activity.student_initials }}</strong>
            • {{ activity.description }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ formatTimeAgo(activity.timestamp) }}
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>

    <div v-else class="text-center pa-4 text-caption text-medium-emphasis">
      No recent activity
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/axios';

interface OnlineStudent {
  student_id: number;
  initials: string;
  web_id: string;
  last_activity_type: string;
  last_activity_name: string;
  last_seen: string;
  seconds_ago: number;
}

interface RecentActivity {
  id: number;
  student_initials: string;
  activity_type: string;
  activity_name: string;
  description: string;
  timestamp: string;
}

const onlineStudents = ref<OnlineStudent[]>([]);
const recentActivities = ref<RecentActivity[]>([]);
const lastUpdate = ref<Date | null>(null);
const isPolling = ref(true);
const pollInterval = ref(10000); // 10 seconds
let pollTimer: number | null = null;

const formatLastUpdate = computed(() => {
  if (!lastUpdate.value) return 'Never';
  
  const now = new Date();
  const diff = Math.floor((now.getTime() - lastUpdate.value.getTime()) / 1000);
  
  if (diff < 5) return 'Just now';
  if (diff < 60) return `${diff} seconds ago`;
  return lastUpdate.value.toLocaleTimeString();
});

async function fetchOnlineStudents() {
  try {
    const response = await api.get('/online-students/');
    
    onlineStudents.value = response.data.students;
    lastUpdate.value = new Date();
    
    console.log(`[Polling] ${onlineStudents.value.length} students online`);
  } catch (error) {
    console.error('Failed to fetch online students:', error);
  }
}

async function fetchRecentActivities() {
  try {
    const response = await api.get('/student-activities/', {
      params: {
        limit: 50,
        // Only get last 5 minutes
        days: 1, // Still need to pass days param, will filter on client
      }
    });
    
    // Filter to only last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    recentActivities.value = response.data.filter((a: any) => {
      return new Date(a.timestamp) >= fiveMinutesAgo;
    });
  } catch (error) {
    console.error('Failed to fetch recent activities:', error);
  }
}

async function poll() {
  if (!isPolling.value) return;
  
  await Promise.all([
    fetchOnlineStudents(),
    fetchRecentActivities(),
  ]);
}

function startPolling() {
  // Initial fetch
  poll();
  
  // Set up interval
  pollTimer = window.setInterval(poll, pollInterval.value);
  isPolling.value = true;
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  isPolling.value = false;
}

function togglePolling() {
  if (isPolling.value) {
    stopPolling();
  } else {
    startPolling();
  }
}

// Helper functions
function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    'conjugation': 'mdi-controller',
    'other_game': 'mdi-gamepad-variant',
    'exercise': 'mdi-weight-lifter',
    'vocab_workout': 'mdi-cards-outline',
    'achievement': 'mdi-trophy',
    'workout_drill': 'mdi-clipboard-check',
    'feedback': 'mdi-comment-alert',
    'profile_update': 'mdi-account-voice',
  };
  return icons[type] || 'mdi-circle';
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    'conjugation': 'blue',
    'other_game': 'purple',
    'exercise': 'orange',
    'vocab_workout': 'teal',
    'achievement': 'amber',
    'workout_drill': 'green',
    'feedback': 'red',
    'profile_update': 'indigo',
  };
  return colors[type] || 'grey';
}

function getActivityClass(secondsAgo: number): string {
  if (secondsAgo < 60) return 'active-now';
  if (secondsAgo < 180) return 'active-recent';
  return 'active-idle';
}

function getTimeChipColor(secondsAgo: number): string {
  if (secondsAgo < 60) return 'success';
  if (secondsAgo < 180) return 'warning';
  return 'grey';
}

function formatSecondsAgo(seconds: number): string {
  if (seconds < 10) return 'now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 300) return `${Math.floor(diffSec / 60)}m ago`;
  
  return date.toLocaleTimeString();
}

onMounted(() => {
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped>
.student-card {
  transition: all 0.3s ease;
}

.student-card.active-now {
  border-color: #4caf50;
  border-width: 2px;
}

.student-card.active-recent {
  border-color: #ff9800;
}

.student-card.active-idle {
  opacity: 0.7;
}
</style>