<template>
  <div ref="chartContainer" class="pie-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from 'vue';
import * as d3 from 'd3';

export default defineComponent({
  name: 'PieChart',
  props: {
    data: {
      type: Array as () => { label: string; value: number }[],
      required: true
    },
    width: {
      type: Number,
      default: 250
    },
    height: {
      type: Number,
      default: 250
    },
    colors: {
      type: Array as () => string[],
      default: () => ['#4CAF50', '#F44336']
    }
  },
  setup(props) {
    const chartContainer = ref<HTMLElement | null>(null);

    const drawChart = () => {
      if (!chartContainer.value) return;

      const radius = Math.min(props.width, props.height) / 2;
      const color = d3.scaleOrdinal<string>()
        .domain(props.data.map(d => d.label))
        .range(props.colors);

      const svg = d3.select(chartContainer.value)
        .html('')
        .append('svg')
        .attr('width', props.width)
        .attr('height', props.height)
        .append('g')
        .attr('transform', `translate(${props.width / 2}, ${props.height / 2})`);

      const pie = d3.pie<{ label: string; value: number }>().value(d => d.value);
      const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
        .innerRadius(0)
        .outerRadius(radius);

      svg.selectAll('path')
        .data(pie(props.data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label));

      svg.selectAll('text')
        .data(pie(props.data))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => `${d.data.label}: ${d.data.value}`);
    };

    onMounted(drawChart);
    watch(() => props.data, drawChart, { deep: true });

    return { chartContainer };
  }
});
</script>

<style scoped>
.pie-chart {
  margin-top: 1rem;
}
</style>

