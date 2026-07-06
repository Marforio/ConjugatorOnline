<template>
  <v-container class="pa-1 pa-md-1 bg-white min-h-screen text-slate-800" fluid>
    
    <div class="d-flex justify-center mb-4">
      <v-window-controls v-model="activePanel" length="2" />
    </div>

    <div class="d-flex justify-center mx-auto mb-6" style="margin-top: 2%;">
      <v-card 
        class="d-flex pa-1.5 bg-slate-100 rounded-xl border border-slate-200/60 shadow-sm" 
        flat
        max-width="550"
        width="100%"
      >
        <v-btn
          @click="activePanel = 0"
          :variant="activePanel === 0 ? 'flat' : 'text'"
          :color="activePanel === 0 ? 'primary' : 'slate-600'"
          class="flex-grow-1 rounded-lg text-none font-weight-black text-body-2 py-2"
          height="44"
          prepend-icon="mdi-dumbbell"
        >
          New Training Session
        </v-btn>

        <v-btn
          @click="activePanel = 1"
          :variant="activePanel === 1 ? 'flat' : 'text'"
          :color="activePanel === 1 ? 'primary' : 'slate-600'"
          class="flex-grow-1 rounded-lg text-none font-weight-black text-body-2 py-2"
          height="44"
          prepend-icon="mdi-chart-timeline-variant"
        >
          Continue A Session
        </v-btn>
      </v-card>
    </div>

    <v-window v-model="activePanel" class="max-width-hub mx-auto overflow-visible">
      
      <v-window-item :value="0">
        <v-card class="border rounded-xl bg-white" flat max-width="1200">
          
          <div class="px-4 px-md-5 py-3 border-b bg-slate-50 rounded-t-xl d-flex flex-column flex-sm-row align-start align-sm-center justify-start ga-4">
            <v-icon size="x-large" class="mx-2">mdi-cards-outline</v-icon>
            <div>
              <div class="text-h6 font-weight-black text-slate-900 leading-none">Vocab Training - Settings</div>
              <div class="text-caption text-slate-500">Choose a list and training mode</div>
            </div>
            <v-spacer></v-spacer>
            
            <div v-if="selectedListId" class="d-flex align-center ga-2 w-100 w-sm-auto justify-end flex-wrap">
              
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
                  Export PDF: {{ selectedListMeta?.name || 'Vocab List' }}
                </span>
              </v-btn>

              <v-btn
                :color="valid ? 'success' : 'slate-300'"
                :disabled="!valid"
                size="small"
                height="36"
                class="rounded-lg text-none font-weight-black tracking-wide px-4 elevation-1 ms-8"
                prepend-icon="mdi-play-circle"
                @click="start"
              >
                Launch Training
              </v-btn>
            </div>
          </div>

          <v-row no-gutters class="pa-4 pa-md-5">
            
            <v-col
              cols="12"
              :md="selectedListId ? 5 : 12"
              :class="selectedListId ? 'pr-md-4' : 'px-0 text-center mx-auto max-width-initial-picker'"
            >
              <div class="border rounded-xl pa-4 bg-slate-50 h-100">
                <div class="d-flex align-center mb-2">
                  <v-avatar color="primary" size="22" class="text-caption font-weight-black text-white mr-2">1</v-avatar>
                  <span class="text-subtitle-2 font-weight-black text-slate-900 uppercase tracking-wide">Select Vocab List</span>
                </div>

                <!-- Loading state -->
                <v-progress-linear v-if="loadingLists" indeterminate class="mb-4" />

                <v-radio-group v-model="selectedListId" hide-details density="compact" class="ma-0 pa-0 inline-radio-group">
                  
                  <!-- General Vocabulary (Hardcoded Irregular Verbs) -->
                  <div v-if="irregularVerbItems?.length" class="text-overline font-weight-bold text-slate-400 tracking-wider mb-2 block leading-none">
                    General Vocabulary
                  </div>

                  <div v-if="irregularVerbItems?.length" class="bg-white border rounded-xl pa-3 mb-4 space-stack-items">
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
                      class="compact-pills-radio"
                      :class="{ 'border-b pb-1.5 mb-1.5': idx !== generalVocabItems.length - 1 }"
                    />
                  </div>

                  <!-- Custom Vocab Lists from Backend -->
                  <div v-if="customVocabListItems?.length > 0" class="text-overline font-weight-bold text-slate-400 tracking-wider mb-2 block leading-none">
                    My Domain: <span class="text-primary text-uppercase font-weight-semibold">{{ user.studentDomainLabel || 'General' }}</span>
                  </div>

                  <div v-if="customVocabListItems?.length > 0" class="bg-white border rounded-xl pa-3 space-stack-items">
                    <v-radio
                      v-for="(item, idx) in customVocabListItems"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      color="primary"
                      :class="{ 'border-b pb-1.5 mb-1.5': idx !== customVocabListItems.length - 1 }"
                      class="compact-pills-radio"
                    />
                  </div>

                  <!-- Empty state message -->
                  <div v-if="!loadingLists && !irregularVerbItems?.length && !customVocabListItems?.length" class="text-caption text-slate-500 pa-4 text-center">
                    No vocab lists available. Please check with your instructor.
                  </div>
                </v-radio-group>
              </div>
            </v-col>

            <v-col v-if="selectedListId" cols="12" md="7" class="pl-md-4 mt-5 mt-md-0">
              <div class="border rounded-xl pa-4 bg-white h-100 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="primary" size="22" class="text-caption font-weight-black text-white mr-2">2</v-avatar>
                    <span class="text-subtitle-2 font-weight-black text-slate-900 uppercase tracking-wide">Define Study Mode</span>
                  </div>

                  <!-- Level selector (for irregular verbs only for now) -->
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
                      <v-chip value="multiple_choice" filter variant="tonal" size="comfortable" class="font-weight-bold rounded-lg px-4 py-1">Multiple Choice</v-chip>
                      
                      <!-- 🌟 WRITE MODE - HIGHLIGHTED -->
                      <v-tooltip text="Awards trophy" location="top">
                        <template #activator="{ props: tooltipProps }">
                          <v-chip 
                            v-bind="tooltipProps"
                            value="write" 
                            filter 
                            variant="tonal"
                            size="large"
                            color="yellow-lighten-3"
                            class="font-weight-black rounded-lg px-5 py-2 text-slate-900 elevation-2 write-mode-chip"
                            prepend-icon="mdi-trophy"
                          >
                            Write
                          </v-chip>
                        </template>
                      </v-tooltip>

                      <v-chip value="asteroidz" filter variant="tonal" disabled size="comfortable" class="font-weight-bold rounded-lg px-4 py-1">Asteroidz</v-chip>
                      <v-chip value="space_invaders" filter variant="tonal" size="comfortable" class="font-weight-bold rounded-lg px-4 py-1">Space Invaderz</v-chip>
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

                    <div v-if="selectedListId && allowedPairs.length === 0" class="text-caption font-weight-bold text-error mt-2 d-flex align-center px-1">
                      <v-icon size="14" class="mr-1">mdi-alert-circle-outline</v-icon>
                      This list has no valid study pairs configured yet.
                    </div>
                  </div>

                  <div v-if="selectedMode === 'quiz'" class="mb-4 animate-fade-in">
                    <v-text-field
                      v-model.number="selectedQuizCount"
                      label="Quiz Length (Total Items)"
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
                    <template v-if="!selectedListId">Please choose a vocab list from Step 1.</template>
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
                    Launch Training
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
import api from "@/axios";

