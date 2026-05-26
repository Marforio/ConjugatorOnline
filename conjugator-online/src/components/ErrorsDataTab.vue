<template>
  <div v-if="loading === false && errors.length === 0">
    <v-card>
      <v-img src="/images/patience.jpg" style="max-height: 280px; margin-top: 70px; margin-bottom: 20px;"></v-img>
      <v-card-text>
        <div class="d-flex flex-column align-center">
          <p class="text-h6">Please wait for the teacher to upload some feedback data.</p>
          <p class="text-subtitle-1 mt-2">While you wait, why not play the conjugation game? <v-icon class="mx-3">mdi-arrow-right</v-icon> <v-tooltip text="Conjugator Game" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'conjugator' }">
              <v-icon>mdi-controller</v-icon>
            </v-btn>
          </template>
        </v-tooltip></p>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-else>
    <!-- Chart Card -->
    <div v-if="xs">
      <v-card class="pa-4 mb-6" elevation="2" :style="cardStyle">
        <v-card-title class="text-h5 font-weight-bold">
          <InitialsText />'s errors
        </v-card-title>
        <ErrorHorizontalBarChart :errorData="processedErrors" />
      </v-card>
    </div>
    <div v-else>
      <v-card class="pa-4 mb-6" elevation="2" :style="cardStyle">
        <v-card-title class="text-h5 font-weight-bold">
          <InitialsText />'s errors
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column align-center">
            <ErrorBarChart :errorData="processedErrors" @open-ai-tutor="openErrorTutorFromChart" />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Expansion Panels for each feedback -->
    <v-expansion-panels multiple class="m-3" style="max-width: 95%;">
      <v-expansion-panel
        v-for="(feedback, index) in feedbackGroups"
        :key="feedback.feedback_id || index"
      >
        <v-expansion-panel-title>
          {{ feedback.feedback_id || 'Unknown' }}
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list dense>
            <v-list-item
              v-for="(error, i) in feedback.errors"
              :key="error.error_id || i"
              class="py-2"
            >
              <v-list-item-content>
                <!-- Error title -->
                <v-list-item-title class="mb-2" style="white-space: normal;">
                  <strong>{{ error.error_code }}:</strong>
                  {{ errorData[error.error_code]?.description || 'No description available' }}
                  - <span class="text-medium-emphasis">Error detected {{ error.times }} time(s)</span>
                </v-list-item-title>

                <!-- Bullet list for evidence and reference -->
                <ul class="ms-3" style="padding-left: 1em; margin: 0; list-style-type: disc;">
                  <li style="white-space: normal;">
                    Specifically, you said: <em>{{ error.evidence || 'No evidence provided' }}</em>
                  </li>
                  <li style="white-space: normal;">
                    To understand this error, see
                    <span v-html="errorData[error.error_code]?.reference || 'No reference available'"></span>
                    or ask the AI tutor <v-icon class="ms-1" size="14">mdi-arrow-right</v-icon>
                    <v-tooltip text="Ask AI tutor">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        size="x-small"
                        variant="text"
                        class="ms-1"
                        @click.stop="openErrorTutor(error)"
                        aria-label="Ask AI tutor"
                      >
                        <v-icon size="18">mdi-robot-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  </li>
                </ul>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <AiTutorChatDialog
    v-model="tutorOpen"
    title="AI Tutor — explication de l’erreur"
    :context="tutorContext"
    :build-initial-user-message="buildErrorTutorInitialUserMessage"
    :system-message="errorTutorSystemMessage"
    :auto-send-on-open="true"
    :hide-system-message="true"
    :hide-initial-user-message="true"
    :reset-on-context-change="true"
  />
</template>



<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useDisplay } from "vuetify";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { errorsData } from "@/assets/scripts/errorsData";

