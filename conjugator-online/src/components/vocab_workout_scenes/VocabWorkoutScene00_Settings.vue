<!-- VocabWorkoutScene00_Settings.vue -->
<template>
  <v-container class="pa-6">
    <div class="d-flex justify-center">
        <v-window-controls v-model="activePanel" length="2" />
    </div>
    <!-- ARROWS ONLY -->
  <div class="d-flex align-center justify-space-between mt-2">

  <v-btn
    variant="text"
    @click="activePanel = 0"
    :disabled="activePanel === 0"
    class="d-flex align-center ga-2"
  >
    <v-icon>mdi-chevron-left</v-icon>
    <span class="ms-3">New session</span>
  </v-btn>

  <v-img
    src="/images/banners/VocabWorkout1.png"
    max-width="300px"
    class="mx-4"
    cover
  />

  <v-btn
    variant="text"
    @click="activePanel = 1"
    :disabled="activePanel === 1"
    class="d-flex align-center ga-2"
  >
    <span class="me-3">My progress</span>
    <v-icon>mdi-chevron-right</v-icon>
  </v-btn>


</div>

    <v-window v-model="activePanel">

  <!-- PANEL 1: Start studying -->
  <v-window-item :value="0">
  <v-card class="pa-4" max-width="1200" min-height="420">
    <div class="d-flex align-center justify-space-between">
      <div>
        <div class="text-h5 font-weight-medium">Settings</div>
        <div class="text-subtitle-1 text-medium-emphasis">
          Start a new training session
        </div>
      </div>
      <!-- START BUTTON -->
        <div v-if="selectedListKey && selectedMode" class="d-flex justify-end">
          <v-btn color="success" size="x-large" @click="start" :disabled="!valid">Start</v-btn>
        </div>
    </div>

    <v-divider class="my-4" />

    <!-- TWO-COLUMN LAYOUT -->
    <v-row>
      <!-- LEFT COLUMN: LIST PICKER -->
      <v-col cols="12" md="5">
        <div class="text-subtitle-2 mb-2">Vocab list</div>

        <v-radio-group
          v-model="selectedListKey"
          hide-details
          density="compact"
        >
          <!-- Irregular verbs -->
          <div class="text-caption text-medium-emphasis mb-1">Irregular verbs</div>
          <v-radio
            v-for="item in irregularVerbItems"
            :key="item.value"
            :label="item.title"
            :value="item.value"
            class="mb-1"
          />

          <v-divider class="my-3" />

          <!-- My domain -->
          <div class="text-caption text-medium-emphasis mb-1">
            My domain: <span class="text-capitalize">{{ studentDomain }}</span>
          </div>

          <v-row dense>
            <v-col
              v-for="item in domainItems"
              :key="item.value"
              cols="12"
              sm="6"
            >
              <v-radio
                :label="item.title"
                :value="item.value"
                class="mb-1"
              />
            </v-col>
          </v-row>
        </v-radio-group>
      </v-col>

      <!-- RIGHT COLUMN: SETTINGS (only when list selected) -->
      <v-col cols="12" md="7" v-if="selectedListKey">
        
        <!-- LEVEL -->
        <div v-if="listSupportsLevels" class="mt-1">
          <div class="text-subtitle-2 mb-2">Level</div>
          <v-btn-toggle
            v-model="selectedLevel"
            mandatory
            divided
            class="level-toggle"
          >
            <v-btn value="essential" variant="outlined" color="primary">Essential</v-btn>
            <v-btn value="advanced" variant="outlined" color="primary">Advanced</v-btn>
          </v-btn-toggle>

          <v-divider class="my-4" />
        </div>

        <!-- MODE -->
        <div class="text-subtitle-2 mb-2">Mode</div>
        <v-chip-group
          v-model="selectedMode"
          mandatory
          selected-class="text-primary"
          class="mb-2"
          column
        >
          <v-chip value="cards" color="primary" size="large">Cards</v-chip>
          <v-chip value="multiple_choice" variant="tonal" color="primary" size="large" disabled>
            Multiple choice
          </v-chip>
          <v-chip value="write" variant="tonal" color="primary" size="large">Writing</v-chip>
          <v-chip value="quiz" variant="tonal" disabled color="primary" size="large">Quiz</v-chip>
        </v-chip-group>

        <v-divider class="my-4" />

        <!-- STUDY PAIR -->
        <div v-if="selectedMode">
          <div class="text-subtitle-2 mb-2">Study pair</div>

          <v-row>
            <v-col cols="12" md="6">
              <v-radio-group
                v-model="selectedFrontField"
                :label="selectedMode === 'cards' ? 'Front (what you see first)' : 'Prompt (what you see)'"
                density="compact"
                hide-details
              >
                <v-row dense>
                  <v-col
                    v-for="item in sortedFrontItems"
                    :key="item.value"
                    cols="12"
                    sm="6"
                  >
                    <v-radio
                      :label="item.title"
                      :value="item.value"
                    />
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>

            <v-col cols="12" md="6">
              <v-radio-group
                v-model="selectedBackField"
                :label="selectedMode === 'cards'
                    ? 'Back'
                    : selectedMode === 'multiple_choice'
                      ? 'The answer you have to select'
                      : 'What you have to write'"
                density="compact"
                hide-details
              >
                <v-radio
                  v-for="item in allowedBackItems"
                  :key="item.value"
                  :label="item.title"
                  :value="item.value"
                />
              </v-radio-group>
            </v-col>
          </v-row>

          <div v-if="selectedListKey && allowedPairs.length === 0" class="text-caption text-error mt-2">
            This list has no valid study pairs configured yet.
          </div>

          <!-- QUIZ COUNT -->
          <v-text-field
            v-if="selectedMode === 'quiz'"
            v-model.number="selectedQuizCount"
            label="Quiz length"
            type="number"
            min="1"
            max="200"
            density="comfortable"
            hide-details
            class="mt-2"
          />
        </div>

        <!-- VALIDATION -->
        <div v-if="!valid" class="text-caption text-error mt-2">
          <template v-if="!selectedListKey">
            Please choose a vocab list.
          </template>
          <template v-else-if="listSupportsLevels && !selectedLevel">
            Please choose a level (essential/advanced).
          </template>
          <template v-else-if="selectedMode === 'write' && !computedTrackKey">
            Writing progress is only tracked for specific study pairs.
          </template>
          <template v-else>
            Please review your settings.
          </template>
        </div>

      </v-col>
    </v-row>
  </v-card>