import VWMyProgressPanel from "@/components/vocab_workout_scenes/VWMyProgressPanel.vue";
import HomeButton from "../HomeButton.vue";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COMPLETION_TARGET = 3;

type VWMode = "cards" | "write" | "multiple_choice" | "quiz" | "match" | null;
type VWLevel = "essential" | "advanced" | null;

interface CustomVocabList {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  item_count: number;
  created_at: string;
  updated_at: string;
}

interface CustomVocabItem {
  id: string;
  vocab_list: string;
  term: string;
  definition: string;
  part_of_speech?: string;
  context_usage?: string;
  image_url?: string;
  additional_data?: Record<string, any>;
  created_at: string;
}

const emit = defineEmits<{
  (e: "startGame", payload: any): void;
}>();

const vw = useVocabWorkoutStore();
const user = useUserStore();

const activePanel = ref(0);
const pdfLoading = ref(false);
const loadingLists = ref(false);

/* ----------------------------
   SETTINGS STATE
---------------------------- */
const selectedListId = ref<string | null>(null); // UUID for custom lists, or special key for hardcoded
const selectedMode = ref<VWMode>(null);
const selectedLevel = ref<VWLevel>(null);
const selectedFrontField = ref<string>("definition");
const selectedBackField = ref<string>("term");
const selectedQuizCount = ref<number>(20);

/* ----------------------------
   Custom vocab lists from backend
---------------------------- */
const customVocabLists = ref<CustomVocabList[]>([]);
const customVocabItems = ref<Record<string, CustomVocabItem[]>>({}); // keyed by list ID

