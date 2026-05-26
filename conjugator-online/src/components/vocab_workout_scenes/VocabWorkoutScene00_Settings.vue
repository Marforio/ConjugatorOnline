<template>
  <v-container class="pa-1 pa-md-1 bg-white min-h-screen text-slate-800" fluid>
    
    <div class="d-flex justify-center">
      <v-window-controls v-model="activePanel" length="2" />
    </div>

    <div class="d-flex align-center justify-space-between max-width-hub mx-auto">
      <v-btn
        variant="tonal"
        color="slate-600"
        @click="activePanel = 0"
        :disabled="activePanel === 0"
        class="rounded-lg text-none font-weight-bold px-4"
        prepend-icon="mdi-chevron-left"
      >
        New Workout Session
      </v-btn>

      <v-img
        src="/images/banners/VocabWorkout1.png"
        max-width="200px"
        class="mx-4 d-none d-sm-flex"
        contain
      />

      <v-btn
        variant="tonal"
        color="slate-600"
        @click="activePanel = 1"
        :disabled="activePanel === 1"
        class="rounded-lg text-none font-weight-bold px-4"
        append-icon="mdi-chevron-right"
      >
        Check My Progress
      </v-btn>
    </div>

    <v-window v-model="activePanel" class="max-width-hub mx-auto overflow-visible">
      
      <v-window-item :value="0">
        <v-card class="border rounded-xl bg-white" flat max-width="1200">
          
          <div class="px-4 px-md-5 py-3 border-b bg-slate-50 rounded-t-xl d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-4">
            <div>
              <div class="text-h6 font-weight-black text-slate-900 leading-none mb-1">Workout Settings</div>
              <div class="text-caption text-slate-500">Choose a list and study mode</div>
            </div>
            
            <div v-if="selectedListKey" class="d-flex align-center ga-2 w-100 w-sm-auto justify-end flex-wrap">
              
              <v-btn
                variant="outlined"
                color="slate-600"
                size="small"
                height="36"
                class="rounded-lg text-none font-weight-bold bg-white max-width-pdf-btn px-3"
                prepend-icon="mdi-file-pdf-box"
                @click="downloadListPdf"
                :loading="pdfLoading"
              >
                <span class="text-truncate">
                  Export PDF: {{ selectedListMeta?.title || selectedListKey }}
                </span>
              </v-btn>

              <v-btn
                :color="valid ? 'success' : 'slate-300'"
                :disabled="!valid"
                size="small"
                height="36"
                class="rounded-lg text-none font-weight-black tracking-wide px-4 elevation-1"
                prepend-icon="mdi-play-circle"
                @click="start"
              >
                Launch Workout
              </v-btn>
            </div>
          </div>

          <v-row no-gutters class="pa-4 pa-md-5">
            
            <v-col
              cols="12"
              :md="selectedListKey ? 5 : 12"
              :class="selectedListKey ? 'pr-md-4' : 'px-0 text-center mx-auto max-width-initial-picker'"
            >
              <div class="border rounded-xl pa-4 bg-slate-50 h-100">
                <div class="d-flex align-center mb-3">
                  <v-avatar color="primary" size="22" class="text-caption font-weight-black text-white mr-2">1</v-avatar>
                  <span class="text-subtitle-2 font-weight-black text-slate-900 uppercase tracking-wide">Select Vocab List</span>
                </div>

                <v-radio-group v-model="selectedListKey" hide-details density="compact" class="ma-0 pa-0 inline-radio-group">
                  
                  <div v-if="generalVocabItems?.length" class="text-overline font-weight-bold text-slate-400 tracking-wider mb-2 block leading-none">
                    General Vocabulary
                  </div>

                  <div v-if="generalVocabItems?.length" class="bg-white border rounded-xl pa-3 mb-4 space-stack-items">
                    <v-radio
                      v-for="item in irregularVerbItems"
                      :key="item.value"
                      :label="item.title"
                      :value="item.value"
                      color="primary"
                      class="compact-pills-radio border-b pb-1.5 mb-1.5"
                    />
                    <v-radio 
                      v-for="(item, idx) in generalVocabItems" 
                      :key="item.value" 
                      :label="item.title" 
                      :value="item.value" 
                      color="primary"
                      :class="{ 'border-b pb-1.5 mb-1.5': idx !== generalVocabItems.length - 1 }"
                      class="compact-pills-radio" 
                    />
                  </div>

                  <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-2 block leading-none">
                    My Domain (<span class="text-primary text-lowercase font-weight-black">{{ studentDomain }}</span>)
                  </div>

                  <div class="bg-white border rounded-xl pa-3 space-stack-items">
                    <v-radio 
                      v-for="(item, idx) in domainItems" 
                      :key="item.value" 
                      :label="item.title" 
                      :value="item.value" 
                      color="primary"
                      :class="{ 'border-b pb-1.5 mb-1.5': idx !== domainItems.length - 1 }"
                      class="compact-pills-radio" 
                    />
                  </div>
                </v-radio-group>
              </div>
            </v-col>

            <v-col v-if="selectedListKey" cols="12" md="7" class="pl-md-4 mt-5 mt-md-0">
              <div class="border rounded-xl pa-4 bg-white h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="primary" size="22" class="text-caption font-weight-black text-white mr-2">2</v-avatar>
                    <span class="text-subtitle-2 font-weight-black text-slate-900 uppercase tracking-wide">Define Study Mode</span>
                  </div>

                  <div v-if="listSupportsLevels" class="mb-4 animate-fade-in">
                    <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-2">Choose essential or advanced</div>
                    <v-btn-toggle v-model="selectedLevel" mandatory divided color="primary" variant="outlined" class="rounded-xl flex-width-toggle border" height="38">
                      <v-btn value="essential" class="text-none font-weight-bold flex-grow-1 text-caption">Essential</v-btn>
                      <v-btn value="advanced" class="text-none font-weight-bold flex-grow-1 text-caption">Advanced</v-btn>
                    </v-btn-toggle>
                  </div>

                  <div class="mb-4">
                    <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">Study Mode</div>
                    <v-chip-group v-model="selectedMode" mandatory color="primary" column class="ma-0 chip-matrix-row">
                      <v-chip value="cards" filter variant="tonal" size="comfortable" class="font-weight-bold rounded-lg px-4 py-1">Cards</v-chip>
                      <v-chip value="multiple_choice" filter variant="tonal" size="comfortable" disabled class="font-weight-bold rounded-lg px-4 py-1">Multiple Choice</v-chip>
                      <v-chip value="write" filter variant="tonal" size="comfortable" class="font-weight-bold rounded-lg px-4 py-1">Write</v-chip>
                      <v-chip value="quiz" filter variant="tonal" size="comfortable" disabled class="font-weight-bold rounded-lg px-4 py-1">Quiz</v-chip>
                    </v-chip-group>
                  </div>

                  <v-divider class="my-4 border-opacity-40"></v-divider>

                  <div v-if="selectedMode" class="mb-4 bg-slate-50 border rounded-xl pa-3 animate-fade-in">
                    <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-2 d-flex align-center">
                      <v-icon size="14" class="mr-2" color="slate-400">mdi-swap-horizontal</v-icon> Study Pair
                    </div>

                    <v-row no-gutters>
                      <v-col cols="12" sm="6" class="pr-sm-2 mb-3 mb-sm-0">
                        <div class="bg-white border rounded-lg pa-2">
                          <v-radio-group v-model="selectedFrontField" :label="selectedMode === 'cards' ? 'Card Front' : 'What you see (prompt)'" density="compact" hide-details class="custom-group-label">
                            <v-radio v-for="item in sortedFrontItems" :key="item.value" :label="item.title" :value="item.value" color="primary" class="text-caption font-weight-bold mt-1 text-slate-700" />
                          </v-radio-group>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="6" class="pl-sm-2">
                        <div class="bg-white border rounded-lg pa-2 h-100">
                          <v-radio-group v-model="selectedBackField" :label="selectedMode === 'cards' ? 'Card Back (Target)' : 'What you write (target)'" density="compact" hide-details class="custom-group-label">
                            <v-radio v-for="item in allowedBackItems" :key="item.value" :label="item.title" :value="item.value" color="primary" class="text-caption font-weight-bold mt-1 text-slate-700" />
                          </v-radio-group>
                        </div>
                      </v-col>
                    </v-row>

                    <div v-if="selectedListKey && allowedPairs.length === 0" class="text-caption font-weight-bold text-error mt-2 d-flex align-center px-1">
                      <v-icon size="14" class="mr-1">mdi-alert-circle-outline</v-icon>
                      This list has no valid study pairs configured yet.
                    </div>
                  </div>

                  <div v-if="selectedMode === 'quiz'" class="mb-4 animate-fade-in">
                    <v-text-field
                      v-model.number="selectedQuizCount"
                      label="Quiz Length Vector (Total Items)"
                      type="number"
                      min="1"
                      max="200"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      hide-details
                      class="rounded-xl font-weight-bold"
                    />
                  </div>
                </div>

                <div class="mt-4 pt-2 border-t">
                  <div v-if="!valid" class="text-caption font-weight-bold text-error mb-2 d-flex align-center">
                    <v-icon size="14" class="mr-1">mdi-lock-outline</v-icon>
                    <template v-if="!selectedListKey">Please choose a vocab list from Step 1.</template>
                    <template v-else-if="listSupportsLevels && !selectedLevel">Please choose a level.</template>
                    <template v-else-if="selectedMode === 'write' && !computedTrackKey">Writing progress is only tracked for specific study pairs.</template>
                    <template v-else>Please try different settings.</template>
                  </div>

                  <v-btn
                    block
                    height="46"
                    :color="valid ? 'success' : 'slate-300'"
                    :disabled="!valid"
                    class="rounded-xl font-weight-black text-none tracking-wide text-subtitle-2 elevation-1"
                    prepend-icon="mdi-play-circle"
                    @click="start"
                  >
                    Launch Workout
                  </v-btn>
                </div>

              </div>
            </v-col>
          </v-row>

        </v-card>
      </v-window-item>

      <v-window-item :value="1">
        <VWMyProgressPanel
          :completionTarget="COMPLETION_TARGET"
          @continue="continueSession"
          @start="(payload) => startNewSessionForList(payload.listKey, payload.level, payload.trackKey)"
        />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";
