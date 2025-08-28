<template>
  <v-card class="pa-4" elevation="2">
    <v-card-text class="text-center">
      <div class="text-h4 font-weight-bold">{{ value }}</div>
      <div class="text-subtitle-1 text-grey-darken-1">{{ label }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
}>()
</script>

<style scoped>
.v-card {
  min-width: 150px;
  max-width: 250px;
}
</style>
