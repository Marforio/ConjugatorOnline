<template>
  <v-card elevation="0" rounded="xl" border class="h-100">
    <v-card-title class="bg-amber-lighten-5 border-b pa-4 d-flex align-center justify-space-between">
      <div class="d-flex align-center ga-2">
        <v-icon color="amber-darken-2">mdi-lightbulb-on-outline</v-icon>
        <span class="text-amber-darken-2 font-weight-bold">Quick Vocab Recall</span>
      </div>
      <v-chip size="x-small" variant="flat" color="amber-darken-2" class="text-white font-weight-bold">
        {{ total }} wrong
      </v-chip>
    </v-card-title>

    <v-card-text class="pa-4">
      <div v-if="loading" class="text-center py-6">
        <v-progress-circular indeterminate size="28" color="amber-darken-2" />
      </div>

      <div v-else-if="!item" class="text-center py-6 text-slate-500 text-caption">
        No previous wrong answers found.
      </div>

      <div v-else class="flip-host">
        <div class="flip-wrap" @click="flipped = !flipped">
          <div class="flip-inner" :class="{ flipped }">
            <!-- FRONT -->
            <div class="flip-face face-front pa-4 text-center">
              <div class="text-xxs text-slate-500 mb-2">{{ item.list_name }}</div>
              <div class="text-caption text-slate-600 mb-2">Prompt</div>
              <div class="text-h6 font-weight-bold text-slate-900">{{ item.prompt_text || item.term }}</div>
              <div class="text-caption text-slate-500 mt-3">Tap to reveal answer</div>
            </div>

            <!-- BACK -->
            <div class="flip-face face-back pa-4 text-center">
              <div class="text-caption text-slate-600 mb-1">Correct answer</div>
              <div class="text-h5 font-weight-bold text-success-darken-2">
                {{ (item.expected && item.expected.length) ? item.expected.join(" / ") : item.term }}
              </div>

              <div class="text-caption text-slate-600 mt-3 mb-1">Your last answer</div>
              <div class="text-body-2 font-weight-medium text-error">
                {{ item.last_user_answer || "—" }}
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-space-between mt-3">
          <v-btn size="small" variant="text" @click.stop="prev">Prev</v-btn>
          <v-btn size="small" variant="text" @click.stop="next">Next</v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  loading: boolean;
  items: any[];
}>();

const idx = ref(0);
const flipped = ref(false);

const total = computed(() => props.items?.length ?? 0);

const item = computed(() => {
  if (!props.items?.length) return null;
  return props.items[idx.value] ?? null;
});

watch(
  () => props.items,
  () => {
    idx.value = 0;
    flipped.value = false;
  }
);

function next() {
  if (!props.items?.length) return;
  idx.value = (idx.value + 1) % props.items.length;
  flipped.value = false;
}
function prev() {
  if (!props.items?.length) return;
  idx.value = (idx.value - 1 + props.items.length) % props.items.length;
  flipped.value = false;
}
</script>

<style scoped>
.flip-host { min-height: 220px; }
.flip-wrap { perspective: 1000px; cursor: pointer; }
.flip-inner {
  position: relative;
  width: 100%;
  min-height: 180px;
  transform-style: preserve-3d;
  transition: transform .45s ease;
}
.flip-inner.flipped { transform: rotateY(180deg); }
.flip-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
}
.face-back { transform: rotateY(180deg); }
.text-xxs { font-size: .72rem; }
.border-b { border-bottom: 1px solid #e2e8f0; }
</style>