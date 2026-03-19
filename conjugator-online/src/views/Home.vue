<template>
  <v-container fluid class="d-flex flex-column pa-1">
    <!-- Top controls: centered on xs, right-aligned on sm+ -->
    <div class="top-controls mb-8">
      <div v-if="auth.isLoggedIn" class="mt-4 me-4">
        <LogOutButton v-if="!smAndDown"></LogOutButton>
      </div>
      <div v-else>
        <v-btn v-if="!xs" :to="{ name: 'login' }" color="primary" variant="tonal" class="mt-6 me-8">Log in</v-btn>
      </div>
    </div>

    <!-- Main Title Centered -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
       <div
          v-if="xs"
          class="language-title"
          style="font-size: 3.5rem; margin-top: 5%; margin-bottom: 20%; margin-left: 4%; margin-right: 4%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
        >
          Language Labs
        </div>

        <div
          v-else-if="lg || xl"
          class="language-title"
          style="font-size: 9rem; margin-top: 0.1%; margin-bottom: 4%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
        >
          Language Labs
        </div>

        <div
          v-else
          class="language-title"
          style="font-size: 8rem; margin-top: 2%; margin-bottom: 10%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
        >
          Language Labs
        </div>

        <!-- 
        <v-img
          v-if="xs"
          src="/images/banners/LanguageLabs1.png"
          alt="Language Labs"
          height="280"
          class="mx-auto mb-5"
        />

        MD+
        <v-img
          v-else
          src="/images/banners/LanguageLabs.png"
          alt="Language Labs"
          height="360"
          class="mx-auto mb-6"
        /> -->
      </v-col>
    </v-row>

    <!-- Tiles with Icon Buttons for Navigation -->


  <v-row justify="center" align="center" dense style="margin-left: 17%; margin-right: 17%;">

  <v-col
    cols="8"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="primary"
      width="200px"
      href="https://book.language-labs.ch"
    >
      <v-icon large>mdi-book-open-variant</v-icon>
      <span v-if="!$vuetify.display.xs" class="subtitle-1 font-weight-medium px-3">Grammar Book</span>
    </v-btn>
  </v-col>

  <v-col
    cols="12"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="warning"
      width="200px"
      :to="{ name: 'conjugator' }"
    >
      <v-icon large>mdi-controller</v-icon>
      <span v-if="!$vuetify.display.xs" class="subtitle-1 font-weight-medium px-3">Conjugator</span>
    </v-btn>
  </v-col>

  <v-col
    cols="12"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="red-lighten-1"
      width="200px"
      :to="{ name: 'vocabworkout' }"
    >
      <v-icon large>mdi-cards-outline</v-icon>
      <span v-if="!$vuetify.display.xs" class="subtitle-1 font-weight-medium px-3">Vocab</span>
    </v-btn>
  </v-col>

  <v-col
    cols="12"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="secondary"
      width="200px"
      :to="{ name: 'games' }"
    >
      <v-icon large>mdi-gamepad-circle</v-icon>
      <span v-if="!$vuetify.display.xs" class="subtitle-1 font-weight-medium px-3">Other games</span>
    </v-btn>
  </v-col>

  <v-col
    cols="12"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="yellow-darken-2"
      width="200px"
      :to="{ name: 'tools' }"
    >
      <v-icon large>mdi-tools</v-icon>
      <span v-if="!$vuetify.display.xs" class="subtitle-1 font-weight-medium px-3">Tools</span>
    </v-btn>
  </v-col>

  <v-col
    v-if="auth.isLoggedIn && userStore.isStaff"
    cols="12"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="deep-purple-accent-4"
      width="200px"
      :to="{ name: 'teacher-tools' }"
    >
      <v-icon large>mdi-school</v-icon>
      <span v-if="!$vuetify.display.xs" class="subtitle-1 font-weight-medium px-3">Teacher Tools</span>
    </v-btn>
  </v-col>

  </v-row>
    <v-row justify="center" align="center" dense style="margin-left: 17%; margin-right: 17%; margin-top: 3%;">
  
    <v-col cols="12" md="8" class="d-flex justify-center mb-6 mb-sm-10 mx-auto">
      <v-btn
        :to="{ name: 'dashboard' }"
        class="dashboard-hero-btn elevation-4"
        block
      >
        <div v-if="xs" class="d-flex flex-column align-center justify-center">
          <v-icon size="24" color="primary">mdi-view-dashboard</v-icon>
          <span class="text-caption font-weight-bold text-primary mt-1">Dashboard</span>
        </div>

        <div v-else class="d-flex align-center justify-start w-100 px-6">
          <div class="icon-blob me-6">
            <v-icon size="32" color="primary">mdi-view-dashboard-variant</v-icon>
          </div>
          <div class="text-left">
            <span class="text-h5 font-weight-black text-slate-800">Go to My Dashboard</span>
          </div>
          <v-spacer></v-spacer>
          <v-icon class="arrow-icon ms-5" color="primary">mdi-arrow-right-circle-outline</v-icon>
        </div>
      </v-btn>
    </v-col>
  </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import LogOutButton from "@/components/LogOutButton.vue";
import { useDisplay } from "vuetify";

const auth = useAuthStore();
const userStore = useUserStore();
const { xs, sm, md, lg, xl, smAndDown } = useDisplay()


</script>

<style scoped>
/* Full-width wrapper for the top controls. */
.top-controls {
  width: 100%;
  display: flex;
  justify-content: center;     /* default: center on small screens */
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

/* On small+ screens push controls to the right */
@media (min-width: 600px) {
  .top-controls {
    justify-content: flex-end;
  }
}

/* Title scales responsively */
.site-title {
  margin: 0;
  font-weight: 700;
  font-size: clamp(1.6rem, 4vw, 3.2rem);
  line-height: 1.05;
}

/* Small visual tweak so the top-right button isn't glued to the edge */
.top-controls > * {
  margin-right: 12px;
}
.top-controls > *:last-child {
  margin-right: 0;
}
/* Dashboard Hero Button - Light Professional Theme */
.dashboard-hero-btn {
  /* Very light blue-to-white gradient */
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
  border: 1px solid #e2e8f0;
  border-radius: 20px !important;
  height: 110px !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.dashboard-hero-btn:hover {
  transform: translateY(-4px);
  background: #ffffff !important;
  border-color: #3b82f6; /* Soft blue border on hover */
  box-shadow: 0 15px 30px -10px rgba(59, 130, 246, 0.2) !important;
}

/* The circle behind the icon */
.icon-blob {
  background: rgba(59, 130, 246, 0.1);
  padding: 14px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.dashboard-hero-btn:hover .icon-blob {
  transform: scale(1.1) rotate(-5deg);
  background: rgba(59, 130, 246, 0.15);
}

.text-slate-800 {
  color: #1e293b;
}

.arrow-icon {
  font-size: 32px;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.dashboard-hero-btn:hover .arrow-icon {
  opacity: 1;
  transform: translateX(8px);
}

/* Adjust the text-overline height for tight spacing */
.text-overline {
  font-size: 0.75rem !important;
  line-height: 1rem;
}

/* Ensure the smaller buttons look consistent */
.v-btn.flex-column {
  border-radius: 12px !important;
  text-transform: none !important;
}

</style>
