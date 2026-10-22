<template>
  <div class="d-flex flex-column align-center w-100 h-100">
    <div class="text-overline font-weight-black text-primary">Target verb</div>
    <div class="flex-grow-1 d-flex align-center text-center font-weight-black verb">{{ prompt.verb }}</div>
    <v-divider class="w-100 my-2" />
    <v-row no-gutters class="w-100 text-center">
      <v-col cols="4"><div class="text-overline text-medium-emphasis">Person</div><div class="font-weight-black">{{ prompt.person }}</div></v-col>
      <v-col cols="4"><div class="text-overline text-medium-emphasis">Type</div><div class="font-weight-black">{{ prompt.sentence_type }}</div></v-col>
      <v-col cols="4"><div class="text-overline text-medium-emphasis">Tense</div><div class="font-weight-black">{{ prompt.tense }}</div></v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
defineProps<{ prompt: any; settings?: Record<string, any> }>();
</script>

<style scoped>.verb { font-size: clamp(2rem, 7vw, 3rem); line-height: 1.1; }</style>