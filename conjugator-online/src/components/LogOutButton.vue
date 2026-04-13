<template>
  <v-tooltip text="Log out" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="grey-darken-2"
        @click="logout"
        :disabled="loggingOut || logoutDone"
        style="align-self: center; margin-right: 15px;"
      >
        <!-- Show spinner during logout -->
        <v-progress-circular 
          v-if="loggingOut" 
          indeterminate 
          size="24" 
          width="3"
          color="white"
        />

        <!-- Show logout icon initially -->
        <v-icon v-else-if="!logoutDone" size="large">
          mdi-logout
        </v-icon>

        <!-- Show checkmark when done -->
        <v-icon
          v-else
          size="large"
          color="success"
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

  // Show spinner for 800ms
  setTimeout(() => {
    loggingOut.value = false;
    logoutDone.value = true; // show checkmark

    // Keep checkmark visible for 600ms, then logout
    setTimeout(() => {
      // Clear session + user state
      auth.logout();
      userStore.clearStudent();
      
      // Redirect
      window.location.href = "/";
    }, 600);
  }, 800);
}
</script>

<style scoped>
.logout-check {
  animation: pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes pop {
  0% { 
    transform: scale(0); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.3); 
    opacity: 1; 
  }
  100% { 
    transform: scale(1); 
    opacity: 1; 
  }
}
</style>