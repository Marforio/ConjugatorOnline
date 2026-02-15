<!-- VWMyProgressPanel.vue -->
<template>
  <div class="d-flex flex-column ga-4">
    <!-- Header -->
    <v-row dense>
      <div class="mx-4">
        <div class="text-h5 font-weight-medium">{{ title }}</div>
        <div class="text-subtitle-1 text-medium-emphasis">
          {{ subtitle }}
        </div>
      </div>
    </v-row>

    <!-- Top row: summary cards -->
    <v-row dense>
      <v-col cols="12" md="6">
        <VWCompletedOnceCard :items="completedOnceItems" class="mt-1 mb-5 mx-2" />
        <VWCompletedThreeTimesCard :items="completedThreeItems" class="mb-5 mx-2" />
      </v-col>

      <v-col cols="12" md="6">
        <VWUnstartedTracksCard
          :items="unstartedTrackRows"
          class="mt-1 mx-2"
          @start="onStartFromUnstarted"
        />
      </v-col>
    </v-row>

    <!-- Bottom row: active progress only -->
    <VWActiveSessionsProgressList
      :rows="activeWorkRows"
      :loading="vw.loadingMyWork"
      :error="vw.errorMyWork"
      :completionTarget="completionTarget"
      @refresh="reload"
      @continue="onContinue"
      @start="onStartFromActiveList"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";

import VWCompletedOnceCard from "@/components/vocab_workout_scenes/VWCompletedOnceCard.vue";
import VWCompletedThreeTimesCard from "@/components/vocab_workout_scenes/VWCompletedThreeTimesCard.vue";
import VWUnstartedTracksCard from "@/components/vocab_workout_scenes/VWUnstartedTracksCard.vue";
import VWActiveSessionsProgressList from "@/components/vocab_workout_scenes/VWActiveSessionsProgressList.vue";

type TrackKey = {
  listKey: string;
  mode: string;
  level: string | null;
  trackKey: string | null;
};

type TrackBadgeItem = { key: string; title: string };

type UnstartedTrackRow = {
  key: string;
  title: string;
  subtitle: string;
  listKey: string;
  level: string | null;
  trackKey: string | null;
};

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
  level: string | null;
  trackKey: string | null;
};

const props = withDefaults(
  defineProps<{
    completionTarget?: number;
    title?: string;
    subtitle?: string;
  }>(),
  {
    completionTarget: 3,
    title: "Settings",
    subtitle: "Continue an ongoing session or review your progress",
  }
);

const emit = defineEmits<{
  (e: "continue", sessionId: number): void;
  (e: "start", payload: { listKey: string; level: string | null; trackKey: string | null }): void;
}>();

const user = useUserStore();
const vw = useVocabWorkoutStore();

/* =====================================================
   MODULE FILTERING
===================================================== */

const IRREGULAR_MODULE_NAME = "Irregular verbs";

const studentDomain = computed(
  () => (user.student as any)?.domain ?? null
);

/** modules allowed (ORDERED) */
const allowedModules = computed(() => {
  const modules: string[] = [];

  // always first
  modules.push(IRREGULAR_MODULE_NAME);

  const dom = (studentDomain.value ?? "").trim();

  if (dom) {
    const match = Object.values(vocabLists).find(
      (m: any) =>
        (m.module ?? "").toLowerCase() === dom.toLowerCase()
    )?.module;

    if (match && match !== IRREGULAR_MODULE_NAME) {
      modules.push(match);
    }
  }

  console.log("Allowed modules:", modules);

  return modules;
});

/** list keys allowed everywhere */
const allowedListKeys = computed(() => {
  const allowed = new Set<string>();

  for (const [listKey, metaRaw] of Object.entries(vocabLists)) {
    const moduleName = (metaRaw as any).module || "General vocab";

    if (allowedModules.value.includes(moduleName)) {
      allowed.add(listKey);
    }
  }

  console.log("Allowed lists:", [...allowed]);

  return allowed;
});

/** ordering helper */
function moduleRank(listKey: string): number {
  const moduleName = (vocabLists as any)[listKey]?.module ?? "";

  if (moduleName === IRREGULAR_MODULE_NAME) return 0;

  if (
    moduleName.toLowerCase() ===
    (studentDomain.value ?? "").toLowerCase()
  )
    return 1;

  return 99;
}

/* =====================================================
   HELPERS
===================================================== */

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

function listTitle(listKey: string): string {
  const meta: any = (vocabLists as any)[listKey];
  return meta?.title ?? listKey;
}

function prettyTrack(trackKey: string | null): string {
  const t = normTrackKey(trackKey);
  if (t === "default") return "Default track";
  return t.replace(/_/g, " ");
}

function prettyMode(mode: string): string {
  if (mode === "write") return "Write";
  if (mode === "quiz") return "Quiz";
  return mode;
}

function prettyLevel(level: string | null): string {
  if (!level) return "All";
  if (level === "essential") return "Essential";
  if (level === "advanced") return "Advanced";
  return level;
}

/* =====================================================
   BUILD TRACK CATALOG (FILTERED)
===================================================== */

const allTracksCatalog = computed<TrackKey[]>(() => {
  const tracks: TrackKey[] = [];
  const MODES = ["write", "quiz"];

  for (const [listKey, metaRaw] of Object.entries(vocabLists)) {
    if (!allowedListKeys.value.has(listKey)) continue;

    const meta: any = metaRaw;

    const levels: (string | null)[] =
      meta.supportsLevels ? ["essential", "advanced"] : [null];

    const trackKeys: (string | null)[] =
      Array.isArray(meta.trackKeys) && meta.trackKeys.length
        ? meta.trackKeys.map((k: any) => normTrackKey(k))
        : ["default"];

    for (const mode of MODES) {
      for (const level of levels) {
        for (const trackKey of trackKeys) {
          tracks.push({ listKey, mode, level, trackKey });
        }
      }
    }
  }

  return tracks;
});

