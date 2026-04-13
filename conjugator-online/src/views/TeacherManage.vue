<template>
  <v-container fluid class="mt-5 pa-4 d-flex flex-column justify-center align-center">
    <LiveStudentMonitor class="mb-6" />
    <v-row align="stretch" justify="center" class="game-grid" dense>
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <div class="image-tile">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            :to="{ name: 'manage-workouts' }"
          >
            Manage Workouts
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <div class="image-tile">
            <v-btn
              color="primary"
              size="large"
              variant="elevated"
              :to="{ name: 'manage-feedback' }"
            >
              Give Feedback
            </v-btn>
        </div>
      </v-col>


            <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <div class="image-tile">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            :to="{ name: 'manage-data' }"
          >
            See Data
          </v-btn>
        </div>
      </v-col>
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
}

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