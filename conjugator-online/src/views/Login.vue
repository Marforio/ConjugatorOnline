<template>
  <v-container
    fluid
    class="d-flex align-center justify-center login-gradient-canvas pa-4"
    style="min-height: 100vh;"
  >
    <v-card class="pa-6 pa-sm-10 border rounded-xl bg-white shadow-xl position-relative box-card-chassis" max-width="480" flat>
      
      <v-overlay
        :model-value="loading && !loginError && !loginSuccess"
        class="d-flex flex-column align-center justify-center text-center style-glass-overlay"
        opacity="0.7"
        scrim="#0f172a"
        persistent
      >
        <v-progress-circular indeterminate size="52" width="5" color="primary" />
        <div class="mt-4 text-subtitle-2 font-weight-bold text-white tracking-wide">Syncing data profiles...</div>
      </v-overlay>

      <v-overlay
        :model-value="loginSuccess"
        class="d-flex flex-column align-center justify-center text-center style-glass-overlay"
        opacity="0.8"
        scrim="#0f172a"
        persistent
      >
        <v-avatar color="success-lighten-5" size="96" class="mb-4 animate-scale-pop">
          <v-icon color="success" size="56">mdi-check-circle</v-icon>
        </v-avatar>
        <div class="text-h6 font-weight-black text-white leading-none">Authentication Passed</div>
        <div class="text-caption text-slate-300 mt-1 font-weight-medium">Configuring runtime parameters...</div>
      </v-overlay>

      <v-overlay
        :model-value="loginError"
        class="d-flex flex-column align-center justify-center text-center style-glass-overlay"
        opacity="0.85"
        scrim="#450a0a"
        persistent
      >
        <v-avatar color="error-lighten-5" size="96" class="mb-4 animate-shake">
          <v-icon color="error" size="56">mdi-close-circle</v-icon>
        </v-avatar>
        <div class="text-h6 font-weight-black text-white leading-none">Authentication Denied</div>
        <div class="text-caption text-red-200 mt-1 font-weight-medium">{{ error || 'Check credentials' }}</div>
      </v-overlay>

      <div class="text-center mb-8">
        <v-avatar color="primary-lighten-5" size="52" class="mb-3 border">
          <v-icon color="primary" size="26">mdi-book-education-outline</v-icon>
        </v-avatar>
        <v-card-title class="pa-0 text-h5 font-weight-black text-slate-900 tracking-tight leading-none mb-1">
          Welcome Back
        </v-card-title>
        <div class="text-caption text-slate-400 font-weight-bold uppercase tracking-wider">Language Labs</div>
      </div>

      <v-card-text class="pa-0">
        <v-form @submit.prevent="handleLogin">
          <v-row dense>
            <v-col cols="12" class="mb-2">
              <div class="text-xxs font-weight-black text-slate-400 text-uppercase tracking-wider mb-1.5 pl-0.5">Username</div>
              <v-text-field
                v-model="username"
                placeholder="Enter username"
                density="comfortable"
                variant="outlined"
                prepend-inner-icon="mdi-account-outline"
                color="primary"
                hide-details
                required
              />
            </v-col>

            <v-col cols="12" class="mb-4">
              <div class="text-xxs font-weight-black text-slate-400 text-uppercase tracking-wider mb-1.5 pl-0.5">Password</div>
              <v-text-field
                v-model="password"
                placeholder="Enter password"
                :type="showPassword ? 'text' : 'password'"
                density="comfortable"
                variant="outlined"
                prepend-inner-icon="mdi-lock-open-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                color="primary"
                hide-details
                required
                @click:append-inner="showPassword = !showPassword"
              />
            </v-col>

            <v-col cols="12" v-if="error && showError" class="mb-2">
              <v-alert
                type="error"
                variant="tonal"
                density="comfortable"
                class="rounded-xl font-weight-bold text-caption border border-error border-opacity-20 text-left"
                closable
                @click:close="showError = false"
              >
                {{ error }}
              </v-alert>
            </v-col>

            <v-col cols="12" class="mt-2">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                height="48"
                class="rounded-xl text-none font-weight-black tracking-wide elevation-1"
                :disabled="loading"
              >
                Sign In
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

const auth = useAuthStore();
const userStore = useUserStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");
const showError = ref(false);

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
    // 1) Login -> auth store owns token credentials context
    await auth.login(username.value, password.value);

    // 2) Optional server validation pass
    await apiValidateToken();

    // 3) Force blocking profile query so roles are fetched before routing determinations
    await userStore.ensureUserLoaded();

    loading.value = false;
    loginSuccess.value = true;

    // Wait briefly for success animation frame confirmation matrices
    setTimeout(() => {
      // Prioritize explicit navigation queries
      if (route.query.redirect) {
        return router.replace(route.query.redirect as string);
      }

      // 🛡️ ROLE SPLIT REDIRECTION CRITERIA CALCULATION
      if (userStore.isStaff) {
        router.replace("/teacher"); // Admin dashboard root pathway
      } else {
        router.replace("/home"); // Student dashboard workspace pathway
      }
    }, 1200);
    
  } catch (err: any) {
    error.value =
      err.response?.status === 401
        ? "Invalid username or password"
        : err.message || "Login system error encountered";

    loginError.value = true;
    showError.value = true;

    setTimeout(() => {
      loading.value = false;
      setTimeout(() => {
        loginError.value = false;
      }, 2500);
    }, 100);

    setTimeout(() => {
      showError.value = false;
    }, 4500);
  }
}
</script>

<style scoped>
/* ==========================================
   🎨 DESIGN LAYOUT REFURBISHMENT MODIFIERS
   ========================================== */
.login-gradient-canvas {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}

.login-gradient-canvas::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#2563eb 0.8px, transparent 0.8px), radial-gradient(#2563eb 0.8px, #f8fafc 0.8px);
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
  opacity: 0.03;
  pointer-events: none;
}

.box-card-chassis {
  width: 100%;
  border-color: #e2e8f0 !important;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05) !important;
}

.style-glass-overlay {
  backdrop-filter: blur(8px);
}

.text-xxs {
  font-size: 0.7rem !important;
}

.leading-none {
  line-height: 1 !important;
}

/* ==========================================
   🔄 STATE STYLES & INTERACTIVE TRANSITIONS
   ========================================== */
.animate-scale-pop {
  animation: compile-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-shake {
  animation: compile-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes compile-pop {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes compile-shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Color references fixes */
.text-slate-900 { color: #0f172a; }
.text-slate-400 { color: #94a3b8; }
.text-slate-300 { color: #cbd5e1; }
</style>