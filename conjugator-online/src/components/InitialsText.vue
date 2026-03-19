<template>
  <span>
    {{ initials || "Ghost" }}
  </span>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";

const userStore = useUserStore();
const auth = useAuthStore();

const initials = computed(() => userStore.student?.initials ?? "");

onMounted(async () => {
  // Do not call protected endpoints if not logged in
  if (!auth.access) return;

  await userStore.ensureUserLoaded();

  // If staff, don’t fetch student
  if (userStore.isStaff) return;

  // Only fetch if we don't already have it
  if (!userStore.student) {
    await userStore.fetchStudentData();
  }
  console.log("Initials loaded:", initials.value);
});
</script>