<template>
  <div class="conjugator-container">
    <div class="settings-scene">
      <h1>Results page</h1>
      <p>Game results {{ correctResults.length }} correct answers!</p>
      <div id="pie-chart"></div>
      <h3>Correct answers</h3>
      <div v-if="correctResults.length === 0" class="alert" role="alert">
        No correct answers :-(
      </div>
      <swiper
        v-if="correctResults.length > 0"
        :slides-per-view="4"
        :space-between="20"
        :modules="swiperModules"
        navigation="true"
        class="mySwiper"
      >
        <swiper-slide
          v-for="(result, index) in correctResults"
          :key="'correct-' + index"
        >
          <div class="card border-success bg-success-subtle mb-3" style="max-width: 18rem; margin: auto;">
            <div class="card-header">Correct Answer</div>
            <div class="card-body">
              <h5 class="card-title">Success card title</h5>
              <p class="card-text">Great job! You got it right.</p>
              <p>Prompt {{ index + 1 }}:</p>
              <p>Verb: {{ result.prompt.verb }}</p>
              <p>Person: {{ result.prompt.person }}</p>
              <p>Tense: {{ result.prompt.tense }}</p>
              <p>Sentence Type: {{ result.prompt['sentence type'] }}</p>
              <p>User Answer: {{ result['user answer'] }}</p>
              <p>Correct: {{ result.correct }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <h3>Wrong answers</h3>
      <swiper
        v-if="wrongResults.length > 0"
        :slides-per-view="4"
        :space-between="20"
        :modules="swiperModules"
        navigation="true"
        class="mySwiper"
      >
        <swiper-slide
          v-for="(result, index) in wrongResults"
          :key="'wrong-' + index"
        >
          <div class="card border-warning bg-warning-subtle mb-3" style="margin: auto;">
            <div class="card-header">Question {{ index + 1 }}</div>
            <div class="card-body">
              <h5 class="card-title">Your answer:</h5>
              <p class="fs-4 text-center"><em>{{ result['user answer'] }}</em></p>
              <p class="card-text">This answer is incorrect.</p>
              <p class="card-text h6">Prompt:</p>
              <ul class="list-group list-group-flush">
                <li class="list-group-item bg-warning-subtle">Verb: {{ result.prompt.verb }}</li>
                <li class="list-group-item bg-warning-subtle">Person: {{ result.prompt.person }}</li>
                <li class="list-group-item bg-warning-subtle">Tense: {{ result.prompt.tense }}</li>
                <li class="list-group-item bg-warning-subtle">Sentence Type: {{ result.prompt['sentence type'] }}</li>
              </ul>
              <p></p>
              <p class="card-text"><span class="h6">Correct answer(s):</span></p>
              <p class="card-text ps-3"><em>{{ result['correct answer(s)'].join(', ') }}</em></p>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <button @click="goToScene('Scene02_Settings')">PLAY AGAIN</button>
    </div>
  </div>
</template>


<script>
import * as d3 from "d3";
import '@/assets/styles/global_conjugator_styles.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { markRaw } from "vue";
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';

const swiperModules = markRaw([Navigation]);

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    results: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    normalizedResults() {
      return this.results; // Already an array, no transformation needed
    },
    correctResults() {
    return this.results.filter((r) => r && r.correct === true);
    },
    wrongResults() {
    return this.results.filter((r) => r && r.correct === false);
    },
    chartData() {
      const correctCount = this.results.filter((r) => r.correct).length;
      const wrongCount = this.results.length - correctCount;
      return [
        { label: "Correct", value: correctCount },
        { label: "Wrong", value: wrongCount },
      ];
    },
  },
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
.settings-scene {
  width: 100%;
  max-width: none;
  padding: 1rem;
  box-sizing: border-box;
}
#pie-chart {
  margin: 20px auto;
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
  width: 100% !important; /* Prevent Swiper from forcing a small width */
  max-width: 250px; /* Set a max width for the card */
  display: flex;
  justify-content: center;
}
.card {
  width: 100%;
  max-width: 300px;
}

</style>
