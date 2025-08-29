<template>
  <div class="chart-container">
    <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>
    <div id="infoCard">{{ selectedEvidence || 'Click a bar to see error details' }}</div>
    <div ref="tooltip" class="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

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
    this.drawChart();
  },
  methods: {
    drawChart() {
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      // 🔹 Build a map: feedback_id string -> full row
      const feedbackMap = new Map();
      this.errorData.forEach(d => {
        if (d.feedback) {
          feedbackMap.set(d.feedback, d);
        }
      });

      // 🔹 Group by error_code and feedback_id
      const nested = d3.group(
        this.errorData,
        d => d.error_code,
        d => d.feedback
      );

      // 🔹 Flatten for stacking
      const stackData = [];
      for (const [error_code, feedbackGroup] of nested.entries()) {
        const entry = { error_code };
        for (const [feedback_id, items] of feedbackGroup.entries()) {
          entry[feedback_id] = d3.sum(items, d => d.times);
        }
        stackData.push(entry);
      }

      // 🔹 Extract feedback IDs
      const feedbackKeys = Array.from(feedbackMap.keys());

      // 🔹 Date decoder
      function decodeDate(raw) {
        if (!raw || raw === 'Unknown date') return raw;
        const match = raw.match(/_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
        if (!match) return raw;
        const [, year, month, day, hour, minute] = match;
        return `${day}/${month}/${year} at ${hour}:${minute}`;
      }

      // 🔹 Prepare SVG
      const svg = d3.select(this.$refs.svg);
      svg.selectAll('*').remove();

      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

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

      const stackedSeries = d3.stack()
        .keys(feedbackKeys)
        .value((d, key) => d[key] || 0)(stackData);

      // 🔹 Axes
      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g')
        .call(d3.axisLeft(y));

      const tooltip = d3.select(this.$refs.tooltip);

      // 🔹 Draw bars
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
          const row = feedbackMap.get(feedbackId);
          const decodedDate = decodeDate(row?.date ?? 'Unknown date');

          tooltip
            .style('opacity', 1)
            .html(`Feedback from ${decodedDate}: ${d[1] - d[0]} errors`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => tooltip.style('opacity', 0))
        .on('click', (_, d) => {
          this.selectedEvidence = `Error ${d.data.error_code}`;
        });
    }
  },
  watch: {
    errorData: {
      handler() {
        this.drawChart();
      },
      deep: true
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
}
</style>
