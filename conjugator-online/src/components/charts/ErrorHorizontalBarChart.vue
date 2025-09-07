<template>
  <div class="chart-wrapper">
    <!-- Popover card pinned top-right -->
    <v-card
      class="popover-card"
      elevation="2"
      max-width="90%"
    >
      <v-list density="compact">
        <v-list-subheader>
          <span class="text-uppercase">
            {{ popover.visible && selectedEvidence ? selectedEvidence.error : "Error Info" }}
          </span>
        </v-list-subheader>

        <v-list-item v-if="!popover.visible || !selectedEvidence" class="text-body-2">
          Click on a bar for information on the error
        </v-list-item>

        <v-list-item v-else class="text-body-2">
          {{ selectedEvidence.description }}
          ( see <span v-html="selectedEvidence.reference"></span> )
        </v-list-item>
      </v-list>
    </v-card>


    <!-- Chart -->
    <div class="chart-container" ref="container">
      <svg
        ref="svg"
        :width="svgWidth"
        :height="svgHeight"
        class="chart-svg"
      ></svg>
    </div>

    <!-- Info card (always below) -->
    <div id="infoCard" v-if="selectedEvidence">
      <v-list density="compact">
        <v-list-subheader>
          <span class="text-uppercase">{{ selectedEvidence.error }}</span>
        </v-list-subheader>
        <v-list-item>
          <strong>Examples of your errors: </strong>
          <em>{{ selectedEvidence.evidence }}</em>
        </v-list-item>
        <v-list-item>
          <strong>How to fix the error:</strong>
          {{ selectedEvidence.recommendation }}.
          For example, {{ selectedEvidence.examples }}
        </v-list-item>
        <v-list-item>
          <strong>Reference:</strong>
          for a complete explanation, go to
          <span v-html="selectedEvidence.reference"></span>
          in the grammar book
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { errorsData } from "@/assets/scripts/errorsData";

export default {
  name: "ErrorFrequencyChartSmall",
  props: { errorData: { type: Array, required: true } },
  data() {
    return {
      svgWidth: 360,
      svgHeight: 400,
      selectedEvidence: null,
      popover: { visible: false }
    };
  },
  mounted() {
    this.calculateSvgHeight();
    this.drawChart();
  },
  watch: {
    errorData: {
      handler() {
        this.calculateSvgHeight();
        this.drawChart();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    calculateSvgHeight() {
      if (!this.errorData || this.errorData.length === 0) {
        this.svgHeight = 400;
        return;
      }
      const errorCodes = [...new Set(this.errorData.map(d => d.error_code))];
      this.svgHeight = Math.max(200, errorCodes.length * 50);
    },
    drawChart() {
      const margin = { top: 20, right: 40, bottom: 20, left: 50 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      const svg = d3
        .select(this.$refs.svg)
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight);

      svg.selectAll("*").remove();

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const feedbackKeys = Array.from(
        new Set(this.errorData.map(d => d.feedback).filter(Boolean))
      );

      const nested = d3.group(this.errorData, d => d.error_code, d => d.feedback);
      const stackData = [];

      nested.forEach((feedbackGroup, error_code) => {
        const exampleError = this.errorData.find(e => e.error_code === error_code);
        const entry = {
          error_code,
          evidence: exampleError?.evidence ?? "",
          description: exampleError?.description ?? "",
          recommendation: exampleError?.recommendation ?? "",
          examples: exampleError?.examples ?? "",
          reference: exampleError?.reference ?? ""
        };

        feedbackGroup.forEach((items, feedbackId) => {
          entry[feedbackId] = d3.sum(items, d => d.times);
        });

        stackData.push(entry);
      });

      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, key) => sum + (a[key] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, key) => sum + (b[key] || 0), 0);
        return totalB - totalA;
      });

      const maxTotal =
        d3.max(stackData, d => d3.sum(feedbackKeys, key => d[key] || 0)) || 0;

      const y = d3
        .scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, height])
        .padding(0.2);

      const x = d3.scaleLinear().domain([0, maxTotal]).nice().range([0, width]);

      const color = d3
        .scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeTableau10);

      const stackedSeries = d3
        .stack()
        .keys(feedbackKeys)
        .value((d, key) => d[key] || 0)(stackData);

      chart
        .selectAll("g.layer")
        .data(stackedSeries)
        .enter()
        .append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("y", d => y(d.data.error_code))
        .attr("x", d => x(d[0]))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d[1]) - x(d[0]))
        .on("click", (event, d) => {
          this.showPopover(d.data);
        });

      chart.append("g").call(d3.axisLeft(y));

      chart
        .selectAll(".bar-total")
        .data(stackData)
        .enter()
        .append("text")
        .attr("class", "bar-total")
        .attr("x", d => x(d3.sum(feedbackKeys, k => d[k] || 0)) + 4)
        .attr("y", d => y(d.error_code) + y.bandwidth() / 2)
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .text(d => d3.sum(feedbackKeys, k => d[k] || 0));
    },
    showPopover(errorItem) {
      const error_code = errorItem.error_code;
      const evidenceText = errorItem.evidence || "No evidence available";
      const errorDetails = errorsData[error_code];

      if (errorDetails) {
        this.selectedEvidence = {
          error: `Error ${error_code}`,
          description: errorDetails.description,
          evidence: `"${evidenceText}"`,
          recommendation: errorDetails.recommendation,
          examples: errorDetails.examples,
          reference: errorDetails.reference
        };
      } else {
        this.selectedEvidence = {
          error: `Error ${error_code}`,
          description: "No details found",
          evidence: "",
          recommendation: "",
          examples: "",
          reference: ""
        };
      }

      this.popover.visible = true;
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  margin-top: 5%;
  padding: 8%;
}

.chart-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  padding-top: 120px; /* space for the pinned card */
}

.chart-svg {
  display: block;
}

.popover-card {
  position: absolute;
  top: 0; /* adjust how far from the top */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;     /* ensure it takes up 90% of parent */
  max-width: 90%; /* safeguard */
  z-index: 1000;
}

</style>
