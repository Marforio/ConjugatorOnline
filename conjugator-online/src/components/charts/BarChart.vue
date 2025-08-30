<template>
  <div ref="chartContainer" class="bar-chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, computed } from 'vue';
import * as d3 from 'd3';
import { useDisplay } from 'vuetify';

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
    const marginBottom = 50;
    const marginLeft = 18;

    const { xs, smAndUp } = useDisplay();

    const responsiveWidth = computed(() => {
      if (smAndUp.value) return Math.max(props.width, 500);
      return 300; // smaller width for phones
    });

    const labelFontSize = computed(() => (xs.value ? '9px' : '11px'));
    const labelRotation = computed(() => (xs.value ? -15 : -30));

    const drawChart = () => {
      if (!chartContainer.value) return;

      const svg = d3.select(chartContainer.value)
        .html('')
        .append('svg')
        .attr('width', responsiveWidth.value + marginLeft)
        .attr('height', props.height + marginBottom);

      const chartGroup = svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`);

      const x = d3.scaleBand()
        .domain(props.data.map((d: ChartData) => d.label))
        .range([0, responsiveWidth.value])
        .padding(0.1);

      const yMax = d3.max(props.data, (d: ChartData) => d.value)!;
      const y = d3.scaleLinear()
        .domain([0, yMax * 1.1])
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
        .append('title')
        .text((d: ChartData) => `${d.correct}/${d.total} correct`);

      chartGroup.selectAll('text.value-label')
        .data(props.data)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', (d: ChartData) => x(d.label)! + x.bandwidth() / 2)
        .attr('y', (d: ChartData) => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .text((d: ChartData) => `${d.value}%`);

      chartGroup.selectAll('text.x-label')
        .data(props.data)
        .enter()
        .append('text')
        .attr('class', 'x-label')
        .attr('x', (d: ChartData) => x(d.label)! + x.bandwidth() / 2)
        .attr('y', props.height)
        .attr('font-size', labelFontSize.value)
        .attr('transform', (d: ChartData) =>
          `rotate(${labelRotation.value}, ${x(d.label)! + x.bandwidth() / 2}, ${props.height})`
        )
        .attr('text-anchor', 'end')
        .text((d: ChartData) => d.label);
    };

    onMounted(drawChart);
    watch(() => props.data, drawChart, { deep: true });
    watch(responsiveWidth, drawChart); // redraw on screen size change

    return { chartContainer};
  }
});
</script>


<style scoped>
.bar-chart {
  margin-top: 1rem;
  overflow-x: auto;
}

</style>
