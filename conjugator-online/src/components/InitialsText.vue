<template>
  <span>
    {{ initials ?? "Ghost" }}
  </span>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import api from "@/axios";

const userStore = useUserStore();
const auth = useAuthStore();

const initials = computed(() => userStore.student?.initials);

onMounted(async () => {
  if (!auth.isLoggedIn) {
    console.warn("Not logged in — skipping student fetch.");
    userStore.clearStudent();
    return;
  }

  try {
    const res = await api.get("/students/");
    const studentData = Array.isArray(res.data) ? res.data[0] : res.data;

    if (studentData) {
      userStore.setStudent(studentData);
    } else {
      console.warn("No student record found for this user.");
      userStore.clearStudent();
    }
  } catch (err) {
    console.error("Failed to fetch student info:", err);
    userStore.clearStudent();
  }
});
</script>
