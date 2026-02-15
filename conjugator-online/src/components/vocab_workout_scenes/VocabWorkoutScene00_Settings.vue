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
              <v-btn color="success" size="x-large" @click="start" :disabled="!valid">
                Start
              </v-btn>
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- TWO-COLUMN LAYOUT -->
          <v-row>
            <!-- LEFT COLUMN: LIST PICKER -->
            <v-col cols="12" md="5">
              <div class="text-subtitle-2 mb-2">Vocab list</div>

              <v-radio-group v-model="selectedListKey" hide-details density="compact">
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
                  <v-col v-for="item in domainItems" :key="item.value" cols="12" sm="6">
                    <v-radio :label="item.title" :value="item.value" class="mb-1" />
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>

            <!-- RIGHT COLUMN: SETTINGS (only when list selected) -->
            <v-col cols="12" md="7" v-if="selectedListKey">
              <!-- LEVEL -->
              <div v-if="listSupportsLevels" class="mt-1">
                <div class="text-subtitle-2 mb-2">Level</div>
                <v-btn-toggle v-model="selectedLevel" mandatory divided class="level-toggle">
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
                          <v-radio :label="item.title" :value="item.value" />
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-radio-group
                      v-model="selectedBackField"
                      :label="
                        selectedMode === 'cards'
                          ? 'Back'
                          : selectedMode === 'multiple_choice'
                            ? 'The answer you have to select'
                            : 'What you have to write'
                      "
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

                <div
                  v-if="selectedListKey && allowedPairs.length === 0"
                  class="text-caption text-error mt-2"
                >
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

      <!-- PANEL 2: My progress (REPACKAGED) -->
      <v-window-item :value="1">
        <VWMyProgressPanel
          :completionTarget="COMPLETION_TARGET"
          @continue="continueSession"
          @start="(payload) => startNewSessionForList(payload.listKey, payload.level, payload.trackKey)"
        />
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

import VWMyProgressPanel from "@/components/vocab_workout_scenes/VWMyProgressPanel.vue";
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
  selectedFrontField.value = newKey === "irregular_verbs" ? "term" : "definition";
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

const irregularVerbItems = computed(() => {
  return Object.entries(availableListsComputed.value).flatMap(([moduleName, lists]) =>
    lists
      .filter((l) => l.value.startsWith("irregular_verbs"))
      .map((l) => ({
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

  return (props.availableLists?.[moduleKey] ?? []).map((l) => ({
    title: l.title,
    value: l.value,
    module: moduleKey,
    supportsLevels: l.supportsLevels,
  }));
});

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

  if (isIrregularListKey(listKey)) {
    if (back === "term" && ["definition", "French", "German", "Italian"].includes(front))
      return "to_infinitive";

    if (front === "term" && back === "past_simple") return "to_past_simple";
    if (front === "term" && back === "present_perfect") return "to_past_particple";
    if (front === "term" && back === "past_forms") return "to_past_forms";

    return null;
  }

  if (back === "term" && ["definition", "French", "German", "Italian"].includes(front)) return "to_term";
  return null;
}

function getAllowedPairs(listKey: string): Pair[] {
  if (isIrregularListKey(listKey)) {
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

  return [
    { front: "definition", back: "term", label: "Definition → Term" },
    { front: "French", back: "term", label: "French → Term" },
    { front: "German", back: "term", label: "German → Term" },
    { front: "Italian", back: "term", label: "Italian → Term" },
  ];
}

function isIrregularListKey(listKey: string | null | undefined): boolean {
  if (!listKey) return false;
  return listKey === "irregular_verbs" || listKey.startsWith("irregular_verbs");
}

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

const computedTrackKey = computed(() => {
  if (!selectedListKey.value) return null;
  if (!selectedFrontField.value || !selectedBackField.value) return null;
  return computeTrackKeyFrontend(
    selectedListKey.value,
    selectedFrontField.value as FieldValue,
    selectedBackField.value as FieldValue
  );
});

const allowedPairs = computed<Pair[]>(() => {
  const listKey = selectedListKey.value;
  if (!listKey) return [];
  return getAllowedPairs(listKey).filter((p) => !!computeTrackKeyFrontend(listKey, p.front, p.back));
});

const allowedFrontItems = computed(() => {
  const pairs = allowedPairs.value;
  const allowedFronts = new Set<FieldValue>();
  for (const p of pairs) allowedFronts.add(p.front);

  return Array.from(allowedFronts).map((v) => ({ title: FIELD_LABELS[v], value: v }));
});

const allowedBackItems = computed(() => {
  const pairs = allowedPairs.value;
  const allowedBacks = new Set<FieldValue>();
  for (const p of pairs) {
    if (!selectedFrontField.value || p.front === selectedFrontField.value) allowedBacks.add(p.back);
  }
  return Array.from(allowedBacks).map((v) => ({ title: FIELD_LABELS[v], value: v }));
});

const sortedFrontItems = computed(() => {
  return [...allowedFrontItems.value].sort((a, b) => {
    if (a.title === "Term") return -1;
    if (b.title === "Term") return 1;
    return a.title.localeCompare(b.title);
  });
});

// Auto-fix invalid pair whenever list or selections change.
function forceValidPair() {
  if (!selectedListKey.value) return;
  if (computedTrackKey.value) return;

  const pairs = allowedPairs.value;
  if (!pairs.length) return;

  const matchFront = pairs.find((p) => p.front === (selectedFrontField.value as FieldValue));
  const first = matchFront ?? pairs[0];

  selectedFrontField.value = first.front;
  selectedBackField.value = first.back;
}

watch(selectedFrontField, async (front) => {
  if (isIrregularListKey(selectedListKey.value) && front === "term") {
    selectedBackField.value = "";
    await nextTick();
    forceValidPair();
  }
});

watch(selectedListKey, (newKey) => {
  if (!newKey) return;

  if (isIrregularListKey(newKey)) {
    selectedFrontField.value = "definition";
    selectedBackField.value = "term";
  }

  forceValidPair();
});

watch([selectedFrontField, selectedBackField], () => {
  forceValidPair();
});

watch(listSupportsLevels, (supports) => {
  if (!supports) {
    selectedLevel.value = null;
  } else if (selectedLevel.value !== "essential" && selectedLevel.value !== "advanced") {
    selectedLevel.value = "essential";
  }
});

/* ----------------------------
   Emit helpers
---------------------------- */
function emitStartGame(payload: any) {
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
 * Start new from My Progress panel:
 */
function startNewSessionForList(listKey: string, level: string | null, trackKey: string | null) {
  // (kept same behavior as before)
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

  if (listSupportsLevels.value) {
    if (selectedLevel.value !== "essential" && selectedLevel.value !== "advanced") return false;
  }

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
    trackKey: computedTrackKey.value,
    quizCount: selectedMode.value === "quiz" ? selectedQuizCount.value : undefined,
  });
}
</script>
