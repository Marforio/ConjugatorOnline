<template>
  <v-container fluid class="fill-height d-flex flex-column mt-5">
    <v-row align="center" justify="center" class="flex-grow-1 text-center">
      <v-col cols="12">
        <!-- Clickable Image -->
        <div
          class="image-link"
          @click="goToScene('Scene02_Settings')"
          role="button"
          tabindex="0"
        >
          <v-img
            src="/images/conjugator.png"
            alt="Logo"
            class="m-2 rounded-image"
            width="100%"
            contain
          />
        </div>

        <!-- Beating subtitle -->
        <h2 class="beating-text mt-3 mb-5">
          Put your conjugation to the test!
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="flex-grow-1 text-center mt-5">
      <v-btn elevation class="text-h5 m-3" size="x-large" color="success" @click="goToScene('Scene02_Settings')">
        Play!
      </v-btn>
    </v-row>  
    <v-row>
      <v-btn icon elevation class="m-3" large :to="{ name: 'home' }">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-row>
    
    
  </v-container>
</template>

<script>
export default {
  methods: {
    goToScene(sceneName) {
      this.$emit("changeScene", sceneName);
    },
  },
};
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
