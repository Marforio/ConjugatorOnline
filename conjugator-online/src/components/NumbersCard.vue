<template>
  <v-card class="pa-4 m-3 flex-grow-1" elevation="2">
    <v-card-text class="text-center" style="text-wrap: wrap;">
      <v-card-title class="text-subtitle-2 text-wrap">{{ title }}</v-card-title>
      <div class="text-h5 m-3 font-weight-bold">{{ value }}</div>
      <div class="text-caption text-medium-emphasis">{{ label }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  label: string
}>()
</script>

<style scoped>
.v-card {
  min-width: 50px;
  max-width: 180px;
}
</style>
