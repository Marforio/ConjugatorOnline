<template>
    <!-- Navigation Drawer for Mobile -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      class="d-sm-none"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title>Hello <InitialsText /></v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item :to="{ name: 'home' }">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item href="https://book.language-labs.ch" target='_blank'>
          <v-list-item-title>Grammar Book</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'dashboard' }">
          <v-list-item-title>My Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'exercises' }" :disable="true">
          <v-list-item-title>Exercises</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'conjugator' }">
          <v-list-item-title>Conjugator Game</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'games' }">
          <v-list-item-title>Other Games</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'tools' }">
          <v-list-item-title>Tools</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <LogOutButton />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app>
      <!-- Mobile Nav Icon -->
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="d-sm-none"
      />

      <!-- Title -->
      <v-btn :to="{ name: 'home' }" class="text-none ms-4">
        <v-app-bar-title>Language Labs</v-app-bar-title>
      </v-btn>

      <v-spacer></v-spacer>

      <!-- Desktop Icons -->
      <div class="d-none d-sm-flex px-6 m-4">
        <v-tooltip text="Home" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'home' }">
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Grammar Book" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" href="https://book.language-labs.ch" target='_blank'>
              <v-icon>mdi-book-open-variant</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Go to Exercises" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'exercises' }" :disabled="true">   <!-- :disabled="true"  --> 
              <v-icon>mdi-weight-lifter</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Conjugator Game" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'conjugator' }">
              <v-icon>mdi-controller</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Other Games" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'games' }" >  <!-- :disabled="true"  --> 
              <v-icon>mdi-gamepad-circle</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Classroom tools" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'tools' }" >  <!-- :disabled="true"  --> 
              <v-icon>mdi-tools</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="My dashboard" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'dashboard' }">
              <v-icon>mdi-chart-bar</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <span v-if="userStore.isAuthenticated" style="align-self: center; margin-left: 50px; margin-right: 50px;">Hello <InitialsText /></span>
      </div>
        
      <div v-if="userStore.isAuthenticated"><LogOutButton /></div>
      <div v-else>
        <v-btn :to="{ name: 'login' }" color="primary" variant="tonal" class="px-4 m-4">Log in</v-btn>
      </div>
      
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from "@/stores/user";
import { useDisplay } from "vuetify";
import InitialsText from './InitialsText.vue';
import LogOutButton from './LogOutButton.vue';

export default defineComponent({
  name: "TopNavBar",
  components: {
    InitialsText,
    LogOutButton,
  },
  setup() {
    const userStore = useUserStore();
    const { smAndDown } = useDisplay();
    const drawer = ref(false);
    const disabledExercises = ref(true); 
    const disabledGame = ref(false);


    return { userStore, drawer };
  },
});
</script>
