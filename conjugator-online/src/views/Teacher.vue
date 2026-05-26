<template>
  <v-container fluid class="mt-5 pa-4">

    <v-row align="start" justify="center">
        <LiveStudentMonitor class="w-100 mx-6" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/axios'
import LiveStudentMonitor from '@/components/LiveStudentMonitor.vue'

const router = useRouter()
</script>

<style scoped>
.game-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 2rem;
}

.image-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px; /* Changed to 100% to fill the v-col space predictably */
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

/* Kept these in case your child components or image assets rely on them */
.tile-frame {
  width: 90%;
  border-radius: 12px;
  overflow: hidden;
  max-height: 14rem;
}

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