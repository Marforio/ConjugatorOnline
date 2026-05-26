<template>
  <v-app-bar flat class="border-b px-4 layout-nav-header bg-white" app>
    <div class="d-flex align-center flex-shrink-0">
      <v-btn
        v-if="showMenuButton"
        icon="mdi-menu"
        variant="text"
        color="slate-700"
        class="mr-2"
        @click="$emit('update:drawer', !drawer)"
      />

      <v-toolbar-title class="text-body-1 font-weight-bold text-slate-700 d-none d-sm-flex align-center">
        <v-icon size="18" class="mr-2" color="slate-400">mdi-school</v-icon>
        Teacher Dashboard
      </v-toolbar-title>
    </div>

    <div
      v-if="auth.isLoggedIn && userStore.isStaff"
      class="ticker-nav-wrapper d-none d-md-flex align-center mx-auto"
    >
      <div class="ticker-nav-container d-flex align-center rounded-pill px-4">
        <template v-if="displayActivity">
          <div class="ticker-badge-pulse active mr-3"></div>
          <div class="ticker-window-viewport">
            <div class="ticker-track-strip text-caption font-weight-medium text-white">
              <v-icon
                size="14"
                :color="getActivityColor(displayActivity.last_activity_type)"
                class="mr-1"
              >
                {{ getActivityIcon(displayActivity.last_activity_type) }}
              </v-icon>
              <span class="text-amber-accent-2 font-weight-bold mr-1">
                Student {{ displayActivity.initials }}:
              </span>
              <span class="text-grey-lighten-4 mr-2">
                {{ displayActivity.last_activity_name }}
              </span>
              <span class="text-grey-lighten-1 font-italic font-weight-light">
                ({{ formatSecondsAgo(displayActivity.seconds_ago) }})
              </span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="ticker-badge-pulse idle mr-3"></div>
          <span class="text-caption font-weight-medium text-grey-lighten-1 italic-label">
            No active students tracked within last 5m
          </span>
        </template>
      </div>
    </div>

    <div class="d-flex align-center flex-shrink-0 ml-auto">
      <span v-if="auth.isLoggedIn" class="text-body-2 text-slate-600 font-weight-medium mr-4">
        Hello <InitialsText />
      </span>
      <LogOutButton v-if="auth.isLoggedIn" variant="tonal" density="comfortable" color="slate-600" />
      <v-btn v-else :to="{ name: 'login' }" color="primary" variant="flat" class="rounded-lg px-4">
        Log in
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import api from '@/axios';
import InitialsText from './InitialsText.vue';
import LogOutButton from './LogOutButton.vue';

interface OnlineStudent {
  student_id: number;
  initials: string;
  web_id: string;
  last_activity_type: string;
  last_activity_name: string;
  last_seen: string;
  seconds_ago: number;
}

export default defineComponent({
  name: "TopNavBar",
  components: {
    InitialsText,
    LogOutButton,
  },
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
    showMenuButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:drawer'],
  setup() {
    const auth = useAuthStore();
    const userStore = useUserStore();

    const displayActivity = ref<OnlineStudent | null>(null);
    let networkTimer: number | null = null;
    let secondsTicker: number | null = null;

    function getActivityIcon(type: string): string {
      const icons: Record<string, string> = {
        conjugation: 'mdi-controller',
        other_game: 'mdi-gamepad-variant',
        exercise: 'mdi-weight-lifter',
        vocab_workout: 'mdi-cards-outline',
        achievement: 'mdi-trophy',
        profile_update: 'mdi-account-voice',
        feedback: 'mdi-comment-alert',
      };
      return icons[type] || 'mdi-lightning-bolt';
    }

    function getActivityColor(type: string): string {
      const colors: Record<string, string> = {
        conjugation: 'blue-accent-2',
        other_game: 'purple-accent-2',
        exercise: 'orange-accent-2',
        vocab_workout: 'teal-accent-2',
        achievement: 'amber-accent-2',
        profile_update: 'indigo-accent-2',
        feedback: 'red-accent-2',
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
        displayActivity.value = students.length > 0 ? students[0] : null;
      } catch (error) {
        console.error('Integrated header pulse fail:', error);
      }
    }

    function initTickerTimers() {
      if (auth.isLoggedIn && userStore.isStaff) {
        fetchLatestPulse();
        if (!networkTimer) networkTimer = window.setInterval(fetchLatestPulse, 60000);
        if (!secondsTicker) {
          secondsTicker = window.setInterval(() => {
            if (displayActivity.value) displayActivity.value.seconds_ago += 1;
          }, 1000);
        }
      } else {
        clearTickerTimers();
      }
    }

    function clearTickerTimers() {
      if (networkTimer) { clearInterval(networkTimer); networkTimer = null; }
      if (secondsTicker) { clearInterval(secondsTicker); secondsTicker = null; }
      displayActivity.value = null;
    }

    watch(() => auth.isLoggedIn, () => { initTickerTimers(); });

    onMounted(() => { initTickerTimers(); });
    onUnmounted(() => { clearTickerTimers(); });

    return {
      auth,
      userStore,
      displayActivity,
      getActivityIcon,
      getActivityColor,
      formatSecondsAgo
    };
  },
});
</script>

<style scoped>
.layout-nav-header {
  border-color: #e2e8f0 !important;
}

.ticker-nav-wrapper {
  flex-grow: 1;
  max-width: 440px;
  min-width: 360px;
}

.ticker-nav-container {
  background-color: #1e293b;
  border: 1px solid #334155;
  height: 34px;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ticker-window-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.ticker-track-strip {
  position: absolute;
  white-space: nowrap;
  padding-left: 100%;
  animation: inline-navbar-slide 16s linear infinite;
}

.ticker-track-strip:hover {
  animation-play-state: paused;
}

@keyframes inline-navbar-slide {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-100%, 0, 0); }
}

.ticker-badge-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ticker-badge-pulse.active {
  background-color: #ef4444;
  animation: ticker-pulse-glow 1.4s infinite ease-in-out;
}

.ticker-badge-pulse.idle {
  background-color: #64748b;
}

.italic-label {
  font-style: italic;
}

@keyframes ticker-pulse-glow {
  0% { opacity: 0.3; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
  100% { opacity: 0.3; transform: scale(0.85); }
}

.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
</style>