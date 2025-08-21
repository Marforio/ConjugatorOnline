<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg p-4 w-100" style="max-width: 400px;">
      <h2 class="text-center mb-4">Login</h2>

      <form @submit.prevent="handleLogin">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Enter username"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter password"
            required
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger py-2">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login as loginService } from "@/services/auth";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  error.value = "";
  loading.value = true;

  try {
    const data = await loginService(username.value, password.value);
    // Tokens are saved in auth.ts
    console.log("Login successful", data);

    // Redirect after login
    window.location.href = "/";
  } catch (err: any) {
    if (err.response?.status === 401) {
      error.value = "Invalid credentials";
    } else {
      error.value = err.message || "Login failed";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
