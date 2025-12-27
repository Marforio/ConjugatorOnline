<template>
  <v-container fluid class="fill-height d-flex flex-column" style="margin-top: 50px;">
    <v-row align="center" justify="center" class="flex-grow-1 text-center">
      <v-col cols="12">
        <div
          class="image-link"
          @click="goToScene('Scene02_Settings')"
          role="button"
          tabindex="0"
        >
          <v-img
            v-if="xs"
            src="/images/banners/Conjugator2.png"
            class="m-2 mb-5 rounded-image w-100"
            style="min-width: 20rem;"
            contain
          />

          <v-img
            v-else-if="sm"
            src="/images/banners/Conjugator.png"
            class="m-2 mb-5 rounded-image w-100"
            style="min-width: 35rem;"
            contain
          />

          <v-img
            v-else-if="md"
            src="/images/banners/Conjugator.png"
            class="m-2 mb-5 rounded-image w-100"
            style="min-width: 50rem;"
            contain
          />

          <v-img
            v-else
            src="/images/banners/Conjugator.png"
            class="m-2 mb-5 rounded-image w-100"
            style="min-width: 70rem;"
            contain
          />
        </div>

        <!-- Hide on xs -->
        <h2 v-if="smAndUp" class="text-h5 beating-text mt-5 mb-2">
          Put your conjugation to the test!
        </h2>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-btn icon elevation class="m-3" size="x-large" :to="{ name: 'home' }">
        <v-icon size="x-large">mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>


<script setup>
import { useDisplay } from 'vuetify'

const { xs, sm, md, smAndUp } = useDisplay()

const emit = defineEmits(['changeScene'])

const goToScene = (sceneName) => {
  emit('changeScene', sceneName)
}
</script>


<style scoped>
.beating-text {
  display: inline-block;
  color: #134376; /* Base blue color */
  animation: beat 2.5s infinite ease-in-out;
}

@keyframes beat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Rounded + hover image styles */
.rounded-image {
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rounded-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
</style>
