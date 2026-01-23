<!-- src/components/vocab_workout/vocab_workout_scenes/VocabWorkoutScene00_Start.vue -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="860">
      <v-card-title class="mb-2">
          <div class="d-flex justify-center">
            <v-img src="/images/banners/VocabWorkout1.png" max-width="420" />
          </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- MODE -->
          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium">Mode</v-card-title>
            <v-radio-group v-model="selections.mode" class="ms-2" density="compact">
              <v-radio label="Cards (flip)" value="cards" />
              <v-radio label="Writing" value="write" />
              <v-radio label="Multiple choice" value="multiple_choice" />
              <v-radio label="Quiz (subset)" value="quiz" />
            </v-radio-group>

            <div v-if="selections.mode === 'quiz'" class="ms-2 mt-2">
              <div class="text-caption mb-1">Quiz size</div>
              <v-slider
                v-model="selections.quizCount"
                min="5"
                max="30"
                step="1"
                density="compact"
                hide-details
              />
              <div class="text-caption">
                Questions: <strong>{{ selections.quizCount }}</strong>
              </div>
            </div>
          </v-col>

          <!-- VOCAB SOURCE (domain + list) -->
          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium">Vocab set</v-card-title>

            <v-select
              v-model="selections.domain"
              :items="domainOptions"
              label="Choose domain"
              density="compact"
              class="mb-3"
            />

            <v-select
              v-model="selections.listKey"
              :items="listOptions"
              item-title="title"
              item-value="value"
              label="Choose list"
              density="compact"
              :disabled="!selections.domain || listOptions.length === 0"
              :hint="!selections.domain
                ? 'Pick a domain first'
                : (listOptions.length ? '' : 'No lists found for this domain')"
              persistent-hint
            />

            <!-- Only show level for irregular verbs domain -->
            <div v-if="supportsLevels" class="mt-4">
              <v-card-title class="font-weight-medium pa-0 mb-2">Verb level</v-card-title>
              <v-radio-group v-model="selections.level" class="ms-2" density="compact">
                <v-radio label="Essential" value="essential" />
                <v-radio label="Advanced" value="advanced" />
              </v-radio-group>
            </div>

          </v-col>

          <!-- STUDY PAIR -->
          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium">Study pair</v-card-title>

            <!-- Cards mode: front always TERM -->
            <template v-if="selections.mode === 'cards'">
              <div class="ms-1 text-caption text-medium-emphasis mb-2">
                Cards mode: front is always <strong>Term</strong>.
              </div>

              <v-select
                v-model="selections.backField"
                :items="cardBackOptions"
                item-title="title"
                item-value="value"
                label="Show on back"
                density="compact"
              />
            </template>

            <!-- Writing mode: choose prompt (shown) + what user writes (restricted) -->
            <template v-else-if="selections.mode === 'write'">
              <v-select
                v-model="selections.frontField"
                :items="writeFrontOptions"
                item-title="title"
                item-value="value"
                label="Show (prompt)"
                density="compact"
                class="mb-3"
              />

              <v-select
                v-model="selections.backField"
                :items="writeBackOptions"
                item-title="title"
                item-value="value"
                label="User writes"
                density="compact"
                :hint="writeHint"
                persistent-hint
              />
            </template>

            <!-- Other modes (multiple choice / quiz) -->
            <template v-else>
              <v-select
                v-model="selections.frontField"
                :items="nonWriteFrontOptions"
                item-title="title"
                item-value="value"
                label="Show (prompt)"
                density="compact"
                class="mb-3"
              />

              <v-select
                v-model="selections.backField"
                :items="nonWriteBackOptions"
                item-title="title"
                item-value="value"
                label="Answer"
                density="compact"
              />
            </template>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pb-4">
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="x-large" class="ms-3">
              <v-icon color="grey-darken-3" size="x-large">mdi-arrow-left-circle</v-icon>
            </v-btn>
          </RouterLink>

          <v-btn color="primary" @click="start" :disabled="!valid">Start</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

type Domain =
  | "Irregular verbs"
  | "General vocab"
  | "Architecture"
  | "Business"
  | "Chemistry"
  | "Civil"
  | "Computer Science"
  | "Electrical"
  | "Mechanical";

type Mode = "cards" | "write" | "multiple_choice" | "quiz";
type Level = "all" | "essential" | "advanced";

type Field =
  | "term"
  | "definition"
  | "French"
  | "German"
  | "Italian"
  | "past_simple"
  | "present_perfect"
  | "both"; // writing verbs only

