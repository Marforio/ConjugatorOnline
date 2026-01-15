<template>
  <v-container v-if="results" fluid class="pa-4">
    <!-- Heading -->
    <v-row v-if="$vuetify.display.lgAndUp" class="m-2" justify="center">
      <h1 class="text-h2">Pronoun Practice Results</h1>
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
              <span v-if="results.avg_time_per_prompt < 5 && percentCorrect > 70">
                Nice work! You really seem to know your pronouns!
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
                      <p class="text-center">{{ result.question }}</p>
                      <div class="mb-4 d-flex justify-center align-center">
                        <v-img
                            v-if="result.image"
                            :src="`/images/pronoun_pics_resized/${result.image}`"
                            alt="Pronoun Image"
                            class="mb-4 rounded-lg border-md"
                            max-width="100"
                            aspect-ratio="1"
                            cover
                        />
                        </div>
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
                      <p v-if="result.out_of_time">You ran out of time!</p>
                      <p v-else >This answer is incorrect. </p>
                      <p>Time elapsed: {{ result.elapsed_time }} seconds.</p>
                      <p class="font-weight-medium">Prompt:</p>
                     <p class="text-center font-italic">{{ result.question }}</p>
                      <div class="mb-4 d-flex justify-center align-center">
                        <v-img
                            v-if="result.image"
                            :src="`/images/pronoun_pics_resized/${result.image}`"
                            alt="Pronoun Image"
                            class="mb-4 rounded-lg border-md"
                            max-width="100"
                            aspect-ratio="1"
                            cover
                        />
                        </div>

                      <p class="font-weight-medium">Acceptable answer(s): </p>
                      <p class="font-italic text-center">{{ result.correct_answer.join(", ") }}</p>
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
      <v-btn @click="$emit('changeScene', 'PronounScene01_Game')">
        PLAY AGAIN
      </v-btn>

      <router-link :to="{ path: '/dashboard', query: { tab: 'other-games', game: 'Pronoun Practice' } }">
        <v-btn>Go to Dashboard</v-btn>
      </router-link>
      <HomeButton />
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, markRaw } from "vue";
import * as d3 from "d3";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HomeButton from "../HomeButton.vue";

// Props
const props = defineProps({
  results: { type: Object, required: true }
});

// Emits
const emit = defineEmits(["changeScene"]);

// Swiper setup
const swiperModules = markRaw([Navigation]);

// Computed refs for correct/wrong
const correctResults = computed(() =>
  Array.isArray(props.results?.rounds)
    ? props.results.rounds.filter(r => r.is_correct === true )
    : []
);

const wrongResults = computed(() =>
  Array.isArray(props.results?.rounds)
    ? props.results.rounds.filter(r => r.is_correct === false )
    : []
);

const percentCorrect = computed(() => {
  if (!props.results?.total_rounds) return 0;
  return ((props.results.correct_count / props.results.total_rounds) * 100).toFixed(0);
});

const percentIncorrect = computed(() => {
  if (!props.results?.total_rounds) return 0;
  return ((props.results.wrong_count / props.results.total_rounds) * 100).toFixed(0);
});

const chartData = computed(() => [
  { label: "Correct", value: props.results.correct_count || 0 },
  { label: "Wrong", value: props.results.wrong_count || 0 },
]);

// D3 pie chart rendering
function renderPieChart() {
  const container = d3.select("#pie-chart").node();
  if (!container) return;

  const containerWidth = container.getBoundingClientRect().width;
  const size = Math.min(containerWidth - 25);
  const width = size;
  const height = size;
  const radius = Math.min(width, height) / 2;

  d3.select("#pie-chart").selectAll("*").remove(); // clear old chart

  const svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(chartData.value.map(d => d.label))
    .range(["#4CAF50", "#F44336"]);

  const pie = d3.pie().value(d => d.value);
  const dataReady = pie(chartData.value);

  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  svg.selectAll("path")
    .data(dataReady)
    .join("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "white")
    .style("stroke-width", "2px");

  svg.selectAll("text")
    .data(dataReady)
    .join("text")
    .text(d => `${d.data.label}: ${d.data.value}`)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "12px");
}

// Render or re-render chart
onMounted(renderPieChart);
watch(() => props.results, renderPieChart, { deep: true });
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
