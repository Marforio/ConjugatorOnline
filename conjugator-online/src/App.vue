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
import { useInactivityTimeout } from "@/composables/useInactivityTimeout";
import { useAuthStore } from './stores/auth';

const route = useRoute()
const auth = useAuthStore()

// Hide nav bar on home page
const showNav = computed(() => {
  const name = route.name || ''
  return name !== 'home' && name !== 'conjugator' && name !== 'login' && name !== 'meeting-machine' && name!== 'pronounpractice' && name!== 'quantifier'
})

if (auth.isLoggedIn && !auth.isAccessTokenExpired()) {
  useInactivityTimeout();
}

</script>