type ListOption = { title: string; value: string; supportsLevels?: boolean };

const emit = defineEmits<{
  (e: "startGame", payload: any): void;
}>();

const props = defineProps<{
  availableLists?: Partial<Record<Domain, ListOption[]>>;
}>();

const domainOptions: Domain[] = [
  "Irregular verbs",
  "General vocab",
  "Architecture",
  "Business",
  "Chemistry",
  "Civil",
  "Computer Science",
  "Electrical",
  "Mechanical",
];


// fallback so UI works even before wiring SceneManager
const fallbackLists: Partial<Record<Domain, ListOption[]>> = {
  "Irregular verbs": [{ title: "Irregular verbs (all)", value: "irregularVerbs" }],
  "Architecture": [{ title: "House elements", value: "houseElements" }],
};

const selections = ref<{
  mode: Mode;
  domain: Domain | null;
  listKey: string;
  level: Level;
  frontField: Field;
  backField: Field;
  quizCount: number;
}>({
  mode: "cards",
  domain: null,
  listKey: "",
  level: "all",
  frontField: "definition",
  backField: "definition",
  quizCount: 15,
});

const listOptions = computed<ListOption[]>(() => {
  const map = props.availableLists ?? fallbackLists;
  const d = selections.value.domain;
  if (!d) return [];
  return map?.[d] ?? [];
});

const isIrregularDomain = computed(() => selections.value.domain === "Irregular verbs");
const isVerbSet = computed(() => isIrregularDomain.value);


const supportsLevels = computed(() => {
  if (!selections.value.domain || !selections.value.listKey) return false;
  const lists = (props.availableLists?.[selections.value.domain] ?? []);
  const found = lists.find(l => l.value === selections.value.listKey);
  return !!found?.supportsLevels;
});

// enforce level not "all" when supportsLevels
watch(supportsLevels, (v) => {
  if (v) {
    if (selections.value.level !== "essential" && selections.value.level !== "advanced") {
      selections.value.level = "essential";
    }
  } else {
    selections.value.level = "all"; // ignored anyway
  }
});


/* -----------------------------
   FRONT options
----------------------------- */
const baseFront: { title: string; value: Field }[] = [
  { title: "Term (headword)", value: "term" },
  { title: "Definition", value: "definition" },
  { title: "French", value: "French" },
  { title: "German", value: "German" },
  { title: "Italian", value: "Italian" },
];

const verbOnlyShow: { title: string; value: Field }[] = [
  { title: "Past simple", value: "past_simple" },
  { title: "Present perfect", value: "present_perfect" },
];

const writeFrontOptions = computed(() =>
  isIrregularDomain.value ? [...baseFront, ...verbOnlyShow] : [...baseFront]
);

const nonWriteFrontOptions = computed(() =>
  isIrregularDomain.value ? [...baseFront, ...verbOnlyShow] : [...baseFront]
);

/* -----------------------------
   CARDS back options
   - Only show PS/PP if irregular verbs domain
----------------------------- */
const cardBackOptions = computed(() => {
  const common = [
    { title: "Definition", value: "definition" },
    { title: "French", value: "French" },
    { title: "German", value: "German" },
    { title: "Italian", value: "Italian" },
  ];

  if (!isIrregularDomain.value) return common;

  return [
    ...common,
    { title: "Past forms (PS + PP)", value: "past_forms" },
  ];
});


/* -----------------------------
   WRITING back options (what user types)
----------------------------- */
const rawWriteBackOptions = computed<{ title: string; value: Field }[]>(() => {
  if (!isVerbSet.value) {
    return [{ title: "Term", value: "term" }];
  }
  return [
    { title: "Term (infinitive)", value: "term" },
    { title: "Past simple", value: "past_simple" },
    { title: "Present perfect", value: "present_perfect" },
    { title: "Past simple + Present perfect (2 fields)", value: "both" },
  ];
});

const writeBackOptions = computed(() => {
  const front = selections.value.frontField;
  return rawWriteBackOptions.value.filter((opt) => opt.value !== front);
});

const writeHint = computed(() => {
  if (!isVerbSet.value) return "Writing is limited to the term for this vocab set.";
  if (selections.value.backField === "both") return "You will type past simple AND present perfect.";
  return "You will type only the selected field.";
});

