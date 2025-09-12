<template>
  <v-container>
    <!-- Tabs Navigation -->
    <v-select
      v-if="isMobile"
      v-model="activeTab"
      :items="tabItems"
      item-title="label"
      item-value="value"
      label="Select section"
      class="mt-4"
      dense
      outlined
    />

    <v-tabs
      v-else
      v-model="activeTab"
      class="mt-4"
      show-arrows
      grow
    >
      <v-tab v-for="item in tabItems" :key="item.value" :value="item.value">
        {{ item.label }}
      </v-tab>
    </v-tabs>

    <!-- Tab Content -->
    <v-window v-model="activeTab" class="mt-5" touchless>
      <v-window-item value="grammar-feedback">
        work in progress
      </v-window-item>

      <v-window-item value="goals">
        work in progress
      </v-window-item>

      <v-window-item value="conjugation-game">
        work in progress
      </v-window-item>
    </v-window>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { useDisplay } from "vuetify";
import TopNavBar from "@/components/TopNavBar.vue";
import PieChart from "@/components/charts/PieChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import ErrorsDataTab from "@/components/ErrorsDataTab.vue";
import NumbersCard from "@/components/NumbersCard.vue";
import { useRouter, useRoute } from 'vue-router';
import VocabDataTab from "@/components/VocabDataTab.vue";
import GoalsDataTab from "@/components/GoalsDataTab.vue";




interface GameSession {
  session_id: number;
  student: number;
  verb_set: string;
  sentence_types: string[];
  tenses: string[];
  started_at: string;
  total_rounds: number;
  correct_count: number;
  wrong_count: number;
  avg_time_per_prompt: number;
  rounds: any[];
}

