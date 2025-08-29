<template>
  <ErrorBarChart :errorData="processedErrors" />
  <div>
    <h2>Recent Errors</h2>
    <v-list>
        <v-list-item v-for="errorItem in errors" :key="errorItem.error_id">
        <v-list-item-content>
            <v-list-item-title>
            <strong>{{ errorItem.error_code }}</strong> ({{ errorItem.times }}x)
            </v-list-item-title>
            <v-list-item-subtitle v-if="errorItem.evidence">
            {{ errorItem.evidence }}
            </v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>
    </v-list>
</div>
            
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import ErrorBarChart from "./charts/ErrorBarChart.vue";
import api from "@/axios";

interface ErrorItem {
  error_id: string;
  error_code: string;
  evidence: string | null;
  times: number;
  feedback: Feedback;
}
interface Feedback {
  feedback_id: string;
  student?: {
    name?: string;
    // Add other student fields if needed
  };
  course?: {
    name?: string;
    // Add other course fields if needed
  };
  date?: string;
  content?: string;
}

export default defineComponent({
  name: "ErrorDashboard",
  components: { ErrorBarChart },

  setup() {
    const errors = ref<ErrorItem[]>([]);
    const loading = ref(true);
    const errorsError = ref<string | null>(null);

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
            feedback: feedback?.feedback_id ?? 'Unknown Feedback'
        })) ?? []
        );


    onMounted(() => {
      fetchErrorDashboardData();
    });

    return {
      processedErrors,
      loading,
      errorsError,
      errors
    };
  },
});
</script>
