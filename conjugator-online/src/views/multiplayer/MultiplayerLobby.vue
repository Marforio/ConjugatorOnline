<template>
  <v-container class="pa-6 lobby-bg" fluid>
    <div class="mx-auto" style="max-width: 1100px">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
        <div>
          <h1 class="text-h3 font-weight-black hero-title">🎮 Multiplayer Arena</h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ isTeacher ? 'Host a game for your class.' : 'Challenge your classmates in real time.' }}
          </p>
        </div>
        <v-btn variant="tonal" rounded="xl" size="x-large" prepend-icon="mdi-chart-box" :to="{ name: 'MultiplayerStats' }">
          Stats
        </v-btn>
        <v-btn color="primary" size="x-large" rounded="xl" class="font-weight-bold"
               prepend-icon="mdi-plus-circle" @click="openCreate">
          {{ isTeacher ? 'Host a Game' : 'Create Arena' }}
        </v-btn>
        <v-btn variant="tonal" rounded="xl" size="x-large" prepend-icon="mdi-tournament" :to="{ name: 'TournamentList' }">
          Tournaments
        </v-btn>
      </div>

      <v-slide-y-transition>
        <v-alert v-if="myActiveArena" type="info" variant="tonal" rounded="xl" class="mb-6" border="start">
          <div class="d-flex align-center justify-space-between flex-wrap ga-3">
            <span>
              You're {{ myActiveArena.host_is_player === false ? 'hosting' : 'in' }} an active
              <strong>{{ gameMeta(myActiveArena.game_name).label }}</strong> arena
              ({{ statusMeta(myActiveArena.status).label }}).
            </span>
            <v-btn color="primary" rounded="lg" @click="returnToArena(myActiveArena)">Return</v-btn>
          </div>
        </v-alert>
      </v-slide-y-transition>

      <v-card v-if="lobbyArenas.length === 0" rounded="xl" class="pa-10 text-center" variant="tonal">
        <div class="text-h2 mb-2">🕹️</div>
        <div class="text-h6 font-weight-bold">No active arenas</div>
        <div class="text-body-2 text-medium-emphasis">
          {{ isTeacher ? 'Host a game for one of your classes!' : 'Create one and invite your classmates!' }}
        </div>
      </v-card>

      <template v-else>
        <template v-if="teacherArenas.length">
          <div class="d-flex align-center mb-3">
            <v-icon color="amber-darken-2" class="mr-2">mdi-school</v-icon>
            <h2 class="text-h6 font-weight-black">From the teacher</h2>
          </div>
          <v-row class="mb-4">
            <v-col v-for="arena in teacherArenas" :key="arena.arena_id" cols="12" md="6" lg="4">
              <ArenaCard :arena="arena" />
            </v-col>
          </v-row>
        </template>

        <template v-if="studentArenas.length">
          <div v-if="teacherArenas.length" class="d-flex align-center mb-3 mt-2">
            <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
            <h2 class="text-h6 font-weight-black">{{ isTeacher ? 'Other arenas' : 'From classmates' }}</h2>
          </div>
          <v-row>
            <v-col v-for="arena in studentArenas" :key="arena.arena_id" cols="12" md="6" lg="4">
              <ArenaCard :arena="arena" />
            </v-col>
          </v-row>
        </template>
      </template>
    </div>

    <v-dialog v-model="showCreateDialog" max-width="700">
      <v-card rounded="xl" class="pa-6">
        <v-card-title class="text-h5 font-weight-black px-0">
          {{ isTeacher ? 'Host a Class Game' : 'Create Arena' }}
        </v-card-title>

        <v-form @submit.prevent="createArena">
          <div class="text-subtitle-2 font-weight-bold mb-2">Class</div>
          <v-select
            v-if="isTeacher"
            v-model="form.course"
            :items="teacherCourseItems"
            item-title="title"
            item-value="slug"
            label="Select a class (required)"
            variant="outlined"
            :rules="[(v: string) => !!v || 'Choose a class']"
            class="mb-2"
          />
          <template v-else>
            <v-select
              v-if="studentCourseSlugs.length > 1"
              v-model="form.course"
              :items="studentCourseItems"
              item-title="title"
              item-value="slug"
              label="Your class"
              variant="outlined"
              class="mb-2"
            />
            <v-chip v-else-if="studentCourseSlugs.length === 1" color="primary" variant="tonal" class="mb-4" prepend-icon="mdi-school">
              {{ prettySlug(studentCourseSlugs[0]) }}
            </v-chip>
            <v-alert v-else type="warning" variant="tonal" density="compact" class="mb-4">
              You aren't enrolled in a class yet, so you can't create an arena.
            </v-alert>
          </template>

          <v-switch v-if="isTeacher" v-model="form.host_only" color="primary" inset hide-details class="mb-4"
                    label="Host only (I won't play)" />

          <div class="text-subtitle-2 font-weight-bold mb-2">Game</div>
          <v-item-group v-model="form.game_name" mandatory class="d-flex ga-3 mb-5 flex-wrap">
            <v-item v-for="g in availableGames" :key="g" :value="g" v-slot="{ isSelected, toggle }">
              <v-card :color="isSelected ? gameMeta(g).color : undefined"
                      :variant="isSelected ? 'flat' : 'outlined'"
                      rounded="xl" class="pa-3 text-center game-pick" width="165" @click="toggle">
                <v-icon size="28" :color="isSelected ? 'white' : gameMeta(g).color">{{ gameMeta(g).icon }}</v-icon>
                <div class="text-body-2 font-weight-bold mt-1" :class="{ 'text-white': isSelected }">
                  {{ gameMeta(g).label }}
                </div>
              </v-card>
            </v-item>
          </v-item-group>

          <v-btn-toggle v-model="form.game_mode" mandatory color="primary" rounded="xl" class="mb-5 w-100" divided>
            <v-btn value="race" class="flex-grow-1 text-none">🏃 Race</v-btn>
            <v-btn value="synchronized" class="flex-grow-1 text-none">⏱️ Synchronized</v-btn>
          </v-btn-toggle>

          <v-slider v-model="form.num_prompts" :min="1" :max="30" :step="1" thumb-label="always"
                    label="Rounds" color="primary" class="mb-2" />
          <v-slider v-model="form.max_players" :min="2" :max="maxPlayersCap" :step="1" thumb-label="always"
                    label="Max players" color="primary" class="mb-4" />

          <v-expand-transition>
            <div class="mb-2">
              <GameSettingsForm v-model="gameSettings" :game-name="form.game_name" @validity="settingsValid = $event" />
            </div>
          </v-expand-transition>

          <v-alert v-if="createError" type="error" variant="tonal" class="mb-3">{{ createError }}</v-alert>

          <div class="d-flex justify-end ga-2">
            <v-btn variant="text" @click="showCreateDialog = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" :loading="creating" rounded="lg" size="large" :disabled="!canCreate">
              {{ isTeacher ? 'Host' : 'Create' }}
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" location="top">{{ snack.text }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, h, defineComponent, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/axios';
import { useUserStore } from '@/stores/user';
import { gameMeta, statusMeta, defaultSettingsFor } from './multiplayerMeta';
import GameSettingsForm from '@/views/multiplayer/GameSettingsForm.vue';



