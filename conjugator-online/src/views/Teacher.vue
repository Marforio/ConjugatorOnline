<template>
  <v-container fluid class="mt-5 pa-4">
    <!-- Main layout row: splits into two halves on medium+ screens -->
    <v-row align="start" justify="center">
      <v-col cols="12" md="10">
        <h1 class="text-h2 text-center my-4">Teacher Dashboard</h1>
      </v-col>
    </v-row>
    
    <v-row align="start" justify="center">
      
      <!-- Left Half: Live Student Monitor -->
      <v-col cols="12" md="5">
        <LiveStudentMonitor class="w-100 mx-6" />
      </v-col>

      <!-- Right Half: Action Buttons -->
      <v-col cols="12" md="7" class="px-12 py-6">
        <v-row align="stretch" justify="center" class="game-grid" dense>

          <!-- Manage Students -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="image-tile">
              <v-btn
                color="success"
                size="x-large"
                variant="elevated"
                block
                :to="{ name: 'manage-students' }"
              >
                Manage Students
              </v-btn>
            </div>
          </v-col>

          <!-- Teacher Tools -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="image-tile">
              <v-btn
                color="primary"
                size="x-large"
                variant="elevated"
                block
                :to="{ name: 'teacher-tools' }"
              >
                Classroom Tools
              </v-btn>
            </div>
          </v-col>
          
          
          <!-- See Error Data -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="image-tile">
              <v-btn
                color="info"
                size="x-large"
                variant="elevated"
                block
                :to="{ name: 'manage-error-data' }"
              >
                Error Data
              </v-btn>
            </div>
          </v-col>

          <!-- See Achievement Data -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="image-tile">
              <v-btn
                color="brown-lighten-1"
                size="x-large"
                variant="elevated"
                block
                :to="{ name: 'manage-achievement-data' }"
              >
                Achievement Data
              </v-btn>
            </div>
          </v-col>

          <!-- Give Feedback -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="image-tile">
              <v-btn
                color="warning"
                size="x-large"
                variant="elevated"
                block
                :to="{ name: 'manage-feedback' }"
              >
                Give Feedback
              </v-btn>
            </div>
          </v-col>

          <!-- Manage Workouts -->
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="image-tile">
              <v-btn
                color="secondary"
                size="x-large"
                variant="elevated"
                block
                :to="{ name: 'manage-workouts' }"
              >
                Manage Workouts
              </v-btn>
            </div>
          </v-col>

        </v-row>
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