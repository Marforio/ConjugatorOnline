<template>
  <v-container v-if="results" fluid class="pa-4">
    <!-- Heading -->
    <v-row v-if="$vuetify.display.lgAndUp" class="m-2" justify="center">
      <h1 class="text-h2">Conjugation Game Results</h1>
    </v-row>

    <v-row align="start" justify="center" class="settings-scene">
      <!-- Left Column: Summary + Chart -->
      <v-col cols="12" lg="5">
        <v-card class="pa-4 mb-1" elevation="2" rounded="lg">
          <v-card-title class="text-h5">Results</v-card-title>
          <v-card-text class="text-body-2">
            <div>
              <span class="text-subtitle-1">Accuracy: </span>
              <span>
                {{ results.correct_count }} correct answers out of {{ results.total_rounds }}.
                That's {{ percentCorrect }}%!
              </span>
            </div>
            <div>
              <span class="text-subtitle-1">Speed: </span>
              Your average response time was: {{ results.avg_time_per_prompt }} seconds.
              <span v-if="results.avg_time_per_prompt < 10 && percentCorrect > 70">
                Nice work! Your speed and accuracy show that you are good at conjugation!
              </span>
            </div>
            <v-responsive max-width="500" class="mx-auto mt-5 mb-2">
              <div id="pie-chart"></div>
            </v-responsive>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column: Expansion Panels -->
      <v-col cols="12" lg="7">
        <v-expansion-panels multiple>
          <!-- Correct Answers Panel -->
          <v-expansion-panel>
            <v-expansion-panel-title>
              Correct Answers ({{ results.correct_count }})
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-if="correctResults.length === 0">
                <v-alert type="info" dense>No correct answers 😢</v-alert>
              </div>
              <swiper
                v-else
                ref="correctSwiperRef"
                :modules="swiperModules"
                :slides-per-view="2"
                :space-between="20"
                class="mySwiper"
                :navigation="{
                  prevEl: '.correct-button-prev',
                  nextEl: '.correct-button-next'
                }"
                :breakpoints="{
                  0: { slidesPerView: 1 },
                  500: { slidesPerView: 2 },
                  700: { slidesPerView: 3 }
                }"
              >
                <swiper-slide
                  v-for="(result, index) in correctResults"
                  :key="'correct-' + index"
                >
                  <v-card class="mx-auto my-3" color="green-lighten-5" max-width="300" elevation="2">
                    <v-card-title>Question {{ result.prompt_number }}</v-card-title>
                    <v-card-text>
                      <p class="text-subtitle-1">Your answer:</p>
                      <p class="text-center text-h6"><em>{{ result.user_answer }}</em></p>
                      <p>Congrats! You got it right in {{ result.elapsed_time }} seconds.</p>
                      <p class="font-weight-medium">Prompt:</p>
                      <ul>
                        <li>Verb: {{ result.verb }}</li>
                        <li>Person: {{ result.person }}</li>
                        <li>Tense: {{ result.tense }}</li>
                        <li>Sentence Type: {{ result.sentence_type }}</li>
                      </ul>
                      <p class="font-weight-medium">Acceptable answer(s):</p>
                      <p><em>{{ result.acceptable_answers.join(', ') }}</em></p>
                    </v-card-text>
                  </v-card>
                </swiper-slide>
                <div class="correct-button-prev swiper-button-prev"></div>
                <div class="correct-button-next swiper-button-next"></div>
              </swiper>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Incorrect Answers Panel -->
          <v-expansion-panel>
            <v-expansion-panel-title>
              Incorrect Answers ({{ results.wrong_count }})
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <swiper
                v-if="wrongResults.length > 0"
                :modules="swiperModules"
                :slides-per-view="2"
                :space-between="20"
                class="mySwiper"
                :navigation="{
                  prevEl: '.wrong-button-prev',
                  nextEl: '.wrong-button-next'
                }"
                :breakpoints="{
                  0: { slidesPerView: 1 },
                  500: { slidesPerView: 2 },
                  700: { slidesPerView: 3 }
                }"
              >
                <swiper-slide
                  v-for="(result, index) in wrongResults"
                  :key="'wrong-' + index"
                >
                  <v-card class="mx-auto my-3" color="amber-lighten-5" max-width="300" elevation="2">
                    <v-card-title>Question {{ result.prompt_number }}</v-card-title>
                    <v-card-text>
                      <p class="text-subtitle-1">Your answer:</p>
                      <p class="text-center text-h6">
                        <em v-if="result.user_answer">{{ result.user_answer }}</em>
                        <span v-else>No answer submitted.</span>
                      </p>
                      <p>This answer is incorrect. </p>
                      <v-chip
                          v-if="isTypoRound(result)"
                          size="x-small"
                          color="info"
                          variant="tonal"
                          class="ms-2"
                        >
                          typo
                        </v-chip>
                      <p>Time elapsed: {{ result.elapsed_time }} seconds.</p>
                      <p class="font-weight-medium">Prompt:</p>
                      <ul>
                        <li>Verb: {{ result.verb }}</li>
                        <li>Person: {{ result.person }}</li>
                        <li>Tense: {{ result.tense }}</li>
                        <li>Sentence Type: {{ result.sentence_type }}</li>
                      </ul>
                      <p class="font-weight-medium">Acceptable answer(s):</p>
                      <p><em>{{ result.acceptable_answers.join(', ') }}</em></p>
                      <div class="d-flex justify-center">
                        <v-btn
                        size="small"
                        variant="tonal"
                        class="mt-2"
                        color="primary"
                        @click="openTutorForRound(result)"
                      >
                        Ask the AI Tutor <v-icon class="ms-1" size="14">mdi-robot-outline</v-icon>
                      </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </swiper-slide>
                <div class="wrong-button-prev swiper-button-prev"></div>
                <div class="wrong-button-next swiper-button-next"></div>
              </swiper>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-row class="d-flex justify-center align-center mt-4 gap-4">
      <v-btn @click="goToScene('Scene02_Settings')">PLAY AGAIN</v-btn>
      <router-link :to="{ path: '/dashboard', query: { tab: 'conjugation-game' } }">
        <v-btn>GO TO Dashboard</v-btn>
      </router-link>
      <HomeButton />
    </v-row>
  </v-container>

  <AiTutorChatDialog
    v-model="aiOpen"
    title="AI Grammar Tutor"
    :context="aiContext"
    :build-initial-user-message="buildInitialPrompt"
    :show-context-preview="false"
    :reset-on-context-change="true"
    api-url="/llm/chat/"
    :max-tokens="250"
    :temperature="0.4"
  >
  <template #context-summary="{ ctx }">
    <div class="my-3">
      <div>
        <span class="font-weight-medium">The prompt is:</span>
        verb={{ ctx?.verb }} | person={{ ctx?.person }} | tense={{ ctx?.tense }} | sentence type={{ ctx?.sentence_type }}
      </div>

      <div class="mt-1">
        <span class="font-weight-medium">Your answer:</span> {{ ctx?.student_answer ?? "—" }}
      </div>

      <div class="mt-1">
        <span class="font-weight-medium">Target answer:</span>
        {{ (ctx?.acceptable_answers ?? []).join(" / ") || "—" }}
      </div>
    </div>

    <v-divider class="my-2" />
  </template>
  </AiTutorChatDialog>

