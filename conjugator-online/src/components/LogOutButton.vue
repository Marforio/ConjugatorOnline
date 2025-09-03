<template>
  <v-btn
    color="error"
    @click="logout"
    style="align-self: center; margin-right: 15px;"
  >
    Logout
  </v-btn>
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