</v-window-item>


<!-- PANEL 2: My progress -->
<v-window-item :value="1">
  <div class="d-flex flex-column ga-4">
    <!-- Top row: summary cards -->
    <v-row dense>
      <div class="mx-4">
        <div class="text-h5 font-weight-medium">Settings</div>
        <div class="text-subtitle-1 text-medium-emphasis">
          Continue an ongoing session or review your progress
        </div>
      </div>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="6">
        <VWCompletedOnceCard :items="completedOnceItems" class="mt-1 mb-5 mx-2" />
        <VWCompletedThreeTimesCard :items="completedThreeItems" class="mb-5 mx-2"  />
    </v-col>

      <v-col cols="12" md="6">
        <VWUnstartedTracksCard
          :items="unstartedTrackRows"
          @start="(payload) => startNewSessionForList(payload.listKey, payload.level, payload.trackKey)"
          class="mt-1 mx-2"
        />
      </v-col>
    </v-row>

    <!-- Bottom row: active progress only -->
    <VWActiveSessionsProgressList
      :rows="activeWorkRows"
      :loading="vw.loadingMyWork"
      :error="vw.errorMyWork"
      :completionTarget="COMPLETION_TARGET"
      @refresh="reload"
      @continue="continueSession"
      @start="startNewSessionForList"
    />
  </div>
</v-window-item>
</v-window>
<div class="d-flex justify-start mt-3">
<HomeButton />
</div>

  </v-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";
import { useUserStore } from "@/stores/user";

import VWCompletedOnceCard from "@/components/vocab_workout_scenes/VWCompletedOnceCard.vue";
import VWCompletedThreeTimesCard from "@/components/vocab_workout_scenes/VWCompletedThreeTimesCard.vue";
import VWUnstartedTracksCard from "@/components/vocab_workout_scenes/VWUnstartedTracksCard.vue";
import VWActiveSessionsProgressList from "@/components/vocab_workout_scenes/VWActiveSessionsProgressList.vue";
import HomeButton from "../HomeButton.vue";



/** If you want “Completed 3×” as the mastery target */
const COMPLETION_TARGET = 3;

type VWMode = "cards" | "write" | "multiple_choice" | "quiz" | "match" | null;
type VWLevel = "essential" | "advanced" | null;

