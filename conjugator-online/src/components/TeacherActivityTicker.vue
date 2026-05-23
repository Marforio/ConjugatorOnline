<template>
  <!-- Render back as a clean v-sheet with an explicit layout class -->
  <v-sheet
    v-if="userStore.user?.is_staff && displayActivity"
    color="grey-darken-4"
    height="36"
    class="ticker-bar fixed-top-ticker d-flex align-center px-4 border-b pa-0"
  >
    <!-- Fixed Live Badge Indicator -->
    <div class="ticker-badge d-flex align-center mr-4 pl-4">
      <v-badge
        dot
        inline
        color="error"
        class="mr-2 pulse-dot"
      />
      <span class="text-caption font-weight-black text-uppercase text-grey-lighten-1 tracking-wider">
        Live Feed
      </span>
    </div>

    <v-divider vertical class="mx-2 border-opacity-20" color="white" />

    <!-- Moving Track Window Context -->
    <div class="ticker-window flex-grow-1 position-relative overflow-hidden h-100 d-flex align-center">
      <div class="ticker-track d-flex align-center text-body-2 text-white font-weight-medium">
        <v-icon 
          size="16" 
          :color="getActivityColor(displayActivity.last_activity_type)" 
          class="mr-2"
        >
          {{ getActivityIcon(displayActivity.last_activity_type) }}
        </v-icon>
        
        <span class="text-amber-accent-2 font-weight-bold mr-1">
          Student {{ displayActivity.initials }}:
        </span>
        
        <span class="text-grey-lighten-3 mr-2">
          {{ displayActivity.last_activity_name }}
        </span>

        <v-chip
          size="x-small"
          variant="tonal"
          color="grey-lighten-1"
          class="text-caption font-italic ml-1"
        >
          {{ formatSecondsAgo(displayActivity.seconds_ago) }}
        </v-chip>
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/axios';

// Replace this mock with your actual store definition hook
const userStore = {
  user: { is_staff: true }
};

interface OnlineStudent {
  student_id: number;
  initials: string;
  web_id: string;
  last_activity_type: string;
  last_activity_name: string;
  last_seen: string;
  seconds_ago: number;
}

const displayActivity = ref<OnlineStudent | null>(null);
let networkTimer: number | null = null;
let secondsTicker: number | null = null;

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    'conjugation': 'mdi-controller',
    'other_game': 'mdi-gamepad-variant',
    'exercise': 'mdi-weight-lifter',
    'vocab_workout': 'mdi-cards-outline',
    'achievement': 'mdi-trophy',
    'profile_update': 'mdi-account-voice',
    'feedback': 'mdi-comment-alert',
  };
  return icons[type] || 'mdi-lightning-bolt';
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    'conjugation': 'blue-accent-2',
    'other_game': 'purple-accent-2',
    'exercise': 'orange-accent-2',
                'vocab_workout': 'teal-accent-2',
    'achievement': 'amber-accent-2',
    'profile_update': 'indigo-accent-2',
    'feedback': 'red-accent-2',
  };
  return colors[type] || 'white';
}

function formatSecondsAgo(secs: number): string {
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  return `${mins}m ago`;
}

async function fetchLatestPulse() {
  try {
    const response = await api.get('/online-students/');
    const students = response.data.students || [];
    
    if (students.length > 0) {
      displayActivity.value = students[0];
      // 🚀 Dynamically notify the whole DOM that the ticker is active and takes 36px space
      document.documentElement.style.setProperty('--ticker-height', '36px');
    } else {
      displayActivity.value = null;
      document.documentElement.style.setProperty('--ticker-height', '0px');
    }
  } catch (error) {
    console.error('Ticker sync failed:', error);
  }
}

onMounted(() => {
  if (userStore.user?.is_staff) {
    fetchLatestPulse();
    networkTimer = window.setInterval(fetchLatestPulse, 60000);
    secondsTicker = window.setInterval(() => {
      if (displayActivity.value) {
        displayActivity.value.seconds_ago += 1;
      }
    }, 1000);
  }
});

onUnmounted(() => {
  if (networkTimer) clearInterval(networkTimer);
  if (secondsTicker) clearInterval(secondsTicker);
  document.documentElement.style.setProperty('--ticker-height', '0px');
});
</script>

<style scoped>
/* Force the bar to lock at the absolute top layer of the screen viewport */
.fixed-top-ticker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1010; /* Keeps it above standard AppBars but below dialog focus overlays */
  user-select: none;
}

.ticker-badge {
  letter-spacing: 1px;
  white-space: nowrap;
}

.ticker-window {
  width: 100%;
}

.ticker-track {
  position: absolute;
  white-space: nowrap;
  padding-left: 100%;
  animation: ticker-slide 20s linear infinite;
}

.ticker-track:hover {
  animation-play-state: paused;
  cursor: default;
}

@keyframes ticker-slide {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-100%, 0, 0); }
}

.pulse-dot :deep(.v-badge__badge) {
  animation: blink 1.8s infinite ease-in-out;
}

@keyframes blink {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
</style>