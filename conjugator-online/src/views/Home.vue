<template>
  <v-container fluid class="d-flex flex-column pa-1">
    <div class="top-controls mb-8">
      <div v-if="auth.isLoggedIn" class="mt-4 me-4">
        <span class="me-6 text-title-small">Welcome back <InitialsText />!</span>
        <LogOutButton v-if="!smAndDown"></LogOutButton>
      </div>
      <div v-else>
        <v-btn v-if="!xs" :to="{ name: 'login' }" color="primary" variant="tonal" class="mt-6 me-8">Log in</v-btn>
      </div>
    </div>

    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <!-- XS title: smaller -->
        <div
          v-if="xs"
          class="language-title language-title--xs"
        >
          Language Labs
        </div>

        <!-- Non-XS title: unchanged -->
        <div
          v-else
          class="language-title"
          :style="{
            fontSize: (lg || xl) ? '9rem' : '8rem',
            marginTop: '2%',
            marginBottom: '6%',
            fontFamily: 'Segoe UI, sans-serif'
          }"
        >
          Language Labs
        </div>
      </v-col>
    </v-row>

    <!-- Buttons -->
    <v-row
      justify="center"
      align="center"
      dense
      :style="xs ? { marginLeft: '17%', marginRight: '17%' } : { marginLeft: '17%', marginRight: '17%' }"
      class="nav-grid"
    >
      <!-- XS: hero button MUST be on top -->
      <v-col
        v-if="xs && auth.isLoggedIn"
        cols="12"
        class="d-flex justify-center mb-4"
        style="order: -1;"
      >
        <v-btn
          :to="{ name: 'dashboard' }"
          class="dashboard-hero-btn dashboard-hero-btn--xs elevation-2"
        >
          <v-icon size="28" color="primary">mdi-view-dashboard-variant</v-icon>
        </v-btn>
      </v-col>

      <!-- Grammar book -->
      <v-col
        cols="8"
        sm="6"
        md="4"
        class="d-flex justify-center mb-0 mb-sm-4"
        :class="xs ? 'nav-col--xs' : ''"
      >
        <v-btn
          class="nav-tile-btn"
          color="primary"
          width="80%"
          :class="xs ? 'nav-tile-btn--xs' : ''"
          href="https://book.language-labs.ch"
        >
          <v-icon :size="xs ? 28 : undefined" :large="!xs">mdi-book-open-variant</v-icon>
          <span v-if="!xs" class="subtitle-1 font-weight-medium px-3">Grammar Book</span>
        </v-btn>
      </v-col>

      <!-- Conjugator -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center mb-0 mb-sm-4" :class="xs ? 'nav-col--xs' : ''">
        <v-btn class="nav-tile-btn" width="80%" color="warning" :class="xs ? 'nav-tile-btn--xs' : ''" :to="{ name: 'conjugator' }">
          <v-icon :size="xs ? 28 : undefined" :large="!xs">mdi-controller</v-icon>
          <span v-if="!xs" class="subtitle-1 font-weight-medium px-3">Conjugator</span>
        </v-btn>
      </v-col>

      <!-- Vocab -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center mb-0 mb-sm-4" :class="xs ? 'nav-col--xs' : ''">
        <v-btn class="nav-tile-btn" width="80%" color="red-lighten-1" :class="xs ? 'nav-tile-btn--xs' : ''" :to="{ name: 'vocabworkout' }">
          <v-icon :size="xs ? 28 : undefined" :large="!xs">mdi-cards-outline</v-icon>
          <span v-if="!xs" class="subtitle-1 font-weight-medium px-3">Vocab</span>
        </v-btn>
      </v-col>

      <!-- Other games -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center mb-0 mb-sm-4" :class="xs ? 'nav-col--xs' : ''">
        <v-btn class="nav-tile-btn" width="80%" color="secondary" :class="xs ? 'nav-tile-btn--xs' : ''" :to="{ name: 'games' }">
          <v-icon :size="xs ? 28 : undefined" :large="!xs">mdi-gamepad-circle</v-icon>
          <span v-if="!xs" class="subtitle-1 font-weight-medium px-3">Other games</span>
        </v-btn>
      </v-col>

      <!-- Tools -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center mb-0 mb-sm-4" :class="xs ? 'nav-col--xs' : ''">
        <v-btn class="nav-tile-btn" width="80%" color="yellow-darken-2" :class="xs ? 'nav-tile-btn--xs' : ''" :to="{ name: 'tools' }">
          <v-icon :size="xs ? 28 : undefined" :large="!xs">mdi-tools</v-icon>
          <span v-if="!xs" class="subtitle-1 font-weight-medium px-3">Tools</span>
        </v-btn>
      </v-col>

      <!-- Teacher Tools -->
      <v-col
        v-if="auth.isLoggedIn && userStore.isStaff"
        cols="12"
        sm="6"
        md="4"
        class="d-flex justify-center mb-0 mb-sm-4"
        :class="xs ? 'nav-col--xs' : ''"
      >
        <v-btn class="nav-tile-btn" width="80%" color="deep-purple-accent-4" :class="xs ? 'nav-tile-btn--xs' : ''" :to="{ name: 'teacher-tools' }">
          <v-icon :size="xs ? 28 : undefined" :large="!xs">mdi-school</v-icon>
          <span v-if="!xs" class="subtitle-1 font-weight-medium px-3">Teacher Tools</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Non-XS hero dashboard button (unchanged) -->
    <v-row v-if="!xs && auth.isLoggedIn" justify="center" align="center" dense style="margin-left: 17%; margin-right: 17%; margin-top: 2%;">
      <v-col cols="12" md="6" lg="5" class="d-flex justify-center mb-10 mx-auto">
        <v-btn
          :to="{ name: 'dashboard' }"
          class="dashboard-hero-btn elevation-2"
          block
        >
          <div class="d-flex align-center justify-start w-100 px-4">
            <div class="icon-blob-mini me-4">
              <v-icon size="24" color="primary">mdi-view-dashboard-variant</v-icon>
            </div>
            <div class="text-left">
              <span class="text-subtitle-1 font-weight-bold text-slate-800">Go to My Dashboard</span>
            </div>
            <v-spacer></v-spacer>
            <v-icon class="arrow-icon" color="primary">mdi-arrow-right</v-icon>
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
import InitialsText from "@/components/InitialsText.vue";

