<template>
  <v-footer class="d-flex align-center justify-space-evenly px-4 py-3" color="surface-light">
    <v-btn class="px-3" icon :to="{ name: 'home' }">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <div class="text-center px-6">
      Logged in as <InitialsText />
    </div>
  </v-footer>
</template>

<script>
import HomeButton from "./HomeButton.vue";
import InitialsText from "./InitialsText.vue";

export default {
  components: {
    HomeButton,
    InitialsText
  }
};
</script>