const props = defineProps<{
  // from SceneManager
  availableLists: Record<string, { title: string; value: string; supportsLevels: boolean }[]>;
}>();

const emit = defineEmits<{
  (e: "startGame", payload: any): void;
}>();

const vw = useVocabWorkoutStore();
const user = useUserStore();

const activePanel = ref(0);

/* ----------------------------
   SETTINGS STATE
---------------------------- */
const selectedListKey = ref<string | null>(null);
const selectedMode = ref<VWMode>(null);
const selectedLevel = ref<VWLevel>(null);
const selectedFrontField = ref<string>("definition");
const selectedBackField = ref<string>("term");
const selectedQuizCount = ref<number>(20);

watch(selectedListKey, async (newKey) => {
  await nextTick();
  selectedFrontField.value =
    newKey === "irregular_verbs" ? "term" : "definition";
});

type FieldValue =
  | "term"
  | "definition"
  | "past_simple"
  | "present_perfect"
  | "past_forms"
  | "French"
  | "German"
  | "Italian";

type Pair = { front: FieldValue; back: FieldValue; label?: string };

/* ----------------------------
   Available lists (defensive)
---------------------------- */
const availableListsComputed = computed(() => props.availableLists ?? {});

/* ----------------------------
   List meta helpers (from picker)
---------------------------- */
const selectedListMeta = computed(() => {
  const flat = Object.values(availableListsComputed.value).flat();
  return flat.find((x) => x.value === selectedListKey.value) ?? null;
});

const listSupportsLevels = computed(() => !!selectedListMeta.value?.supportsLevels);

/* --------------------------------
for displaying progress
----------------------------------*/
/** ---- types used by the cards ---- */
type TrackKey = {
  listKey: string;
  mode: string;              // "write" | "quiz" (or others if you add later)
  level: string | null;      // "essential" | "advanced" | null
  trackKey: string | null;   // "default" | your track keys
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

/** ---- key helpers ---- */
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

/**
 * Optional: make trackKey prettier in UI.
 * If you have canonical track keys like "to_term", "to_past_forms" etc,
 * you can map them here.
 */
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

/** ---- Build a catalog of every possible “track” in the app ----
 * This lets us compute “unstarted”.
 *
 * Rules:
 * - modes: write + quiz (change if you want)
 * - levels: if supportsLevels -> essential/advanced else null
 * - trackKeys: if registry defines meta.trackKeys (array) use it, else ["default"]
 */
const allTracksCatalog = computed<TrackKey[]>(() => {
  const tracks: TrackKey[] = [];
  const MODES = ["write", "quiz"];

  for (const [listKey, metaRaw] of Object.entries(vocabLists)) {
    const meta: any = metaRaw as any;

    const levels: (string | null)[] = meta.supportsLevels ? ["essential", "advanced"] : [null];

    // ✅ Optional registry enhancement:
    // add `trackKeys: ["default", "to_past_forms", ...]` to a list meta if needed.
    const trackKeys: (string | null)[] = Array.isArray(meta.trackKeys) && meta.trackKeys.length
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

/** ---- progress map by composite track key ---- */
const progressByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const p of (vw.progress ?? [])) {
    const key = makeTrackKey(
      p.list_key,
      p.mode,
      normLevel(p.level),
      p.track_key
    );
    map.set(key, p);
  }
  return map;
});

/** ---- active sessions map (so we can tell which tracks are currently active) ---- */
const activeSessionByTrack = computed(() => {
  const map = new Map<string, any>();
  for (const s of (vw.activeSessions ?? [])) {
    if (s.status !== "active") continue;
    const key = makeTrackKey(
      s.list_key,
      s.mode,
      normLevel(s.level),
      s.track_key
    );
    // keep the most recent active session per track
    if (!map.has(key)) map.set(key, s);
  }
  return map;
});

/** =========================
 *  1) Completed 1×
 *  ========================= */
const completedOnceItems = computed<TrackBadgeItem[]>(() => {
  const out: TrackBadgeItem[] = [];

  for (const p of (vw.progress ?? [])) {
    const finished = Number(p.sessions_finished ?? 0);
    if (finished < 1) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);

    const title = `${listTitle(p.list_key)} • ${prettyMode(p.mode)} • ${prettyLevel(normLevel(p.level))} • ${prettyTrack(p.track_key)}`;

    out.push({ key, title });
  }

  return out.sort((a, b) => a.title.localeCompare(b.title));
});

