<template>
  <div class="chart-wrapper">
    <div class="tooltip" ref="tooltip" style="opacity: 0;"></div>

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

    <!-- info box below -->
    <div class="info-wrapper p-1" ref="infoWrapper" style="display: flex; justify-content: center;">
      <v-card v-if="selectedEvidence" class="info-card" max-width="95%" width="95%" elevation="2">
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
            {{ selectedEvidence.recommendation }}. For example, {{ selectedEvidence.examples }}.
            <u>For a complete explanation</u>, go to
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
      svgHeight: 400,
      selectedEvidence: null,
      popover: { x: 300, y: 30 }
    };
  },
  mounted() {
    const { smAndDown } = useDisplay();
    if (smAndDown.value) this.svgWidth = 1000;
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
        new Set(this.errorData.map(d => d.feedbackId).filter(Boolean))
      );
      const nested = d3.group(this.errorData, d => d.error_code, d => d.feedbackId);
      const stackData = [];
      nested.forEach((feedbackGroup, error_code) => {
        const entry = { error_code };
        feedbackGroup.forEach((items, feedbackId) => {
          entry[feedbackId] = d3.sum(items, d => d.times);
        });
        stackData.push(entry);
      });
      const maxTotal =
        d3.max(stackData, d => d3.sum(feedbackKeys, key => d[key] || 0)) || 0;
      this.svgHeight = Math.max(400, maxTotal * 10);
    },

    updatePopoverPosition() {
      if (!this.$refs.container) return;
      const contRect = this.$refs.container.getBoundingClientRect();
      const popoverWidth = 200;
      const padding = 24;
      this.popover.x = Math.max(0, contRect.width - popoverWidth - padding);
      this.popover.y = Math.max(0, padding);
    },

    drawChart() {
      const margin = { top: 30, right: 40, bottom: 50, left: 60 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      const svg = d3
        .select(this.$refs.svg)
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .style('min-width', this.svgWidth + 'px');

      svg.selectAll('*').remove();

      const chart = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const feedbackKeys = Array.from(
        new Set(this.errorData.map(d => d.feedbackId).filter(Boolean))
      );

      // Prepare stacked data
      const nested = d3.group(this.errorData, d => d.error_code, d => d.feedbackId);
      const stackData = [];

      nested.forEach((feedbackGroup, error_code) => {
        const allEvidence = this.errorData
          .filter(e => e.error_code === error_code && e.evidence)
          .map(e => e.evidence.trim())
          .filter((v, i, a) => v && a.indexOf(v) === i);
        const entry = {
          error_code,
          evidence: allEvidence.length ? allEvidence.join('; ') : null
        };
        feedbackGroup.forEach((items, feedbackId) => {
          entry[feedbackId] = d3.sum(items, d => d.times);
        });
        stackData.push(entry);
      });

      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, k) => sum + (a[k] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, k) => sum + (b[k] || 0), 0);
        return totalB - totalA;
      });

      const maxTotal =
        d3.max(stackData, d => d3.sum(feedbackKeys, k => d[k] || 0)) || 0;

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
          .attr('fill', 'steelblue');
      } else {
        // ✅ Build feedbackId → feedbackDate map for tooltips
        const feedbackById = new Map();
        this.errorData.forEach(row => {
          if (row.feedbackId) {
            feedbackById.set(String(row.feedbackId), row.feedbackDate || null);
          }
        });

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
          .on('mouseover', (event, d) => {
            const parentDatum = d3.select(event.target.parentNode).datum();
            const feedbackKey = parentDatum?.key ? String(parentDatum.key) : null;
            const rawDate = feedbackById.get(feedbackKey);
            const feedbackDate = rawDate
              ? new Date(rawDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : 'Unknown date';
            const tooltip = d3.select(this.$refs.tooltip);
            tooltip.style('opacity', 1).html(`<strong>Feedback ${feedbackDate}</strong>`);
          })
          .on('mousemove', event => {
            const wrapperRect = this.$el.getBoundingClientRect();
            const tooltip = d3.select(this.$refs.tooltip);
            tooltip
              .style('left', event.clientX - wrapperRect.left + 12 + 'px')
              .style('top', event.clientY - wrapperRect.top - 28 + 'px');
          })
          .on('mouseout', () => {
            d3.select(this.$refs.tooltip).style('opacity', 0);
          })
          .on('click', (event, d) => this.showPopover(d.data));
      }

      chart
        .selectAll('.bar-total')
        .data(stackData)
        .enter()
        .append('text')
        .attr('class', 'bar-total')
        .attr('x', d => x(d.error_code) + x.bandwidth() / 2)
        .attr('y', d => {
          const total = d3.sum(feedbackKeys, k => d[k] || 0);
          return y(total) - 4;
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(d => d3.sum(feedbackKeys, k => d[k] || 0));
    },

    showPopover(errorItem) {
      const error_code = errorItem.error_code;
      const evidenceText = errorItem.evidence || 'No evidence available';
      const details = errorsData[error_code];
      this.selectedEvidence = details
        ? {
            error: `Error ${error_code}`,
            description: details.description,
            evidence: `"${evidenceText}"`,
            recommendation: details.recommendation,
            examples: details.examples,
            reference: details.reference
          }
        : {
            error: `Error ${error_code}`,
            description: 'No details found',
            evidence: '',
            recommendation: '',
            examples: '',
            reference: ''
          };
      const contRect = this.$refs.container.getBoundingClientRect();
      const padding = 24;
      this.popover.x = Math.max(0, contRect.width - 300 - padding - 150);
      this.popover.y = Math.max(0, padding);
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  padding: 16px 24px;
  box-sizing: border-box;
  width: 100%;
}
.chart-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  display: block;
  white-space: nowrap;
}
.popover-card {
  position: absolute;
  z-index: 1000;
  max-width: 300px;
  min-width: 200px;
  width: auto;
  white-space: normal;
  word-break: break-word;
}
.info-wrapper {
  max-width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
  display: block;
}
.tooltip {
  position: absolute;
  background: rgba(50, 50, 50, 0.9);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  pointer-events: none;
  transition: opacity 0.15s ease-in-out;
  white-space: nowrap;
  z-index: 2000;
}
</style>
