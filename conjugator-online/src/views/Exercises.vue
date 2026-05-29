<template>
  <v-container class="py-8 max-w-container text-slate-800">
    
    <!-- Top Header Workspace Section -->
    <v-card class="pa-6 mb-8 exercises-hero text-slate-900 border" rounded="xl" elevation="0">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <h1 class="text-h4 font-weight-black tracking-tight text-slate-900">Grammar Exercises</h1>
          <p class="text-body-1 text-slate-600 mt-2 max-w-prose">
            Practice for specific language errors organized by codes. 
            For complete explanations, use the 
            <a :href="grammarBookUrl" target="_blank" rel="noopener noreferrer" class="font-weight-bold text-teal-darken-2 link-underlined">
              Grammar Book <v-icon size="14" class="ms-0.5">mdi-open-in-new</v-icon>
            </a>.
          </p>
        </div>
        <v-avatar color="teal-lighten-5" class="text-teal-darken-2" size="64" variant="flat">
          <v-icon size="32">mdi-weight-lifter</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <!-- Search Code Dynamic Quick Router Interface -->
    <v-card
      class="pa-4 mb-8 border rounded-xl d-flex align-center bg-white shadow-xs"
      elevation="0"
    >
      <div class="d-flex flex-wrap align-center w-100 justify-space-between ga-4">
        <div class="d-flex align-center ga-3 flex-grow-1" style="min-width: 280px;">
          <v-avatar color="indigo-lighten-5" size="40" class="text-indigo-darken-2">
            <v-icon size="20">mdi-text-search</v-icon>
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold text-slate-800">Browse by chapter or do a direct search</div>
            <div class="text-caption text-slate-500">Find the chapter below or enter a 4-digit error code to locate the exercise unit directly</div>
          </div>
        </div>

        <div class="d-flex align-center flex-wrap ga-3 justify-sm-end flex-grow-1">
          <!-- Text Field input tracker wrapper -->
          <v-text-field
            v-model="searchCode"
            placeholder="e.g. 0110"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            style="max-width: 160px; min-width: 120px;"
            inputmode="numeric"
            maxlength="4"
            class="font-mono font-weight-bold"
            bg-color="slate-50"
          />

          <!-- Live Dynamic Feedback Pill Box -->
          <div class="text-body-2 min-w-status">
            <template v-if="searchCode.trim().length === 0">
              <span class="text-slate-400 font-weight-medium">Search by error code</span>
            </template>

            <template v-else-if="!isValidSearchCode">
              <v-chip size="small" color="orange" variant="tonal" class="font-weight-medium">
                <v-icon start size="14">mdi-alert-circle-outline</v-icon> Requires 4 digits
              </v-chip>
            </template>

            <template v-else-if="!hasErrorCode">
              <v-chip size="small" color="red" variant="tonal" class="font-weight-medium">
                <v-icon start size="14">mdi-close-circle-outline</v-icon> Code not found
              </v-chip>
            </template>

            <template v-else>
              <v-btn
                :to="`/exercises/${searchCode.trim()}`"
                color="teal"
                variant="flat"
                size="small"
                class="text-none font-weight-bold text-white rounded-lg px-4"
                append-icon="mdi-arrow-right"
              >
                Launch Exercise {{ searchCode }}
              </v-btn>
            </template>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Master Interactive Accordion Expansion Layout -->
    <v-expansion-panels variant="popout" multiple class="ga-3">
      <v-expansion-panel
        v-for="group in groupedErrors"
        :key="group.chapterId"
        class="border rounded-xl bg-white overflow-hidden panel-card shadow-xs"
        elevation="0"
      >
        <v-expansion-panel-title class="py-4 px-5 text-subtitle-1 font-weight-bold text-slate-800">
          <template v-slot:default="{ expanded }">
            <div class="d-flex align-center justify-space-between w-100 pr-4">
              <div class="d-flex align-center ga-3">
                <v-avatar 
                  :color="expanded ? 'teal' : 'slate-100'" 
                  :class="expanded ? 'text-white' : 'text-slate-500'"
                  size="32" 
                  class="font-weight-black text-caption font-mono transition-all"
                >
                  {{ String(group.chapterNumber).padStart(2, '0') }}
                </v-avatar>
                <span :class="expanded ? 'text-teal-darken-3 font-weight-black' : 'text-slate-800'">
                  {{ stripChapterPrefix(chapterNameById.get(group.chapterId) || '') }}
                </span>
              </div>
              <v-chip size="small" variant="tonal" color="slate-500" class="font-weight-bold hidden-xs">
                Errors starting with {{ String(group.chapterNumber).padStart(2, '0') }} _ _
              </v-chip>
            </div>
          </template>
        </v-expansion-panel-title>

        <v-expansion-panel-text class="pa-0 border-t bg-slate-50-fluid">
          <v-table density="comfortable" class="bg-transparent text-body-2 table-fixed">
            <thead class="bg-slate-100-header">
              <tr>
                <th class="font-weight-bold text-slate-600 font-mono" style="width: 120px; padding-left: 20px;">Code</th>
                <th class="font-weight-bold text-slate-600">Grammar Core Objective / Description</th>
                <th class="font-weight-bold text-slate-600 text-center" style="width: 160px; padding-right: 20px;">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in group.items" :key="item.code" class="exercise-tr transition-all">
                <td class="font-weight-bold font-mono text-teal-darken-2" style="padding-left: 20px;">
                  {{ item.code }}
                </td>
                <td class="text-slate-700 font-weight-medium py-3 pr-4">
                  {{ item.entry.description }}
                </td>
                <td class="text-center" style="padding-right: 20px;">
                  <v-btn
                    :to="`/exercises/${item.code}`"
                    variant="tonal"
                    color="teal"
                    size="small"
                    class="text-none font-weight-black rounded-lg w-100 bg-teal-tight"
                    append-icon="mdi-play"
                  >
                    Start Unit
                  </v-btn>
                </td>
              </tr>
              <tr v-if="group.items.length === 0">
                <td colspan="3" class="text-center text-slate-400 py-6 bg-white border-none italic">
                  No execution segments loaded into this node block context.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TopNavBar from "@/components/TopNavBar.vue";
