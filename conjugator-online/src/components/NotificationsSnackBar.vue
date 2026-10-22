<template>
  <div>
    <!-- Snackbar for new notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="10000"
      location="top right"
      :color="snackbarColor(currentNotification?.notification_type)"
      elevation="8"
      rounded="lg"
      multi-line
    >
      <!-- clickable content -->
      <div
        class="d-flex align-items-start clickable-snackbar"
        role="button"
        tabindex="0"
        @click="openNotificationTarget"
        @keydown.enter.prevent="openNotificationTarget"
        @keydown.space.prevent="openNotificationTarget"
      >
        <v-icon size="32" class="mr-3">
          {{ getNotificationIcon(currentNotification?.notification_type) }}
        </v-icon>
        <div class="flex-grow-1">
          <div class="text-subtitle-1 font-weight-bold">
            {{ currentNotification?.title }}
          </div>
          <div class="text-body-2 mt-1">
            {{ currentNotification?.message }}
          </div>
          <div class="text-caption mt-2 text-white">
            Click to open
          </div>
        </div>
      </div>

      <template v-slot:actions>
        <v-btn variant="text" size="small" @click="viewDetails">View</v-btn>
        <v-btn variant="text" size="small" icon="mdi-close" @click="dismissSnackbar" />
      </template>
    </v-snackbar>

    <!-- Details Dialog -->
    <v-dialog v-model="showDialog" max-width="500" :scrim="true">
      <v-card v-if="currentNotification" rounded="lg">
        <v-card-title class="d-flex align-items-center pa-6 pb-4">
          <v-icon
            size="40"
            :color="currentNotification.notification_type === 'achievement' ? 'amber' : 'success'"
            class="mr-3"
          >
            {{ getNotificationIcon(currentNotification.notification_type) }}
          </v-icon>
          <span>{{ currentNotification.title }}</span>
        </v-card-title>

        <v-card-text class="pa-6 pt-2">
          <div class="text-body-1">{{ currentNotification.message }}</div>
          <div class="text-caption text-medium-emphasis mt-4">
            <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
            {{ formatDate(currentNotification.created_at) }}
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn color="secondary" variant="elevated" @click="openNotificationTarget">
            Open
          </v-btn>
          <v-spacer />
          <v-btn color="primary" variant="elevated" @click="closeDialog">Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNotificationStore } from '@/stores/notifications';
import { useRouter } from 'vue-router';

const router = useRouter();
const notificationStore = useNotificationStore();

const showSnackbar = ref(false);
const showDialog = ref(false);
const currentNotification = ref<any>(null);
const notificationQueue = ref<any[]>([]);
const isShowingNotification = ref(false);

watch(
  () => notificationStore.unreadNotifications,
  (newNotifications, oldNotifications) => {
    const oldIds = new Set(oldNotifications?.map(n => n.id) || []);
    const newOnes = newNotifications.filter(n => !oldIds.has(n.id));
    if (newOnes.length > 0) {
      notificationQueue.value.push(...newOnes);
      if (!isShowingNotification.value) showNextNotification();
    }
  },
  { deep: true }
);

function showNextNotification() {
  if (notificationQueue.value.length === 0) {
    isShowingNotification.value = false;
    return;
  }
  isShowingNotification.value = true;
  currentNotification.value = notificationQueue.value.shift();
  showSnackbar.value = true;

  setTimeout(() => {
    if (currentNotification.value) notificationStore.markAsRead(currentNotification.value.id);
  }, 1000);
}

function viewDetails() {
  showSnackbar.value = false;
  showDialog.value = true;
}

function dismissSnackbar() {
  showSnackbar.value = false;
  if (currentNotification.value) notificationStore.dismiss(currentNotification.value.id);
  setTimeout(showNextNotification, 500);
}

function closeDialog() {
  showDialog.value = false;
  currentNotification.value = null;
  setTimeout(showNextNotification, 500);
}

function snackbarColor(type?: string) {
  if (type === 'achievement') return 'amber-darken-2';
  if (type?.startsWith('tournament_')) return 'deep-purple-darken-1';
  return 'success';
}

function openNotificationTarget() {
  const n = currentNotification.value;
  if (!n) return;

  showSnackbar.value = false;
  showDialog.value = false;

  // Route by type; tournament takes priority if present
  if (n.tournament) {
    router.push({ name: 'TournamentView', params: { id: n.tournament } });
  } else if (n.notification_type === 'achievement') {
    router.push({ path: '/dashboard', query: { tab: 'goals' } });
  } else {
    router.push({ path: '/dashboard' });
  }

  currentNotification.value = null;
  setTimeout(showNextNotification, 500);
}

function getNotificationIcon(type: string | undefined): string {
  const icons: Record<string, string> = {
    achievement: 'mdi-trophy',
    assignment_completed: 'mdi-check-circle',
    feedback_received: 'mdi-comment-alert',
    profile_updated: 'mdi-account-voice',
    tournament_invite: 'mdi-tournament',
    tournament_started: 'mdi-sitemap',
    tournament_round: 'mdi-sword-cross',
    tournament_result: 'mdi-podium-gold',
  };
  return icons[type || ''] || 'mdi-bell';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.clickable-snackbar {
  cursor: pointer;
}
.clickable-snackbar:hover {
  opacity: 0.95;
}
</style>