<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function login() {
  error.value = "";
  loading.value = true;

  try {
    const res = await fetch(
      "https://userauthfunction-dtd8dabncmfpaqgx.switzerlandnorth-01.azurewebsites.net/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    console.log("JWT token:", data.token);

    // Save JWT token in localStorage
    localStorage.setItem("jwt", data.token);

    alert("Login successful!");
  } catch (err: any) {
    error.value = err.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 1rem;
}
.error {
  color: red;
}
</style>
