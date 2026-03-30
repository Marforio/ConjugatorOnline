<template>
  <v-container class="mt-6">
    <div class="mb-6">
      <h1 class="text-h3 my-3">Grammar exercises</h1>

      <h2 class="text-h6 font-weight-regular mb-4">
        Grammar exercises for specific errors, organized by error code. See the
        <a :href="grammarBookUrl" target="_blank" rel="noopener noreferrer">Grammar Book</a>
        for full explanations.
      </h2>

      <!-- Search box (does NOT filter panels; only provides a quick link) -->
      <v-card
        variant="tonal"
        color="primary"
        class="px-4 py-3 my-8"
      >
        <div class="d-flex flex-wrap justify-center align-center ga-4">
          <div class="text-body-1">
            Search by error code:
          </div>

          <v-text-field
            v-model="searchCode"
            label="Enter a 4-digit code"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            class="my-0"
            style="max-width: 180px"
            inputmode="numeric"
            maxlength="4"
          />

          <div class="text-body-1">
            <template v-if="searchCode.trim().length === 0">
              <!-- nothing -->
            </template>

            <template v-else-if="!isValidSearchCode">
              <span class="text-medium-emphasis">Enter 4 digits (e.g. 0110)</span>
            </template>

            <template v-else-if="!hasErrorCode">
              <span class="text-medium-emphasis">No exercise found for {{ searchCode }}</span>
            </template>

            <template v-else>
              <RouterLink :to="`/exercises/${searchCode}`" class="text-primary font-weight-medium">
                Open exercise {{ searchCode }}
              </RouterLink>
            </template>
          </div>
        </div>
      </v-card>
    </div>

    <v-expansion-panels variant="accordion" multiple>
      <v-expansion-panel
        v-for="group in groupedErrors"
        :key="group.chapterId"
      >
        <v-expansion-panel-title>
          {{ group.panelTitle }}
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-table>
            <thead>
              <tr>
                <th>Error Code</th>
                <th>Description</th>
                <th>Exercise Link</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in group.items" :key="item.code">
                <td>{{ item.code }}</td>
                <td>{{ item.entry.description }}</td>
                <td>
                  <RouterLink :to="`/exercises/${item.code}`" class="text-primary">
                    Go to exercise
                  </RouterLink>
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

// TODO: replace with the URL you will provide
const grammarBookUrl = "https://book.language-labs.ch";

const searchCode = ref("");

// Hard-coded chapters inside this component:
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

// Your requested change:
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

// Grouping for expansion panels (NOT affected by search)
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

  // Initialize all panels (always show all chapters)
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

  // Put each error into its chapter
  for (const [code, entry] of Object.entries(errorsData)) {
    const ch = chapterFromErrorCode(code);
    if (!ch) continue;

    const group = groups.get(ch.chapterId);
    if (!group) continue;

    group.items.push({ code, entry });
  }

  // Sort items in each chapter
  for (const g of groups.values()) {
    g.items.sort((a, b) => Number(a.code) - Number(b.code));
  }

  return Array.from(groups.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);
});
</script>