/** =========================
 *  2) Completed 3×
 *  ========================= */
const completedThreeItems = computed<TrackBadgeItem[]>(() => {
  const out: TrackBadgeItem[] = [];

  for (const p of (vw.progress ?? [])) {
    const finished = Number(p.sessions_finished ?? 0);
    if (finished < COMPLETION_TARGET) continue;

    const key = makeTrackKey(p.list_key, p.mode, normLevel(p.level), p.track_key);

    const title = `${listTitle(p.list_key)} • ${prettyMode(p.mode)} • ${prettyLevel(normLevel(p.level))} • ${prettyTrack(p.track_key)}`;

    out.push({ key, title });
  }

  return out.sort((a, b) => a.title.localeCompare(b.title));
});

/** =========================
 *  3) Unstarted tracks
 *  =========================
 * “Unstarted” means: no progress row with sessions_started > 0 for that track.
 */
const unstartedTrackRows = computed<UnstartedTrackRow[]>(() => {
  const out: UnstartedTrackRow[] = [];

  for (const t of allTracksCatalog.value) {
    // ✅ write-only
    if (t.mode !== "write") continue;

    const key = makeTrackKey(t.listKey, t.mode, t.level, t.trackKey);
    const prog = progressByTrack.value.get(key);

    const started = Number(prog?.sessions_started ?? 0);
    if (started > 0) continue;

    out.push({
      key,
      title: `${listTitle(t.listKey)} • ${prettyMode(t.mode)}`,   // will always be Write now
      subtitle: `${prettyLevel(t.level)} • ${prettyTrack(t.trackKey)}`,
      listKey: t.listKey,
      level: t.level,
      trackKey: normTrackKey(t.trackKey),
    });
  }

  return out.sort((a, b) => a.title.localeCompare(b.title));
});


/** =========================
 *  4) Active progress bars only
 *  =========================
 * We build rows from active sessions, and enrich with progress aggregates when available.
 */
const activeWorkRows = computed<ActiveWorkRow[]>(() => {
  const out: ActiveWorkRow[] = [];

  for (const s of (vw.activeSessions ?? [])) {
    if (s.status !== "active") continue;

    const key = makeTrackKey(s.list_key, s.mode, normLevel(s.level), s.track_key);
    const prog = progressByTrack.value.get(key);

    const correct = Number(prog?.correct_count ?? s.correct_count ?? 0);
    const wrong = Number(prog?.wrong_count ?? s.wrong_count ?? 0);
    const attempts = correct + wrong;
    const accuracy = attempts ? Math.round((correct / attempts) * 1000) / 10 : 0;

    const completed = Number(prog?.sessions_finished ?? 0);
    const progressPct = s.all_item_ids && s.mastered_item_ids
        ? Math.round((s.mastered_item_ids.length / s.all_item_ids.length) * 100)
        : 0;


    out.push({
      key,
      title: `${listTitle(s.list_key)}`,
      subtitle: listTitle(s.list_key) === 'Irregular Verbs' ? `${prettyLevel(normLevel(s.level))} • ${prettyTrack(s.front_field)} ${prettyTrack(s.track_key)}` : `${prettyTrack(s.front_field)} ${prettyTrack(s.track_key)}`,
      correct,
      wrong,
      accuracy,
      completed,
      progressPct,
      canContinue: true,
      continueSessionId: Number(s.session_id),
      listKey: s.list_key,
      level: normLevel(s.level),
      trackKey: normTrackKey(s.track_key),
    });
  }

  // most recently active first (if you want)
  // if you store last_activity_at on the session, sort by it:
  out.sort((a, b) => (activeSessionByTrack.value.get(b.key)?.last_activity_at ?? "").localeCompare(
                    activeSessionByTrack.value.get(a.key)?.last_activity_at ?? ""));

  return out;
});

const groupedActiveWork = computed(() => {
  const groups = new Map<string, Map<string, ActiveWorkRow[]>>();

  for (const row of activeWorkRows.value) {
    if (!groups.has(row.title)) {
      groups.set(row.title, new Map());
    }

    const subtitleMap = groups.get(row.title)!;

    if (!subtitleMap.has(row.subtitle)) {
      subtitleMap.set(row.subtitle, []);
    }

    subtitleMap.get(row.subtitle)!.push(row);
  }

  return groups;
});



