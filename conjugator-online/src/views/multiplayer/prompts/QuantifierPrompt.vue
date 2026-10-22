<template>
  <div class="d-flex flex-column align-center w-100 h-100 text-center">
    <v-chip size="small" color="secondary" variant="flat" class="text-uppercase">
      {{ prompt.subject }}
      <v-tooltip activator="parent" location="top">{{ prompt.countable ? 'Countable' : 'Uncountable' }}</v-tooltip>
    </v-chip>
    <v-img v-if="prompt.image" :src="`/images/quant_pics_resized/${prompt.image}`"
           width="170" height="170" aspect-ratio="1" cover class="rounded-lg border-md my-3 flex-grow-0" />
    <div class="d-flex justify-center ga-2 flex-wrap mb-2">
      <v-chip v-if="prompt.displayed_intensifier" size="small" variant="tonal"
              :color="prompt.displayed_intensifier === 'impressive' ? 'purple' : 'red'" class="text-uppercase font-weight-bold">
        {{ prompt.displayed_intensifier === 'impressive' ? '👀' : '😵' }} {{ prompt.displayed_intensifier }}
      </v-chip>
      <v-chip size="small" color="blue-darken-3" variant="tonal" class="text-uppercase font-weight-bold">
        {{ prompt.displayed_quantity }}
      </v-chip>
    </div>
    <div class="text-h6 font-italic mt-auto">
      " {{ prompt.displayed_sentence }} <span class="text-primary font-weight-black">________</span> . "
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ prompt: any; settings?: Record<string, any> }>();
</script>