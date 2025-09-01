<template>
  <v-app>
    <!-- Conditionally show TopNavBar -->
    <TopNavBar v-if="showNav" />

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TopNavBar from '@/components/TopNavBar.vue'

const route = useRoute()

// Hide nav bar on home page
const showNav = computed(() => route.name !== 'home' && route.name !== 'conjugator')
</script>
