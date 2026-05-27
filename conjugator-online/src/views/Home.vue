<template>
  <v-container fluid class="d-flex flex-column align-center justify-center fill-height splash-hero-frame pa-6">
    <div class="text-center splash-content-card pa-8 rounded-xl elevation-4 bg-white border">
      <!-- Minimalist Icon Shield -->
      <v-avatar color="blue-lighten-5" size="80" class="mb-4">
        <v-img
          src="/icons/logo1.png"
          alt="Logo"
          cover
          class="rounded-circle"
        />
      </v-avatar>


      <!-- Brand Heading Title -->
      <h1 class="text-h2 font-weight-black text-slate-900 tracking-tight mb-2">
        Language Labs
      </h1>
      <p class="text-body-1 text-slate-500 max-width-text mx-auto mb-8">
        Custom language tools for students.
      </p>

      <!-- Dynamic Entry Actions Core -->
      <div class="d-flex flex-column align-center justify-center gap-4">
        <template v-if="auth.isLoggedIn">
          <!-- Main workspace tunnel button -->
          <v-btn
            :to="{ name: 'student-home' }"
            color="primary"
            size="large"
            height="56"
            width="280"
            class="enter-workspace-btn rounded-xl font-weight-bold text-none text-subtitle-1 elevation-2"
            append-icon="mdi-arrow-right"
          >
            Enter Workspace
          </v-btn>
          
          <div class="text-caption text-slate-400 mt-2 d-flex align-center">
            Logged in as verified user: <span class="font-weight-bold text-primary ml-1"><InitialsText /></span>
          </div>
        </template>

        <template v-else>
          <!-- Prominent Authorization redirection call -->
          <v-btn
            :to="{ name: 'login' }"
            color="primary"
            size="large"
            height="56"
            width="280"
            class="enter-workspace-btn rounded-xl font-weight-bold text-none text-subtitle-1 elevation-2"
            append-icon="mdi-login-variant"
          >
            Log In to Begin
          </v-btn>
          <span class="text-caption text-slate-400 mt-2">Ask your teacher for login credentials.</span>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth"
import InitialsText from "@/components/InitialsText.vue"

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  // 🚀 AUTOMATIC LANDING REDIRECT:
  // If the student touches the home route while already authenticated,
  // bypass the splash screen completely and pop them right into their dashboard!
  if (auth.isLoggedIn && !auth.isAccessTokenExpired()) {
    router.replace({ name: 'dashboard' })
  }
})
</script>

<style scoped>
.splash-hero-frame {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.splash-content-card {
  max-width: 520px;
  width: 100%;
  border-color: #e2e8f0 !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01) !important;
}

.max-width-text {
  max-width: 380px;
}

.enter-workspace-btn {
  letter-spacing: 0.3px !important;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.enter-workspace-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -8px rgba(59, 130, 246, 0.35) !important;
}

.text-slate-900 { color: #0f172a; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
</style>