/* =====================================================
   PROGRESS MAPS
===================================================== */

const progressByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const p of vw.progress ?? []) {
    if (!allowedListKeys.value.has(p.list_key)) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);
    map.set(key, p);
  }
  return map;
});

const activeSessionByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const s of vw.activeSessions ?? []) {
    if (s.status !== "active") continue;
    if (!allowedListKeys.value.has(s.list_key)) continue;

    const key = makeTrackKey(s.list_key, s.mode, normLevel(s.level), s.track_key);
    if (!map.has(key)) map.set(key, s);
  }
  return map;
});

/* =====================================================
   COMPLETED
===================================================== */

function sortByModuleThenTitle(a: any, b: any) {
  const rankDiff =
    moduleRank(a.key.split("::")[0]) -
    moduleRank(b.key.split("::")[0]);

  return rankDiff || a.title.localeCompare(b.title);
}

const completedOnceItems = computed<TrackBadgeItem[]>(() => {
  const out: TrackBadgeItem[] = [];

  for (const p of vw.progress ?? []) {
    if (!allowedListKeys.value.has(p.list_key)) continue;
    if (Number(p.sessions_finished ?? 0) < 1) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);

    out.push({
      key,
      title: `${listTitle(p.list_key)} • ${prettyMode(p.mode)} • ${prettyLevel(normLevel(p.level))} • ${prettyTrack(p.track_key)}`
    });
  }

  return out.sort(sortByModuleThenTitle);
});

const completedThreeItems = computed<TrackBadgeItem[]>(() => {
  const out: TrackBadgeItem[] = [];

  for (const p of vw.progress ?? []) {
    if (!allowedListKeys.value.has(p.list_key)) continue;
    if (Number(p.sessions_finished ?? 0) < props.completionTarget) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);

    out.push({
      key,
      title: `${listTitle(p.list_key)} • ${prettyMode(p.mode)} • ${prettyLevel(normLevel(p.level))} • ${prettyTrack(p.track_key)}`
    });
  }

  return out.sort(sortByModuleThenTitle);
});

/* =====================================================
   UNSTARTED (WRITE ONLY)
===================================================== */

const unstartedTrackRows = computed<UnstartedTrackRow[]>(() => {
  const out: UnstartedTrackRow[] = [];

  for (const t of allTracksCatalog.value) {
    if (t.mode !== "write") continue;

    const key = makeTrackKey(t.listKey, t.mode, t.level, t.trackKey);
    const prog = progressByTrack.value.get(key);

    if (Number(prog?.sessions_started ?? 0) > 0) continue;

    out.push({
      key,
      title: `${listTitle(t.listKey)} • Write`,
      subtitle: `${prettyLevel(t.level)} • ${prettyTrack(t.trackKey)}`,
      listKey: t.listKey,
      level: t.level,
      trackKey: normTrackKey(t.trackKey),
    });
  }

  return out.sort((a, b) => {
    const rankDiff = moduleRank(a.listKey) - moduleRank(b.listKey);
    return rankDiff || a.title.localeCompare(b.title);
  });
});

/* =====================================================
   ACTIVE WORK
===================================================== */

const activeWorkRows = computed<ActiveWorkRow[]>(() => {
  const out: ActiveWorkRow[] = [];

  for (const s of vw.activeSessions ?? []) {
    if (s.status !== "active") continue;
    if (!allowedListKeys.value.has(s.list_key)) continue;

    const key = makeTrackKey(s.list_key, s.mode, normLevel(s.level), s.track_key);
    const prog = progressByTrack.value.get(key);

    const correct = Number(prog?.correct_count ?? s.correct_count ?? 0);
    const wrong = Number(prog?.wrong_count ?? s.wrong_count ?? 0);
    const attempts = correct + wrong;
    const accuracy = attempts ? Math.round((correct / attempts) * 1000) / 10 : 0;

    const progressPct =
      s.all_item_ids && s.mastered_item_ids
        ? Math.round((s.mastered_item_ids.length / s.all_item_ids.length) * 100)
        : 0;

    out.push({
      key,
      title: listTitle(s.list_key),
      subtitle: `${prettyLevel(normLevel(s.level))} • ${prettyTrack(s.track_key)}`,
      correct,
      wrong,
      accuracy,
      completed: Number(prog?.sessions_finished ?? 0),
      progressPct,
      canContinue: true,
      continueSessionId: Number(s.session_id),
      listKey: s.list_key,
      level: normLevel(s.level),
      trackKey: normTrackKey(s.track_key),
    });
  }

  out.sort((a, b) => {
    const rankDiff = moduleRank(a.listKey) - moduleRank(b.listKey);
    if (rankDiff) return rankDiff;

    return (
      activeSessionByTrack.value
        .get(b.key)
        ?.last_activity_at?.localeCompare(
          activeSessionByTrack.value.get(a.key)?.last_activity_at ?? ""
        ) ?? 0
    );
  });

  return out;
});

/* =====================================================
   FETCH
===================================================== */

async function reload() {
  await vw.fetchMyWork();
}

onMounted(reload);

/* =====================================================
   EVENTS
===================================================== */

function onContinue(sessionId: number) {
  emit("continue", sessionId);
}

function onStartFromUnstarted(payload: { listKey: string; level: string | null; trackKey: string | null }) {
  emit("start", payload);
}

function onStartFromActiveList(listKey: string, level: string | null, trackKey: string | null) {
  emit("start", { listKey, level, trackKey });
}
</script>