// in createArena payload:
// game_settings: { ...gameSettings.value },
interface Arena {
  arena_id: string;
  creator: { id: number; username: string };
  game_name: string;
  game_mode: 'race' | 'synchronized';
  status: 'waiting' | 'in_progress' | 'finished';
  participants_count: number;
  max_players: number;
  num_prompts: number;
  course?: string | null;
  host_is_player?: boolean;
  created_by_teacher?: boolean;
}

const router = useRouter();
const userStore = useUserStore();

const arenas = ref<Arena[]>([]);
const myArenas = ref<Arena[]>([]);
const showCreateDialog = ref(false);
const creating = ref(false);
const createError = ref('');
const snack = ref({ show: false, text: '', color: 'info' });

const availableGames = ref<string[]>([]);

const isTeacher = computed(() => userStore.isStaff);

const form = ref({
  game_name: 'Conjugator',
  game_mode: 'race' as 'race' | 'synchronized',
  num_prompts: 24,
  max_players: 4,
  course: '',
  host_only: true,
});


const gameSettings = ref<Record<string, any>>(defaultSettingsFor('Conjugator'));

watch(() => form.value.game_name, (n) => {
  gameSettings.value = defaultSettingsFor(n);
});

const prettySlug = (slug: string) => slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const teacherCourseItems = computed(() =>
  userStore.availableTeacherCourses.filter((c) => c.is_active).map((c) => ({ slug: c.slug, title: c.title }))
);
const studentCourseSlugs = computed(() => Array.from(new Set(userStore.enrollments.map((e) => e.course).filter(Boolean))));
const studentCourseItems = computed(() => studentCourseSlugs.value.map((slug) => ({ slug, title: prettySlug(slug) })));

