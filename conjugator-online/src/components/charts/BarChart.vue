<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'BarChart',
  props: {
    data: { type: Array as () => any[], required: true },
    height: { type: Number, default: 250 }
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const drawChart = () => {
      if (!chartCanvas.value) return;
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels: props.data.map(d => d.label),
          datasets: [{
            label: 'Accuracy %',
            data: props.data.map(d => d.value),
            backgroundColor: props.data.map(d => d.color),
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%' } },
            x: { ticks: { maxRotation: 45, minRotation: 0 } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = props.data[ctx.dataIndex];
                  return `${item.correct}/${item.total} correct (${item.value}%)`;
                }
              }
            }
          }
        }
      });
    };

    onMounted(drawChart);
    watch(() => props.data, drawChart, { deep: true });
    onBeforeUnmount(() => chartInstance?.destroy());

    return { chartCanvas };
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 250px; /* The container now controls the height */
}
</style>