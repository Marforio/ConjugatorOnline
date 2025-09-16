<template>
  <div>
    <!-- Course filter -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedCourse"
          :items="courseOptions"
          item-title="name"
          item-value="id"
          label="Filter by course"
          clearable
          @update:modelValue="fetchErrorDashboardData"
        />
      </v-col>
    </v-row>

    <!-- Chart Card -->
    <v-card class="pa-4 mb-6" elevation="2" :style="cardStyle">
      <v-card-title class="text-h5 font-weight-bold">
        Errors ({{ selectedCourseName }})
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-column align-center">
          <AdminErrorBarChart :errorData="topErrors" />
        </div>
      </v-card-text>
    </v-card>

<!-- Error details with dropdown -->
<v-card class="pa-4 mb-6" elevation="2">
  <v-card-title class="text-h6">
    Error details
  </v-card-title>
  <v-card-text>
    <!-- Dropdown to select error -->
    <v-select
      v-model="selectedErrorCode"
      :items="filteredErrors.map(e => ({ title: `${e.error_code} — ${e.total_times} occurrences — ${ errorData[e.error_code]?.description ?? '' }`, value: e.error_code }))"
      label="Select an error"
      clearable
    />

    <!-- Show details if an error is selected -->
    <div v-if="selectedErrorObj">
      <p><strong>Error {{ selectedErrorObj.error_code }} : </strong><span class="text-subtitle-1">{{ errorData[selectedErrorObj.error_code].description }}</span></p>
      <p><strong>Total occurrences:</strong> {{ selectedErrorObj.total_times }}</p>
      <p><strong>Qick recommendation: </strong> {{ errorData[selectedErrorObj.error_code].recommendation }}</p>
      <p><strong>Reference:</strong> <span v-html="errorData[selectedErrorObj.error_code]?.reference || 'N/A'"></span></p>
      <p><strong>Evidence samples:</strong></p>
      <ul>
        <li v-for="(ev, i) in selectedErrorObj.evidence_samples" :key="i"><span v-html="ev"></span></li>
      </ul>
    </div>

    <div v-else>
      <p>Please select an error from the dropdown to view details.</p>
    </div>
  </v-card-text>
</v-card>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import AdminErrorBarChart from "./charts/AdminErrorBarChart.vue";
import api from "@/axios";
import { useDisplay } from "vuetify";
import { errorsData } from '@/assets/scripts/errorsData';

interface AdminError {
  error_code: string;
  total_times: number;
  evidence_samples: string[];
  course: string; // slug
}

export default defineComponent({
  name: "AdminErrorDashboard",
  components: { AdminErrorBarChart },
  setup() {
    const errorData = errorsData
    const errors = ref<AdminError[]>([]);
    const courseOptions = ref<{ id: string; name: string }[]>([]);
    const selectedCourse = ref<string | null>(null);
    const selectedError = ref<AdminError | null>(null);
    const { xs } = useDisplay();
    const loading = ref(true);
    const errorMsg = ref<string | null>(null);

    const cardStyle = computed(() => ({
      minWidth: xs.value ? "200px" : "300px",
      maxWidth: xs.value ? "500px" : "95%",
      marginLeft: xs.value ? "5px" : "15px",
      marginRight: xs.value ? "5px" : "15px",
    }));

    const selectedCourseName = computed(() => {
      if (!selectedCourse.value || selectedCourse.value === "all") return "All Courses";
      const found = courseOptions.value.find(c => c.id === selectedCourse.value);
      return found ? found.name : "Unknown Course";
    });

    const selectedErrorCode = ref<string | null>(null);

    const selectedErrorObj = computed(() =>
      filteredErrors.value.find(e => e.error_code === selectedErrorCode.value) || null
    );


    // Fetch course list
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/");
        courseOptions.value = [
          { id: "all", name: "All Courses" },
          ...res.data.map((c: any) => ({ id: c.slug, name: c.slug })),
        ];
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    // Fetch aggregated error summary
    const fetchErrorDashboardData = async () => {
      loading.value = true;
      errorMsg.value = null;

      try {
        const params =
          selectedCourse.value && selectedCourse.value !== "all"
            ? { course: selectedCourse.value }
            : {};

        const res = await api.get<AdminError[]>("/admin-error-summary/summary/", { params });
        const raw = res.data || [];

        // normalize
        const sanitized = raw.map((e: any) => ({
          error_code: String(e.error_code ?? "UNKNOWN"),
          total_times: Number(e.total_times) || 0,
          evidence_samples: Array.isArray(e.evidence_samples) ? e.evidence_samples : [],
          course: String(e.course ?? "unknown")
        }));

        // aggregate if "All Courses" is selected
        if (!selectedCourse.value || selectedCourse.value === "all") {
          const grouped: Record<string, AdminError> = {};

          sanitized.forEach(e => {
            if (!grouped[e.error_code]) {
              grouped[e.error_code] = {
                error_code: e.error_code,
                total_times: 0,
                evidence_samples: [],
                course: "ALL" // marker
              };
            }
            grouped[e.error_code].total_times += e.total_times;
            grouped[e.error_code].evidence_samples.push(...e.evidence_samples);
          });

          errors.value = Object.values(grouped);
        } else {
          // keep un-aggregated if course is specified
          errors.value = sanitized;
        }

        console.table(errors.value);
      } catch (err) {
        console.error("Failed to fetch admin errors:", err);
        errorMsg.value = "Failed to fetch admin errors";
      } finally {
        loading.value = false;
      }
    };


    // sorted errors and top errors remain the same
    const filteredErrors = computed(() =>
      [...errors.value].sort((a, b) => b.total_times - a.total_times)
    );

    const topErrors = computed(() => filteredErrors.value.slice(0, 20));


    onMounted(() => {
      fetchCourses();
      fetchErrorDashboardData();
    });

    return {
      errorData,
      errors,
      topErrors,
      filteredErrors,
      courseOptions,
      selectedCourse,
      selectedCourseName,
      selectedError,
      fetchErrorDashboardData,
      cardStyle,
      selectedErrorObj,
      selectedErrorCode
    };
  },
});
</script>

<style scoped>
.hoverable {
  cursor: pointer;
}
</style>
