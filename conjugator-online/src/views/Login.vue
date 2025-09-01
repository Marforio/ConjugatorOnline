<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card class="pa-8" max-width="560" elevation="4">
      <v-card-title class="text-h5 text-center mb-4">Welcome Back</v-card-title>

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
              <v-alert type="error" dense class="mb-3">
                {{ error }}
              </v-alert>
            </v-col>

            <v-col cols="12">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
              >
                Login
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
import { login as loginService } from "@/services/auth";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const route = useRoute();
const router = useRouter();

async function handleLogin() {
  error.value = "";
  loading.value = true;

  try {
    const data = await loginService(username.value, password.value);
    console.log("Login successful", data);

    const redirectPath = (route.query.redirect as string) || "/";
    router.replace(redirectPath);
  } catch (err: any) {
    error.value = err.response?.status === 401
      ? "Invalid credentials"
      : err.message || "Login failed";
  } finally {
    loading.value = false;
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

</style>
