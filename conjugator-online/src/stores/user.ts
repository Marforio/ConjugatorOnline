// src/stores/user.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getAccessToken, clearTokens } from "@/services/auth";

interface User {
  id: number;
  username: string;
  is_staff: boolean;
}

interface Student {
  id: number;
  web_id: string;
  initials: string;
  user: User;
}

export const useUserStore = defineStore("user", () => {
  const student = ref<Student | null>(null);
  const accessToken = ref<string | null>(getAccessToken()); // init from localStorage

  function setStudent(data: Student) {
    student.value = data;
  }

  function clearStudent() {
    student.value = null;
    accessToken.value = null;
    clearTokens();
  }

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  const isAuthenticated = computed(() => !!accessToken.value);

  return { student, accessToken, setStudent, clearStudent, setAccessToken, isAuthenticated };
});