/* ----------------------------
   Load available custom vocab lists on mount
---------------------------- */
onMounted(async () => {
  await loadAvailableVocabLists();
});

async function loadAvailableVocabLists() {
  loadingLists.value = true;
  try {
    // Fetch all available custom vocab lists for this student
    // This endpoint respects VocabListAvailability permissions
    const response = await api.get<CustomVocabList[]>("/vocab-lists/");
    const rawData = response.data && typeof response.data === 'object' && 'results' in response.data
      ? (response.data as any).results
      : response.data;
    
    customVocabLists.value = Array.isArray(rawData) ? rawData : [];
    console.log("📚 Loaded custom vocab lists:", customVocabLists.value.length);
  } catch (err: any) {
    console.error("Failed to load custom vocab lists:", err);
    customVocabLists.value = [];
  } finally {
    loadingLists.value = false;
  }
}

/* ----------------------------
   Load items for selected list
---------------------------- */
watch(selectedListId, async (newId) => {
  if (!newId || isHardcodedListKey(newId)) {
    // Hardcoded list, no need to load items
    return;
  }

  try {
    // Fetch items for this custom list
    const response = await api.get<CustomVocabItem[]>(`/vocab-lists/${newId}/prompts/`);
    const items = Array.isArray(response.data) ? response.data : [];
    customVocabItems.value[newId] = items;
    console.log(`📖 Loaded ${items.length} items for list ${newId}`);
  } catch (err: any) {
    console.error(`Failed to load items for list ${newId}:`, err);
    customVocabItems.value[newId] = [];
  }
});

/* ----------------------------
   Hardcoded irregular verbs (from frontend registry)
---------------------------- */
const irregularVerbItems = computed(() => {
  return Object.entries(vocabLists as any)
    .filter(([key]) => key.startsWith("irregular_verbs"))
    .map(([key, entry]: [string, any]) => ({
      title: entry.title || key,
      value: key,
      supportsLevels: !!entry.supportsLevels,
    }));
});
const generalVocabItems = computed(() => {
  return Object.entries(vocabLists as any)
    .filter(([key]) => key.startsWith("general"))
    .map(([key, entry]: [string, any]) => ({
      title: entry.title || key,
      value: key,
      supportsLevels: !!entry.supportsLevels,
    }));
});

/* ----------------------------
   Custom vocab lists (from backend)
---------------------------- */
const customVocabListItems = computed(() => {
  return customVocabLists.value.map((list) => ({
    id: list.id,
    name: list.name,
    domain: list.domain,
  }));
});

/* ----------------------------
   Selected list metadata
---------------------------- */
const selectedListMeta = computed(() => {
  if (!selectedListId.value) return null;

  // Check if it's a custom list
  const customList = customVocabLists.value.find((l) => l.id === selectedListId.value);
  if (customList) return customList;

  // Check if it's a hardcoded list
  const hardcodedEntry = (vocabLists as any)[selectedListId.value];
  if (hardcodedEntry) {
    return {
      id: selectedListId.value,
      name: hardcodedEntry.title || selectedListId.value,
    };
  }

  return null;
});

const listSupportsLevels = computed(() => {
  if (!selectedListId.value) return false;
  // Only hardcoded irregular verbs support levels for now
  return isHardcodedListKey(selectedListId.value) && (vocabLists as any)[selectedListId.value]?.supportsLevels;
});

function isHardcodedListKey(key: string | null): boolean {
  if (!key) return false;
  return key.startsWith("irregular_verbs") || key.startsWith("general");
}

/* ----------------------------
   Get term data for PDF/validation
---------------------------- */
function getSelectedListTermMap(): Record<string, any> {
  const key = selectedListId.value;
  if (!key || !isHardcodedListKey(key)) return {};

  const entry = (vocabLists as any)[key];
  const termMap = entry?.data;

  if (!termMap || typeof termMap !== "object" || Array.isArray(termMap)) return {};
  return termMap as Record<string, any>;
}

function getSelectedListItems(): CustomVocabItem[] {
  const key = selectedListId.value;
  if (!key) return [];

  if (isHardcodedListKey(key)) return [];

  return customVocabItems.value[key] ?? [];
}

