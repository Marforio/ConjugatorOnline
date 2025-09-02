
<template>
  <span>
    {{ initials ?? 'Ghost' }}
  </span>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { getAccessToken } from "@/services/auth"; 
import api from "@/axios";

const userStore = useUserStore();
const initials = computed(() => userStore.student?.initials);

// Fetch student info only if token exists
onMounted(async () => {
  const token = getAccessToken();
  if (!token) {
    console.warn("No access token — skipping student fetch.");
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
