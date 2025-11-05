<template>
  <v-tooltip text="Log out" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"  
        color="grey-darken-2"
        @click="logout"
        style="align-self: center; margin-right: 15px;"
      >
        <v-icon large>mdi-logout</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

const auth = useAuthStore();
const userStore = useUserStore();

function logout() {
  auth.logout();          // clear tokens via store
  userStore.clearStudent();
  window.location.href = "/"; // redirect to homepage
}
</script>
