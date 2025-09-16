<template>
  <div class="chart-wrapper">
    <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>

    <!-- Error details card (fixed below chart) -->
    <v-card
      v-if="selectedError"
      class="mt-4 pa-4"
      elevation="6"
      max-width="100%"
      justify="center"
    >
      <v-list dense>
        <v-list-subheader>
          {{ selectedError.error_code }} ({{ selectedError.course }})
        </v-list-subheader>

        <v-list-item>
          <p>
            <strong>Error {{ selectedError.error_code }}: </strong>
            <span class="text-subtitle-1">
              {{ errorsData[selectedError.error_code]?.description || "No description available" }}
            </span>
          </p>
          <p><strong>Total occurrences: </strong> {{ selectedError.total_times }}</p>
          <p>
            <strong>Quick recommendation:</strong>
            {{ errorsData[selectedError.error_code]?.recommendation || "None" }}
          </p>
          <p>
            <strong>Reference: </strong>
            <span v-html="errorsData[selectedError.error_code]?.reference || 'N/A'"></span>
          </p>
        </v-list-item>

        <v-list-item>
          <strong>Sample evidence:</strong>
          <ul>
            <li
              v-for="(ev, i) in selectedError.evidence_samples.slice(0, 5)"
              :key="i"
            >
              {{ ev }}
            </li>
          </ul>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import * as d3 from "d3";
import { errorsData } from "@/assets/scripts/errorsData";

export default {
  name: "AdminErrorBarChart",
  props: {
    errorData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      svgWidth: 1000,
      svgHeight: 400,
      selectedError: null,
      errorsData: errorsData,
    };
  },
  watch: {
    errorData: {
      handler() {
        this.drawChart();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    drawChart() {
      const margin = { top: 40, right: 20, bottom: 100, left: 60 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      const svg = d3.select(this.$refs.svg);
      svg.selectAll("*").remove();

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const data = this.errorData.map((d) => ({
        ...d,
        uniqueKey: d.course === "ALL" ? d.error_code : `${d.error_code}-${d.course}`,
        total_times: Number(d.total_times) || 0,
      }));

      if (!data.length || d3.max(data, (d) => d.total_times) === 0) return;

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.uniqueKey))
        .range([0, width])
        .padding(0.3);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.total_times)])
        .nice()
        .range([height, 0]);

      chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3.axisBottom(x).tickFormat((d) =>
            d.includes("-") ? d.split("-")[0] : d
          )
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      chart.append("g").call(d3.axisLeft(y));

      // Bars with click handler
      chart
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.uniqueKey))
        .attr("y", (d) => y(d.total_times))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.total_times))
        .attr("fill", "#1976d2")
        .style("cursor", "pointer")
        .on("click", (_, d) => {
          this.selectedError = d;
        });

      chart
        .selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.uniqueKey) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.total_times) - 4)
        .attr("text-anchor", "middle")
        .text((d) => d.total_times);
    },
  },
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
}
</style>
