<template>
  <v-app-bar app>
    <v-btn :to="{ name: 'home' }">
      <v-app-bar-title>Language Labs</v-app-bar-title>
    </v-btn>

    <v-spacer></v-spacer>

    <!-- Home Button with Tooltip -->
    <v-tooltip text="Go to Homepage" location="bottom">
       <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" :to="{ name: 'home' }">
        <v-icon>mdi-home</v-icon>
            </v-btn>
        </template>
    </v-tooltip>

    <!-- Grammar Book site Link with Tooltip -->
    <v-tooltip text="Go to Grammar Book" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" href="https://book.language-labs.ch">
        <v-icon>mdi-book-open-variant</v-icon>
        </v-btn>
        </template>
    </v-tooltip>

    <!-- Conjugator Button with Tooltip -->
    <v-tooltip text="Open Conjugator Game" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'conjugator' }">
        <v-icon>mdi-controller</v-icon>
        </v-btn>
        </template>
    </v-tooltip>

    <v-app-bar-divider class="mx-3"></v-app-bar-divider>

    <span>Hello <InitialsText></InitialsText></span>

    <v-app-divider class="mx-3"></v-app-divider>

    <!-- Logout Button-->
    <LogOutButton />

  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from "@/stores/user";
import InitialsText from './InitialsText.vue';
import LogOutButton from './LogOutButton.vue';

export default defineComponent({
  name: "TopNavBar",
  components: { InitialsText, LogOutButton },
  setup() {
    const userStore = useUserStore();

    return { userStore }; // ✅ Make sure userStore is returned!
  },
});
</script>