/* ----------------------------
   Domain + expected lists
---------------------------- */
const studentDomain = computed(() => (user.student as any)?.domain ?? null);

const domainModuleKey = computed(() => {
  const dom = (studentDomain.value ?? "").trim();
  if (!dom) return null;

  const keys = Object.keys(props.availableLists ?? {});
  const hit = keys.find((k) => k.toLowerCase() === dom.toLowerCase());
  return hit ?? null;
});

const expectedListKeys = computed(() => {
  const keys = new Set<string>();
  keys.add("irregular_verbs");

  const moduleKey = domainModuleKey.value;
  if (moduleKey) {
    (props.availableLists?.[moduleKey] ?? []).forEach((x) => keys.add(x.value));
  }
  return Array.from(keys);
});

const irregularVerbItems = computed(() => {
  return Object.entries(availableListsComputed.value)
    .flatMap(([moduleName, lists]) =>
      lists
        .filter(l => l.value.startsWith("irregular_verbs"))
        .map(l => ({
          title: l.title,
          value: l.value,
          module: moduleName,
          supportsLevels: l.supportsLevels,
        }))
    );
});

const domainItems = computed(() => {
  const moduleKey = domainModuleKey.value;
  if (!moduleKey) return [];

  return (props.availableLists?.[moduleKey] ?? []).map(l => ({
    title: l.title,
    value: l.value,
    module: moduleKey,
    supportsLevels: l.supportsLevels,
  }));
});



console.log("studentDomain:", studentDomain.value);
console.log("domainModuleKey:", domainModuleKey.value);
console.log("domain lists:", props.availableLists?.[domainModuleKey.value ?? ""] ?? []);


/* ----------------------------
   Track key (progress variant) rules
   - enforce for writing mode
---------------------------- */
watch(selectedFrontField, (front) => {
  if (isIrregularListKey(selectedListKey.value) && front === "term") {
    selectedBackField.value = ""; // clears filter so all back options appear
  }
});


function computeTrackKeyFrontend(listKey: string, front: FieldValue, back: FieldValue): string | null {
  if (!listKey) return null;
  if (front === back) return null;

  if ((isIrregularListKey(listKey))) {
    // translation/definition -> infinitive(term)
    if (back === "term" && ["definition", "French", "German", "Italian"].includes(front))
      return "to_infinitive";

    // infinitive(term) -> past simple
    if (front === "term" && back === "past_simple")
      return "to_past_simple";

    // infinitive(term) -> past participle
    if (front === "term" && back === "present_perfect")
      return "to_past_particple";

    // infinitive(term) -> both past forms
    if (front === "term" && back === "past_forms")
      return "to_past_forms";

    return null;
  }

  // Normal lists
  if (back === "term" && ["definition", "French", "German", "Italian"].includes(front))
    return "to_term";

  return null;
}


function getAllowedPairs(listKey: string): Pair[] {
  if ((isIrregularListKey(listKey))) {
    return [
      { front: "definition", back: "term", label: "Definition → Infinitive" },
      { front: "French", back: "term", label: "French → Infinitive" },
      { front: "German", back: "term", label: "German → Infinitive" },
      { front: "Italian", back: "term", label: "Italian → Infinitive" },
      { front: "term", back: "past_simple", label: "Infinitive → Past simple" },
      { front: "term", back: "present_perfect", label: "Infinitive → Past participle" },
      { front: "term", back: "past_forms", label: "Infinitive → Both past forms" },
    ];
  }

  // default lists
  return [
    { front: "definition", back: "term", label: "Definition → Term" },
    { front: "French", back: "term", label: "French → Term" },
    { front: "German", back: "term", label: "German → Term" },
    { front: "Italian", back: "term", label: "Italian → Term" },
  ];
}
function isIrregularListKey(listKey: string | null | undefined): boolean {
  if (!listKey) return false;
  console.log(listKey)
  return listKey === "irregular_verbs" || listKey.startsWith("irregular_verbs");
}


// These are the base “catalog” labels for rendering v-select items.
const FIELD_LABELS: Record<FieldValue, string> = {
  term: "Term",
  definition: "Definition",
  past_simple: "Past simple",
  present_perfect: "Present perfect",
  past_forms: "Both past forms",
  French: "French",
  German: "German",
  Italian: "Italian",
};

