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

    <!-- Book Link with Tooltip -->
    <v-tooltip text="Open Booking Page" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" href="https://book.language-labs.ch">
        <v-icon>mdi-book-open-variant</v-icon>
        </v-btn>
        </template>
    </v-tooltip>

    <!-- Conjugator Button with Tooltip -->
    <v-tooltip text="Open Conjugator" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :to="{ name: 'conjugator' }">
        <v-icon>mdi-controller</v-icon>
        </v-btn>
        </template>
    </v-tooltip>

    <v-app-bar-divider class="mx-3"></v-app-bar-divider>

    <span v-if="userStore.initials">Hello {{ userStore.initials }}!</span>
    <span v-else class="text-body-1">Welcome!</span>

    <v-app-divider class="mx-3"></v-app-divider>

    <!-- Logout Button-->
      <v-btn color="error" @click="logout">Logout</v-btn>

  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from "@/stores/user";
import { clearTokens } from "@/services/auth";

export default defineComponent({
  name: "TopNavBar",
  setup() {
    const userStore = useUserStore();

    const logout = () => {
      clearTokens();
      userStore.clearInitials();
      window.location.href = '/';
    };

    return { userStore, logout }; // ✅ Make sure userStore is returned!
  },
});
</script>
