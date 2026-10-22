<template>
  <v-container class="pa-6 arena-bg" fluid>
    <div class="mx-auto" style="max-width: 960px">
      <!-- Connection banner -->
      <v-slide-y-transition>
        <v-alert v-if="store.wsStatus !== 'open'" :type="store.wsStatus === 'closed' ? 'error' : 'warning'"
                 variant="tonal" rounded="xl" class="mb-4" density="compact">
          <template v-if="store.wsStatus === 'closed'">Disconnected. {{ store.lastError }}</template>
          <template v-else>
            <v-progress-circular size="16" width="2" indeterminate class="mr-2" />
            {{ store.wsStatus === 'reconnecting' ? 'Reconnecting…' : 'Connecting…' }}
          </template>
        </v-alert>
      </v-slide-y-transition>

      <!-- Header -->
      <v-card rounded="xl" class="mb-6 overflow-hidden" elevation="4">
        <div class="pa-6 d-flex align-center flex-wrap ga-4"
             :style="{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)` }">
          <v-avatar size="64" color="white"><v-icon :color="meta.color" size="36">{{ meta.icon }}</v-icon></v-avatar>
          <div class="flex-grow-1">
            <h1 class="text-h4 font-weight-black text-white">{{ meta.label }} Arena</h1>
            <div class="d-flex flex-wrap ga-2 mt-2">
              <v-chip size="small" color="white" variant="flat">
                {{ arena?.game_mode === 'race' ? '🏃 Race' : '⏱️ Synchronized' }}
              </v-chip>
              <v-chip size="small" color="white" variant="flat">{{ arena?.num_prompts }} prompts</v-chip>
              <v-chip size="small" color="white" variant="flat">Host: {{ arena?.creator?.username }}</v-chip>
            </div>
          </div>
          <div class="d-flex ga-2">
            <v-btn variant="flat" color="white" prepend-icon="mdi-link-variant" rounded="lg" @click="copyLink">Invite</v-btn>
            <v-btn variant="flat" color="error" prepend-icon="mdi-exit-run" rounded="lg" :loading="leaving" @click="leaveArena">Leave</v-btn>
          </div>
        </div>
      </v-card>

      <!-- Players -->
      <v-card rounded="xl" class="pa-5 mb-6" elevation="2">
        <div class="text-h6 font-weight-black mb-4">
          👥 Players ({{ arena?.participants?.length ?? 0 }}/{{ arena?.max_players ?? '-' }})
        </div>
        <v-row>
          <v-col v-for="(slot, i) in slots" :key="i" cols="12" sm="6">
            <v-card v-if="slot" rounded="xl" class="pa-3 d-flex align-center player-slot" variant="tonal"
                    :style="{ borderColor: playerColor(i) }">
              <v-badge dot :color="isConnected(slot.user.id) ? 'success' : 'grey'" location="bottom end" offset-x="4" offset-y="4">
                <v-avatar :color="playerColor(i)" size="48">
                  <span class="font-weight-black text-white">{{ slot.user.username.slice(0, 2).toUpperCase() }}</span>
                </v-avatar>
              </v-badge>
              <div class="ml-3">
                <div class="font-weight-black">
                  {{ slot.user.username }}
                  <span v-if="slot.user.id === userStore.user?.id" class="text-caption">(You)</span>
                </div>
                <div class="text-caption text-medium-emphasis">
                  <span v-if="slot.user.id === arena?.creator?.id">👑 Host · </span>
                  {{ isConnected(slot.user.id) ? 'Connected' : 'Not connected' }}
                </div>
              </div>
            </v-card>
            <v-card v-else rounded="xl" variant="outlined" class="pa-3 d-flex align-center empty-slot">
              <v-avatar size="48" color="grey-lighten-3"><v-icon>mdi-account-plus</v-icon></v-avatar>
              <span class="ml-3 text-medium-emphasis">Waiting for player…</span>
            </v-card>
          </v-col>
        </v-row>
      </v-card>

      <!-- Conjugation settings -->
      <v-expand-transition>
        <v-card v-if="arena?.game_name === 'Conjugator' && arena?.game_settings" rounded="xl" class="pa-5 mb-6" elevation="2">
          <div class="text-h6 font-weight-black mb-3">⚙️ Settings</div>
          <div class="d-flex flex-wrap ga-6">
            <div><div class="text-caption text-medium-emphasis">Verb set</div>
              <div class="font-weight-bold">{{ arena.game_settings.verb_set }}</div></div>
            <div><div class="text-caption text-medium-emphasis">Tenses</div>
              <div class="font-weight-bold">{{ arena.game_settings.tenses?.join(', ') }}</div></div>
            <div><div class="text-caption text-medium-emphasis">Sentence types</div>
              <div class="font-weight-bold">{{ arena.game_settings.sentence_types?.join(', ') }}</div></div>
          </div>
        </v-card>
      </v-expand-transition>

      <!-- Start / waiting -->
      <v-card rounded="xl" class="pa-6 text-center start-card" elevation="4">
        <template v-if="isCreator">
          <v-btn color="success" size="x-large" rounded="xl" class="px-12 font-weight-black pulse"
                 prepend-icon="mdi-play-circle" :loading="starting" :disabled="!canStart" @click="startGame">
            Start Game
          </v-btn>
          <div v-if="!canStart" class="text-caption text-medium-emphasis mt-3">
            Need at least 2 connected players ({{ store.players.length }} connected)
          </div>
        </template>
        <template v-else>
          <v-progress-circular indeterminate color="primary" class="mb-3" />
          <div class="text-h6 font-weight-bold">Waiting for {{ arena?.creator?.username }} to start…</div>
        </template>
      </v-card>
    </div>

    <!-- Already in another arena -->
    <v-dialog v-model="showConflict" max-width="440" persistent>
      <v-card rounded="xl" class="pa-6 text-center">
        <div class="text-h2">⚠️</div>
        <div class="text-h6 font-weight-black my-2">You're already in another arena</div>
        <div class="d-flex flex-column ga-2 mt-4">
          <v-btn color="primary" rounded="lg" @click="goConflictArena">Return to it</v-btn>
          <v-btn variant="text" @click="router.replace({ name: 'MultiplayerLobby' })">Back to lobby</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" location="top">{{ snack.text }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/axios';