import { useUserStore } from "@/stores/user";

import VWMyProgressPanel from "@/components/vocab_workout_scenes/VWMyProgressPanel.vue";
import HomeButton from "../HomeButton.vue";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const pdfLoading = ref(false);

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

function getSelectedListTermMap(): Record<string, any> {
  const key = selectedListKey.value;
  if (!key) return {};

  const entry = (vocabLists as any)[key];
  const termMap = entry?.data;

  if (!termMap || typeof termMap !== "object" || Array.isArray(termMap)) return {};
  return termMap as Record<string, any>;
}


async function downloadListPdf() {
  if (!selectedListKey.value) return;

  pdfLoading.value = true;
  try {
    const title = selectedListMeta.value?.title ?? selectedListKey.value;

    const termMap = getSelectedListTermMap();
    let rows = toPdfRowsFromTermMap(termMap)
      .filter((r) => r.term.length > 0)
      .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));

    // Optional: filter by level for irregular verbs (or any list that provides a `level` per term)
    if (listSupportsLevels.value && selectedLevel.value) {
      rows = rows.filter((r) => {
        const raw = termMap[r.term];
        return String(raw?.level ?? "").toLowerCase() === String(selectedLevel.value).toLowerCase();
      });
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    doc.setFontSize(14);
    doc.text(`Vocab list: ${title}`, 40, 40);

const marginLeft = 30;
const marginRight = 30;

const isIrregular = selectedListKey.value?.startsWith("irregular_verbs");

const head = isIrregular
  ? ["Term", "Past forms", "Definition", "French", "German", "Italian"]
  : ["Term", "Definition", "French", "German", "Italian"];

const body = rows.map((r) =>
  isIrregular
    ? [r.term, r.past_forms || "", r.definition, r.French, r.German, r.Italian]
    : [r.term, r.definition, r.French, r.German, r.Italian]
);

// Choose “ideal” widths, then auto-scale to fit exactly
const idealWidths = isIrregular
  ? [95, 140, 240, 125, 125, 125]
  : [110, 300, 140, 140, 140];


  function fitColumnWidthsToPage(doc: jsPDF, widths: number[], marginLeft: number, marginRight: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const available = pageWidth - marginLeft - marginRight;

  const sum = widths.reduce((a, b) => a + b, 0);
  if (sum <= available) return widths;

  const scale = available / sum;
  return widths.map((w) => Math.floor(w * scale));
}
const fitted = fitColumnWidthsToPage(doc, idealWidths, marginLeft, marginRight);

const columnStyles: any = {};
for (let i = 0; i < fitted.length; i++) {
  columnStyles[i] = { cellWidth: fitted[i] };
}

  autoTable(doc, {
    startY: 60,
    margin: { left: marginLeft, right: marginRight },

    // ✅ this helps prevent unexpected stretching
    tableWidth: "wrap",

    head: [head],
    body,

    styles: {
      fontSize: 9,
      cellPadding: 4,
      overflow: "linebreak", // keep your existing behavior
      valign: "top",
    },

    headStyles: {
      fillColor: [30, 30, 30],
      textColor: 255,
    },

    columnStyles,
  });

      const safeName = String(title).replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
      const levelSuffix =
        listSupportsLevels.value && selectedLevel.value ? `_${selectedLevel.value}` : "";
      doc.save(`${safeName || "vocab_list"}${levelSuffix}.pdf`);
    } catch (e) {
      console.error("[VocabWorkoutSettings] PDF export failed:", e);
    } finally {
      pdfLoading.value = false;
    }
  }

