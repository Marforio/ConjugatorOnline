<template>
  <v-expansion-panels multiple>
    <v-expansion-panel
      v-for="(tierKey, index) in orderedTierKeys"
      :key="tierKey"
    >
      <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
        Item {{ index + 1 }}
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <!-- Ordered list starting at 0; styled to look like your previous list -->
        <ol class="prompt-list" start="0" aria-label="Prompts for {{ tierKey }}">
          <li v-for="(prompt, pIndex) in prompts[tierKey]" :key="pIndex">
            <span class="prompt-number">{{ pIndex }}</span>
            <span class="prompt-text">{{ prompt }}</span>
          </li>
        </ol>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  prompts: {
    type: Object,
    required: true,
  },
});

// Keep Tier 1 → Tier 2 → Tier 3 order
const orderedTierKeys = computed(() => ['Tier 1', 'Tier 2', 'Tier 3'].filter(k => props.prompts[k]));
</script>

<style scoped>
.v-expansion-panel-title {
  background-color: #f5f5f5;
  color: #1a237e;
  font-size: 1.1rem;
}

/* Remove bullets & spacing */
.prompt-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Layout each list item in a row */
.prompt-list > li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.4rem 0;
}

/* Blue circular number chip */
.prompt-number {
  flex: 0 0 auto;
  background-color: #1a237e;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 50%;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Text next to number */
.prompt-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  white-space: normal;
}

@media (max-width: 960px) {
  .prompt-number {
    width: 1.4rem;
    height: 1.4rem;
    font-size: 0.85rem;
  }
}
</style>

