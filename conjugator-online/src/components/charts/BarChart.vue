<template>
  <div ref="chartContainer" class="bar-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from 'vue';
import * as d3 from 'd3';

interface ChartData {
  label: string;
  value: number;
  correct: number;
  total: number;
    color: string;
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
    const marginBottom = 50; // extra space for labels
    const marginLeft = 18; 

    const drawChart = () => {
      if (!chartContainer.value) return;

      const svg = d3.select(chartContainer.value)
        .html('')
        .append('svg')
        .attr('width', props.width + marginLeft)
        .attr('height', props.height + marginBottom);

    const chartGroup = svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`); // ← shift everything right

      const x = d3.scaleBand()
        .domain(props.data.map((d: ChartData) => d.label))
        .range([0, props.width])
        .padding(0.1);

      const yMax = d3.max(props.data, (d: ChartData) => d.value)!;
      const y = d3.scaleLinear()
        .domain([0, yMax * 1.1]) // ← add 10% headroom
        .range([props.height - 20, 0]);


      chartGroup.selectAll('rect')
        .data(props.data)
        .enter()
        .append('rect')
        .attr('x', (d: ChartData) => x(d.label)!)
        .attr('y', (d: ChartData) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d: ChartData) => props.height - 20 - y(d.value))
        .attr('fill', (d: ChartData) => d.color)
        .each(function (d: ChartData) {
            d3.select(this)
            .append('title')
            .text(`${d.correct}/${d.total} correct`);
        });

      chartGroup.selectAll('text')
        .data(props.data)
        .enter()
        .append('text')
        .attr('x', (d: ChartData) => x(d.label)! + x.bandwidth() / 2)
        .attr('y', (d: ChartData) => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .text((d: ChartData) => `${d.value}%`);

      chartGroup.selectAll('.x-label')
        .data(props.data)
        .enter()
        .append('text')
        .attr('class', 'x-label')
        .attr('x', (d: ChartData) => x(d.label)! + x.bandwidth() / 2)
        .attr('y', props.height - 5) // near bottom of chart
        .attr('font-size', '10px')
        .attr('transform', (d: ChartData) => `rotate(-30, ${x(d.label)! + x.bandwidth() / 2}, ${props.height - 5})`)
        .attr('text-anchor', 'end')
        .text((d: ChartData) => d.label)
        .attr('y', props.height) ;
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
