<template>
  <div class="d-flex flex-column ga-4">
    <!-- Header -->
    <v-row dense>
      <div class="mx-4 mt-8 mb-2">
        <div class="text-h5 font-weight-medium">{{ title }}</div>
        <div class="text-subtitle-1 text-medium-emphasis">
          {{ subtitle }}
        </div>
      </div>
    </v-row>

    <!-- Top row: active progress only -->
    <VWActiveSessionsProgressList
      :rows="activeWorkRows"
      :loading="vw.loadingMyWork"
      :error="vw.errorMyWork"
      :completionTarget="completionTarget"
      @refresh="reload"
      @continue="onContinue"
      @start="onStartFromActiveList"
    />

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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";

import VWCompletedOnceCard from "@/components/vocab_workout_scenes/VWCompletedOnceCard.vue";
import VWCompletedThreeTimesCard from "@/components/vocab_workout_scenes/VWCompletedThreeTimesCard.vue";
import VWUnstartedTracksCard from "@/components/vocab_workout_scenes/VWUnstartedTracksCard.vue";
import VWActiveSessionsProgressList from "@/components/vocab_workout_scenes/VWActiveSessionsProgressList.vue";

type TrackBadgeItem = { key: string; title: string };

type UnstartedTrackRow = {
  key: string;
  title: string;
  subtitle: string;
  listKey: string;
  listName?: string | null;
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
  listName?: string | null;
  level: string | null;
  trackKey: string | null;
};

type CustomListLite = {
  id: string;
  name: string;
  domain?: string | null;
};

const props = withDefaults(
  defineProps<{
    completionTarget?: number;
    title?: string;
    subtitle?: string;
  }>(),
  {
    completionTarget: 3,
    title: "My Progress",
    subtitle: "Continue an active session and check your progress",
  }
);

const emit = defineEmits<{
  (e: "continue", sessionId: number): void;
  (e: "start", payload: { listKey: string; level: string | null; trackKey: string | null }): void;
}>();

const user = useUserStore();
const vw = useVocabWorkoutStore();

type CustomVocabList = {
  id: string;
  name: string;
  domain?: string | null;
};

const customVocabLists = ref<CustomListLite[]>([]);

type ListSourceRow = {
  id: string;
  name: string;
  domain?: string | null;
  supportsLevels: boolean;
  source: "custom" | "hardcoded";
};


/* =====================================================
   LOAD CUSTOM LISTS FOR UNSTARTED PANEL (BACKEND-DRIVEN)
===================================================== */

async function loadAvailableVocabLists() {
  try {
    const response = await api.get("/vocab-lists/");
    const rawData =
      response.data && typeof response.data === "object" && "results" in response.data
        ? (response.data as any).results
        : response.data;

    customVocabLists.value = Array.isArray(rawData) ? rawData : [];
  } catch (err) {
    console.error("Failed to load custom vocab lists:", err);
    customVocabLists.value = [];
  }
}

const hardcodedVocabListItems = computed<ListSourceRow[]>(() => {
  return Object.entries(vocabLists as any)
    .filter(([key]) => key.startsWith("irregular_verbs") || key.startsWith("general"))
    .map(([key, entry]: [string, any]) => ({
      id: key,
      name: entry.title || key,
      domain: entry.module || "General",
      supportsLevels: !!entry.supportsLevels, // irregular verbs => true
      source: "hardcoded" as const,
    }));
});

const customVocabListItems = computed<ListSourceRow[]>(() => {
  return customVocabLists.value.map((list) => ({
    id: String(list.id),
    name: String(list.name || "Custom Vocabulary List"),
    domain: list.domain ?? "Custom",
    supportsLevels: false,
    source: "custom" as const,
  }));
});

const allVocabListItems = computed<ListSourceRow[]>(() => {
  const map = new Map<string, ListSourceRow>();
  [...hardcodedVocabListItems.value, ...customVocabListItems.value].forEach((l) => {
    if (!map.has(l.id)) map.set(l.id, l);
  });
  return Array.from(map.values());
});

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
  // 1) hardcoded
  const meta: any = (vocabLists as any)[listKey];
  if (meta?.title) return meta.title;

  // 2) progress serializer (preferred, includes list_name)
  const p: any = (vw.progress || []).find((x: any) => x.list_key === listKey);
  if (p?.list_name && String(p.list_name).trim()) {
    return String(p.list_name).trim();
  }

  // 3) active session fallback
  const s: any = (vw.activeSessions || []).find((x: any) => x.list_key === listKey);
  if (s?.list_name && String(s.list_name).trim()) {
    return String(s.list_name).trim();
  }

  // 4) pretty fallback for legacy non-UUID keys
  if (listKey && listKey.includes("_") && !listKey.includes("-")) {
    const clearText = listKey.replace(/_/g, " ");
    return clearText.charAt(0).toUpperCase() + clearText.slice(1);
  }

  // 5) UUID fallback
  if (listKey && listKey.includes("-")) return "Custom Vocabulary Collection";

  return listKey;
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
   MAPS
