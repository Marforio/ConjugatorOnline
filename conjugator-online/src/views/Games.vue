<template>
  <v-container fluid class="mt-5 pa-4 d-flex flex-column justify-center align-center">
    <v-row align="stretch" justify="center" class="game-grid" dense>

      <!-- Pronoun Practice -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <RouterLink :to="{ name: 'pronounpractice' }" class="image-tile">
          <div class="tile-frame">
            <v-img
              src="/images/banners/PronounPractice.png"
              alt="Pronoun Practice"
              cover
              class="tile-image"
            />
          </div>
        </RouterLink>
      </v-col>

      <!-- Quantifier Quest -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <RouterLink :to="{ name: 'quantifierquest' }" class="image-tile">
          <div class="tile-frame">
            <v-img
              src="/images/banners/QuantifierQuest.png"
              alt="Quantifier Quest"
              cover
              class="tile-image"
            />
          </div>
        </RouterLink>
      </v-col>

      <!-- Passive Maker -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <RouterLink
          :to="{ name: 'passiveparty' }"
          class="image-tile"
        >
          <div class="tile-frame">
            <v-img src="/images/banners/PassiveParty.png" alt="Passive Maker" cover class="tile-image" />
          </div>
        </RouterLink>
      </v-col>


      <!-- Verb Combinator -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <RouterLink
          :to="{ name: 'verbmixer' }"
          class="image-tile"
        >
          <div class="tile-frame">
            <v-img src="/images/banners/VerbMixer.png" alt="Verb Mixer" cover class="tile-image" />
          </div>
        </RouterLink>
      </v-col>

      <!-- Translator -->
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <RouterLink
          :to="isEnabled ? { name: 'trickytranslator' } : undefined"
          class="image-tile"
          :style="{ pointerEvents: isEnabled ? 'auto' : 'none', opacity: isEnabled ? 1 : 0.5 }"
        >
          <div class="tile-frame">
            <v-img src="/images/banners/TrickyTranslator.png" alt="Translator" cover class="tile-image" />
          </div>
        </RouterLink>
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
