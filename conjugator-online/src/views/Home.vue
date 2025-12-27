<template>
  <v-container fluid class="d-flex flex-column pa-4">
    <!-- Top controls: centered on xs, right-aligned on sm+ -->
    <div class="top-controls mb-8">
      <div v-if="userStore.isAuthenticated">
        <LogOutButton v-if="!smAndDown"></LogOutButton>
      </div>
      <div v-else>
        <v-btn :to="{ name: 'login' }" color="primary" variant="tonal">Log in</v-btn>
      </div>
    </div>

    <!-- Main Title Centered -->
    <v-row justify="center" class="mb-2">
      <v-col cols="12" class="text-center">

       <!-- XS -->
        <v-img
          v-if="xs"
          src="/images/banners/LanguageLabs1.png"
          alt="Language Labs"
          height="280"
          class="mx-auto mb-5"
        />

        <!-- MD+ -->
        <v-img
          v-else
          src="/images/banners/LanguageLabs.png"
          alt="Language Labs"
          height="360"
          class="mx-auto mb-6"
        />
      </v-col>
    </v-row>

    <!-- Tiles with Icon Buttons for Navigation -->
<v-row justify="center" align="center" dense>
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
      href="https://book.language-labs.ch"
    >
      <v-icon large>mdi-book-open-variant</v-icon>
      <span class="subtitle-1 font-weight-medium px-3">Grammar Book</span>
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
      :to="{ name: 'conjugator' }"
    >
      <v-icon large>mdi-controller</v-icon>
      <span class="subtitle-1 font-weight-medium px-3">Conjugator</span>
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
      color="success"
      :to="{ name: 'dashboard' }"
    >
      <v-icon large>mdi-chart-bar</v-icon>
      <span class="subtitle-1 font-weight-medium px-3">Dashboard</span>
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
      :to="{ name: 'games' }"
    >
      <v-icon large>mdi-gamepad-circle</v-icon>
      <span class="subtitle-1 font-weight-medium px-3">Other games</span>
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
      :to="{ name: 'tools' }"
    >
      <v-icon large>mdi-tools</v-icon>
      <span class="subtitle-1 font-weight-medium px-3">Tools</span>
    </v-btn>
  </v-col>
  <!-- TEACHER TOOLS (admin-only) -->
  <v-col
    v-if="userStore.isAuthenticated && userStore.isStaff"
    cols="12"
    sm="6"
    md="4"
    class="d-flex justify-center mb-0 mb-sm-4"
  >
    <v-btn
      large
      class="d-flex flex-column align-center pa-3 pa-sm-6"
      color="deep-purple-accent-4"
      :to="{ name: 'teacher-tools' }"
    >
      <v-icon large>mdi-school</v-icon>
      <span class="subtitle-1 font-weight-medium px-3">Teacher Tools</span>
    </v-btn>
  </v-col>

</v-row>

  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import LogOutButton from "@/components/LogOutButton.vue";
import { useDisplay } from "vuetify";

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
</style>
