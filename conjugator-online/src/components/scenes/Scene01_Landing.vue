<template>
  <!-- Pure white background, clean alignment grid boundaries -->
  <v-container fluid class="fill-height d-flex flex-column bg-white justify-center pa-6" style="min-height: calc(100vh - 64px);">
    
    <v-row align="center" justify="center" class="flex-grow-1 text-center w-100">
      <v-col cols="12" class="d-flex flex-column align-center justify-center">
        
        <!-- Interactive Click Target Core (Keyboard accessible) -->
        <div
          class="image-interactive-wrapper"
          @click="goToScene('Scene02_Settings')"
          @keyup.enter="goToScene('Scene02_Settings')"
          role="button"
          tabindex="0"
          aria-label="Enter Conjugation Game Settings"
        >
          <!-- 🚀 COLLAPSED SINGLE-TAG OPTIMIZATION:
               Dynamically matches layouts without multiplying template markup nodes -->
          <v-img
            :src="xs ? '/images/banners/Conjugator2.png' : '/images/banners/Conjugator.png'"
            class="rounded-xl game-banner-graphic border shadow-sm mx-auto"
            :max-width="xs ? '100%' : sm ? '560' : md ? '800' : '1100'"
            cover
          />
        </div>

        <!-- Beating CTA Subtitle (Hidden on tiny phone footprints to save fold space) -->
        <h2 v-if="smAndUp" class="text-subtitle-1 text-sm-h5 font-weight-black tracking-tight pulsing-cta-text mt-8 mb-2">
          Put your conjugation to the test!
        </h2>
      </v-col>
    </v-row>

    <!-- Navigation Escape Link Row -->
    <v-row no-gutters class="w-100 justify-center pb-4 mt-auto">
      <v-btn 
        icon="mdi-arrow-left" 
        variant="tonal" 
        size="large" 
        color="slate-600" 
        class="bg-white border rounded-xl elevation-1" 
        :to="{ name: 'student-data' }" 
      />
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
/* ==========================================
   ✨ PREMIUM GESTURE GRAPHICS & HOVER ACTIONS
   ========================================== */
.image-interactive-wrapper {
  width: 100%;
  outline: none;
  display: block;
}

.game-banner-graphic {
  border-color: #e2e8f0 !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
}

/* Fluid mouse interactions */
.image-interactive-wrapper:hover .game-banner-graphic {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01) !important;
  border-color: #3b82f6 !important; /* Distinct blue focus ring accent */
}

/* Keyboard focus rings indicators */
.image-interactive-wrapper:focus-visible .game-banner-graphic {
  transform: scale(1.02);
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
}

/* Smooth, non-jarring typographic layout breathe loops */
.pulsing-cta-text {
  display: inline-block;
  color: #1e293b; /* Refined charcoal signature text color */
  animation: breathing-pulse 3s infinite ease-in-out;
  letter-spacing: -0.2px !important;
}

@keyframes breathing-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
    color: #3b82f6; /* Shifts slightly to primary blue at the peak of the pulse */
  }
}

.text-slate-600 { color: #475569; }
</style>