export default defineComponent({
  name: "Dashboard",
  components: { TopNavBar, NumbersCard, PieChart, BarChart, ErrorsDataTab, VocabDataTab, GoalsDataTab },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sessions = ref<GameSession[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const verbUsage = ref<any[]>([]);
    const tierStats = ref<any[]>([]);
    interface TenseStats {
        discovered_verbs_ps: string[];
        discovered_verbs_pp: string[];
        mastered_verbs_ps: string[];
        mastered_verbs_pp: string[];
      }

    const tenseStats = ref<TenseStats | null>(null);

    const typoRequests = ref<Set<number>>(new Set());
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    });

    const showSnackbar = (text: string, color = 'success') => {
      snackbar.value.text = text;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    const userStore = useUserStore();

    const totalRoundsPlayed = computed(() =>
      sessions.value.reduce((sum, session) => sum + session.total_rounds, 0)
    );
    const avgTimePerRound = computed(() => {
      const total = sessions.value.reduce((sum, session) => sum + session.avg_time_per_prompt, 0);
      return sessions.value.length > 0 ? (total / sessions.value.length).toFixed(1) : 0;
    });

    const totalRightWrongChartData = computed(() => [
      { label: "Correct", value: totalPercentCorrect.value },
      { label: "Incorrect", value: totalPercentIncorrect.value },
    ]);

    const totalPercentCorrect = computed(() =>
      Number(
        (
          (sessions.value.reduce(
            (sum, session) => sum + session.correct_count,
            0
          ) /
            totalRoundsPlayed.value) *
          100
        ).toFixed(0)
      )
    );

    const totalPercentIncorrect = computed(() =>
      Number(
        (
          (sessions.value.reduce(
            (sum, session) => sum + session.wrong_count,
            0
          ) /
            totalRoundsPlayed.value) *
          100
        ).toFixed(0)
      )
    );


    const activeTab = ref("grammar-feedback");
    const tabItems = [
      { value: "grammar-feedback", label: "Errors Feedback" },
      { value: "vocabulary", label: "Vocabulary" },
      { value: "goals", label: "Goals" },
      { value: "conjugation-game", label: "Conjugator" },
    ];

    const { xs, smAndDown } = useDisplay();
    const isMobile = computed(() => smAndDown.value);
    const BarchartColorPalette = [
      "#4CAF50",
      "#2196F3",
      "#FFC107",
      "#E91E63",
      "#9C27B0",
      "#FF5722",
    ];
    const sparklineGradients = [
          ['#222'],
          ['#42b3f4'],
          ['green', 'yellow', 'red'],
          ['purple', 'violet'],
          ['#00c6ff', '#F0F', '#FF0'],
          ['#f72047', '#ffd200', '#1feaea'],
        ]

    const fetchConjGameSessionsDashboardData = async () => {
      loading.value = true;
      conjGameError.value = null;

      try {
        const sessionsRes = await api.get<GameSession[]>("/conj-game-sessions/");
        sessions.value = sessionsRes.data;

      } catch (err: any) {
        console.error("Conj game sessions fetch failed:", err);
        conjGameError.value = conjGameError.value
          ? `${conjGameError.value}; Failed to fetch sessions`
          : "Failed to fetch sessions";
      }

      loading.value = false;
    };

    const sessionAccuracyTrend = computed(() => {
      return sessions.value
        .reverse()
        .map(session => {
          const total = session.total_rounds ?? 0
          return total
            ? Number(((session.correct_count / total) * 100).toFixed(0))
            : null
        })
        .filter((x): x is number => x !== null) // type guard to keep only numbers
    })

  const requestTypo = async (promptId: number) => {
    if (typoRequests.value.has(promptId)) return;

    typoRequests.value.add(promptId);

    try {
      await api.patch(`/conj-game-prompts/${promptId}/request-typo/`, {
        typo_requested: true
      });
      showSnackbar('Typo request submitted!');
      fetchConjGameSessionsDashboardData();
    } catch (err) {
      console.error("Typo request failed:", err);
      showSnackbar('Failed to send typo request.', 'error');
    }
  };


    // unwrap the computed into a plain array
const sessionAccuracyTrendArray = computed(() => sessionAccuracyTrend.value)


    const tenseAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap((session) => session.rounds || []);
      const tenseGroups: Record<string, { correct: number; total: number }> = {};

      for (const round of rounds) {
        const tense = round.tense;
        if (!tenseGroups[tense]) {
          tenseGroups[tense] = { correct: 0, total: 0 };
        }
        tenseGroups[tense].total += 1;
        if (round.is_correct) {
          tenseGroups[tense].correct += 1;
        }
      }

      return Object.entries(tenseGroups).map(
        ([tense, stats], index: number) => ({
          label: tense,
          value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
          correct: stats.correct,
          total: stats.total,
          color: BarchartColorPalette[index % BarchartColorPalette.length],
        })
      );
    });

    const sentenceTypeAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap((session) => session.rounds || []);
      const typeGroups: Record<string, { correct: number; total: number }> = {};

      for (const round of rounds) {
        const type = round.sentence_type;
        if (!typeGroups[type]) {
          typeGroups[type] = { correct: 0, total: 0 };
        }
        typeGroups[type].total += 1;
        if (round.is_correct) {
          typeGroups[type].correct += 1;
        }
      }


      return Object.entries(typeGroups).map(
        ([type, stats], index: number) => ({
          label: type,
          value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
          correct: stats.correct,
          total: stats.total,
          color: BarchartColorPalette[index % BarchartColorPalette.length],
        })
      );
    });

    onMounted(async () => {
      await fetchConjGameSessionsDashboardData();
      userStore.fetchVerbUsageDashboardData();
      setInitialTabFromRoute();
      console.log("SessionAccTrend: ", sessionAccuracyTrend )
    });

    function setInitialTabFromRoute() {
      const tabFromRoute = route.query.tab;
      const isValidTab = typeof tabFromRoute === "string" && tabItems.some(t => t.value === tabFromRoute);

      activeTab.value = isValidTab ? tabFromRoute : tabItems[0].value; // fallback to first tab
    }


    return {
      sessions,
      loading,
      errorsError,
      conjGameError,
      activeTab,
      tabItems,
      isMobile,
      userStore,
      TopNavBar,
      PieChart,
      sessionAccuracyTrend: sessionAccuracyTrendArray,
      totalRightWrongChartData,
      totalRoundsPlayed,
      avgTimePerRound,
      tenseAccuracyData,
      sentenceTypeAccuracyData,
      smAndDown,
      xs,
      verbUsage,
      tierStats,
      tenseStats,
      typoRequests,
      snackbar,
      requestTypo,
      sparklineGradients,
    };
  },
});
</script>

<style scoped>

</style>

