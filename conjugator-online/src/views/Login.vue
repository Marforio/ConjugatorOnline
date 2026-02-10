<template>
<v-container
  fluid
  class="d-flex align-center justify-center"
  style="min-height: 100vh;"
>
  <v-card class="pa-8" max-width="560" elevation="4" style="position: relative;">
    <!-- Loading Overlay -->
    <v-overlay
      :model-value="loading && !loginError && !loginSuccess"
      class="d-flex flex-column align-center justify-center text-center"
      opacity="0.85"
    >
      <v-progress-circular indeterminate size="48" color="primary" />
      <div class="mt-4 text-body-1 loading-text">Loading your data… please wait</div>
    </v-overlay>

    <!-- Success Overlay -->
    <v-overlay
      :model-value="loginSuccess"
      class="d-flex flex-column align-center justify-center text-center" style="transform: translateY(-40px);"
      opacity="0.85"
    >
      <v-icon color="green" size="80" class="success-check">mdi-check-circle</v-icon>
      <div class="mt-4 text-h6 loading-text">Login successful!</div>
    </v-overlay>

    <!-- Error Overlay -->
    <v-overlay
      :model-value="loginError"
      class="d-flex flex-column align-center justify-center text-center" style="transform: translateY(-40px);"
      opacity="0.85"
    >
      <v-icon color="red" size="80" class="error-shake">mdi-close-circle</v-icon>
      <div class="mt-4 text-h6 loading-text">Login failed</div>
    </v-overlay>


    <v-card-title class="text-h5 text-center mb-4">
      Welcome Back
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleLogin">
        <v-row dense>
          <v-col cols="12" class="mb-3">
            <v-text-field
              v-model="username"
              label="Username"
              placeholder="Enter username"
              density="comfortable"
              required
            />
          </v-col>

          <v-col cols="12" class="mb-3">
            <v-text-field
              v-model="password"
              label="Password"
              placeholder="Enter password"
              type="password"
              density="comfortable"
              required
            />
          </v-col>

          <v-col cols="12" v-if="error">
            <v-alert v-if="showError" type="error" dense class="mb-3" dismissible>
              {{ error }}
            </v-alert>
          </v-col>

          <v-col cols="12">
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
            >
              Log in
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</v-container>

</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { apiValidateToken } from "@/services/auth";
import api from '@/axios'

const auth = useAuthStore();
const userStore = useUserStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const showError = ref(false)

const loginSuccess = ref(false); 
const loginError = ref(false);

const route = useRoute();
const router = useRouter();


async function handleLogin() {
  error.value = "";
  loading.value = true;
  loginSuccess.value = false;
  loginError.value = false;
  showError.value = false;

  try {
    const token = await auth.login(username.value, password.value);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await apiValidateToken();
    userStore.setAccessToken(token);

    // Hide loading and show success animation
    loading.value = false;
    loginSuccess.value = true;

    // Wait briefly before redirect
    setTimeout(() => {
      const redirectPath = (route.query.redirect as string) || "/";
      router.replace(redirectPath);
    }, 1200);

  } catch (err: any) {
    error.value =
      err.response?.status === 401
        ? "Invalid username or password"
        : err.message || "Login failed";

    // Show error overlay immediately
    loginError.value = true;
    showError.value = true;

    // Brief delay to hide loading overlay
    setTimeout(() => {
      loading.value = false;
      
      // NOW start the error animation timer (2.5 seconds from NOW)
      setTimeout(() => {
        loginError.value = false;
      }, 2500);
    }, 100);

    // Hide the inline error alert even later
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-text-field input {
  font-size: 1rem;
}

.v-btn {
  font-weight: 600;
}

.success-check {
  animation: pop 0.4s ease-out forwards;
}

.error-shake { 
  animation: shake 0.4s ease-out forwards; 
  color: white
}

.loading-text {
  color: white;
}


@keyframes pop {
  0% { transform: scale(0.4); opacity: 0; }
  70% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes shake { 
  0% { transform: translateX(0); opacity: 0; } 
  20% { opacity: 1; } 30% { transform: translateX(-6px); } 
  50% { transform: translateX(6px); } 
  70% { transform: translateX(-4px); } 
  100% { transform: translateX(0); } 
}
</style>