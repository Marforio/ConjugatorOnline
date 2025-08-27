// src/stores/user.ts
import { ref } from "vue";
import { defineStore } from "pinia";

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

  function setStudent(data: Student) {
    student.value = data;
  }

  function clearStudent() {
    student.value = null;
  }

  return { student, setStudent, clearStudent };
});