===================================================== */

const progressByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const p of vw.progress ?? []) {
    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);
    map.set(key, p);
  }
  return map;
});

const activeSessionByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const s of vw.activeSessions ?? []) {
    if (s.status !== "active") continue;
    const key = makeTrackKey(s.list_key, s.mode, normLevel(s.level), s.track_key);
    if (!map.has(key)) map.set(key, s);
  }
  return map;
});

/* =====================================================
   COMPLETED
===================================================== */

const completedOnceItems = computed<TrackBadgeItem[]>(() => {
  const out: TrackBadgeItem[] = [];

  for (const p of vw.progress ?? []) {
    if (Number(p.sessions_finished ?? 0) < 1) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);
    out.push({
      key,
      title: `${listTitle(p.list_key)} • ${prettyMode(p.mode)} • ${prettyLevel(normLevel(p.level))} • ${prettyTrack(p.track_key)}`,
    });
  }

  return out.sort((a, b) => a.title.localeCompare(b.title));
});

const completedThreeItems = computed<TrackBadgeItem[]>(() => {
  const out: TrackBadgeItem[] = [];

  for (const p of vw.progress ?? []) {
    if (Number(p.sessions_finished ?? 0) < props.completionTarget) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);
    out.push({
      key,
      title: `${listTitle(p.list_key)} • ${prettyMode(p.mode)} • ${prettyLevel(normLevel(p.level))} • ${prettyTrack(p.track_key)}`,
    });
  }

  return out.sort((a, b) => a.title.localeCompare(b.title));
});

/* =====================================================
   UNSTARTED (WRITE ONLY, CUSTOM LISTS FROM /vocab-lists/)
===================================================== */

const unstartedTrackRows = computed<UnstartedTrackRow[]>(() => {
  const out: UnstartedTrackRow[] = [];

  for (const list of allVocabListItems.value) {
    // key requirement:
    // irregular verbs supports levels => essential and advanced are separate tracks
    const levels: (string | null)[] = list.supportsLevels ? ["essential", "advanced"] : [null];

    for (const level of levels) {
      const mode = "write";
      const trackKey = "default";
      const key = makeTrackKey(list.id, mode, level, trackKey);

      const prog = progressByTrack.value.get(key);
      if (Number(prog?.sessions_started ?? 0) > 0) continue;

      out.push({
        key,
        title: list.name,
        subtitle: `${level ? `${prettyLevel(level)} • ` : ""}${list.domain || "General"} • Default track`,
        listKey: list.id,
        listName: list.name,
        level,
        trackKey,
      });
    }
  }

  return out.sort((a, b) => a.title.localeCompare(b.title));
});

/* =====================================================
   ACTIVE WORK
===================================================== */

const activeWorkRows = computed<ActiveWorkRow[]>(() => {
  const out: ActiveWorkRow[] = [];

  for (const s of vw.activeSessions || []) {
    if (s.status !== "active") continue;

    const key = makeTrackKey(s.list_key, s.mode, normLevel(s.level), s.track_key);
    const prog = progressByTrack.value.get(key);

    const correct = Number(prog?.correct_count ?? s.correct_count ?? 0);
    const wrong = Number(prog?.wrong_count ?? s.wrong_count ?? 0);
    const attempts = correct + wrong;
    const accuracy = attempts ? Math.round((correct / attempts) * 1000) / 10 : 0;

    const progressPct =
      s.all_item_ids && s.mastered_item_ids && s.all_item_ids.length > 0
        ? Math.round((s.mastered_item_ids.length / s.all_item_ids.length) * 100)
        : 0;

    const resolvedTitle = listTitle(s.list_key);
    const progressListName = prog?.list_name ? String(prog.list_name).trim() : null;

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
      listName: progressListName || resolvedTitle,
      level: normLevel(s.level),
      trackKey: normTrackKey(s.track_key),
    });
  }

  out.sort((a, b) => {
    return (
      activeSessionByTrack.value
        .get(b.key)
        ?.last_activity_at?.localeCompare(activeSessionByTrack.value.get(a.key)?.last_activity_at ?? "") ?? 0
    );
  });

  return out;
});

/* =====================================================
   FETCH
===================================================== */

async function reload() {
  await Promise.all([
    vw.fetchMyWork(),
    loadAvailableVocabLists(),
  ]);
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