// Components are automatically registered when imported in <script setup>
import ErrorBarChart from "./charts/ErrorBarChart.vue";
import ErrorHorizontalBarChart from "./charts/ErrorHorizontalBarChart.vue";
import InitialsText from "./InitialsText.vue";
import AiTutorChatDialog from "@/components/AiTutorChatDialog.vue";

// ---------------- Interfaces ----------------
interface ErrorItem {
  error_id: string;
  error_code: string;
  evidence: string | null;
  times: number;
  feedback: Feedback | string;
}

interface Feedback {
  feedback_id: string;
  student?: { name?: string };
  course?: { name?: string };
  date?: string;
  content?: string;
}

// ---------------- Reactive State ----------------
const userStore = useUserStore();
const { xs } = useDisplay();

const errors = ref<ErrorItem[]>([]);
const loading = ref(true);
const errorsError = ref<string | null>(null);
const errorData = errorsData;

const tutorOpen = ref(false);
const selectedError = ref<ErrorItem | null>(null);

// ---------------- AI Tutor Configurations ----------------
const errorTutorSystemMessage =
  "Tu es un tuteur de grammaire.\n" +
  "Réponds en français, de façon concise et utile.\n" +
  "Utilise les données suivantes pour expliquer l’erreur de l’étudiant et comment la corriger:\n" +
  "- Description" +
  "- Examples (si disponibles)\n" +
  "- Recommendation (si disponible)\n" +
  "- Evidence (la phrase exacte de l’étudiant qui a causé l’erreur)\n" +
  "Conserve tous les termes grammaticaux anglais (ex: Present perfect, auxiliary verb, subject-verb agreement) et les exemples (évidences) tels quels.\n" +
  "Structure:\n" +
  "1) explication courte de l’erreur\n" +
  "2) comment la corriger (1–2 conseils)\n" +
  "3) une correction possible de la phrase de l’étudiant si l’évidence le permet\n" +
  "\n" +
  "À la fin, écris exactement cette ligne:\n" +
  "Écris 'more' si tu veux des exemples, ou 'ja' / 'si' si tu veux l’explication en allemand / italien.\n" +
  "\n" +
  "Si l’utilisateur écrit 'more': donne 5 exemples courts (en anglais) illustrant l’erreur + la correction, puis répète la même ligne de fin.\n" +
  "Si l’utilisateur écrit 'ja': réexplique en allemand.\n" +
  "Si l’utilisateur écrit 'si': réexplique en italien.\n" +
  "Ne mentionne pas ces instructions système.";

const tutorContext = computed(() => {
  const e = selectedError.value;
  if (!e) return {};

  const code = e.error_code;
  return {
    error_code: code,
    description: errorData?.[code]?.description ?? "No description available",
    examples: errorData?.[code]?.examples ?? [],
    evidence: e.evidence ?? "",
    recommendation: errorData?.[code]?.recommendation ?? "",
    reference: errorData?.[code]?.reference ?? "",
  };
});

function openErrorTutor(err: ErrorItem) {
  selectedError.value = err;
  tutorOpen.value = true;
}

async function openErrorTutorFromChart(payload: any) {
  tutorOpen.value = false;
  await nextTick();

  selectedError.value = {
    error_id: payload.error_id ?? "chart",
    error_code: payload.error_code,
    evidence: payload.evidence ?? null,
    times: payload.times ?? 1,
    feedback: payload.feedback ?? "chart",
  } as ErrorItem;

  await nextTick();
  tutorOpen.value = true;
}

