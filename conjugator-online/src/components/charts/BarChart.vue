<template>
  <div ref="chartContainer" class="bar-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from 'vue';
import * as d3 from 'd3';

interface ChartData {
  label: string;
  value: number;
}

export default defineComponent({
  name: 'BarChart',
  props: {
    data: {
      type: Array as () => ChartData[],
      required: true
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 250
    },
    color: {
      type: String,
      default: '#2196F3'
    }
  },
  setup(props) {
    const chartContainer = ref<HTMLElement | null>(null);

    const drawChart = () => {
      if (!chartContainer.value) return;

      const svg = d3.select(chartContainer.value)
        .html('')
        .append('svg')
        .attr('width', props.width)
        .attr('height', props.height);

      const x = d3.scaleBand()
        .domain(props.data.map((d: ChartData) => d.label))
        .range([0, props.width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(props.data, (d: ChartData) => d.value)!])
        .range([props.height - 20, 0]);

      svg.selectAll('rect')
        .data(props.data)
        .enter()
        .append('rect')
        .attr('x', (d: ChartData) => x(d.label)!)
        .attr('y', (d: ChartData) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d: ChartData) => props.height - 20 - y(d.value))
        .attr('fill', props.color);

      svg.selectAll('text')
        .data(props.data)
        .enter()
        .append('text')
        .attr('x', (d: ChartData) => x(d.label)! + x.bandwidth() / 2)
        .attr('y', (d: ChartData) => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .text((d: ChartData) => d.value.toString());
    };

    onMounted(drawChart);
    watch(() => props.data, drawChart, { deep: true });

    return { chartContainer };
  }
});
</script>

<style scoped>
.bar-chart {
  margin-top: 1rem;
}
</style>
