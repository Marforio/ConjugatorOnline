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

      // Group by error_code and feedback
        const nested = d3.group(this.errorData, d => d.error_code, d => d.feedback);

        // Create a flat structure for stacking
        const stackData = [];

        for (const [error_code, feedbackGroup] of nested.entries()) {
        const entry = { error_code };
        for (const [feedback, items] of feedbackGroup.entries()) {
            entry[feedback] = d3.sum(items, d => d.times);
        }
        stackData.push(entry);
        }

        // Extract feedback keys
        const feedbackKeys = Array.from(
        new Set(this.errorData.map(d => d.feedback))
        );

      
      const svg = d3.select(this.$refs.svg);
      svg.selectAll('*').remove(); // Clear previous chart

      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, width])
        .padding(0.2);

        const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(stackData, d =>
            d3.sum(feedbackKeys, key => d[key] || 0)
            )
        ])
        .nice()
        .range([height, 0]);

        const color = d3.scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeCategory10); // or your own palette

        const stackedSeries = d3.stack()
            .keys(feedbackKeys)
            .value((d, key) => d[key] || 0)(stackData);


      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g')
        .call(d3.axisLeft(y));

      const tooltip = d3.select(this.$refs.tooltip);

      chart.selectAll('.bar')
        .data(this.errorData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.error_code))
        .attr('y', d => y(d.times))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.times))
        .attr('fill', '#69b3a2')
        .on('mouseover', (event, d) => {
          tooltip
            .style('opacity', 1)
            .html(`<strong>${d.error_code}</strong><br/>${d.evidence}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        })
        .on('click', (_, d) => {
          this.selectedEvidence = d.evidence;
        });
        
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
                const feedback = event.currentTarget.parentNode.__data__.key;
                tooltip
                .style('opacity', 1)
                .html(`<strong>${d.data.error_code}</strong><br/>${feedback}: ${d[1] - d[0]} errors`)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', () => {
                tooltip.style('opacity', 0);
            })
            .on('click', (_, d) => {
                this.selectedEvidence = `Error ${d.data.error_code}`;
            });
        chart.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

            chart.append('g')
            .call(d3.axisLeft(y));


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