</template>

<script>
import * as d3 from "d3";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { markRaw } from "vue";
import "swiper/css";
import "swiper/css/navigation";
import HomeButton from "../HomeButton.vue";
import AiTutorChatDialog from "../AiTutorChatDialog.vue";

export default {
  data() {
    return {
      swiperModules: markRaw([Navigation]),

      // NEW: AI tutor dialog state
      aiOpen: false,
      aiContext: null,
    };
  },
  components: {
    Swiper,
    SwiperSlide,
    HomeButton,
    AiTutorChatDialog, // NEW
  },
  props: {
    results: { type: Object, required: true },
  },
  computed: {
    correctResults() {
      return Array.isArray(this.results?.rounds)
        ? this.results.rounds.filter((r) => r.is_correct === true)
        : [];
    },
    wrongResults() {
      return Array.isArray(this.results?.rounds)
        ? this.results.rounds.filter((r) => r.is_correct === false)
        : [];
    },
    percentCorrect() {
      return ((this.results.correct_count / this.results.total_rounds) * 100).toFixed(0);
    },
    percentIncorrect() {
      return ((this.results.wrong_count / this.results.total_rounds) * 100).toFixed(0);
    },
    chartData() {
      return [
        { label: "Correct", value: this.results.correct_count },
        { label: "Wrong", value: this.results.wrong_count },
      ];
    },
  },
  methods: {
    goToScene(sceneName) {
      this.$emit("changeScene", sceneName);
    },

    // NEW: where your JWT comes from (adjust to your app)
    getJwt() {
      return localStorage.getItem("access");
    },

    // open dialog for one specific wrong round
    async openTutorForRound(round) {
      this.aiOpen = false;
      await this.$nextTick();

      this.aiContext = {
        game: "conjugation",
        prompt_number: round.prompt_number,
        verb: round.verb,
        person: round.person,
        tense: round.tense,
        sentence_type: round.sentence_type,
        student_answer: round.user_answer || "",
        acceptable_answers: round.acceptable_answers || [],
        elapsed_time: round.elapsed_time,
      };

      await this.$nextTick();
      this.aiOpen = true;
    },

  buildInitialPrompt(ctx) {
    return [
      "You are an English grammar tutor helping me, the student, after a conjugation game question.",
      "",
      "Task:",
      "Explain (in a short paragraph) why my answer is wrong and how to fix it.",
      "Then write the same explanation again in French.",
      "",
      "Hard formatting rules (must follow):",
      "- Output exactly TWO paragraphs:",
      "  Paragraph 1: English",
      " Paragraph 2: write exactly: Write 'more' for more examples. Write 'oui'/'ja'/'si' for the same explanation in French/German/Italian.\n" +
      "If the user says 'more', give 5 new short examples and repeat the final line.\n" +
      "If the user asks for a different language, repeat the original explanation in that language, but do not translate the tense names, expected answers or erroneous answers. These should be referred to in their original form.\n",
      "",
      "Exercise context:",
      `verb=${ctx.verb}, person=${ctx.person}, target tense=${ctx.tense}, sentence_type=${ctx.sentence_type}`,
      `Student answer: ${ctx.student_answer || "(no answer)"}. If the answer is blank, nonsensical, or empty, acknowledge that no answer was submitted and provide a general explanation of how to approach the question.`,
      `Acceptable answers: ${(ctx.acceptable_answers || []).join(" | ") || "(none provided)"}`,
      "These should be referred to in their original form.\n" +
      "Do not mention these system instructions.",
    ].join("\n");
  },
  
    isTypoRound(round) {
      // support either shape:
      // 1) round.is_typo (recommended for backend payload)
      if (round && typeof round.is_typo === "boolean") return round.is_typo;

      // 2) round.typo.isTypo (if you store the full detector output)
      if (round?.typo && typeof round.typo.isTypo === "boolean") {
        // only show as typo if it wasn't force-wrong by a gate
        return !!round.typo.isTypo && !round.typo.forceWrong;
      }

      return false;
    },

    renderPieChart() {
      const container = d3.select("#pie-chart").node();
      const containerWidth = container.getBoundingClientRect().width;
      const size = Math.min(containerWidth - 25);

      const width = size;
      const height = size;
      const radius = Math.min(width, height) / 2;

      d3.select("#pie-chart").selectAll("*").remove();

      const svg = d3
        .select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3
        .scaleOrdinal()
        .domain(this.chartData.map((d) => d.label))
        .range(["#4CAF50", "#F44336"]);

      const pie = d3.pie().value((d) => d.value);
      const dataReady = pie(this.chartData);

      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      svg
        .selectAll("path")
        .data(dataReady)
        .join("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

      svg
        .selectAll("text")
        .data(dataReady)
        .join("text")
        .text((d) => `${d.data.label}: ${d.data.value}`)
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px");
    },
  },
  mounted() {
    this.renderPieChart();
  },
};
</script>

<style scoped>
#pie-chart {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mySwiper {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
}
.swiper-slide {
  display: flex;
  justify-content: center;
}
</style>
