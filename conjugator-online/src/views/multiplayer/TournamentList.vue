<template>
  <v-container class="pa-6 lobby-bg" fluid>
    <div class="mx-auto" style="max-width: 1000px">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
        <h1 class="text-h4 font-weight-black">🏆 Tournaments</h1>
        <div class="d-flex ga-2">
          <v-btn variant="tonal" rounded="lg" :to="{ name: 'MultiplayerLobby' }">Lobby</v-btn>
          <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" @click="openCreate">New tournament</v-btn>
        </div>
      </div>

      <v-card v-if="!tournaments.length" rounded="xl" variant="tonal" class="pa-8 text-center">
        No tournaments yet.
      </v-card>

      <v-row>
        <v-col v-for="t in tournaments" :key="t.tournament_id" cols="12" md="6">
          <v-card rounded="xl" class="pa-4" :to="{ name: 'TournamentView', params: { id: t.tournament_id } }">
            <div class="d-flex align-center mb-2">
              <v-icon :color="gameMeta(t.game_name).color" class="mr-2">{{ gameMeta(t.game_name).icon }}</v-icon>
              <div class="text-h6 font-weight-black">{{ t.name || gameMeta(t.game_name).label }}</div>
              <v-spacer />
              <v-chip size="small" :color="statusColor(t.status)">{{ statusLabel(t.status) }}</v-chip>
            </div>
            <div class="text-caption text-medium-emphasis">
              🏫 {{ prettySlug(t.course) }} · 👥 {{ t.entrants.length }} · host {{ t.creator_username }}
            </div>
            <div v-if="t.champion_username" class="mt-2">🥇 {{ t.champion_username }}</div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="showCreate" max-width="700">
      <v-card rounded="xl" class="pa-6">
        <v-card-title class="text-h5 font-weight-black px-0">New tournament</v-card-title>

        <v-text-field v-model="form.name" label="Name (optional)" variant="outlined" class="mb-2" />

        <v-select v-if="courseItems.length > 1" v-model="form.course" :items="courseItems"
                  item-title="title" item-value="slug" label="Class" variant="outlined" class="mb-2"
                  @update:model-value="loadClassmates" />
        <v-chip v-else-if="courseItems.length === 1" class="mb-4" color="primary" variant="tonal">
          {{ courseItems[0].title }}
        </v-chip>
        <v-alert v-else type="warning" variant="tonal" density="compact" class="mb-4">
          No class available.
        </v-alert>

        <div class="text-subtitle-2 font-weight-bold mb-2">Game</div>
        <v-item-group v-model="form.game_name" mandatory class="d-flex ga-3 mb-4 flex-wrap">
          <v-item v-for="g in availableGames" :key="g" :value="g" v-slot="{ isSelected, toggle }">
            <v-card :color="isSelected ? gameMeta(g).color : undefined" :variant="isSelected ? 'flat' : 'outlined'"
                    rounded="xl" class="pa-3 text-center" width="150" @click="toggle">
              <v-icon size="26" :color="isSelected ? 'white' : gameMeta(g).color">{{ gameMeta(g).icon }}</v-icon>
              <div class="text-body-2 font-weight-bold" :class="{ 'text-white': isSelected }">{{ gameMeta(g).label }}</div>
            </v-card>
          </v-item>
        </v-item-group>

        <v-btn-toggle v-model="form.game_mode" mandatory color="primary" rounded="xl" class="mb-4 w-100" divided>
          <v-btn value="race" class="flex-grow-1 text-none">🏃 Race</v-btn>
          <v-btn value="synchronized" class="flex-grow-1 text-none">⏱️ Synchronized</v-btn>
        </v-btn-toggle>

        <v-slider v-model="form.num_prompts" :min="3" :max="30" :step="1" thumb-label="always" label="Rounds" class="mb-2" />

        <GameSettingsForm v-model="gameSettings" :game-name="form.game_name" @validity="settingsValid = $event" />

        <div class="text-subtitle-2 font-weight-bold mt-4 mb-1">
          Invite classmates ({{ totalPlayers }}/16, minimum 4 to start)
        </div>
        <v-list density="compact" max-height="220" class="overflow-y-auto border rounded-lg">
          <v-list-item v-for="s in classmates" :key="s.user_id" :disabled="s.is_me || blocked(s)">
            <template #prepend>
              <v-checkbox-btn v-model="form.invitee_ids" :value="s.user_id" :disabled="s.is_me || blocked(s)" />
            </template>
            <v-list-item-title>{{ s.username }}</v-list-item-title>
            <v-list-item-subtitle v-if="blocked(s)">
              {{ s.blocked_active_tournament ? 'In another tournament' : 'In an active arena' }}
            </v-list-item-subtitle>
          </v-list-item>
          <div v-if="!classmates.length" class="pa-3 text-caption">No classmates found.</div>
        </v-list>

        <v-alert v-if="error" type="error" variant="tonal" class="mt-3">{{ error }}</v-alert>

        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn variant="text" @click="showCreate = false">Cancel</v-btn>
          <v-btn color="primary" :loading="creating" :disabled="!canCreate" @click="create">Create</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/axios';
