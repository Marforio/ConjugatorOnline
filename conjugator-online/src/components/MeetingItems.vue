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
        <v-list density="compact">
          <v-list-item
            v-for="(prompt, pIndex) in prompts[tierKey]"
            :key="pIndex"
          >
            <v-list-item-title class="text-wrap">
              • {{ prompt }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
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

.v-list-item-title {
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
}
</style>