const allowedPairs = computed<Pair[]>(() => {
  const listKey = selectedListKey.value;
  if (!listKey) return [];

  // Only include pairs that pass the same gating logic (extra safety).
  return getAllowedPairs(listKey).filter(p => !!computeTrackKeyFrontend(listKey, p.front, p.back));
});

// Allowed front options based on selectedBackField (if set)
const allowedFrontItems = computed(() => {
  const pairs = allowedPairs.value;

  const allowedFronts = new Set<FieldValue>();
  for (const p of pairs) {
    allowedFronts.add(p.front);
  }

  return Array.from(allowedFronts).map(v => ({
    title: FIELD_LABELS[v],
    value: v,
  }));
});

// Allowed back options based on selectedFrontField (if set)
const allowedBackItems = computed(() => {
  const pairs = allowedPairs.value;

  const allowedBacks = new Set<FieldValue>();
  for (const p of pairs) {
    if (!selectedFrontField.value || p.front === selectedFrontField.value) {
      allowedBacks.add(p.back);
    }
  }

  return Array.from(allowedBacks).map(v => ({ title: FIELD_LABELS[v], value: v }));
});

const sortedFrontItems = computed(() => {
  return [...allowedFrontItems.value].sort((a, b) => {
    if (a.title === "Term") return -1;
    if (b.title === "Term") return 1;
    return a.title.localeCompare(b.title);
  });
});


// This becomes your “single source of truth” validity for *all modes*.
const computedTrackKey = computed(() => {
  if (!selectedListKey.value) return null;
  if (!selectedFrontField.value || !selectedBackField.value) return null;
  return computeTrackKeyFrontend(selectedListKey.value, selectedFrontField.value as FieldValue, selectedBackField.value as FieldValue);
});

// Auto-fix invalid pair whenever list or selections change.
function forceValidPair() {
  if (!selectedListKey.value) return;

  // If current pair valid, keep it.
  if (computedTrackKey.value) return;

  const pairs = allowedPairs.value;
  if (!pairs.length) return;

  // Prefer a pair that matches the current front if possible
  const matchFront = pairs.find(p => p.front === (selectedFrontField.value as FieldValue));
  const first = matchFront ?? pairs[0];

  selectedFrontField.value = first.front;
  selectedBackField.value = first.back;
}

watch(selectedFrontField, async (front) => {
  if (isIrregularListKey(selectedListKey.value) && front === "term") {
    selectedBackField.value = ""; // clear immediately
    await nextTick();             // allow computed/DOM to update
    forceValidPair();             // pick a valid back for front="term"
  }
});


watch(selectedListKey, (newKey) => {
  if (!newKey) return;

  if (isIrregularListKey(newKey)) {
    // Force the first irregular pair: definition → term
    selectedFrontField.value = "definition";
    selectedBackField.value = "term";
  }

  forceValidPair();
});


watch([selectedFrontField, selectedBackField], () => {
  // prevent front==back and prevent invalid combos
  forceValidPair();
});

watch(listSupportsLevels, (supports) => {
  if (!supports) {
    selectedLevel.value = null;
  } else if (selectedLevel.value !== "essential" && selectedLevel.value !== "advanced") {
    selectedLevel.value = "essential";
  }
});


function getTrackVariantsForList(listKey: string) {
  if ((isIrregularListKey(listKey))) {
    return [
      { trackKey: "to_infinitive", label: "Definition/Translation → Infinitive" },
      { trackKey: "to_past_simple", label: "Infinitive → Past simple" },
      { trackKey: "to_past_particple", label: "Infinitive → Past particple" },
      { trackKey: "to_past_forms", label: "Infinitive → Both past forms" },
    ];
  }
  return [{ trackKey: "to_term", label: "Definition/Translation → Term" }];
}

/* ----------------------------
   Progress/session lookup helpers
   (robust if backend doesn't send track_key)
---------------------------- */
function findWriteProgress(listKey: string, level: string | null, trackKey: string) {
  return vw.progress.find((p: any) => {
    const pTrack = p.track_key ?? p.trackKey ?? null;
    return (
      p.list_key === listKey &&
      p.mode === "write" &&
      (p.level ?? null) === (level ?? null) &&
      (pTrack ?? trackKey) === trackKey
    );
  });
}

function findActiveWriteSession(listKey: string, level: string | null, trackKey: string) {
  return (
    vw.activeSessions.find((s: any) => {
      const sTrack = s.track_key ?? s.trackKey ?? null;
      return (
        s.list_key === listKey &&
        s.mode === "write" &&
        (s.level ?? null) === (level ?? null) &&
        (sTrack ?? trackKey) === trackKey
      );
    }) ?? null
  );
}

