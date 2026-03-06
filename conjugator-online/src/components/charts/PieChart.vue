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
  name: 'PieChart',
  props: {
    data: { type: Array as () => { label: string; value: number }[], required: true },
    colors: { type: Array as () => string[], default: () => ['#4CAF50', '#F44336'] }
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const drawChart = () => {
      if (!chartCanvas.value) return;
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(chartCanvas.value, {
        type: 'pie',
        data: {
          labels: props.data.map(d => d.label),
          datasets: [{
            data: props.data.map(d => d.value),
            backgroundColor: props.colors,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true, // Keeps it a circle
          plugins: { legend: { display: false } }
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
  max-width: 250px; /* Limits size on desktop so it doesn't get huge */
  margin: 0 auto;
}
</style>