const maxPlayersCap = computed(() => (isTeacher.value ? 40 : 8));

const settingsValid = ref(true);

const canCreate = computed(() => !!form.value.course && settingsValid.value);

const lobbyArenas = computed(() => arenas.value.filter((a) => a.status !== 'finished'));
const teacherArenas = computed(() => lobbyArenas.value.filter((a) => a.created_by_teacher));
const studentArenas = computed(() => lobbyArenas.value.filter((a) => !a.created_by_teacher));
const myActiveArena = computed(() => myArenas.value.find((a) => a.status === 'waiting' || a.status === 'in_progress') ?? null);

const isMine = (a: Arena) => myActiveArena.value?.arena_id === a.arena_id;
const isHost = (a: Arena) => a.creator.id === userStore.user?.id;
const isFull = (a: Arena) => a.status === 'waiting' && a.participants_count >= a.max_players && !isMine(a) && !isHost(a);
const actionLabel = (a: Arena) => (isHost(a) && a.host_is_player === false ? 'Manage' : isMine(a) ? 'Return' : a.status === 'waiting' ? 'Join Arena' : 'Spectate');

function toast(text: string, color = 'info') {
  snack.value = { show: true, text, color };
}

function unwrap(data: any): any[] {
  const list = data?.results ?? data;
  return Array.isArray(list) ? list : [];
}

async function loadCatalog() {
  try {
    const res = await api.get('/multiplayer-games/');
    availableGames.value = res.data.games.map((g: any) => g.name);
    if (!availableGames.value.includes(form.value.game_name)) {
      form.value.game_name = availableGames.value[0] || 'Conjugator';
    }
  } catch {
    availableGames.value = ['Conjugator', 'Comparison', 'Passive Party', 'Parallel Universe', 'Pronoun Practice', 'Quantifier Quest', 'Regret Machine', 'Reported Speech', 'Verb Mixer', 'Year 2040'];
  }
}

async function fetchArenas() {
  try {
    const [all, mine] = await Promise.all([
      api.get('/multiplayer-arenas/'),
      api.get('/multiplayer-arenas/my-arenas/'),
    ]);
    arenas.value = unwrap(all.data);
    myArenas.value = unwrap(mine.data);
  } catch (err) {
    console.error('Failed to fetch arenas:', err);
  }
}

function returnToArena(a: { arena_id: string; status: string }) {
  router.push({
    name: a.status === 'in_progress' ? 'MultiplayerGame' : 'MultiplayerArena',
    params: { arenaId: a.arena_id },
  });
}

function enter(a: Arena) {
  if (isHost(a) && a.host_is_player === false) {
    router.push({ name: a.status === 'in_progress' ? 'MultiplayerGamecast' : 'MultiplayerArena', params: { arenaId: a.arena_id } });
    return;
  }
  if (isMine(a)) {
    returnToArena(a);
    return;
  }
  if (a.status === 'waiting') router.push({ name: 'MultiplayerArena', params: { arenaId: a.arena_id } });
  else router.push({ name: 'MultiplayerGamecast', params: { arenaId: a.arena_id } });
}

function openCreate() {
  createError.value = '';
  if (isTeacher.value) {
    if (!form.value.course) form.value.course = teacherCourseItems.value[0]?.slug ?? '';
    form.value.max_players = Math.max(form.value.max_players, 10);
  } else if (studentCourseSlugs.value.length) {
    if (!studentCourseSlugs.value.includes(form.value.course)) form.value.course = studentCourseSlugs.value[0];
  }
  showCreateDialog.value = true;
}

async function createArena() {
  creating.value = true;
  createError.value = '';
  try {
    const payload: Record<string, any> = {
      game_name: form.value.game_name,
      game_mode: form.value.game_mode,
      num_prompts: form.value.num_prompts,
      max_players: form.value.max_players,
      course: form.value.course,
      game_settings: { ...gameSettings.value },
    };
    if (isTeacher.value) payload.host_is_player = !form.value.host_only;

    const res = await api.post('/multiplayer-arenas/', payload);
    showCreateDialog.value = false;
    router.push({ name: 'MultiplayerArena', params: { arenaId: res.data.arena_id } });
  } catch (err: any) {
    createError.value = err.response?.data?.error || err.response?.data?.detail || 'Could not create the arena.';
  } finally {
    creating.value = false;
  }
}