import { useUserStore } from '@/stores/user';
import { gameMeta, defaultSettingsFor } from './multiplayerMeta';
import GameSettingsForm from '@/components/games/GameSettingsForm.vue';
import { prettySlug, statusLabel, statusColor } from './tournamentMeta';

const router = useRouter();
const userStore = useUserStore();
const isTeacher = computed(() => userStore.isStaff);

const tournaments = ref<any[]>([]);
const availableGames = ref<string[]>([]);
const classmates = ref<any[]>([]);
const showCreate = ref(false);
const creating = ref(false);
const error = ref('');
const settingsValid = ref(true);

const form = ref({
  name: '', course: '', game_name: 'Conjugator', game_mode: 'race' as 'race' | 'synchronized',
  num_prompts: 10, invitee_ids: [] as number[],
});
const gameSettings = ref<Record<string, any>>(defaultSettingsFor('Conjugator'));

const courseItems = computed(() =>
  isTeacher.value
    ? userStore.availableTeacherCourses.filter((c) => c.is_active).map((c) => ({ slug: c.slug, title: c.title }))
    : Array.from(new Set(userStore.enrollments.map((e) => e.course).filter(Boolean)))
        .map((slug) => ({ slug, title: prettySlug(slug) }))
);

const blocked = (s: any) => s.blocked_active_tournament || s.blocked_active_arena;
const totalPlayers = computed(() => form.value.invitee_ids.length + (isTeacher.value ? 0 : 1));
const canCreate = computed(() => !!form.value.course && settingsValid.value && totalPlayers.value <= 16);

import { watch } from 'vue';
watch(() => form.value.game_name, (n) => (gameSettings.value = defaultSettingsFor(n)));

async function loadList() {
  try {
    const res = await api.get('/tournaments/');
    tournaments.value = res.data?.results ?? res.data;
  } catch (e) { console.error(e); }
}

async function loadClassmates() {
  form.value.invitee_ids = [];
  if (!form.value.course) return;
  try {
    classmates.value = (await api.get('/tournaments/eligible-classmates/', { params: { course: form.value.course } })).data.students;
  } catch { classmates.value = []; }
}

async function openCreate() {
  error.value = '';
  if (!availableGames.value.length) {
    try { availableGames.value = (await api.get('/multiplayer-games/')).data.games.map((g: any) => g.name); }
    catch { availableGames.value = ['Conjugator']; }
  }
  if (!form.value.course) form.value.course = courseItems.value[0]?.slug ?? '';
  await loadClassmates();
  showCreate.value = true;
}

async function create() {
  creating.value = true;
  error.value = '';
  try {
    const res = await api.post('/tournaments/', {
      name: form.value.name, course: form.value.course, game_name: form.value.game_name,
      game_mode: form.value.game_mode, num_prompts: form.value.num_prompts,
      game_settings: { ...gameSettings.value }, invitee_ids: form.value.invitee_ids,
    });
    showCreate.value = false;
    router.push({ name: 'TournamentView', params: { id: res.data.tournament_id } });
  } catch (e: any) {
    const d = e.response?.data;
    error.value = d?.error || d?.detail || (d && JSON.stringify(d)) || 'Could not create the tournament.';
  } finally { creating.value = false; }
}

let poll: ReturnType<typeof setInterval>;
onMounted(() => { loadList(); poll = setInterval(loadList, 5000); });
onUnmounted(() => clearInterval(poll));
</script>

<style scoped>
.lobby-bg { min-height: 100vh; background: radial-gradient(circle at 10% 0%, #eef2ff 0%, #fff 45%, #fdf2f8 100%); }
</style>