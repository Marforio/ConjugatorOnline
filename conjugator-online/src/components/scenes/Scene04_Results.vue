 <template>
  <v-container v-if="results" fluid class="pa-4">
    <v-row v-if="$vuetify.display.lgAndUp" class="m-2" justify="center">
      <h1 class="text-h2">Conjugation game results</h1>
    </v-row>
    <v-row
      align="start"
      justify="center"
      class="settings-scene"
    >
      <!-- Left Column: Summary + Chart -->
      <v-col cols="12" lg="5">
        <v-card class="pa-4 mb-1" elevation="2" rounded="lg">
          <v-card-title class="text-h5">Results</v-card-title>
          <v-card-text class="text-body-2">
            <div><span class="text-subtitle-1">Accuracy: </span><span>{{ results.correct_count }} correct answers out of {{ results.total_rounds }}. That's {{ percentCorrect }}%!</span></div>
            <div>
              <span class="text-subtitle-1">Speed: </span>Your average response time was: {{ this.results.avg_time_per_prompt }} seconds.
              <span v-if="this.results.avg_time_per_prompt < 10 && percentCorrect > 70">Nice work! Your speed and accuracy show that you are good at conjugation!</span>
            </div>
            <div id="pie-chart" class="mt-5 mb-2"></div>
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
                  350: { slidesPerView: 2 },
                  624: { slidesPerView: 3 }
                }"
              >
                <swiper-slide
                  v-for="(result, index) in correctResults"
                  :key="'correct-' + index"
                >
                  <v-card class="mx-auto my-3" color="green-lighten-5" max-width="300" elevation="2">
                    <v-card-title>Question {{ result.number }}</v-card-title>
                    <v-card-text>
                      <p class="text-center text-h6"><em>{{ result['user answer'] }}</em></p>
                      <p>You got it right in {{ result['elapsedTime'] }} seconds.</p>
                      <p class="font-weight-medium">Prompt:</p>
                      <ul>
                        <li>Verb: {{ result.prompt.verb }}</li>
                        <li>Person: {{ result.prompt.person }}</li>
                        <li>Tense: {{ result.prompt.tense }}</li>
                        <li>Sentence Type: {{ result.prompt['sentence type'] }}</li>
                      </ul>
                      <p class="font-weight-medium">Acceptable answer(s):</p>
                      <p><em>{{ Array.isArray(result['correct answer(s)']) ? result['correct answer(s)'].join(', ') : result['correct answer(s)'] }}</em></p>
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
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 }
                }"
              >
                <swiper-slide
                  v-for="(result, index) in wrongResults"
                  :key="'wrong-' + index"
                >
                  <v-card class="mx-auto my-3" color="amber-lighten-5" max-width="300" elevation="2">
                    <v-card-title>Question {{ result.number }}</v-card-title>
                    <v-card-text>
                      <p class="text-center text-h6">
                        <em v-if="result['user answer']">{{ result['user answer'] }}</em>
                        <span v-else>No answer submitted.</span>
                      </p>
                      <p>Incorrect. Time: {{ result['elapsedTime'] }} seconds.</p>
                      <p class="font-weight-medium">Prompt:</p>
                      <ul>
                        <li>Verb: {{ result.prompt.verb }}</li>
                        <li>Person: {{ result.prompt.person }}</li>
                        <li>Tense: {{ result.prompt.tense }}</li>
                        <li>Sentence Type: {{ result.prompt['sentence type'] }}</li>
                      </ul>
                      <p class="font-weight-medium">Acceptable answer(s):</p>
                      <p><em>{{ Array.isArray(result['correct answer(s)']) ? result['correct answer(s)'].join(', ') : result['correct answer(s)'] }}</em></p>
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
    <v-row class="d-flex justify-center align-center mt-4 gap-4">
      <!-- Action Buttons -->
        <v-btn @click="goToScene('Scene02_Settings')">PLAY AGAIN</v-btn>
        <v-btn href="/dashboard">GO TO dashboard</v-btn>
        <HomeButton />
    </v-row>
  </v-container>
</template>



<script>
import * as d3 from "d3";
import '@/assets/styles/global_conjugator_styles.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { markRaw } from "vue";
import 'swiper/css';
import 'swiper/css/navigation';
import HomeButton from "../HomeButton.vue";

export default {
  data() {
    return {
      swiperModules: markRaw([Navigation])
    };
  },
  components: {
    Swiper,
    SwiperSlide,
    HomeButton
  },
  props: {
    results: {
      type: Object,
      required: true
    },
    totalTime: {
      type: String,
      default: 0,
    },
    avgTime: {
      type: String,
      default: 0,
    },
  },
  computed: {  
    correctResults() {
      return Array.isArray(this.results?.rounds)
        ? this.results.rounds.filter(r => r?.correct === true)
        : [];
    },
    wrongResults() {
      return Array.isArray(this.results?.rounds)
        ? this.results.rounds.filter(r => r?.correct === false)
        : [];
    },
    percentCorrect() {
      return (this.results.correct_count / this.results.total_rounds * 100).toFixed(0)
    },
    percentIncorrect() {
      return (this.results.wrong_count / this.results.total_rounds * 100).toFixed(0)
    },
    chartData() {
      const correctCount = this.results.correct_count;
      const wrongCount = this.results.wrong_count;
      return [
        { label: "Correct", value: correctCount },
        { label: "Wrong", value: wrongCount },
      ];
    }
}
,
  methods: {
    goToScene(sceneName) {
      this.$emit("changeScene", sceneName);
    },
    renderPieChart() {
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2;

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
        .range(["#4CAF50", "#F44336"]); // Colors for correct (green) and wrong (red)

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

      // Add labels
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
