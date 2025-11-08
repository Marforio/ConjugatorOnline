<template>
  <v-container fluid class="mt-5 pa-4 d-flex flex-column justify-center align-center">
    <v-row align="stretch" justify="center" class="game-grid" dense>

      <!-- Pronoun Practice -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center" style="min-height: 350px;">
        <v-btn
            size="x-large"
            class="d-flex flex-column align-center pa-3 pa-sm-6"
            style="margin-top: 100px;"
            color="yellow-darken-3"
            :to="{ name: 'meeting-machine' }"
            >
            <v-icon large>mdi-lightbulb-group</v-icon>
            <span class="subtitle-1 font-weight-medium px-3">Meeting machine</span>
            </v-btn>
      </v-col>



    </v-row>
    <!-- Back Button -->
    <div class="d-flex justify-center mt-6">
      <RouterLink :to="{ name: 'home' }">
        <v-btn icon elevation="0" size="x-large" style="margin-top: 50px;">
          <v-icon size="x-large" color="black">mdi-arrow-left-circle</v-icon>
        </v-btn>
      </RouterLink>
    </div>

  </v-container>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const isEnabled = false;
</script>

<style scoped>
.game-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* shared link wrapper */
.image-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.image-tile:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

/* ✅ enforce consistent aspect ratio via parent wrapper */
.tile-frame {
  width: 90%;
  border-radius: 12px;
  overflow: hidden;
  max-height: 14rem; /* keeps everything uniform */
}

/* inner v-img should just fill the box */
.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.disabled-tile {
  opacity: 0.5;
  pointer-events: none;
  cursor: default;
}

</style>
