<template>
    <div v-if="xs">
        <v-card class="pa-4 mb-6" elevation="2" :style="{
                    minWidth: xs ? '200px' : '300px', 
                    maxWidth: xs ? '500px' : '95%', 
                    marginLeft: xs ? '5px' : '15px',
                    marginRight: xs ? '5px' : '15px',}">
            <v-card-title class="text-h5 font-weight-bold"> <InitialsText/>'s most frequent errors</v-card-title>
            <ErrorHorizontalBarChart :errorData="processedErrors" />
            
        
        </v-card>
        <h2>Evidence of your errors</h2>
        <v-list>
            <v-list-item v-for="errorItem in errors" :key="errorItem.error_id">
                <v-list-item-title>
                <strong>{{ errorItem.error_code }}</strong> ({{ errorItem.times }}x)
                </v-list-item-title>
                <v-list-item-subtitle v-if="errorItem.evidence">
                {{ errorItem.evidence }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </div>
    <div v-else>
        <v-card class="pa-4 mb-6" elevation="2" :style="{
                    minWidth: xs ? '200px' : '300px', 
                    maxWidth: xs ? '500px' : '95%', 
                    marginLeft: xs ? '5px' : '15px',
                    marginRight: xs ? '5px' : '15px',}">

        <v-card-title class="text-h5 font-weight-bold"> <InitialsText/>'s most frequent errors</v-card-title>
        <v-card-text>
            <div class="d-flex flex-column align-center">
            <ErrorBarChart :errorData="processedErrors" />

            </div>
        </v-card-text>
        </v-card>
    </div>
            
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import ErrorBarChart from "./charts/ErrorBarChart.vue";
import ErrorHorizontalBarChart from "./charts/ErrorHorizontalBarChart.vue";
import InitialsText from "./InitialsText.vue";
import api from "@/axios";
import { useDisplay } from 'vuetify';
import { errorsData } from "@/assets/scripts/errorsData";


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
  components: { ErrorBarChart, ErrorHorizontalBarChart, InitialsText },

  setup() {
    const errors = ref<ErrorItem[]>([]);
    const loading = ref(true);
    const errorsError = ref<string | null>(null);
    const { xs, smAndDown } = useDisplay();

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
      errors,
      xs,
        smAndDown
    };
  },
});
</script>