const auth = useAuthStore();
const userStore = useUserStore();
const { xs, sm, md, lg, xl, smAndDown } = useDisplay()
</script>

<style scoped>
.top-controls {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}

/* XS title smaller (only XS) */
.language-title--xs {
  font-size: 3.7rem;
  margin-top: 6%;
  margin-bottom: 12%;
  font-family: "Segoe UI", sans-serif;
}

/* Hero Button - existing styles kept (note: your file had duplicates; leaving as-is) */
.dashboard-hero-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
  border: 1px solid #e2e8f0;
  border-radius: 12px !important;
  height: 64px !important;
  text-transform: none !important;
  transition: all 0.3s ease;
}

.dashboard-hero-btn:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  background: #ffffff !important;
}

.icon-blob-mini {
  background: rgba(59, 130, 246, 0.1);
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

/* Default tile button styling (non-XS kept) */
.nav-tile-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  height: auto !important;
  min-height: 56px;
}

.text-slate-800 {
  color: #1e293b;
}

.arrow-icon {
  font-size: 20px;
  opacity: 0.5;
}

/* You had a duplicate .top-controls block; keeping behavior but leaving structure intact */
.top-controls {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

@media (min-width: 600px) {
  .top-controls {
    justify-content: flex-end;
  }
}

/* XS-only: icon-only, centered, consistent sizing so ordering/wrapping is predictable */
@media (max-width: 600px) {
  /* Make every column behave consistently on XS (prevents odd wrapping like "cols=8" pushing items around) */
  .nav-col--xs {
    flex: 0 0 auto;
    width: auto;
  }

  /* Icon-only tiles: square, centered content (fixes "justify-start") */
  .nav-tile-btn--xs {
    width: 72px !important;
    height: 72px !important;
    min-height: 72px !important;
    padding: 0 !important;
    border-radius: 16px !important;

    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* XS hero: distinctive + centered, icon only */
  .dashboard-hero-btn--xs {
    width: 50vw !important;      /* was 92vw */
    max-width: 300px !important; /* was 360px */
    height: 64px !important;
    border-radius: 18px !important;

    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;

    border-color: #3b82f6 !important;
    box-shadow: 0 10px 20px -12px rgba(59, 130, 246, 0.35) !important;
  }
}

/* The rest of your existing duplicate styles are left as-is */
.dashboard-xs-btn {
  text-transform: none !important;
  font-weight: bold !important;
  border-radius: 12px !important;
}

.dashboard-hero-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
  border: 1px solid #e2e8f0;
  border-radius: 16px !important;
  height: 80px !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.dashboard-hero-btn:hover {
  transform: translateY(-3px);
  background: #ffffff !important;
  border-color: #3b82f6;
  box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.2) !important;
}

.icon-blob {
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-tile-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px !important;
  border-radius: 12px !important;
  text-transform: none !important;
}

.arrow-icon {
  font-size: 28px;
  opacity: 0.3;
}
</style>