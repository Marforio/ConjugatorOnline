<template>
  <v-tooltip text="Log out" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :color="getButtonColor"
        variant="flat"
        elevation="2"
        @click="logout"
        :disabled="loggingOut || logoutDone"
        class="logout-action-btn"
        style="align-self: center; margin-right: 15px;"
      >
        <!-- State 1: Active Spinner During Progress -->
        <v-progress-circular 
          v-if="loggingOut" 
          indeterminate 
          size="20" 
          width="2.5"
          color="white"
          class="animate-spin-fade"
        />

        <!-- State 2: Standard Exit Icon -->
        <v-icon 
          v-else-if="!logoutDone" 
          size="22" 
          color="white"
        >
          mdi-logout
        </v-icon>

        <!-- State 3: Confirmed Checkmark Pop -->
        <v-icon
          v-else
          size="24"
          color="white"
          class="logout-check"
        >
          mdi-check-circle
        </v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

const auth = useAuthStore();
const userStore = useUserStore();

const loggingOut = ref(false);
const logoutDone = ref(false);

// Dynamic coloring based on step context
const getButtonColor = computed(() => {
  if (logoutDone.value) return "success";
  if (loggingOut.value) return "red-darken-1";
  return "grey-darken-3"; // High contrast dark anchor style
});

function logout() {
  loggingOut.value = true;

  // Render micro loading session status window
  setTimeout(() => {
    loggingOut.value = false;
    logoutDone.value = true;

    // Hold visual execution completion frame briefly before flushing cookie states
    setTimeout(() => {
      auth.logout();
      userStore.clearStudent();
      window.location.href = "/";
    }, 650);
  }, 850);
}
</script>

<style scoped>
/* High performance transition properties */
.logout-action-btn {
  border-radius: 10px !important;
  min-width: 48px !important;
  width: 48px !important;
  height: 40px !important;
  padding: 0 !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.logout-action-btn:hover:not(:disabled) {
  background-color: #b71c1c !important; /* Transitions to a distinct red warning state on hover */
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.logout-action-btn:active:not(:disabled) {
  transform: translateY(1px);
}

/* Enhanced Elastic Checkmark Animation */
.logout-check {
  animation: elasticPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes elasticPop {
  0% { 
    transform: scale(0.3); 
    opacity: 0; 
  }
  70% { 
    transform: scale(1.25); 
    opacity: 1; 
  }
  100% { 
    transform: scale(1); 
    opacity: 1; 
  }
}

.animate-spin-fade {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>