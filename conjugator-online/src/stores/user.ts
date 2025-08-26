// src/stores/user.ts
import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const initials = ref<string | null>(null);

  function setInitials(value: string) {
    initials.value = value;
  }

  function clearInitials() {
    initials.value = null;
  }

  return { initials, setInitials, clearInitials };
});
