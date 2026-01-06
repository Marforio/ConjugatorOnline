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
            <ErrorBarChart :errorData="processedErrors" />
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
                  </li>
                </ul>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import ErrorBarChart from "./charts/ErrorBarChart.vue";
import ErrorHorizontalBarChart from "./charts/ErrorHorizontalBarChart.vue";
import InitialsText from "./InitialsText.vue";
import api from "@/axios";
import { useDisplay } from "vuetify";
import { errorsData } from "@/assets/scripts/errorsData";

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

export default defineComponent({
  name: "ErrorDashboard",
  components: { ErrorBarChart, ErrorHorizontalBarChart, InitialsText },

  setup() {
    const errors = ref<ErrorItem[]>([]);
    const loading = ref(true);
    const errorsError = ref<string | null>(null);
    const { xs } = useDisplay();
    const errorData = errorsData;

    const fetchErrorDashboardData = async () => {
      loading.value = true;
      errorsError.value = null;

      try {
        const response = await api.get<ErrorItem[]>("/errors/");
        errors.value = response.data;
      } catch (err: any) {
        console.error("Failed to fetch errors:", err);
        errorsError.value = errorsError.value
          ? `${errorsError.value}; Failed to fetch errors`
          : "Failed to fetch errors";
      }

      loading.value = false;
    };

const processedErrors = computed(() =>
  errors.value.map(({ error_code, times, evidence, feedback }) => {
    // defaults
    let feedbackId = "Unknown";
    let feedbackDate: string | null = null;
    let feedbackLabel = "";

    // Helper to parse date substring like "_20250620_" and return YYYY-MM-DD
    const extractDateFromString = (s: string): string | null => {
      const match = s.match(/_(\d{8})_/);
      if (!match) return null;
      const y = match[1].slice(0, 4);
      const m = match[1].slice(4, 6);
      const d = match[1].slice(6, 8);
      return `${y}-${m}-${d}`;
    };

    if (typeof feedback === "string") {
      // feedback already a string (student view) — may already contain the date
      feedbackId = feedback || "Unknown";
      feedbackDate = extractDateFromString(feedback);
    } else if (feedback && typeof feedback === "object") {
      // full object (admin view)
      feedbackId = feedback.feedback_id ?? "Unknown";
      if (feedback.date) {
        // sometimes date is encoded in feedback.date string (same pattern)
        feedbackDate = extractDateFromString(feedback.date) ?? null;
        // if not found inside feedback.date, attempt to parse feedback_id too
        if (!feedbackDate) {
          feedbackDate = extractDateFromString(feedback.feedback_id ?? "") ?? null;
        }
      } else {
        // fallback: maybe the feedback_id itself embeds the date
        feedbackDate = extractDateFromString(feedback.feedback_id ?? "") ?? null;
      }
    }

    // Make a friendly label (Presentation / Exercises + date if available)
    if (feedbackId.startsWith("P")) {
      feedbackLabel = "Errors in Feedback on Presentation" + (feedbackDate ? `, created ${feedbackDate}` : "");
    } else if (feedbackId.startsWith("E")) {
      feedbackLabel = "Errors in Feedback on Exercises" + (feedbackDate ? `, created ${feedbackDate}` : "");
    } else {
      feedbackLabel = feedbackId;
    }

    // Use the original feedbackId as the grouping key for charts (it already contains the raw id + date piece)
    return {
      error_code,
      times,
      evidence,
      feedbackId,                 // grouping key for the chart (unique per feedback+date)
      feedbackObj: typeof feedback === "object" ? feedback : null, // original object if present
      feedbackDate,               // parsed date or null
      feedbackLabel               // friendly label for UI
    };
  })
);


    // Group errors by feedback (with friendly names + date for panel headers)
    const feedbackGroups = computed(() => {
  const map = new Map<
    string,
    { feedback_id: string; date?: string; errors: ErrorItem[] }
  >();

  // helper: parse "_YYYYMMDD_" into "YYYY-MM-DD"
  const extractDateFromString = (s?: string): string | undefined => {
    if (!s) return undefined;
    const match = s.match(/_(\d{8})_/);
    if (!match) return undefined;
    const y = match[1].slice(0, 4);
    const m = match[1].slice(4, 6);
    const d = match[1].slice(6, 8);
    return `${y}-${m}-${d}`;
  };

  for (const e of errors.value) {
    // rawId works for both string and object cases
    const rawId =
      typeof e.feedback === "string"
        ? e.feedback
        : e.feedback?.feedback_id || "Unknown";

    // 1) try to get date from feedback.date (object case)
    let formattedDate: string | undefined = undefined;
    if (typeof e.feedback === "object" && e.feedback?.date) {
      formattedDate = extractDateFromString(e.feedback.date);
    }

    // 2) if not found, try to parse the rawId string (covers "P__20250620_..." strings)
    if (!formattedDate) {
      formattedDate = extractDateFromString(rawId);
    }

    // friendly prefix
    let processedId = rawId;
    if (rawId.startsWith("P")) {
      processedId = "Errors in Feedback on Presentation";
    } else if (rawId.startsWith("E")) {
      processedId = "Errors in Feedback on Exercises";
    } else {
      // leave the rawId or some other label for non-standard ids
      processedId = rawId;
    }

    // Append date and rawId to keep group labels informative AND unique" 
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

    onMounted(() => {
      fetchErrorDashboardData();
    });

    return {
      processedErrors,
      loading,
      errorsError,
      errors,
      xs,
      feedbackGroups,
      cardStyle,
      errorData,
    };
  },
});
</script>
