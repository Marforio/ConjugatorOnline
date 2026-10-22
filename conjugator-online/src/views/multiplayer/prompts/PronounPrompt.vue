<template>
  <div class="d-flex flex-column align-center w-100 h-100 text-center">
    <div class="text-overline font-weight-black text-primary">"{{ prompt.subject }}"</div>
    <v-img v-if="prompt.image" :src="`/images/pronoun_pics_resized/${prompt.image}`"
           max-width="170" max-height="170" aspect-ratio="1" cover class="rounded-lg border-md my-2" />
    <div class="text-h6 font-weight-bold mt-auto">{{ prompt.question }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ prompt: any; settings?: Record<string, any> }>();
</script>