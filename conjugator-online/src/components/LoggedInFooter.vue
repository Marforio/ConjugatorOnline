<template>
  <v-footer class="d-flex align-center justify-space-evenly px-4 py-3" color="surface-light">
    <v-btn class="px-3" icon :to="{ name: 'home' }">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    
     <v-tooltip text="My Dashboard" location="top">
        <template v-slot:activator="{ props }">
          <v-btn class="px-3" icon v-bind="props" :to="{ name: 'dashboard' }">
            <v-icon>mdi-view-dashboard</v-icon>
          </v-btn>
        </template>
    </v-tooltip>
    <div class="text-center px-6">
      Logged in as <InitialsText />
    </div>
    <LogOutButton />
  </v-footer>
</template>

<script>
import HomeButton from "./HomeButton.vue";
import InitialsText from "./InitialsText.vue";
import LogOutButton from "./LogOutButton.vue";

export default {
  components: {
    HomeButton,
    InitialsText,
    LogOutButton
  }
};
</script>
