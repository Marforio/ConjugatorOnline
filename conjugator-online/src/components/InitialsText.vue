
<template>
  <span>
    {{ initials ?? 'Ghost' }}
  </span>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import api from "@/axios";

const userStore = useUserStore();
const initials = computed(() => userStore.student?.initials);

// Fetch student info on mount
onMounted(async () => {
  try {
    const res = await api.get("/students/");
    const studentData = Array.isArray(res.data) ? res.data[0] : res.data;

    if (studentData) {
      userStore.setStudent(studentData);
      console.log("Fetched student info:", studentData);
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
