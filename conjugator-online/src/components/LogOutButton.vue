<template>
  <v-tooltip text="Log out" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="grey-darken-2"
        @click="logout"
        :loading="loggingOut"
        style="align-self: center; margin-right: 15px;"
      >
        <!-- Normal icon -->
        <v-icon v-if="!loggingOut && !logoutDone" large>mdi-logout</v-icon>

        <!-- Checkmark after logout -->
        <v-icon
          v-if="logoutDone"
          large
          color="green"
          class="logout-check"
        >
          mdi-check
        </v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

const auth = useAuthStore();
const userStore = useUserStore();

const loggingOut = ref(false);
const logoutDone = ref(false);

function logout() {
  loggingOut.value = true;

  // Spinner visible first
  setTimeout(() => {
    loggingOut.value = false;
    logoutDone.value = true; // show checkmark

    // Keep checkmark visible briefly
    setTimeout(() => {
      auth.logout();
      userStore.clearStudent();
      window.location.href = "/";
    }, 1000);
  }, 1000);
}
</script>

<style scoped>
.logout-check {
  animation: pop 0.35s ease-out forwards;
}

@keyframes pop {
  0% { transform: scale(0.4); opacity: 0; }
  70% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