import { errorsData } from "@/assets/scripts/errorsData";

defineOptions({
  name: "Exercises",
  components: { TopNavBar },
});

const grammarBookUrl = "https://book.language-labs.ch";
const searchCode = ref("");

const chapters = [
  { id: "ch1", name: "1. Nouns and determiners" },
  { id: "ch2", name: "2. Adjectives and adverbs" },
  { id: "ch3", name: "3. Verb conjugation" },
  { id: "ch4", name: "4. Verb tenses and modalities" },
  { id: "ch5", name: "5. Past modals" },
  { id: "ch6", name: "6. Linking words" },
  { id: "ch7", name: "7. Sentence structure" },
  { id: "ch8", name: "8. Passive voice" },
  { id: "ch9", name: "9. Pronouns" },
  { id: "ch10", name: "10. Prepositions" },
  { id: "ch11", name: "11. Verb complements" },
  { id: "ch12", name: "12. Possessive 's" },
  { id: "ch13", name: "13. Special uses of auxiliaries" },
  { id: "ch14", name: "14. Pronunciation" },
  { id: "ch15", name: "15. Vocabulary" },
] as const;

const chapterNameById = new Map<string, string>(chapters.map((c) => [c.id, c.name]));

function chapterFromErrorCode(code: string): { chapterNumber: number; chapterId: string } | null {
  if (!/^\d{4}$/.test(code)) return null;
  const chapterNumber = Number(code.slice(0, 2));
  if (!Number.isFinite(chapterNumber) || chapterNumber <= 0) return null;
  return { chapterNumber, chapterId: `ch${chapterNumber}` };
}

function stripChapterPrefix(chapterName: string): string {
  return chapterName.replace(/^\s*\d+\.\s*/, "");
}

function twoDigitPrefix(n: number): string {
  return String(n).padStart(2, "0");
}

const isValidSearchCode = computed(() => /^\d{4}$/.test(searchCode.value.trim()));
const hasErrorCode = computed(() => {
  if (!isValidSearchCode.value) return false;
  return Object.prototype.hasOwnProperty.call(errorsData, searchCode.value.trim());
});

const groupedErrors = computed(() => {
  const groups = new Map<
    string,
    {
      chapterNumber: number;
      chapterId: string;
      panelTitle: string;
      items: Array<{ code: string; entry: (typeof errorsData)[string] }>;
    }
  >();

  for (const ch of chapters) {
    const chapterNumber = Number(ch.id.replace(/^ch/, ""));
    const chapterPrettyName = stripChapterPrefix(ch.name);
    const prefix = twoDigitPrefix(chapterNumber);

    groups.set(ch.id, {
      chapterNumber,
      chapterId: ch.id,
      panelTitle: `Chapter ${chapterNumber} - ${chapterPrettyName} - (errors starting with ${prefix}--)`,
      items: [],
    });
  }

  for (const [code, entry] of Object.entries(errorsData)) {
    const ch = chapterFromErrorCode(code);
    if (!ch) continue;

    const group = groups.get(ch.chapterId);
    if (!group) continue;

    group.items.push({ code, entry });
  }

  for (const g of groups.values()) {
    g.items.sort((a, b) => Number(a.code) - Number(b.code));
  }

  return Array.from(groups.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);
});
</script>

<style scoped>
.max-w-container {
  max-width: 1120px;
  margin: 0 auto;
}

.exercises-hero {
  background: linear-gradient(135deg, #f8fafc 0%, #f0fdfa 100%);
  border-color: #e2e8f0 !important;
}

.link-underlined {
  text-decoration: none;
}
.link-underlined:hover {
  text-decoration: underline;
}

.shadow-xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

.min-w-status {
  min-width: 160px;
  text-align: right;
}

.bg-slate-50-fluid {
  background-color: #fafafa !important;
}

.bg-slate-100-header {
  background-color: #f1f5f9 !important;
}

.exercise-tr:hover {
  background-color: #ffffff !important;
}

.bg-teal-tight {
  background-color: #f0fdfa !important;
}

.panel-card {
  border: 1px solid #e2e8f0 !important;
  transition: all 0.2s ease-in-out;
}
.panel-card:hover {
  border-color: #cbd5e1 !important;
}

.transition-all {
  transition: all 0.15s ease-in-out;
}

.vertical-middle {
  vertical-align: middle !important;
}

.table-fixed {
  table-layout: fixed;
  width: 100%;
}

.border-t {
  border-top: 1px solid #e2e8f0 !important;
}

@media (max-width: 600px) {
  .hidden-xs {
    display: none !important;
  }
  .min-w-status {
    min-width: 100%;
    text-align: left;
    margin-top: 4px;
  }
}
</style>