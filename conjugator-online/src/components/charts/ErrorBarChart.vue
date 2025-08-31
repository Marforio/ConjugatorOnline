<template>
  <div class="chart-wrapper">
    <!-- chart + popover -->
    <div class="chart-container" ref="container">
      <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>
      <!-- Floating popover box pinned top-right of chart -->
      <div
        v-if="popover.visible"
        class="popover-card"
        :style="{ top: popover.y + 'px', left: popover.x + 'px' }"
        v-html="selectedEvidencePopover"
      ></div>
    </div>
    <!-- infobox (always below, fixed width, doesn’t affect chart height) -->
    <div id="infoCard" v-html="selectedEvidenceInfobox || 'Click a bar to see error details'"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { useDisplay } from 'vuetify';
import { errorsData } from '@/assets/scripts/errorsData';

export default {
  name: 'ErrorFrequencyChart',
  props: {
    errorData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      svgWidth: 800,
      svgHeight: 400, // default min, will be recalculated
      selectedEvidencePopover: null,
      selectedEvidenceInfobox: null,
      popover: {
        visible: false,
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    const { smAndDown } = useDisplay();
    if (smAndDown.value) {
      this.svgWidth = 1000;
    }
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
      const feedbackKeys = Array.from(
        new Set(this.errorData.map(d => d.feedback).filter(Boolean))
      );
      const nested = d3.group(this.errorData, d => d.error_code, d => d.feedback);
      const stackData = [];
      nested.forEach((feedbackGroup, error_code) => {
        const entry = { error_code };
        feedbackGroup.forEach((items, feedbackId) => {
          entry[feedbackId] = d3.sum(items, d => d.times);
        });
        stackData.push(entry);
      });
      let maxTotal = d3.max(stackData, d =>
        d3.sum(feedbackKeys, key => d[key] || 0)
      ) || 0;
      this.svgHeight = Math.max(400, maxTotal * 10);
    },
    drawChart() {
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = this.svgWidth - margin.left - margin.right;
        const height = this.svgHeight - margin.top - margin.bottom;

        const svg = d3
            .select(this.$refs.svg)
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight);

        svg.selectAll('*').remove();
        const chart = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const feedbackKeys = Array.from(
            new Set(this.errorData.map(d => d.feedback).filter(Boolean))
        );

        // Map feedback_id → feedback object for tooltips
        const feedbackMap = new Map();
        this.errorData.forEach(d => {
            if (d.feedback && d.feedback_id) {
            feedbackMap.set(d.feedback, { date: d.date, ...d });
            }
        });

        // Build stackData with evidence included
        const nested = d3.group(this.errorData, d => d.error_code, d => d.feedback);
        const stackData = [];
        
        nested.forEach((feedbackGroup, error_code) => {
            // Find an example error item to get evidence for this error_code
            const exampleError = this.errorData.find(e => e.error_code === error_code);

            // Create new entry copying error_code and evidence
            // Using Object.assign is optional here if you want to add more props
            const entry = { error_code, evidence: exampleError?.evidence ?? null };

            feedbackGroup.forEach((items, feedbackId) => {
            entry[feedbackId] = d3.sum(items, d => d.times);
            });

            stackData.push(entry);
        });

      // Sort by total times descending
      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, key) => sum + (a[key] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, key) => sum + (b[key] || 0), 0);
        return totalB - totalA;
      });

      const maxTotal = d3.max(stackData, d =>
        d3.sum(feedbackKeys, key => d[key] || 0)
      ) || 0;

      // X / Y scales
      const x = d3
        .scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, width])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, maxTotal])
        .nice()
        .range([height, 0]);

      const color = d3
        .scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeTableau10);

      chart
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g').call(d3.axisLeft(y));

      if (feedbackKeys.length === 0) {
        // Simple bars
        chart
          .selectAll('rect')
          .data(stackData)
          .enter()
          .append('rect')
          .attr('x', d => x(d.error_code))
          .attr('y', d => y(d.times))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.times))
          .attr('fill', 'steelblue')
          .on('click', (event, d) => {
            this.showPopover(d);
          });
      } else {
        // Stacked bars
        const stackedSeries = d3
          .stack()
          .keys(feedbackKeys)
          .value((d, key) => d[key] || 0)(stackData);

        chart
          .selectAll('g.layer')
          .data(stackedSeries)
          .enter()
          .append('g')
          .attr('class', 'layer')
          .attr('fill', d => color(d.key))
          .selectAll('rect')
          .data(d => d)
          .enter()
          .append('rect')
          .attr('x', d => x(d.data.error_code))
          .attr('y', d => y(d[1]))
          .attr('height', d => y(d[0]) - y(d[1]))
          .attr('width', x.bandwidth())
          .on('click', (event, d) => {
            console.log('Clicked stacked bar data:', d.data);
            this.showPopover(d.data);
          });
      }
    },
    showPopover(errorItem) {
        const error_code = errorItem.error_code;
        const evidenceText = errorItem.evidence || 'No evidence available';

        const errorDetails = errorsData[error_code];
        if (errorDetails) {
            this.selectedEvidencePopover = `
            <strong>Error ${error_code}</strong><br>
            <em>${errorDetails.description}</em><br>
            See: ${errorDetails.reference}
            `;
            this.selectedEvidenceInfobox = `
            <strong>Error ${error_code}</strong> | <em>${errorDetails.description}</em><br>
            <strong>Evidence of your errors:</strong> ${evidenceText}<br>
            <strong>Recommendation:</strong> ${errorDetails.recommendation}<br>
            <strong>Examples:</strong> ${errorDetails.examples}<br>
            <strong>For a complete explanation:</strong> ${errorDetails.reference}
            `
        } else {
            this.selectedEvidencePopover = `No details found for error ${error_code}`;
        }

        // Fixed position: near top right of chart container
        const container = this.$refs.container;
        const contRect = container.getBoundingClientRect();
        const popoverWidth = 300;
        const padding = 24;

        let relativeX = contRect.width - popoverWidth - padding;
        let relativeY = padding; // Top right, padding from top

        relativeX = Math.max(0, relativeX);
        relativeY = Math.max(0, relativeY);

        this.popover.visible = true;
        this.popover.x = relativeX;
        this.popover.y = relativeY;
        }
  }
};
</script>

<style scoped>
.bar:hover {
  fill: orange;
  cursor: pointer;
}
.chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.chart-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}
#infoCard {
  padding: 10px;
  border: 1px solid #aaa;
  background: #f9f9f9;
  font-family: sans-serif;
  width: 100%; /* span full width below chart */
  min-height: 100px; /* consistent space even if empty */
}

.popover-card {
  position: absolute;
  z-index: 1000;
  max-width: 300px;
  max-height: 200px;
  background: white;
  border: 1px solid #aaa;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  line-height: 1.3;
  overflow-y: auto;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
}
</style>
