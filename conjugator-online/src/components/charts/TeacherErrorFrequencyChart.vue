<template>
  <div class="chart-wrapper">
    <!-- Hover Tooltip -->
    <div class="tooltip" ref="tooltip" style="opacity: 0;"></div>

    <!-- Chart Canvas + Popover Frame -->
    <div class="chart-container" ref="container">
      <svg ref="svg" :width="svgWidth" :height="svgHeight"></svg>

      <!-- Floating Popover Box pinned inside view boundaries -->
      <v-card
        class="popover-card"
        :style="{ top: popover.y + 'px', left: popover.x + 'px', maxWidth: '300px', width: 'auto', display: popoverReady ? 'block' : 'none' }"
        elevation="6"
      >
        <v-list density="compact">
          <v-list-subheader>
            <span class="text-uppercase font-weight-bold primary-label">
              {{ selectedEvidence ? selectedEvidence.error : "Error Details" }}
            </span>
          </v-list-subheader>

          <v-list-item v-if="!selectedEvidence" class="text-body-2 text-medium-emphasis">
            Click on a bar segment for an itemized rule breakdown.
          </v-list-item>

          <v-list-item v-else class="text-body-2">
            {{ selectedEvidence.description }}
            <div class="mt-1 text-caption text-medium-emphasis">
              ( Reference: <span v-html="selectedEvidence.reference"></span> )
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <!-- Info Detail Deck Panel Below -->
    <div class="info-wrapper p-1" ref="infoWrapper" style="display: flex; justify-content: center;">
      <v-card v-if="selectedEvidence" class="info-card" max-width="95%" width="95%" elevation="2" border>
        <v-list density="compact" class="pa-4">
          <v-list-subheader class="px-0 mb-2">
            <div class="d-flex align-center w-100 ga-2">
              <div class="flex-grow-1 min-width-0 text-subtitle-1 font-weight-bold text-slate">
                <span class="text-uppercase text-error mr-1">
                  {{ selectedEvidence.error }} :
                </span>
                {{ selectedEvidence.description }}
              </div>

              <div class="ms-12 flex-shrink-0">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click.stop="openTutorFromSelected"
                  :disabled="!selectedEvidence"
                >
                  Ask AI tutor
                  <v-icon size="18" class="ms-2">mdi-robot-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </v-list-subheader>

          <v-divider class="mb-3" />

          <!-- Dynamic contextual examples layout section -->
          <v-list-item class="px-0 text-body-2 mb-2">
            <v-icon color="warning" class="mr-2" size="20">mdi-text-box-search-outline</v-icon>
            <strong>Collected Evidence:</strong>
            <div class="bg-grey-lighten-4 pa-3 rounded-lg mt-2 text-italic color-dark-neutral style-wrap-text">
              {{ selectedEvidence.evidence }}
            </div>
          </v-list-item>

          <v-list-item class="px-0 text-body-2">
            <v-icon color="success" class="mr-2" size="20">mdi-lightbulb-on-outline</v-icon>
            <strong>Correction Recommendation:</strong>
            <div class="mt-1">
              {{ selectedEvidence.recommendation }}. For instance, <span class="font-weight-medium">{{ selectedEvidence.examples }}</span>.
            </div>
            <div class="mt-2 text-caption text-medium-emphasis">
              For complete rule sets, review <span class="text-decoration-underline" v-html="selectedEvidence.reference"></span> within reference materials.
            </div>
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
  name: 'TeacherErrorFrequencyChart',
  emits: ['open-ai-tutor'],
  props: {
    errorData: {
      type: Array,
      required: true
    },
    // Allows toggled checking context behaviors between full class arrays and individual student views
    viewMode: {
      type: String,
      default: 'CLASSES'
    }
  },
  data() {
    const display = useDisplay();
    return {
      svgWidth: 1000,
      svgHeight: 420,
      selectedEvidence: null,
      popover: { x: 0, y: 0 },
      popoverReady: false, 
      display
    };
  },
  mounted() {
    this.adjustSvgDimensions();
    this.drawChart();

    this.$nextTick(() => {
      this.updatePopoverPosition();
      this.popoverReady = true;
    });

    window.addEventListener('resize', this.updatePopoverPosition);
    this.$refs.container?.addEventListener('scroll', this.updatePopoverPosition);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updatePopoverPosition);
    this.$refs.container?.removeEventListener('scroll', this.updatePopoverPosition);
  },
  watch: {
    errorData: {
      handler() {
        this.adjustSvgDimensions();
        this.drawChart();
      },
      deep: true,
      immediate: true
    },
    viewMode() {
      // Clear out active choices upon context view modes resetting
      this.selectedEvidence = null;
      this.drawChart();
    }
  },
  methods: {
    adjustSvgDimensions() {
      if (!this.errorData || this.errorData.length === 0) {
        this.svgHeight = 420;
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
          entry[feedbackId] = d3.sum(items, d => d.total_times || d.times || 0);
        });
        stackData.push(entry);
      });

      const maxTotal = d3.max(stackData, d => d3.sum(feedbackKeys, key => d[key] || 0)) || 0;
      
      // Allocates scaling headroom buffer for the total number indicators hanging over the bar peaks
      this.svgHeight = Math.max(420, (stackData.length * 22) + 100);
      this.svgWidth = Math.max(1000, (stackData.length * 45) + 120);
    },

    updatePopoverPosition() {
      if (!this.$refs.container) return;
      const cont = this.$refs.container;
      const contRect = cont.getBoundingClientRect();
      const popoverWidth = 240;
      const padding = 20;
      const adjustment = this.display.xlAndUp ? 450 : 50;

      this.popover.x = cont.scrollLeft + Math.max(0, contRect.width - popoverWidth - padding - adjustment);
      this.popover.y = Math.max(0, padding);
    },

    openTutorFromSelected() {
      if (!this.selectedEvidence) return;
      const code = String(this.selectedEvidence.error || "").replace(/^Error\s*/i, "").trim();

      this.$emit("open-ai-tutor", {
        error_code: code,
        description: this.selectedEvidence.description,
        evidence: this.selectedEvidence.evidence, 
        reference: this.selectedEvidence.reference,
      });
    },

    drawChart() {
      if (!this.$refs.svg || !this.errorData.length) return;

      const margin = { top: 40, right: 40, bottom: 60, left: 65 };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      const svg = d3.select(this.$refs.svg);
      svg.selectAll('*').remove();

      const chart = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const feedbackKeys = Array.from(
        new Set(this.errorData.map(d => d.feedbackId).filter(Boolean))
      );

      // 1. Structural calculation map matching code arrays
      const nested = d3.group(this.errorData, d => d.error_code, d => d.feedbackId);
      const stackData = [];

      nested.forEach((feedbackGroup, error_code) => {
        // Collect, deduplicate and clean text arrays across multiple students if loaded dynamically
        const extractedSamples = [];
        this.errorData.forEach(e => {
          if (e.error_code === error_code) {
            if (e.evidence_samples && Array.isArray(e.evidence_samples)) {
              extractedSamples.push(...e.evidence_samples);
            } else if (e.evidence) {
              extractedSamples.push(e.evidence);
            }
          }
        });

        const distinctSamples = extractedSamples
          .map(s => String(s || '').trim())
          .filter((v, i, arr) => v.length > 0 && arr.indexOf(v) === i);

        const entry = {
          error_code,
          evidence: distinctSamples.length ? distinctSamples.slice(0, 5).join('; ') : 'No concrete transcript text captured.'
        };

        feedbackGroup.forEach((items, feedbackId) => {
          entry[feedbackId] = d3.sum(items, d => d.total_times || d.times || 0);
        });
        stackData.push(entry);
      });

      // Sort values descending based on composite stack weight sums
      stackData.sort((a, b) => {
        const totalA = feedbackKeys.reduce((sum, k) => sum + (a[k] || 0), 0);
        const totalB = feedbackKeys.reduce((sum, k) => sum + (b[k] || 0), 0);
        return totalB - totalA;
      });

      const maxTotal = d3.max(stackData, d => d3.sum(feedbackKeys, k => d[k] || 0)) || 0;

      // 2. Linear axis parameters calculation maps
      const x = d3.scaleBand()
        .domain(stackData.map(d => d.error_code))
        .range([0, width])
        .padding(0.3);

      const y = d3.scaleLinear()
        .domain([0, maxTotal || 10])
        .nice()
        .range([height, 0]);

      // Soft approachable dashboard design tones
      const color = d3.scaleOrdinal()
        .domain(feedbackKeys)
        .range(d3.schemeTealBlue || d3.schemeTableau10);

      // 3. Axis Generation Layout Blocks
      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-weight', 'bold')
        .style('fill', '#2C3E50');

      chart.append('g')
        .call(d3.axisLeft(y).ticks(Math.min(maxTotal, 15)));

      // 4. Multi-Layer Stack Assembly Processing Loops
      const feedbackById = new Map();
      this.errorData.forEach(row => {
        if (row.feedbackId) {
          feedbackById.set(String(row.feedbackId), row.feedbackLabel || row.feedbackDate || 'Class Snapshot');
        }
      });

      const stackedSeries = d3.stack()
        .keys(feedbackKeys)
        .value((d, key) => d[key] || 0)(stackData);

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
        .attr('class', 'clickable-bar-segment')
        .attr('x', d => x(d.data.error_code))
        .attr('y', d => y(d[1]))
        .attr('height', d => Math.max(0, y(d[0]) - y(d[1])))
        .attr('width', x.bandwidth())
        .style('cursor', 'pointer')
        .style('transition', 'opacity 0.1s')
        .on('mouseover', (event, d) => {
          d3.select(event.target).style('opacity', 0.85);
          const parentDatum = d3.select(event.target.parentNode).datum();
          const feedbackKey = parentDatum?.key ? String(parentDatum.key) : null;
          const labelText = feedbackById.get(feedbackKey) || 'Activity Segment';
          
          const segmentValue = d[1] - d[0];
          
          d3.select(this.$refs.tooltip)
            .style('opacity', 1)
            .html(`<strong>${labelText}</strong><br/>Occurrences: ${segmentValue}`);
        })
        .on('mousemove', event => {
          const wrapperRect = this.$el.getBoundingClientRect();
          d3.select(this.$refs.tooltip)
            .style('left', event.clientX - wrapperRect.left + 15 + 'px')
            .style('top', event.clientY - wrapperRect.top - 30 + 'px');
        })
        .on('mouseout', (event) => {
          d3.select(event.target).style('opacity', 1);
          d3.select(this.$refs.tooltip).style('opacity', 0);
        })
        .on('click', (event, d) => this.showPopover(d.data));

      // 5. Appending Stacked Total Figures over Bar Crest Summits
      chart.selectAll('.bar-total')
        .data(stackData)
        .enter()
        .append('text')
        .attr('class', 'bar-total')
        .attr('x', d => x(d.error_code) + x.bandwidth() / 2)
        .attr('y', d => {
          const total = d3.sum(feedbackKeys, k => d[k] || 0);
          return y(total) - 6;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#4A5568')
        .text(d => d3.sum(feedbackKeys, k => d[k] || 0));
    },

    showPopover(errorItem) {
      const error_code = errorItem.error_code;
      const evidenceText = errorItem.evidence || 'No structural samples collected.';
      const details = errorsData[error_code];

      this.selectedEvidence = details
        ? {
            error: `Code ${error_code}`,
            description: details.description,
            evidence: evidenceText,
            recommendation: details.recommendation,
            examples: details.examples,
            reference: details.reference
          }
        : {
            error: `Code ${error_code}`,
            description: 'No documentation details registered.',
            evidence: evidenceText,
            recommendation: 'Review item tracking histories.',
            examples: '—',
            reference: '—'
          };

      this.$nextTick(() => this.updatePopoverPosition());
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  padding: 8px 4px;
  box-sizing: border-box;
  width: 100%;
}
.chart-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: block;
  background: #ffffff;
  border-radius: 8px;
}
.popover-card {
  position: absolute;
  z-index: 1000;
  white-space: normal;
  word-break: break-word;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}
.primary-label {
  color: #009688;
}
.style-wrap-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}
.info-wrapper {
  width: 100%;
}
.info-card {
  border-radius: 12px;
}
.tooltip {
  position: absolute;
  background: rgba(33, 37, 41, 0.95);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  line-height: 1.4;
  pointer-events: none;
  transition: opacity 0.1s ease-in-out;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 2000;
}
</style>