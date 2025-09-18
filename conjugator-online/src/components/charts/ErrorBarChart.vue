<template>
  <div class="chart-wrapper">
    <!-- chart + popover -->
    <div class="chart-container" ref="container">
      <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>
      <!-- Floating popover box pinned top-right of chart -->
      <v-card
        class="popover-card"
        :style="{ top: popover.y + 'px', left: popover.x + 'px', maxWidth: '300px', width: 'auto' }"
        elevation="6"
        >
        <v-list density="compact">
          <v-list-subheader>
            <span class="text-uppercase">
              {{ selectedEvidence ? selectedEvidence.error : "Error Info" }}
            </span>
          </v-list-subheader>

          <v-list-item v-if="!selectedEvidence" class="text-body-2">
            Click on a bar for information on the error
          </v-list-item>

          <v-list-item v-else class="text-body-2">
            {{ selectedEvidence.description }}
            ( see <span v-html="selectedEvidence.reference"></span> )
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <!-- infobox (always below, fixed width, doesn’t affect chart height) -->
    <div class="info-wrapper" ref="infoWrapper" style="display: flex; justify-content: center;">
        <v-card v-if="selectedEvidence" class="info-card" max-width="90%" width="90%">
        <v-list density="compact">
            <v-list-subheader>
            <span class="text-uppercase text-high-emphasis">{{ selectedEvidence.error }} :</span>
            {{ selectedEvidence.description }}
            </v-list-subheader>
            <v-list-item>
            <strong>Examples of your errors: </strong>
            <em>{{ selectedEvidence.evidence }}</em>
            </v-list-item>
            <v-list-item>
            <strong>How to fix the error:</strong>
            {{ selectedEvidence.recommendation }}. For example, {{ selectedEvidence.examples }}. <u>For a complete explanation</u>, go to
            <span v-html="selectedEvidence.reference"></span>
            in the grammar book.
            </v-list-item>
        </v-list>
        </v-card>

    </div>    
        
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
      svgWidth: 1000,
      svgHeight: 400, // default min, will be recalculated
      selectedEvidence: null,
      popover: {
        x: 300,
        y: 30
      }
    };
  },
  mounted() {
    const { smAndDown } = useDisplay();
    if (smAndDown.value) {
      this.svgWidth = 1000;
    }
    this.calculateSvgHeight();
    this.drawChart();
    this.updatePopoverPosition();
    window.addEventListener('resize', this.updatePopoverPosition);

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updatePopoverPosition);
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
      let maxTotal = d3.max(stackData, d =>
        d3.sum(feedbackKeys, key => d[key] || 0)
      ) || 0;
      this.svgHeight = Math.max(400, maxTotal * 10);
    },
    updatePopoverPosition() {
        if (!this.popover.visible || !this.$refs.container) return;

        const contRect = this.$refs.container.getBoundingClientRect();
        const popoverWidth = 200;
        const padding = 24;

        let relativeX = contRect.width - popoverWidth - padding;
        let relativeY = padding;

        this.popover.x = Math.max(0, relativeX);
        this.popover.y = Math.max(0, relativeY);
        },
    drawChart() {
        const margin = { top: 30, right: 40, bottom: 50, left: 60 };
        const width = this.svgWidth - margin.left - margin.right;
        const height = this.svgHeight - margin.top - margin.bottom;

        const svg = d3
            .select(this.$refs.svg)
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight)
            .attr('width', this.svgWidth).style('min-width', this.svgWidth + 'px')
            .style('min-width', this.svgWidth + 'px');


        svg.selectAll('*').remove();
        const chart = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const feedbackKeys = Array.from(
          new Set(this.errorData.map(d => d.feedbackId).filter(Boolean))
        );

        

        // Map feedback_id → feedback object for tooltips
        const feedbackMap = new Map();
        this.errorData.forEach(d => {
            if (d.feedback && d.feedback_id) {
            feedbackMap.set(d.feedback, { date: d.date, ...d });
            }
        });

        // Build stackData with evidence included
        const nested = d3.group(this.errorData, d => d.error_code, d => d.feedbackId);
        const stackData = [];
        
        nested.forEach((feedbackGroup, error_code) => {
            // Find an example error item to get evidence for this error_code
            const exampleError = this.errorData.find(e => e.error_code === error_code);

            // Create new entry copying error_code and evidence
            // Using Object.assign is optional here if you want to add more props
            const entry = { error_code, evidence: exampleError?.evidence ?? null };

            feedbackGroup.forEach((items, feedbackId) => {
            entry[feedbackId] = d3.sum(items, d => d.times);
            });

            stackData.push(entry);
        });

      // Sort by total times descending
      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, key) => sum + (a[key] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, key) => sum + (b[key] || 0), 0);
        return totalB - totalA;
      });

      const maxTotal = d3.max(stackData, d =>
        d3.sum(feedbackKeys, key => d[key] || 0)
      ) || 0;

      // X / Y scales
      const x = d3
        .scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, width])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, maxTotal])
        .nice()
        .range([height, 0]);

      const color = d3
        .scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeTableau10);

      chart
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      chart.append('g').call(d3.axisLeft(y));

      if (feedbackKeys.length === 0) {
        // Simple bars
        chart
          .selectAll('rect')
          .data(stackData)
          .enter()
          .append('rect')
          .attr('x', d => x(d.error_code))
          .attr('y', d => y(d.times))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.times))
          .attr('fill', 'steelblue')
          .on('click', (event, d) => {
            this.showPopover(d);
          });
      } else {
        // Stacked bars
        const stackedSeries = d3
          .stack()
          .keys(feedbackKeys)
          .value((d, key) => d[key] || 0)(stackData);

        chart
          .selectAll('g.layer')
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
          .on('click', (event, d) => {
            this.showPopover(d.data);
          });
      }
      chart
      .selectAll(".bar-total")
      .data(stackData)
      .enter()
      .append("text")
      .attr("class", "bar-total")
      .attr("x", d => {
        // center above the stacked bar
        const total = d3.sum(feedbackKeys, k => d[k] || 0);
        return x(d.error_code) + x.bandwidth() / 2;
      })
      .attr("y", d => {
        const total = d3.sum(feedbackKeys, k => d[k] || 0);
        return y(total) - 4; // 4px above the top
      })
      .attr("text-anchor", "middle") // horizontally center
      .attr("dominant-baseline", "alphabetic") // position above the bar
      .attr("font-size", "12px")
      .text(d => d3.sum(feedbackKeys, k => d[k] || 0));
    },
    showPopover(errorItem) {
        const error_code = errorItem.error_code;
        const evidenceText = errorItem.evidence || 'No evidence available';

        const errorDetails = errorsData[error_code];
        if (errorDetails) {
            this.selectedEvidence = {
                error: `Error ${error_code}`,
                description: errorDetails.description,
                evidence: `"${evidenceText}"`,
                recommendation: errorDetails.recommendation,
                examples: errorDetails.examples,
                reference: errorDetails.reference // raw HTML allowed here
                };
            } else {
                this.selectedEvidence = {
                error: `Error ${error_code}`,
                description: 'No details found',
                evidence: '',
                recommendation: '',
                examples: '',
                reference: ''
                };
            }

        // Fixed position: near top right of chart container
        const container = this.$refs.container;
        const contRect = container.getBoundingClientRect();
        const popoverWidth = 300;
        const padding = 24;

        let relativeX = contRect.width - popoverWidth - padding - 150;
        let relativeY = padding; // Top right, padding from top

        relativeX = Math.max(0, relativeX);
        relativeY = Math.max(0, relativeY);

        this.popover.x = relativeX;
        this.popover.y = relativeY;
        }
  }
};
</script>

<style scoped>
.bar:hover {
  fill: orange;
  cursor: pointer;
}
.chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* ✅ instead of flex-start */
  gap: 20px;
  padding: 16px 24px;
  box-sizing: border-box;
  width: 100%;  /* ✅ fill parent, allow overflow to trigger */
}


.chart-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;

  width: 100%;
  max-width: 100vw;
  min-width: 0;

  box-sizing: border-box;
  display: block;

  /* ✅ allow the inner SVG to dictate scroll width */
  white-space: nowrap;
}



.popover-card {
  position: absolute;
  z-index: 1000;
  /* let content grow naturally */
  max-width: 300px; 
  min-width: 200px; /* optional */
  width: auto; 
  white-space: normal; /* allow wrapping */
  word-break: break-word; /* prevent overflow with long words */
}
.info-wrapper {
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  box-sizing: border-box;
  display: block;
}


.info-card {
  box-sizing: border-box;
  /* Remove fixed pixel width if present */
}




</style>
