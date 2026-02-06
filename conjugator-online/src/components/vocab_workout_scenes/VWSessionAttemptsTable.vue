<template>
  <div>
    <!-- Header / summary -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <div class="text-h6 font-weight-medium">
          Session attempts
        </div>
        <div class="text-caption text-medium-emphasis" v-if="meta">
          Status: <strong class="text-capitalize">{{ meta.status }}</strong>
          • Attempts: <strong>{{ meta.total_attempts }}</strong>
        </div>
      </div>

      <div class="d-flex ga-2 align-center" v-if="meta">
        <v-chip size="small" color="success" variant="tonal">✅ {{ meta.correct_count }}</v-chip>
        <v-chip size="small" color="error" variant="tonal">❌ {{ meta.wrong_count }}</v-chip>
        <v-btn variant="text" @click="reload" :loading="loading">Refresh</v-btn>
      </div>
    </div>

    <v-divider class="mb-3" />

    <div v-if="error" class="text-error text-caption mb-3">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate />
    </div>

    <div v-else>
      <div v-if="groupedRounds.length === 0" class="text-caption text-medium-emphasis">
        No attempts recorded for this session yet.
      </div>

      <v-table v-else density="compact">
        <thead>
          <tr>
            <th>#</th>
            <th>Term</th>
            <th>Prompt</th>
            <th>Attempts</th>
            <th>Results</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(g, i) in groupedRounds" :key="g.key">
            <td>{{ i + 1 }}</td>

            <td><strong>{{ g.term }}</strong></td>

            <td class="text-wrap" style="max-width: 260px;">
              {{ g.prompt }}
            </td>

            <!-- Attempts: show user answers side by side -->
            <td>
              <div class="d-flex ga-2 flex-wrap">
                <span
                  v-for="(a, j) in g.attempts"
                  :key="j"
                  class="text-caption"
                >
                  {{ a.user_answer }}
                </span>
              </div>
            </td>

            <!-- Correctness icons -->
            <td>
              <div class="d-flex ga-2">
                <span v-for="(a, j) in g.attempts" :key="j">
                  <span v-if="a.is_correct === true">✅</span>
                  <span v-else-if="a.is_correct === false">❌</span>
                  <span v-else>—</span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import { useAttrs } from "vue";
const attrs = useAttrs();

onMounted(() => {
});

type AttemptRow = {
  attempt_id: string;
  prompt_number: number;
  item_key: string; // listKey::term
  term: string;
  prompt_text: string;
  user_answer: string;
  is_correct: boolean | null;
  created_at?: string;
};

type SessionAttemptsResponse = {
  session_id: number;
  status: string;
  total_attempts: number;
  correct_count: number;
  wrong_count: number;
  attempts: AttemptRow[];
};

const props = defineProps<{
  sessionId: number | null;
  /** auto reload when sessionId changes */
  auto?: boolean;
}>();

const vw = useVocabWorkoutStore();

const loading = ref(false);
const error = ref<string | null>(null);
const meta = ref<SessionAttemptsResponse | null>(null);
const attempts = ref<AttemptRow[]>([]);

async function reload() {

  if (!props.sessionId) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data: any = await vw.fetchSessionAttempts(props.sessionId);

    meta.value = data as any;

    // tolerate both shapes (yours returns `attempts`; DRF pagination would return `results`)
    attempts.value = Array.isArray(data?.attempts)
      ? data.attempts
      : Array.isArray(data?.results)
        ? data.results
        : [];

    console.log("[AttemptsTable] attempts.value length AFTER assign:", attempts.value.length);
    console.log("[AttemptsTable] groupedRounds.value length AFTER assign:", groupedRounds.value.length);
    console.log("[AttemptsTable] attempts snapshot:", attempts.value.slice(0, 3));
  } catch (e: any) {
    console.log("[AttemptsTable] reload() ERROR full:", e);
    console.log("[AttemptsTable] reload() ERROR response:", e?.response);
    console.log("[AttemptsTable] reload() ERROR status:", e?.response?.status);
    console.log("[AttemptsTable] reload() ERROR data:", e?.response?.data);

    error.value = e?.response?.data?.detail || e?.message || "Failed to load attempts.";
    meta.value = null;
    attempts.value = [];
  } finally {
    loading.value = false;
    console.log("[AttemptsTable] reload() FINALLY (done), loading =", loading.value);
  }
}

/**
 * Grouping shape identical to your results page:
 * grouped by item_key (stable), showing all attempts for that item.
 */
const groupedRounds = computed(() => {
  const map = new Map<
    string,
    { key: string; term: string; prompt: string; attempts: AttemptRow[] }
  >();

  for (const a of attempts.value) {
    const key = a.item_key || `${a.term}::${a.prompt_text}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        term: a.term || "—",
        prompt: a.prompt_text || "—",
        attempts: [],
      });
    }

    map.get(key)!.attempts.push(a);
  }

  // Keep a stable order: earliest prompt_number first
  return Array.from(map.values()).sort((x, y) => {
    const ax = x.attempts?.[0]?.prompt_number ?? 0;
    const ay = y.attempts?.[0]?.prompt_number ?? 0;
    return ax - ay;
  });
});

watch(
  () => props.sessionId,
  async (newId, oldId) => {
    console.log("[AttemptsTable] sessionId changed:", oldId, "->", newId);
    if (props.auto !== false && newId) {
      await reload();
    } else {
      console.log(
        "[AttemptsTable] watcher did not reload because auto===false or newId falsy:",
        { auto: props.auto, newId }
      );
    }
  },
  { immediate: true }
);

onMounted(async () => {

  // Not strictly necessary because watcher has immediate:true, but keeping it for clarity.
  if (props.auto !== false && props.sessionId) {
    console.log("[AttemptsTable] onMounted triggering reload()");
    await reload();
  }
});
</script>