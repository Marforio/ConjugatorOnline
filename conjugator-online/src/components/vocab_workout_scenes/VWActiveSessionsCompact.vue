<template>
  <v-card class="pa-4 bg-light" rounded="lg" elevation="2">

    <div v-if="error" class="text-error text-caption mb-2">{{ error }}</div>

    <div v-if="loading" class="text-center py-4">
      <v-progress-circular indeterminate size="22" />
    </div>

    <div v-else-if="rows.length === 0" class="text-caption text-medium-emphasis py-2">
      No active sessions right now.
    </div>

    <!-- only change: fixed-height scroll area -->
    <div v-else class="sessions-scroll d-flex flex-column ga-2">
      <v-card
        v-for="row in rows"
        :key="row.key"
        class="pa-3 border rounded-lg"
        elevation="0"
        min-height="100"
      >
        <div class="d-flex justify-space-between align-start ga-2 mb-2">
          <div class="min-width-0">
            <div class="text-body-2 font-weight-bold text-truncate">{{ row.title }}<span class="text-caption ms-2 text-medium-emphasis">{{ row.subtitle }}</span></div>
          </div>
        </div>

        <v-progress-linear
          :model-value="row.progressPct"
          height="7"
          rounded
          striped
          :color="row.progressPct >= 80 ? 'success' : row.progressPct >= 50 ? 'info' : 'warning'"
        />

        <div class="d-flex justify-space-between align-center mt-2">
          <span class="text-caption text-medium-emphasis">{{ row.progressPct }}% complete</span>
          <div class="d-flex ga-2">
            <v-btn
              v-if="row.canContinue && row.continueSessionId"
              size="small"
              color="primary"
              variant="flat"
              @click="continueSession(row.continueSessionId)"
            >
              Continue this session
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";

const props = withDefaults(
  defineProps<{
    autoLoad?: boolean;
  }>(),
  { autoLoad: true }
);


type ActiveWorkRow = {
  key: string;
  title: string;
  subtitle: string;
  correct: number;
  wrong: number;
  accuracy: number;
  completed: number;
  progressPct: number;
  canContinue: boolean;
  continueSessionId: number | null;
  listKey: string;
  listName?: string | null;
  level: string | null;
  trackKey: string | null;
};

const vw = useVocabWorkoutStore();
const router = useRouter();

const loading = computed(() => vw.loadingMyWork);
const error = computed(() => vw.errorMyWork);

function normTrackKey(v: any): string {
  const s = String(v ?? "").trim();
  return s.length ? s : "default";
}
function normLevel(v: any): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
function makeTrackKey(listKey: string, mode: string, level: string | null, trackKey: string | null) {
  return `${listKey}::${mode}::${level ?? "null"}::${normTrackKey(trackKey)}`;
}
function prettyLevel(level: string | null): string {
  if (!level) return "All";
  if (level === "essential") return "Essential";
  if (level === "advanced") return "Advanced";
  return level;
}
function prettyTrack(trackKey: string | null): string {
  const t = normTrackKey(trackKey);
  return t === "default" ? "Default track" : t.replace(/_/g, " ");
}
function listTitle(listKey: string): string {
  const meta: any = (vocabLists as any)[listKey];
  if (meta?.title) return meta.title;

  const p: any = (vw.progress || []).find((x: any) => x.list_key === listKey);
  if (p?.list_name) return String(p.list_name).trim();

  const s: any = (vw.activeSessions || []).find((x: any) => x.list_key === listKey);
  if (s?.list_name) return String(s.list_name).trim();

  if (listKey.includes("_") && !listKey.includes("-")) {
    const clear = listKey.replace(/_/g, " ");
    return clear.charAt(0).toUpperCase() + clear.slice(1);
  }
  return "Custom Vocabulary Collection";
}

const progressByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const p of vw.progress ?? []) {
    map.set(makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key), p);
  }
  return map;
});

const rows = computed<ActiveWorkRow[]>(() => {
  const out: ActiveWorkRow[] = [];

  for (const s of vw.activeSessions || []) {
    if (s.status !== "active") continue;
    if (s.mode !== "write") continue;

    const key = makeTrackKey(s.list_key, s.mode, normLevel(s.level), s.track_key);
    const prog = progressByTrack.value.get(key);

    const correct = Number(prog?.correct_count ?? s.correct_count ?? 0);
    const wrong = Number(prog?.wrong_count ?? s.wrong_count ?? 0);
    const attempts = correct + wrong;
    const accuracy = attempts ? Math.round((correct / attempts) * 1000) / 10 : 0;

    const total = Array.isArray(s.all_item_ids) ? s.all_item_ids.length : 0;
    const mastered = Array.isArray(s.mastered_item_ids) ? s.mastered_item_ids.length : 0;
    const progressPct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    const resolvedTitle = listTitle(s.list_key);

    out.push({
      key,
      title: resolvedTitle,
      subtitle: `${prettyLevel(normLevel(s.level))} • ${prettyTrack(s.track_key)}`,
      correct,
      wrong,
      accuracy,
      completed: Number(prog?.sessions_finished ?? 0),
      progressPct,
      canContinue: true,
      continueSessionId: Number(s.session_id),
      listKey: s.list_key,
      listName: prog?.list_name ?? resolvedTitle,
      level: normLevel(s.level),
      trackKey: normTrackKey(s.track_key),
    });
  }

  return out.sort((a, b) => b.progressPct - a.progressPct);
});

async function reload() {
  await vw.fetchMyWork();
}

function continueSession(sessionId: number) {
  sessionStorage.setItem(
    "vw_start_payload",
    JSON.stringify({ resumeSessionId: Number(sessionId) })
  );

  router.push({ name: "vocabworkout" }).catch(() => {});
}

function startNew(row: ActiveWorkRow) {
  router.push({
    name: "vocabworkout",
    query: {
      list_key: row.listKey,
      mode: "write",
      level: row.level ?? "",
      track_key: row.trackKey ?? "default",
      front_field: "definition",
      back_field: "term",
    },
  }).catch(() => {});
}

onMounted(async () => {
  if (props.autoLoad) {
    await reload();
  }
});
</script>

<style scoped>
.sessions-scroll {
  max-height: 150px;   /* adjust if you want taller/shorter */
  overflow-y: auto;
  padding-right: 2px;
}
</style>