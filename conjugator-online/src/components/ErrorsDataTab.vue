<template>
  <div>
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
import { errorsData } from '@/assets/scripts/errorsData';

interface ErrorItem {
  error_id: string;
  error_code: string;
  evidence: string | null;
  times: number;
  feedback: Feedback;
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
    const errorData = errorsData

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
      errors.value.map(({ error_code, times, evidence, feedback }) => ({
        error_code,
        times,
        evidence,
        feedback: feedback?.feedback_id ?? "Unknown Feedback"
      }))
    );

    // Group errors by feedback
    // Group errors by feedback with processed date and type
const feedbackGroups = computed(() => {
  const map = new Map<
    string,
    { feedback_id: string; date?: string; errors: ErrorItem[] }
  >();

  for (const e of errors.value) {
    let rawId = e.feedback?.feedback_id || "Unknown";
    let processedId = rawId;

    // Extract date from the string (_YYYYMMDD_) ignoring the last 4 digits
    let rawDate = e.feedback?.date || "";
    let formattedDate: string | undefined = undefined;

    if (rawDate) {
      const match = rawDate.match(/_(\d{8})_/);
      if (match) {
        const y = match[1].slice(0, 4);
        const m = match[1].slice(4, 6);
        const d = match[1].slice(6, 8);
        formattedDate = `${y}-${m}-${d}`;
      }
    }
    // Replace P/E prefixes with friendly words
    if (rawId.startsWith("P")) processedId = "Errors in Feedback on Presentation, created " + formattedDate;
    else if (rawId.startsWith("E")) processedId = "Errors in Feedback on Exercises, created " + formattedDate;

    if (!map.has(processedId)) {
      map.set(processedId, { feedback_id: processedId, date: formattedDate, errors: [e] });
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
      marginRight: xs.value ? "5px" : "15px"
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
      errorData
    };
  }
});
</script>