/* ----------------------------
   Work rows: ALWAYS show potential lists (0% if none)
   + show separate progress bars for track variants
---------------------------- */
const workRows = computed(() => {
  const rows: any[] = [];

  for (const listKey of expectedListKeys.value) {
    const meta = (vocabLists as any)[listKey];
    if (!meta) continue;

    const supportsLevels = !!meta.supportsLevels;
    const levels = supportsLevels ? (["essential", "advanced"] as const) : ([null] as const);
    const variants = getTrackVariantsForList(listKey);

    for (const lvl of levels) {
      for (const variant of variants) {
        const prog = findWriteProgress(listKey, lvl, variant.trackKey);
        const active = findActiveWriteSession(listKey, lvl, variant.trackKey);

        const totalAttempts = prog?.total_attempts ?? 0;
        const correct = prog?.correct_count ?? 0;
        const wrong = prog?.wrong_count ?? 0;
        const accuracy = prog?.accuracy ?? 0;

        const completed = prog?.sessions_finished ?? 0;

        // Placeholder progress: attempts capped at 100
        const progressPct = Math.min(100, totalAttempts);

        rows.push({
          key: `${listKey}::${lvl ?? "none"}::${variant.trackKey}`,
          listKey,
          level: lvl,
          trackKey: variant.trackKey,

          title: supportsLevels ? `${meta.title} (${lvl})` : meta.title,
          subtitle: `${meta.module ?? "General"} • ${variant.label}`,

          correct,
          wrong,
          accuracy,
          completed,
          progressPct,

          canContinue: !!active,
          continueSessionId: active?.session_id ?? null,
        });
      }
    }
  }

  return rows;
});

/* ----------------------------
   Fetch
---------------------------- */
async function reload() {
  await vw.fetchMyWork();
}
onMounted(reload);

/* ----------------------------
   Emit helpers
---------------------------- */
function emitStartGame(payload: any) {
  // Resume path: listKey not required (SceneManager loads from backend)
  if (payload?.resumeSessionId) {
    emit("startGame", payload);
    return;
  }

  const listKey = payload?.listKey ?? selectedListKey.value;
  if (!listKey) {
    console.error("[VocabWorkoutSettings] Missing listKey.");
    return;
  }

  emit("startGame", { ...payload, listKey });
}

function continueSession(sessionId: number) {
  emitStartGame({
    resumeSessionId: sessionId,
    resume: true,
  });
}

/**
 * Start new from My Work:
 * We pass a trackKey, and choose safe default study pairs for that track.
 */
function startNewSessionForList(listKey: string, level: string | null, trackKey: string | null) {
  // Default front/back per track (prevents “easy progress” combos)
  let frontField = "definition";
  let backField = "term";

  if (listKey === "irregular_verbs" && trackKey === "to_past_forms") {
    frontField = "term";
    backField = "past_simple"; // user can later switch to present_perfect via settings
  }

  if (listKey === "irregular_verbs" && trackKey === "to_infinitive") {
    frontField = "definition";
    backField = "term";
  }

  if (listKey !== "irregular_verbs" && trackKey === "to_term") {
    frontField = "definition";
    backField = "term";
  }

  emitStartGame({
    listKey,
    level,
    mode: "write",
    frontField: "definition",
    backField: "term",
    trackKey,
    resume: false,
  });
}

/* ----------------------------
   Validations for Start
---------------------------- */
const valid = computed(() => {
  if (!selectedListKey.value) return false;

  // Level required only when list supports it
  if (listSupportsLevels.value) {
    if (selectedLevel.value !== "essential" && selectedLevel.value !== "advanced") return false;
  }

  // Pair must be pedagogically allowed (for ALL modes)
  return !!computedTrackKey.value;
});


/* ----------------------------
   Start from drawer
---------------------------- */
function start() {
  if (!valid.value) return;

  emit("startGame", {
    listKey: selectedListKey.value,
    mode: selectedMode.value,
    level: listSupportsLevels.value ? selectedLevel.value : null,
    frontField: selectedFrontField.value,
    backField: selectedBackField.value,
    trackKey: computedTrackKey.value, // ✅ always present when valid
    quizCount: selectedMode.value === "quiz" ? selectedQuizCount.value : undefined,
  });
}

</script>
