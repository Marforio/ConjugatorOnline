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
      <!-- Grammar Feedback tab content -->
      <div v-if="loading" class="text-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="errorsError">
        <v-alert type="error">{{ errorsError }}</v-alert>
      </div>
      
      <div v-else>
        <ErrorsDataTab />
      </div>
        
    </v-window-item>

    <v-window-item value="vocabulary">
      <p>Coming soon...</p>
    </v-window-item>

    <v-window-item value="goals">
      <p>Coming soon...</p>
    </v-window-item>

    <v-window-item value="conjugation-game">
      <div v-if="loading" class="text-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="conjGameError">
        <v-alert type="error">{{ conjGameError }}</v-alert>
      </div>
      <div v-else class="d-flex flex-wrap align-start pa-2">
        <v-card class="pa-4 mb-6" elevation="2" style="flex: 1 1;" :style="{
          minWidth: xs ? '300px' : '400px', 
          maxWidth: xs ? '500px' : '650px', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px',}">
          <v-card-title class="text-h5 font-weight-bold">Conjugation accuracy</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <PieChart :data="totalRightWrongChartData" />

              <div class="text-subtitle-1 mt-4">
                {{ sessions.length }} game{{ sessions.length !== 1 ? 's' : '' }} played
              </div>

              <div class="text-subtitle-2">
                {{ totalRoundsPlayed }} total rounds
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pa-4 mb-6" elevation="2" style="flex: 1 1;" :style="{
          minWidth: xs ? '300px' : '400px', 
          maxWidth: xs ? '500px' : '650px', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px',}">

          <v-card-title class="text-h5 font-weight-bold">Tense accuracy</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <BarChart :data="tenseAccuracyData" :width="400" :height="300" color="#4CAF50" />

              <div class="text-subtitle-1 mt-4">
                Percentage of correct answers by tense
              </div>

            </div>
          </v-card-text>
        </v-card>

        <v-card class="flex: 1 1; pa-4 mb-6" elevation="2" :style="{
          minWidth: xs ? '300px' : '400px', 
          maxWidth: xs ? '500px' : '650px', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px'}"> 
          <v-card-title class="text-h5 font-weight-bold">Sentence type accuracy</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <BarChart :data="sentenceTypeAccuracyData" :width="500" :height="300" color="#2196F3" />

              <div class="text-subtitle-1 mt-4">
                Percentage of correct answers by sentence type
              </div>

            </div>
          </v-card-text>
        </v-card>

        <v-sheet
          elevation="2"
          class="m-3 p-4 d-flex flex-wrap" 
        >
          <h3 class="text-h5 font-weight-bold w-100">Irregular verbs</h3>
          <p class="text-subtitle-1 w-100">
            For past simple, only the positive verb forms are counted
          </p>

          <!-- Cards will wrap into rows -->
          <NumbersCard
            class="ma-2 flex-grow-1"
            :value="totalAllIrregsUsedOnce > 0 ? totalAllIrregsUsedOnce : 0"
            title="Past simple"
            label="irregular verbs written correctly at least 1x"
          />

          <NumbersCard
            class="ma-2 flex-grow-1"
            :value="totalAllIrregsUsedOnce > 0 ? (totalAllIrregsUsedOnce/136*100).toFixed(0) + '%': '0%'"
            title="Past simple ALL"
            label="of ALL irregular verbs used at least 1x (out of a total of 136)"
          />

          <NumbersCard
            class="ma-2 flex-grow-1"
            :value="totalAllIrregsUsedOnceParticiple > 0 ? totalAllIrregsUsedOnceParticiple : 0"
            title="Present perfect"
            label="irregular verbs written correctly at least 1x"
          />

          <NumbersCard
            class="ma-2 flex-grow-1"
            :value="totalAllIrregsUsedOnceParticiple > 0 ? (totalAllIrregsUsedOnceParticiple/136*100).toFixed(0) + '%': '0%'"
            title="Present perfect ALL"
            label="of ALL irregular verbs used at least 1x (out of a total of 136)"
          />
        </v-sheet>

        <v-divider></v-divider>

        <v-card class="pa-4 mb-6" elevation="2" :style="{
          minWidth: xs ? '300px' : '95%', 
          maxWidth: xs ? '500px' : '95%', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px',
          marginTop: '20px',
          }"> 
          <div class="text-h5 mt-2" >Game details ({{ sessions.length }} game{{ sessions.length !== 1 ? 's' : '' }} played)</div>
          <div v-for="session in sessions" :key="session.session_id" class="mt-6">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="font-weight-medium">Game {{ session.session_id }} —
                  {{ session.correct_count }} Correct, {{ session.wrong_count }} Incorrect</span> — {{ new Date(session.started_at).toLocaleString() }} — {{ session.tenses.join(', ').slice(0,50) }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div v-if="session.rounds?.length" >
                    <v-table>
                    <thead>
                      <tr>
                        <th>Prompt #</th>
                        <th>Person</th>
                        <th>Verb</th>
                        <th>Tense</th>
                        <th>Sentence Type</th>
                        <th>User Answer</th>
                        <th>Correct?</th>
                        <th>Acceptable Answers</th>
                        <th>Time (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="round in session.rounds" :key="`${session.session_id}-${round.prompt_number}`"
                      >
                        <td>{{ round.prompt_number }}</td>
                        <td>{{ round.person }}</td>
                        <td>{{ round.verb }}</td>
                        <td>{{ round.tense }}</td>
                        <td>{{ round.sentence_type }}</td>
                        <td>{{ round.user_answer }}</td>
                        <td>
                          <v-icon :color="round.is_correct ? 'green' : 'red'">
                            {{ round.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                          </v-icon>
                        </td>
                        <td>{{ round.acceptable_answers?.join(' / ') }}</td>
                        <td>{{ round.elapsed_time?.toFixed(2) ?? '—' }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else>
                  <p class="text-muted">No rounds data available for this session.</p>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          </div>
          </v-card>
        </div>
      
      
    </v-window-item>


  </v-window>
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

const router = useRouter();
const route = useRoute();


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
  components: { TopNavBar, PieChart, BarChart, ErrorsDataTab, NumbersCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sessions = ref<GameSession[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const irregularVerbs = ref<Record<string, any>>({});
    const irregularVerbCounts = ref<Record<string, number>>({});
    const irregularParticipleVerbCounts = ref<Record<string, number>>({})

    const userStore = useUserStore();

    const totalRoundsPlayed = computed(() =>
      sessions.value.reduce((sum, session) => sum + session.total_rounds, 0)
    );
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

    // irregular verb usage data
    const totalAllIrregsUsedOnce = computed(() =>
        Object.values(irregularVerbCounts.value).filter((count) => count >= 1).length
      );

      const totalAllIrregsUsedTwice = computed(() =>
        Object.values(irregularVerbCounts.value).filter((count) => count >= 2).length
      );

      const totalAllIrregsUsedThrice = computed(() =>
        Object.values(irregularVerbCounts.value).filter((count) => count >= 3).length
      );

      // Object of verbs with count > 0
      const AllIrregsVerbsWithCounts = computed(() =>
        Object.fromEntries(
          Object.entries(irregularVerbCounts.value).filter(([_, count]) => count > 0)
        )
      );

      // List of verbs not used yet
      const AllIrregsUnusedVerbs = computed(() =>
        Object.keys(irregularVerbCounts.value).filter(
          (verb) => irregularVerbCounts.value[verb] === 0
        )
      );

      const totalAllIrregsUsedOnceParticiple = computed(() =>
        Object.values(irregularParticipleVerbCounts.value).filter((count) => count >= 1).length
    );

    const activeTab = ref("grammar-feedback");
    const tabItems = [
      { value: "grammar-feedback", label: "Grammar Feedback" },
      { value: "vocabulary", label: "Vocabulary" },
      { value: "goals", label: "Goals" },
      { value: "conjugation-game", label: "Conjugation Game" },
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

    // Fetch irregular verbs JSON
    const fetchIrregularVerbs = async () => {
      try {
        const res = await fetch("/data/irregularVerbs.json");
        const data = await res.json();
        irregularVerbs.value = data;

        // initialize counters
        irregularVerbCounts.value = Object.keys(data).reduce(
          (acc, verb) => ({ ...acc, [verb]: 0 }),
          {}
        );
      } catch (err) {
        console.error("Failed to load irregular verbs JSON:", err);
      }
    };

    const fetchConjGameSessionsDashboardData = async () => {
      loading.value = true;
      conjGameError.value = null;

      try {
        const sessionsRes = await api.get<GameSession[]>("/conj-game-sessions/");
        sessions.value = sessionsRes.data;

        // After fetching, count irregular verbs
        updateIrregularVerbCounts();
      } catch (err: any) {
        console.error("Conj game sessions fetch failed:", err);
        conjGameError.value = conjGameError.value
          ? `${conjGameError.value}; Failed to fetch sessions`
          : "Failed to fetch sessions";
      }

      loading.value = false;
    };

    // Count correct irregular verb answers
    const updateIrregularVerbCounts = () => {
      if (!irregularVerbs.value) return;

      // reset counts
      for (const verb of Object.keys(irregularVerbCounts.value)) {
        irregularVerbCounts.value[verb] = 0;
        irregularParticipleVerbCounts.value[verb] = 0;
      }

      const rounds = sessions.value.flatMap((s) => s.rounds || []);

      for (const round of rounds) {
        const verb = round.verb?.toLowerCase();
        if (
          irregularVerbs.value[verb] &&
          round.tense === "Past simple" &&
          round.sentence_type === "Positive" &&
          round.is_correct
        ) {
          irregularVerbCounts.value[verb] += 1;
        }
        if (
          irregularVerbs.value[verb] &&
          round.tense === "Present perfect" &&
          round.is_correct
        ) {
          irregularParticipleVerbCounts.value[verb] += 1;
        }
      } 
    };

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
      await fetchIrregularVerbs();
      await fetchConjGameSessionsDashboardData();
      setInitialTabFromRoute();
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
      totalRightWrongChartData,
      totalRoundsPlayed,
      tenseAccuracyData,
      sentenceTypeAccuracyData,
      smAndDown,
      xs,
      irregularVerbCounts, 
      totalAllIrregsUsedOnce, 
      totalAllIrregsUsedOnceParticiple
    };
  },
});
</script>