/* -----------------------------
   NON-WRITING back options (MC/quiz)
----------------------------- */
const nonWriteBackOptions = computed(() => {
  const front = selections.value.frontField;

  const common: { title: string; value: Field }[] = [
    { title: "Term (headword)", value: "term" },
    { title: "Definition", value: "definition" },
    { title: "French", value: "French" },
    { title: "German", value: "German" },
    { title: "Italian", value: "Italian" },
  ];

  const verbExtras: { title: string; value: Field }[] = isIrregularDomain.value
    ? [
        { title: "Past simple", value: "past_simple" },
        { title: "Present perfect", value: "present_perfect" },
      ]
    : [];

  return [...common, ...verbExtras].filter((opt) => opt.value !== front);
});

/* -----------------------------
   Reset listKey when domain changes
----------------------------- */
watch(
  () => selections.value.domain,
  () => {
    selections.value.listKey = "";

    // keep level sane
    if (!isIrregularDomain.value) selections.value.level = "all";

    // keep fields sane based on mode/domain
    if (selections.value.mode === "cards") {
      if (!cardBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = "definition";
      }
      return;
    }

    if (selections.value.mode === "write") {
      if (!writeFrontOptions.value.some((o) => o.value === selections.value.frontField)) {
        selections.value.frontField = "definition";
      }
      const preferred: Field = isVerbSet.value ? "past_simple" : "term";
      if (!rawWriteBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = preferred;
      }
      if (!writeBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = writeBackOptions.value[0]?.value ?? preferred;
      }
      return;
    }

    // MC / quiz
    if (!nonWriteFrontOptions.value.some((o) => o.value === selections.value.frontField)) {
      selections.value.frontField = "definition";
    }
    if (!nonWriteBackOptions.value.some((o) => o.value === selections.value.backField)) {
      selections.value.backField = nonWriteBackOptions.value[0]?.value ?? "term";
    }
  }
);
watch(
  () => selections.value.domain,
  () => {
    selections.value.listKey = "";

    const opts = listOptions.value;
    if (opts.length === 1) {
      selections.value.listKey = opts[0].value; // ✅ auto-pick
    }
  }
);
/* -----------------------------
   Mode switch defaults
----------------------------- */
watch(
  () => selections.value.mode,
  (m) => {
    if (m === "cards") {
      if (!cardBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = "definition";
      }
      return;
    }

    if (m === "write") {
      if (!writeFrontOptions.value.some((o) => o.value === selections.value.frontField)) {
        selections.value.frontField = "definition";
      }
      const preferred: Field = isVerbSet.value ? "past_simple" : "term";
      if (!rawWriteBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = preferred;
      }
      if (!writeBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = writeBackOptions.value[0]?.value ?? preferred;
      }
      return;
    }

    // MC / quiz
    if (!nonWriteFrontOptions.value.some((o) => o.value === selections.value.frontField)) {
      selections.value.frontField = "definition";
    }
    if (!nonWriteBackOptions.value.some((o) => o.value === selections.value.backField)) {
      selections.value.backField = nonWriteBackOptions.value[0]?.value ?? "term";
    }
    if (selections.value.frontField === selections.value.backField) {
      selections.value.backField = nonWriteBackOptions.value[0]?.value ?? "term";
    }
  },
  { immediate: true }
);

/* -----------------------------
   If front changes, ensure back still valid (write + non-write)
----------------------------- */
watch(
  () => selections.value.frontField,
  () => {
    if (selections.value.mode === "write") {
      if (!writeBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField =
          writeBackOptions.value[0]?.value ?? (isVerbSet.value ? "past_simple" : "term");
      }
    } else if (selections.value.mode !== "cards") {
      if (!nonWriteBackOptions.value.some((o) => o.value === selections.value.backField)) {
        selections.value.backField = nonWriteBackOptions.value[0]?.value ?? "term";
      }
    }
  }
);

/* -----------------------------
   Validation
----------------------------- */
const valid = computed(() => {
  if (!selections.value.mode) return false;
  if (!selections.value.domain) return false;
  if (!selections.value.listKey) return false;

  if (selections.value.mode === "cards") {
    return !!selections.value.backField;
  }

  if (!selections.value.frontField) return false;
  if (!selections.value.backField) return false;

  if (selections.value.frontField === selections.value.backField) return false;

  if (selections.value.mode === "write") {
    if (!rawWriteBackOptions.value.some((o) => o.value === selections.value.backField)) return false;
  }

  return true;
});

function start() {
  if (!valid.value) return;

  emit("startGame", {
    ...selections.value,
    // cards: engine should treat front as term always
    frontField: selections.value.mode === "cards" ? "term" : selections.value.frontField,
  });
}
</script>