import { useUserStore } from '@/stores/user';
import { useMultiplayerStore } from '@/stores/multiplayer';
import { gameMeta, playerColor } from './multiplayerMeta';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const store = useMultiplayerStore();

const arenaId = route.params.arenaId as string;
const arena = ref<any>(null);
const starting = ref(false);
const leaving = ref(false);
const showConflict = ref(false);
const conflictArena = ref<any>(null);
const snack = ref({ show: false, text: '', color: 'info' });

const meta = computed(() => gameMeta(arena.value?.game_name));
const isCreator = computed(() => arena.value?.creator?.id === userStore.user?.id);
const canStart = computed(() => store.wsConnected && store.players.length >= 2 && !starting.value);
const isHostOnly = computed(
  () => arena.value?.host_is_player === false && arena.value?.creator?.id === userStore.user?.id
);
const slots = computed(() => {
  const max = arena.value?.max_players ?? 2;
  const list: any[] = [...(arena.value?.participants ?? [])];
  return Array.from({ length: max }, (_, i) => list[i] ?? null);
});

const isConnected = (uid: number) => store.players.some((p) => p.user_id === uid);

function toast(text: string, color = 'info') {
  snack.value = { show: true, text, color };
}

async function refreshArena() {
  try {
    const res = await api.get(`/multiplayer-arenas/${arenaId}/`);
    arena.value = res.data;
    if (res.data.status === 'in_progress') {
      const mine = res.data.participants.some((p: any) => p.user.id === userStore.user?.id);
      if (mine) router.replace({ name: 'MultiplayerGame', params: { arenaId } });
      else if (isHostOnly.value) router.replace({ name: 'MultiplayerGamecast', params: { arenaId } });
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      toast('This arena no longer exists.', 'warning');
      router.replace({ name: 'MultiplayerLobby' });
    }
  }
}

async function initialize() {
  try {
    const res = await api.get(`/multiplayer-arenas/${arenaId}/`);
    arena.value = res.data;

    const hosting = res.data.host_is_player === false && res.data.creator.id === userStore.user?.id;
    const joined = res.data.participants.some((p: any) => p.user.id === userStore.user?.id);

    if (!hosting && !joined && res.data.status === 'waiting') {
      try {
        await api.post(`/multiplayer-arenas/${arenaId}/join/`);
      } catch (err: any) {
        if (err.response?.status === 409) {
          conflictArena.value = err.response.data;
          showConflict.value = true;
          return;
        }
        throw err;
      }
      await refreshArena();
    } else if (!hosting && !joined) {
      router.replace({ name: 'MultiplayerGamecast', params: { arenaId } });
      return;
    }
    await store.connect(arenaId);
  } catch (err) {
    console.error('Failed to initialize arena:', err);
    toast('Could not open this arena.', 'error');
    router.replace({ name: 'MultiplayerLobby' });
  }
}

function goConflictArena() {
  const c = conflictArena.value;
  router.replace({
    name: c.active_arena_status === 'in_progress' ? 'MultiplayerGame' : 'MultiplayerArena',
    params: { arenaId: c.active_arena_id },
  });
}

function startGame() {
  starting.value = true;
  if (!store.startGame()) {
    starting.value = false;
    toast('Not connected yet.', 'warning');
    return;
  }
  setTimeout(() => (starting.value = false), 6000);
}

async function leaveArena() {
  leaving.value = true;
  try {
    await api.post(`/multiplayer-arenas/${arenaId}/leave/`);
  } catch (err) {
    console.error('Failed to leave arena:', err);
  } finally {
    store.disconnect();
    leaving.value = false;
    router.push({ name: 'MultiplayerLobby' });
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast('Invite link copied!', 'success');
  } catch {
    toast(window.location.href);
  }
}

const unsubscribe = store.subscribe((msg) => {
  if (msg.type === 'arena_state') refreshArena();
  else if (msg.type === 'game_started') {
    router.replace({
      name: isHostOnly.value ? 'MultiplayerGamecast' : 'MultiplayerGame',
      params: { arenaId },
    });
  }
  else if (msg.type === 'error') {
    starting.value = false;
    toast(msg.message, 'error');
  } else if (msg.type === '_fatal') {
    toast('Connection refused by the server.', 'error');
  }
});

onMounted(initialize);

onBeforeUnmount(() => {
  unsubscribe();
  // Keep the shared socket alive only when we are heading into the game
  if (store.gameStatus !== 'in_progress') store.disconnect();
});
</script>

<style scoped>
.arena-bg { min-height: 100vh; background: linear-gradient(160deg, #eef2ff, #fdf2f8); }
.player-slot { border: 2px solid; }
.empty-slot { border-style: dashed !important; }
.pulse:not(.v-btn--disabled) { animation: pulse 1.8s infinite; }
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, .5); }
  70% { box-shadow: 0 0 0 18px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
</style>