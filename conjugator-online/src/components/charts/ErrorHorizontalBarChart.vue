<template>
  <div class="chart-wrapper">
    <!-- Chart -->
    <div class="chart-container" ref="container">
      <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>
    </div>

    <!-- Floating popover -->
    <div
      v-if="popover.visible"
      class="popover-card"
      :style="{ top: popover.y + 'px', left: popover.x + 'px' }"
      v-html="selectedEvidence"
    ></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { errorsData } from '@/assets/scripts/errorsData';

export default {
  name: 'ErrorFrequencyChartSmall',
  props: {
    errorData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      svgWidth: 360,
      svgHeight: 400,
      selectedEvidence: null,
      popover: {
        visible: false,
        x: 0,
        y: 0
      }
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
      const margin = { top: 20, right: 40, bottom: 20, left: 100 };
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

      // group data
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

      // sort
      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, key) => sum + (a[key] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, key) => sum + (b[key] || 0), 0);
        return totalB - totalA;
      });

      const maxTotal = d3.max(stackData, d =>
        d3.sum(feedbackKeys, key => d[key] || 0)
      ) || 0;

      const y = d3
        .scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, height])
        .padding(0.2);

      const x = d3
        .scaleLinear()
        .domain([0, maxTotal])
        .nice()
        .range([0, width]);

      const color = d3.scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeTableau10);

      // stack series
      const stackedSeries = d3.stack()
        .keys(feedbackKeys)
        .value((d, key) => d[key] || 0)(stackData);

      const tooltipContainer = this.$refs.container;

      // draw stacked bars
      chart.selectAll('g.layer')
        .data(stackedSeries)
        .enter()
        .append('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('y', d => y(d.data.error_code))
        .attr('x', d => x(d[0]))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d[1]) - x(d[0]))
        .on('click', (event, d) => {
            // Get data for the popover 
            const errorDetails = errorsData[d.data.error_code];
            if (errorDetails) {
                this.selectedEvidence = `
                <strong>Error ${d.data.error_code}</strong><br>
                <em>${errorDetails.description}</em><br>
                See ${errorDetails.reference}
                `;
            } else {
                this.selectedEvidence = `No details found for error ${d.data.error_code}`;
            }

            // Fixed position: lower right of container
            const popoverHeight = 100;           // Estimate or measure popover height
            const contRect = tooltipContainer.getBoundingClientRect();
            const popoverWidth = 150;
            const padding = 24;

            // Position: Vertically centered (or adjust slightly up)
            let relativeY = contRect.height / 2 - popoverHeight / 2 ; // -30 moves it further up
            let relativeX = contRect.width - popoverWidth - padding;

            relativeY = Math.max(0, relativeY);

            this.popover.visible = true;
            this.popover.x = relativeX;
            this.popover.y = relativeY;

                        });


      // add error_code labels on left
      chart.append('g')
        .call(d3.axisLeft(y));

      // add totals to right of bars
      chart.selectAll('.bar-total')
        .data(stackData)
        .enter()
        .append('text')
        .attr('class', 'bar-total')
        .attr('x', d => x(d3.sum(feedbackKeys, k => d[k] || 0)) + 4)
        .attr('y', d => y(d.error_code) + y.bandwidth() / 2)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .text(d => d3.sum(feedbackKeys, k => d[k] || 0));
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
}

.chart-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.popover-card {
  position: absolute;
  z-index: 1000;
  max-width: 150px;
  background: white;
  border: 1px solid #aaa;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
}
</style>
