
<template>
    <v-btn color="error" @click="logout" style="align-self: center; margin-right: 15px;">Logout</v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from "@/stores/user";
import { clearTokens } from "@/services/auth";

export default defineComponent({
  name: "LogOutButton",
  setup() {
    const userStore = useUserStore();

    const logout = () => {
      clearTokens();
      userStore.clearStudent();
      window.location.href = '/';
    };

    return { userStore, logout }; // ✅ Make sure userStore is returned!
  },
});
</script>