const ArenaCard = defineComponent({
  props: { arena: { type: Object as PropType<Arena>, required: true } },
  setup(props) {
    return () => {
      const a = props.arena;
      const meta = gameMeta(a.game_name);
      const teacher = !!a.created_by_teacher;
      const bg = teacher ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`;
      return h('div', { class: ['arena-card-wrap', { 'teacher-card': teacher }], style: 'height:100%' }, [
        h('div', { class: 'v-card v-card--variant-elevated rounded-xl arena-card h-100 d-flex flex-column elevation-4' }, [
          h('div', { class: 'arena-banner d-flex align-center px-4 py-3', style: { background: bg } }, [
            h('i', { class: `mdi ${meta.icon} text-white mr-3`, style: 'font-size:28px' }),
            h('span', { class: 'text-h6 font-weight-black text-white' }, meta.label),
            h('span', { class: 'flex-grow-1' }),
            teacher ? h('span', { class: 'teacher-badge' }, '🎓 TEACHER') : h('span', { class: 'status-pill' }, statusMeta(a.status).label),
          ]),
          h('div', { class: 'pa-4 flex-grow-1' }, [
            h('div', { class: 'd-flex align-center mb-3' }, [
              h('div', { class: `host-avatar ${teacher ? 'host-teacher' : ''}` }, a.creator.username.slice(0, 2).toUpperCase()),
              h('div', { class: 'ml-2' }, [
                h('div', { class: 'text-caption text-medium-emphasis' }, teacher ? 'Hosted by teacher' : 'Host'),
                h('div', { class: 'font-weight-bold' }, a.creator.username),
              ]),
            ]),
            h('div', { class: 'd-flex flex-wrap ga-2' }, [
              a.course ? h('span', { class: 'chip chip-course' }, `🏫 ${prettySlug(a.course)}`) : null,
              h('span', { class: 'chip' }, a.game_mode === 'race' ? '🏃 Race' : '⏱️ Synchronized'),
              h('span', { class: 'chip' }, `👥 ${a.participants_count} / ${a.max_players}`),
              h('span', { class: 'chip' }, `❓ ${a.num_prompts} rounds`),
            ]),
          ]),
          h('div', { class: 'pa-4 pt-0' }, [
            h('button', { class: ['action-btn', { 'action-teacher': teacher }], disabled: isFull(a), onClick: () => enter(a) }, actionLabel(a)),
          ]),
        ]),
      ]);
    };
  },
});

let poll: ReturnType<typeof setInterval> | null = null;
onMounted(async () => {
  await loadCatalog();
  await fetchArenas();
  if (!userStore.enrollments.length) userStore.fetchEnrollments().catch(() => {});
  poll = setInterval(fetchArenas, 3000);
});
onUnmounted(() => {
  if (poll) clearInterval(poll);
});
</script>

<style scoped>
.lobby-bg { min-height: 100vh; background: radial-gradient(circle at 10% 0%, #eef2ff 0%, #fff 45%, #fdf2f8 100%); }
.hero-title { background: linear-gradient(90deg, #6366f1, #ec4899); -webkit-background-clip: text; background-clip: text; color: transparent; }
.game-pick { cursor: pointer; transition: transform .15s; }
.game-pick:hover { transform: scale(1.04); }
.arena-card { overflow: hidden; transition: transform .2s, box-shadow .2s; background: #fff; }
.arena-card:hover { transform: translateY(-6px); }
.teacher-card .arena-card { border: 3px solid #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, .15), 0 10px 30px rgba(245, 158, 11, .25) !important; }
.teacher-badge { background: #fff; color: #b45309; font-weight: 900; font-size: 11px; padding: 4px 10px; border-radius: 999px; letter-spacing: .5px; }
.status-pill { background: rgba(255,255,255,.9); font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; }
.host-avatar { width: 32px; height: 32px; border-radius: 50%; background: #6366f1; color: #fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; }
.host-teacher { background: #f59e0b; }
.chip { background: #f1f5f9; border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
.chip-course { background: #fef3c7; color: #92400e; }
.action-btn { width: 100%; padding: 12px; border-radius: 12px; border: 0; background: #6366f1; color: #fff; font-weight: 800; cursor: pointer; transition: filter .15s; }
.action-btn:hover:not(:disabled) { filter: brightness(1.1); }
.action-btn:disabled { opacity: .45; cursor: not-allowed; }
.action-teacher { background: linear-gradient(90deg, #f59e0b, #ef4444); }
</style>