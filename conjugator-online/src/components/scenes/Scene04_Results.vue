<template>
  <div class="settings-scene">
    <h1>Results page</h1>
    <p>Game results</p>
    <div v-for="(result, index) in normalizedResults" :key="index">
      <p>Prompt {{ index + 1 }}:</p>
      <p>Verb: {{ result.prompt.verb }}</p>
      <p>Person: {{ result.prompt.person }}</p>
      <p>Tense: {{ result.prompt.tense }}</p>
      <p>Sentence Type: {{ result.prompt['sentence type'] }}</p>
      <p>User Answer: {{ result['user answer'] }}</p>
      <p>Correct: {{ result.correct }}</p>
      <p>Correct Answers: {{ result['correct answer(s)'].join(', ') }}</p>
    </div>
    <div id="pie-chart"></div> <!-- Container for the pie chart -->
    <button @click="goToScene('Scene02_Settings')">PLAY AGAIN</button>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
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
#pie-chart {
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
