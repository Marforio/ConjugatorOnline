<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="text-subtitle-2 text-uppercase text-grey-darken-1 font-weight-bold mb-2">
      🔑 Word family: <span class="text-primary font-weight-black">{{ prompt.key }}</span>
    </div>
    <v-card variant="flat" class="pa-2 bg-white">
      <div v-for="it in prompt.items" :key="it.pos" class="py-2 border-b">
        <v-chip size="x-small" color="secondary" label class="font-weight-black text-uppercase mr-2">{{ it.pos }}</v-chip>
        <span class="font-italic">{{ it.sentence }}</span>
      </div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
defineProps<{ prompt: any; settings?: Record<string, any> }>();
</script>