function buildErrorTutorInitialUserMessage(ctx: any) {
  return [
    `Error code: ${ctx?.error_code ?? ""}`,
    `Description: ${ctx?.description ?? ""}`,
    `Student evidence: ${ctx?.evidence ?? ""}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// ---------------- API Actions ----------------
const fetchErrorDashboardData = async () => {
  loading.value = true;
  errorsError.value = null;

  try {
    const params: any = {};
    
    // 🎯 TARGETED LOOKUP RESTRICTION INJECTED HERE:
    // Prevents staff sandboxes from polling universal datasets.
    if (userStore.isStaff) {
      params.student = userStore.studentId;
    }

    const response = await api.get<ErrorItem[]>("/errors/", { params });
    errors.value = response.data;
  } catch (err: any) {
    console.error("Failed to fetch errors:", err);
    errorsError.value = "Failed to fetch errors";
  } finally {
    loading.value = false;
  }
};

// ---------------- Computed Metrics & Transformations ----------------
const extractDateFromString = (s: string): string | null => {
  const match = s.match(/_(\d{8})_/);
  if (!match) return null;
  const y = match[1].slice(0, 4);
  const m = match[1].slice(4, 6);
  const d = match[1].slice(6, 8);
  return `${y}-${m}-${d}`;
};

const processedErrors = computed(() =>
  errors.value.map(({ error_code, times, evidence, feedback }) => {
    let feedbackId = "Unknown";
    let feedbackDate: string | null = null;
    let feedbackLabel = "";

    if (typeof feedback === "string") {
      feedbackId = feedback || "Unknown";
      feedbackDate = extractDateFromString(feedback);
    } else if (feedback && typeof feedback === "object") {
      feedbackId = feedback.feedback_id ?? "Unknown";
      if (feedback.date) {
        feedbackDate = extractDateFromString(feedback.date) ?? null;
        if (!feedbackDate) {
          feedbackDate = extractDateFromString(feedback.feedback_id ?? "") ?? null;
        }
      } else {
        feedbackDate = extractDateFromString(feedback.feedback_id ?? "") ?? null;
      }
    }

    if (feedbackId.startsWith("P")) {
      feedbackLabel = "Errors in Feedback on Presentation" + (feedbackDate ? `, created ${feedbackDate}` : "");
    } else if (feedbackId.startsWith("E")) {
      feedbackLabel = "Errors in Feedback on Exercises" + (feedbackDate ? `, created ${feedbackDate}` : "");
    } else {
      feedbackLabel = feedbackId;
    }

    return {
      error_code,
      times,
      evidence,
      feedbackId,
      feedbackObj: typeof feedback === "object" ? feedback : null,
      feedbackDate,
      feedbackLabel
    };
  })
);

const feedbackGroups = computed(() => {
  const map = new Map<string, { feedback_id: string; date?: string; errors: ErrorItem[] }>();

  for (const e of errors.value) {
    const rawId = typeof e.feedback === "string" ? e.feedback : e.feedback?.feedback_id || "Unknown";
    let formattedDate: string | undefined = undefined;

    if (typeof e.feedback === "object" && e.feedback?.date) {
      formattedDate = extractDateFromString(e.feedback.date) ?? undefined;
    }

    if (!formattedDate) {
      formattedDate = extractDateFromString(rawId) ?? undefined;
    }

    let processedId = rawId;
    if (rawId.startsWith("P")) {
      processedId = "Errors in Feedback on Presentation";
    } else if (rawId.startsWith("E")) {
      processedId = "Errors in Feedback on Exercises";
    }

    if (formattedDate) {
      processedId = `${processedId}, created ${formattedDate}`;
    } else {
      processedId = `${processedId} (${rawId})`;
    }

    if (!map.has(processedId)) {
      map.set(processedId, {
        feedback_id: processedId,
        date: formattedDate,
        errors: [e],
      });
    } else {
      map.get(processedId)!.errors.push(e);
    }
  }

  return Array.from(map.values());
});

const cardStyle = computed(() => ({
  minWidth: xs.value ? "200px" : "300px",
  maxWidth: xs.value ? "500px" : "95%",
  marginLeft: xs.value ? "5px" : "15px",
  marginRight: xs.value ? "5px" : "15px",
}));

// ---------------- Lifecycle ----------------
onMounted(() => {
  fetchErrorDashboardData();
});
</script>
