<template>
  <v-footer class="d-flex align-center justify-space-evenly px-4 py-3" color="surface-light">
    <v-btn class="px-3" icon :to="{ name: 'home' }">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <div class="text-center px-6">
      Logged in as <strong>{{ userStore.initials }}</strong>
    </div>
  </v-footer>
</template>


<script>
import { useUserStore } from "@/stores/user";
import HomeButton from "./HomeButton.vue";

export default {
    components: { HomeButton },
  setup() {
    const userStore = useUserStore();
    return { userStore }
    } 
  }


</script>