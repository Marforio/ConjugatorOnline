<template>
  <div ref="svgContainer"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  value: { type: Number, required: true }, // 0–100
  size: { type: Number, default: 220 },    // diameter
  thickness: { type: Number, default: 25 },
  zones: {
    type: Array,
    default: () => [
      { start: 0, end: 25, color: '#C8E6C9' },   
      { start: 25, end: 50, color: '#A5D6A7' },  
      { start: 50, end: 75, color: '#00E676' }, 
      { start: 75, end: 100, color: '#00C853' },
    ]
  }
});

const svgContainer = ref(null);
let svg = null;
let needle = null;

/**
 * polarToCartesian
 * Accepts an angle expressed in the same radians as used by d3.arc()
 * (where 0 = 12 o'clock). Converts to the "math" angle used by
 * Math.cos/Math.sin (where 0 = 3 o'clock) by subtracting PI/2.
 */
function polarToCartesian(cx, cy, r, d3Angle) {
  const mathAngle = d3Angle - Math.PI / 2; // shift origin
  return {
    x: cx + r * Math.cos(mathAngle),
    y: cy + r * Math.sin(mathAngle)
  };
}

const drawGauge = () => {
  const radius = props.size / 2;
  const cx = radius;
  const cy = radius;
  const svgHeight = props.size / 2 + 50; // top half + padding below

  d3.select(svgContainer.value).selectAll('*').remove();

  svg = d3.select(svgContainer.value)
    .append('svg')
    .attr('width', props.size)
    .attr('height', svgHeight)
    .attr('viewBox', `0 0 ${props.size} ${svgHeight}`);

  // arc generator uses d3-style angles (0 = top)
  const arc = d3.arc()
    .innerRadius(radius - props.thickness)
    .outerRadius(radius);

  // Shared angle scale (D3-style): 0% -> -90deg (left), 50% -> 0 (top), 100% -> +90deg (right)
  // Note: this produces the **top semicircle**
  const angleScale = d3.scaleLinear()
    .domain([0, 100])
    .range([-Math.PI / 2, Math.PI / 2]);

  // Draw colored zones via d3.arc (no change needed)
  props.zones.forEach(zone => {
    svg.append('path')
      .attr('d', arc({
        startAngle: angleScale(zone.start),
        endAngle: angleScale(zone.end)
      }))
      .attr('fill', zone.color)
      .attr('transform', `translate(${cx},${cy})`);
  });

  // Draw ticks (use polarToCartesian which converts d3 angles to math angles)
  const tickCount = 10;
  const tickLength = 10;
  for (let i = 0; i <= tickCount; i++) {
    const val = (i / tickCount) * 100;
    const d3Angle = angleScale(val);
    const p1 = polarToCartesian(cx, cy, radius - 2, d3Angle);
    const p2 = polarToCartesian(cx, cy, radius - 2 - tickLength, d3Angle);

    svg.append('line')
      .attr('x1', p1.x).attr('y1', p1.y)
      .attr('x2', p2.x).attr('y2', p2.y)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);
  }

  // Labels at 0, 50, 100 (placed just outside the arc)
  [0, 50, 100].forEach(v => {
    const d3Angle = angleScale(v);
    const lp = polarToCartesian(cx, cy, radius + 18, d3Angle);
    svg.append('text')
      .attr('x', lp.x).attr('y', lp.y + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .text(String(v));
  });

  // Needle - initial placement using the same d3 angle -> converted inside polarToCartesian
  const needleLength = radius - props.thickness - 8;
  const initialD3Angle = angleScale(props.value);
  const needleEnd = polarToCartesian(cx, cy, needleLength, initialD3Angle);

  needle = svg.append('line')
    .attr('x1', cx).attr('y1', cy)
    .attr('x2', needleEnd.x).attr('y2', needleEnd.y)
    .attr('stroke', '#555')
    .attr('stroke-width', 4)
    .attr('stroke-linecap', 'round');

  // center cap
  svg.append('circle')
    .attr('cx', cx).attr('cy', cy).attr('r', 8)
    .attr('fill', '#555');

  // value text under the gauge
  svg.append('text')
    .attr('x', cx)
    .attr('y', cy + 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '22px')
    .attr('fill', '#333')
    .attr('id', 'gauge-value')
    .text(`${Math.round(props.value)}%`);
};

const updateNeedle = (val) => {
  if (!svg || !needle) return;

  const radius = props.size / 2;
  const cx = radius;
  const cy = radius;
  const needleLength = radius - props.thickness - 8;

  // same d3-style scale (0 -> -PI/2 ; 100 -> +PI/2)
  const angleScale = d3.scaleLinear()
    .domain([0, 100])
    .range([-Math.PI / 2, Math.PI / 2]);

  const d3Angle = angleScale(val);
  const end = polarToCartesian(cx, cy, needleLength, d3Angle);

  needle.transition().duration(800)
    .attr('x2', end.x).attr('y2', end.y);

  svg.select('#gauge-value').text(`${Math.round(val)}%`);
};

onMounted(drawGauge);
watch(() => props.value, v => updateNeedle(v));
</script>