type PdfRow = {
  term: string;
  past_forms?: string;
  definition: string;
  French: string;
  German: string;
  Italian: string;
};

function asStringArray(x: any): string[] {
  if (Array.isArray(x)) return x.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof x === "string") return x.split(/[;,/]+/).map((s) => s.trim()).filter(Boolean);
  return [];
}

function toPdfRowsFromTermMap(termMap: Record<string, any>): PdfRow[] {
  return Object.entries(termMap ?? {}).map(([term, data]) => {
    const ps = asStringArray((data as any)?.past_simple);
    const pp = asStringArray((data as any)?.present_perfect);

    const pastForms =
      ps.length || pp.length
        ? `${ps.join(" / ")}${ps.length && pp.length ? " • " : ""}${pp.join(" / ")}`
        : "";

    return {
      term: String(term ?? "").trim(),
      definition: String((data as any)?.definition ?? ""),
      past_forms: pastForms,
      French: String((data as any)?.French ?? ""),
      German: String((data as any)?.German ?? ""),
      Italian: String((data as any)?.Italian ?? ""),
    };
  });
}



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


const GENERAL_MODULE_NAME = "General Vocabulary";

const generalVocabItems = computed(() => {
  // Prefer exact key, but be tolerant of casing/spacing differences
  const keys = Object.keys(availableListsComputed.value);
  const key =
    keys.find((k) => k === GENERAL_MODULE_NAME) ??
    keys.find((k) => k.toLowerCase() === GENERAL_MODULE_NAME.toLowerCase()) ??
    null;

  if (!key) return [];

  return (availableListsComputed.value[key] ?? []).map((l) => ({
    title: l.title,
    value: l.value,
    module: key,
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

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.max-width-hub {
  max-width: 1100px;
  width: 100%;
}

.max-width-initial-picker {
  max-width: 540px;
  width: 100%;
}

/* Wizard Container Content Adjustments */
.flex-width-toggle {
  width: 100%;
  border-color: #e2e8f0 !important;
}

.flex-width-toggle :deep(.v-btn) {
  border-color: transparent !important;
}

.chip-matrix-row :deep(.v-chip--disabled) {
  opacity: 0.45 !important;
}

/* Micro Typography Alignment Rules Overrides */
.compact-pills-radio :deep(.v-selection-control) {
  min-height: 30px !important;
}

.compact-pills-radio :deep(.v-label) {
  font-size: 0.85rem !important;
  font-weight: 600;
  color: #334155 !important;
}

.space-stack-items {
  gap: 4px;
  display: flex;
  flex-column: initial;
  flex-direction: column;
}

/* Restricts the wide PDF text string from blowing out layout constraints on small screens */
.max-width-pdf-btn {
  max-width: 280px !important;
}

@media (max-width: 600px) {
  .max-width-pdf-btn {
    max-width: 100% !important;
    width: 100%;
  }
}

.custom-group-label :deep(.v-label.v-radio-group__label) {
  font-size: 0.7rem !important;
  text-transform: uppercase !important;
  font-weight: 800 !important;
  letter-spacing: 0.8px !important;
  color: #94a3b8 !important;
  margin-bottom: 6px !important;
}

/* Animation Acceleration Parameters */
.animate-fade-in {
  animation: setup-fade 0.25s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes setup-fade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
</style>