/* ----------------------------
   PDF Download
---------------------------- */
/* ----------------------------
   PDF Download
---------------------------- */
async function downloadListPdf() {
  if (!selectedListId.value) return;

  pdfLoading.value = true;
  try {
    const title = selectedListMeta.value?.name ?? selectedListId.value;

    let rows: PdfRow[] = [];
    const isIrregular = isHardcodedListKey(selectedListId.value);

    if (isIrregular) {
      // Hardcoded list
      const termMap = getSelectedListTermMap();
      rows = toPdfRowsFromTermMap(termMap)
        .filter((r) => r.term.length > 0)
        .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));

      if (listSupportsLevels.value && selectedLevel.value) {
        rows = rows.filter((r) => {
          const raw = termMap[r.term];
          return String(raw?.level ?? "").toLowerCase() === String(selectedLevel.value).toLowerCase();
        });
      }
    } else {
      // Custom list from backend
      const items = getSelectedListItems();
      rows = items.map((item: any) => {
        // 🌟 Safe multi-layer extraction matching the game engine architecture
        const data = item.additional_data || {};
        
        return {
          term: item.term || "",
          definition: item.definition || "",
          past_forms: "", // Custom lists typically don't have dual verb strings
          French: String(data.French || item.French || ""),
          German: String(data.German || item.German || ""),
          Italian: String(data.Italian || item.Italian || ""),
        };
      }).sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text(`Vocab list: ${title}`, 40, 40);

    const marginLeft = 30;
    const marginRight = 30;

    // 🌟 DYNAMIC HEADERS AND WIDTHS
    // We check if any rows contain translations to determine if the document needs language blocks
    const hasTranslations = rows.some(r => r.French || r.German || r.Italian);

    let head: string[];
    let body: any[][];
    let idealWidths: number[];

    if (isIrregular) {
      head = ["Term", "Past forms", "Definition", "French", "German", "Italian"];
      body = rows.map(r => [r.term, r.past_forms || "", r.definition, r.French, r.German, r.Italian]);
      idealWidths = [95, 140, 240, 125, 125, 125];
    } else if (hasTranslations) {
      // If custom list has languages, append them to columns cleanly
      head = ["Term", "Definition", "French", "German", "Italian"];
      body = rows.map(r => [r.term, r.definition, r.French, r.German, r.Italian]);
      idealWidths = [120, 280, 125, 125, 125];
    } else {
      // True 2-column fallback layout
      head = ["Term", "Definition"];
      body = rows.map(r => [r.term, r.definition]);
      idealWidths = [180, 570];
    }

    function fitColumnWidthsToPage(
      doc: jsPDF,
      widths: number[],
      marginLeft: number,
      marginRight: number
    ) {
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
      tableWidth: "wrap",
      head: [head],
      body,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: "linebreak",
        valign: "top",
      },
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
      },
      columnStyles,
    });

    const safeName = String(title)
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "");
    const levelSuffix =
      listSupportsLevels.value && selectedLevel.value ? `_${selectedLevel.value}` : "";
    doc.save(`${safeName || "vocab_list"}${levelSuffix}.pdf`);
  } catch (e) {
    console.error("[VWSettingsScene] PDF export failed:", e);
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
   Field & Pair Logic (works for both hardcoded and custom)
---------------------------- */
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

watch(selectedListId, async (newKey) => {
  if (!newKey) return;

  if (isHardcodedListKey(newKey)) {
    selectedFrontField.value = "definition";
    selectedBackField.value = "term";
  } else {
    // For custom lists, default to definition -> term
    selectedFrontField.value = "definition";
    selectedBackField.value = "term";
  }

  forceValidPair();
});

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

function computeTrackKeyFrontend(
  listId: string,
  front: FieldValue,
  back: FieldValue
): string | null {
  if (!listId) return null;
  if (front === back) return null;

  // Irregular Verbs specialized track mapping
  if (listId.startsWith("irregular_verbs")) {
    if (back === "term" && ["definition", "French", "German", "Italian"].includes(front))
      return "to_infinitive";

    if (front === "term" && back === "past_simple") return "to_past_simple";
    if (front === "term" && back === "present_perfect") return "to_past_particple";
    if (front === "term" && back === "past_forms") return "to_past_forms";

    if (["past_simple", "present_perfect", "past_forms"].includes(back)) {
      return `to_${back}`;
    }

    return null;
  }

  // General vocabulary lists or backend custom lists mapping to standard terms
  if (back === "term" && ["definition", "French", "German", "Italian"].includes(front)) {
    return "to_term";
  }
  
  return null;
}


// Add this helper to determine available fields for a list
function getAvailableFieldsForList(listId: string): FieldValue[] {
  // Hardcoded lists have predefined fields
  if (isHardcodedListKey(listId)) {
    return ["term", "definition", "past_simple", "present_perfect", "past_forms", "French", "German", "Italian"];
  }

  // For custom lists, inspect the actual items to see what's available
  const items = getSelectedListItems();
  if (!items.length) return ["definition", "term"];

  const fields = new Set<FieldValue>(["definition", "term"]);

  items.forEach((item) => {
    const data = item.additional_data || {};
    if (data.French) fields.add("French");
    if (data.German) fields.add("German");
    if (data.Italian) fields.add("Italian");
    if (data.past_simple) fields.add("past_simple");
    if (data.present_perfect) fields.add("present_perfect");
  });

  return Array.from(fields);
}

function getAllowedPairs(listId: string): Pair[] {
  // Irregular verbs have unique conjugation targets
  if (listId.startsWith("irregular_verbs")) {
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

  // Hardcoded general vocab lists or Custom DB lists build their fields dynamically
  const availableFields = getAvailableFieldsForList(listId);
  const pairs: Pair[] = [];

  if (availableFields.includes("definition") && availableFields.includes("term")) {
    pairs.push({ front: "definition", back: "term", label: "Definition → Term" });
  }

  ["French", "German", "Italian"].forEach((lang) => {
    if (availableFields.includes(lang as FieldValue) && availableFields.includes("term")) {
      pairs.push({ front: lang as FieldValue, back: "term", label: `${lang} → Term` });
    }
  });

  return pairs;
}

const computedTrackKey = computed(() => {
  if (!selectedListId.value) return null;
  if (!selectedFrontField.value || !selectedBackField.value) return null;
  return computeTrackKeyFrontend(
    selectedListId.value,
    selectedFrontField.value as FieldValue,
    selectedBackField.value as FieldValue
  );
});

const allowedPairs = computed<Pair[]>(() => {
  const listId = selectedListId.value;
  if (!listId) return [];
  return getAllowedPairs(listId).filter(
    (p) => !!computeTrackKeyFrontend(listId, p.front, p.back)
  );
});

const allowedFrontItems = computed(() => {
  const pairs = allowedPairs.value;
  const allowedFronts = new Set<FieldValue>();
  for (const p of pairs) allowedFronts.add(p.front);

  return Array.from(allowedFronts).map((v) => ({
    title: FIELD_LABELS[v],
    value: v,
  }));
});

const allowedBackItems = computed(() => {
  const pairs = allowedPairs.value;
  const allowedBacks = new Set<FieldValue>();
  for (const p of pairs) {
    if (!selectedFrontField.value || p.front === selectedFrontField.value)
      allowedBacks.add(p.back);
  }
  return Array.from(allowedBacks).map((v) => ({
    title: FIELD_LABELS[v],
    value: v,
  }));
});

const sortedFrontItems = computed(() => {
  return [...allowedFrontItems.value].sort((a, b) => {
    if (a.title === "Term") return -1;
    if (b.title === "Term") return 1;
    return a.title.localeCompare(b.title);
  });
});

function forceValidPair() {
  if (!selectedListId.value) return;
  if (computedTrackKey.value) return;

  const pairs = allowedPairs.value;
  if (!pairs.length) return;

  const matchFront = pairs.find(
    (p) => p.front === (selectedFrontField.value as FieldValue)
  );
  const first = matchFront ?? pairs[0];

  selectedFrontField.value = first.front;
  selectedBackField.value = first.back;
}

watch(selectedFrontField, async (front) => {
  if (isHardcodedListKey(selectedListId.value) && front === "term") {
    selectedBackField.value = "";
    await nextTick();
    forceValidPair();
  }
});

watch(selectedListId, async (newId) => {
  if (!newId) return;

  if (isHardcodedListKey(newId)) {
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

  const listId = payload?.listId ?? selectedListId.value;
  if (!listId) {
    console.error("[VWSettingsScene] Missing listId.");
    return;
  }

  emit("startGame", { ...payload, listId });
}

function continueSession(sessionId: number) {
  emitStartGame({
    resumeSessionId: sessionId,
    resume: true,
  });
}

function startNewSessionForList(
  listKey: string,
  level: string | null,
  trackKey: string | null
) {
  emitStartGame({
    listId: listKey, // Could be either hardcoded key or custom UUID
    level,
    mode: "write",
    frontField: "definition",
    backField: "term",
    trackKey,
    resume: false,
  });
}

/* ----------------------------
   Validations
---------------------------- */
const valid = computed(() => {
  if (!selectedListId.value) return false;

  if (listSupportsLevels.value) {
    if (selectedLevel.value !== "essential" && selectedLevel.value !== "advanced")
      return false;
  }

  return !!computedTrackKey.value;
});

/* ----------------------------
   Start game
---------------------------- */
function start() {
  if (!valid.value) return;

  emit("startGame", {
    listId: selectedListId.value,
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

.write-mode-chip {
  transition: all 0.2s ease;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.4) !important;
}

.write-mode-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.6) !important;
}
</style>