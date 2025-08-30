<template>
  <div class="chart-container">
    <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>
    <div id="infoCard" v-html="selectedEvidence || 'Click a bar to see error details'"></div>
    <div ref="tooltip" class="tooltip"></div>
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
      svgHeight: 400,
      selectedEvidence: null
    };
  },
  mounted() {
    const { smAndDown } = useDisplay();
    if (smAndDown.value) {
      this.svgWidth = 1000; // wider for scrollable mobile view
    }
    this.drawChart();
  },
  watch: {
    errorData: {
      handler() {
        this.drawChart();
      },
      deep: true
    }
  },
  methods: {
    drawChart() {
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      const svg = d3.select(this.$refs.svg);
      svg.selectAll('*').remove();
      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // 🔹 Map feedback_id → feedback object for tooltips
      const feedbackMap = new Map();
      this.errorData.forEach(d => {
        if (d.feedback && d.feedback_id) {
          feedbackMap.set(d.feedback, { date: d.date, ...d });
        }
      });

      // 🔹 Group by error_code → feedback_id → sum(times)
      const nested = d3.group(this.errorData, d => d.error_code, d => d.feedback);

      const stackData = [];
      nested.forEach((feedbackGroup, error_code) => {
        const entry = { error_code };
        feedbackGroup.forEach((items, feedbackId) => {
          entry[feedbackId] = d3.sum(items, d => d.times);
        });
        stackData.push(entry);
      });

      // 🔹 Extract feedback keys for stacking
      const feedbackKeys = Array.from(new Set(this.errorData.map(d => d.feedback).filter(Boolean)));

      // Sort by total times descending
      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, key) => sum + (a[key] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, key) => sum + (b[key] || 0), 0);
        return totalB - totalA; // descending
        });

      // 🔹 X / Y scales
      const x = d3.scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, width])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(stackData, d => d3.sum(feedbackKeys, key => d[key] || 0))])
        .nice()
        .range([height, 0]);

      const color = d3.scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeTableau10);

      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g')
        .call(d3.axisLeft(y));

      const tooltip = d3.select(this.$refs.tooltip);

      if (feedbackKeys.length === 0) {
        // 🔹 Only simple bars
        chart.selectAll('rect')
          .data(stackData)
          .enter()
          .append('rect')
          .attr('x', d => x(d.error_code))
          .attr('y', d => y(d.times))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.times))
          .attr('fill', 'steelblue')
          .on('mouseover', (event, d) => {
            tooltip.style('opacity', 1)
              .html(`Error ${d.error_code}: ${d.times} occurrence(s)`)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', () => tooltip.style('opacity', 0))
          .on('click', (_, d) => this.selectedEvidence = `Error ${d.error_code}`);
      } else {
        // 🔹 Stacked bars
        const stackedSeries = d3.stack()
          .keys(feedbackKeys)
          .value((d, key) => d[key] || 0)(stackData);

        chart.selectAll('g.layer')
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
          .on('mouseover', (event, d) => {
            const feedbackId = event.currentTarget.parentNode.__data__.key;
            const feedbackObj = feedbackMap.get(feedbackId);
            const decodedDate = decodeDate(feedbackObj?.date ?? 'Unknown date');
            tooltip.style('opacity', 1)
              .html(`Feedback from ${decodedDate}: ${d[1] - d[0]} errors`)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', () => tooltip.style('opacity', 0))
          .on('click', (_, d) => {
            const errorDetails = errorsData[d.data.error_code];
            if (errorDetails) {
                this.selectedEvidence = `
                <strong>Error ${d.data.error_code}</strong><br>
                <em>${errorDetails.short_slug}</em><br>
                ${errorDetails.description}<br>
                <strong>Recommendation:</strong> ${errorDetails.recommendation}<br>
                <strong>Examples:</strong> ${errorDetails.examples}<br>
                <strong>Reference:</strong> ${errorDetails.reference}
                `;
            } else {
                this.selectedEvidence = `No details found for error ${d.data.error_code}`;
            }
            });

      }

      // 🔹 Helper to decode API date string
      function decodeDate(raw) {
        if (!raw || raw === 'Unknown date') return raw;
        const match = raw.match(/_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
        if (!match) return raw;
        const [, year, month, day, hour, minute] = match;
        return `${day}/${month}/${year} at ${hour}:${minute}`;
      }
    }
  }
};
</script>



<style scoped>
.bar:hover {
  fill: orange;
  cursor: pointer;
}
.tooltip {
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}
#infoCard {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #aaa;
  background: #f9f9f9;
  font-family: sans-serif;
}
.chart-container {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

</style>
