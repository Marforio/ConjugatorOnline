<template>
    <!-- Navigation Drawer for Mobile -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      class="d-sm-none"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title>Hello <InitialsText /></v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item :to="{ name: 'home' }">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item href="https://book.language-labs.ch" target='_blank'>
          <v-list-item-title>Grammar Book</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'dashboard' }">
          <v-list-item-title>My Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'vocabworkout' }">
          <v-list-item-title>Vocab Workout</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'exercises' }" :disabled="true">
          <v-list-item-title>Exercises</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'conjugator' }">
          <v-list-item-title>Conjugator Game</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'games' }">
          <v-list-item-title>Other Games</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'tools' }">
          <v-list-item-title>Tools</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-if="auth.isLoggedIn && userStore.isStaff"
          :to="{ name: 'teacher-tools' }"
        >
          <v-list-item-title>Teacher Tools</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <LogOutButton />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app>
      <!-- Mobile Nav Icon -->
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="d-sm-none"
      />

      <!-- Title -->
      <v-btn :to="{ name: 'home' }" class="text-none ms-4 flex-shrink-0">
        <v-app-bar-title>Language Labs</v-app-bar-title>
      </v-btn>

      <!-- 🚀 CENTER TICKER CONTAINER: Always maps for logged-in teacher accounts -->
      <div 
        v-if="auth.isLoggedIn && userStore.isStaff" 
        class="ticker-nav-wrapper d-none d-md-flex align-center mx-4"
      >
        <div class="ticker-nav-container d-flex align-center rounded-pill px-4">
          <!-- Condition A: Real-time Student tracking info rolling -->
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

          <!-- Condition B: Diagnostic check verification when classroom engine is idle -->
          <template v-else>
            <div class="ticker-badge-pulse idle mr-3"></div>
            <span class="text-caption font-weight-medium text-grey-lighten-1 italic">
              No student activity recorded in last 5m
            </span>
          </template>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Desktop Icons -->
      <div class="d-none d-sm-flex px-6 m-4 flex-shrink-0 align-center">
        <v-tooltip text="Home" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'home' }">
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Grammar Book" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" href="https://book.language-labs.ch" target='_blank'>
              <v-icon>mdi-book-open-variant</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Grammar exercises" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'exercises' }" :disabled="true">
              <v-icon>mdi-weight-lifter</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Conjugator Game" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'conjugator' }">
              <v-icon>mdi-controller</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Other Games" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'games' }" >
              <v-icon>mdi-gamepad-circle</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Vocab Workout" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'vocabworkout' }" >
              <v-icon>mdi-cards-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Classroom tools" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'tools' }" >
              <v-icon>mdi-tools</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="My dashboard" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'dashboard' }">
              <v-icon>mdi-chart-bar</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip
          v-if="auth.isLoggedIn && userStore.isStaff"
          text="Teacher Tools Menu"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'teacher' }">
              <v-icon>mdi-school</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <span v-if="auth.isLoggedIn" style="align-self: center; margin-left: 30px; margin-right: 30px;">Hello <InitialsText /></span>
      </div>
        
      <div v-if="auth.isLoggedIn" class="flex-shrink-0"><LogOutButton /></div>
      <div v-else class="flex-shrink-0">
        <v-btn :to="{ name: 'login' }" color="primary" variant="tonal" class="px-4 m-4">Log in</v-btn>
      </div>
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useDisplay } from "vuetify";
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
  setup() {
    const auth = useAuthStore();
    const userStore = useUserStore();
    const { smAndDown } = useDisplay();
    const drawer = ref(false);
    
    // Ticker Reactivity Core
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
        'conjugation': 'blue-darken-2',
        'other_game': 'purple-darken-2',
        'exercise': 'orange-darken-3',
        'vocab_workout': 'teal-darken-2',
        'achievement': 'amber-darken-3',
        'profile_update': 'indigo-darken-2',
        'feedback': 'red-darken-2',
      };
      return colors[type] || 'grey-darken-3';
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
        } else {
          displayActivity.value = null;
        }
      } catch (error) {
        console.error('Integrated navbar ticker synchronization failure:', error);
      }
    }

    // Handle timer context initialization depending on permissions state
    function initTickerTimers() {
      if (auth.isLoggedIn && userStore.isStaff) {
        fetchLatestPulse();
        
        if (!networkTimer) {
          networkTimer = window.setInterval(fetchLatestPulse, 60000);
        }
        if (!secondsTicker) {
          secondsTicker = window.setInterval(() => {
            if (displayActivity.value) {
              displayActivity.value.seconds_ago += 1;
            }
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

    // Watch login changes to initialize/clear loops cleanly
    watch(() => auth.isLoggedIn, () => { initTickerTimers(); });

    onMounted(() => {
      initTickerTimers();
    });

    onUnmounted(() => {
      clearTickerTimers();
    });

    return { 
      auth, 
      userStore, 
      drawer, 
      displayActivity,
      getActivityIcon,
      getActivityColor,
      formatSecondsAgo
    };
  },
});
</script>

<style scoped>
/* Isolation wrapper block keeping dimensions secure within header layouts */
.ticker-nav-wrapper {
  flex-grow: 1;
  max-width: 440px; 
  min-width: 360px;
}

/* Deep slate/dark grey capsule background styling */
.ticker-nav-container {
  background-color: #212121; /* Dark charcoal tone matching grey-darken-4 themes */
  border: 1px solid #424242;
  height: 34px;
  width: 100%;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* Moving animation canvas view block */
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

/* Live blinking broadcast dot indicator types */
.ticker-badge-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ticker-badge-pulse.active {
  background-color: #ff5252; /* Vivid Red */
  animation: ticker-pulse-glow 1.4s infinite ease-in-out;
}

.ticker-badge-pulse.idle {
  background-color: #757575; /* Flat Grey indicator */
}

@keyframes ticker-pulse-glow {
  0% { opacity: 0.3; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
  100% { opacity: 0.3; transform: scale(0.85); }
}
</style>