<!-- components/LinguisticProfileEmbedded.vue -->
<template>
  <div style="min-height: 800px;">
    <!-- Section Header -->
    <v-card class="pa-6 mb-4 profile-header" elevation="4" rounded="xl" id="profile-section">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h4 font-weight-bold">My Linguistic Profile</div>
          <div class="text-subtitle-1 text-medium-emphasis mt-1">
            Track your progress across four key language skills
          </div>
        </div>
        <v-icon size="56" color="white">mdi-account-voice</v-icon>
      </div>
    </v-card>

    <!-- Loading -->
    <v-card v-if="userStore.loadingLinguisticProfile" class="pa-8 text-center">
      <v-progress-circular indeterminate color="primary" size="48" />
      <div class="text-body-1 mt-4">Loading your profile...</div>
    </v-card>

    <!-- Error -->
    <v-card v-else-if="userStore.linguisticProfileError" class="pa-6" color="error" variant="tonal">
      <div class="d-flex align-center">
        <v-icon size="32" class="mr-4">mdi-alert-circle</v-icon>
        <div>
          <div class="text-h6">Error loading profile</div>
          <div class="text-body-2">{{ userStore.linguisticProfileError }}</div>
        </div>
      </div>
    </v-card>

    <!-- Profile Content -->
    <div v-else>
      <!-- Assessment Info -->
      <v-card v-if="userStore.assessmentStageLabel" class="mb-4 pa-4" elevation="2">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-body-2 text-medium-emphasis">Latest Assessment</div>
            <div class="text-h6">{{ userStore.assessmentStageLabel }}</div>
          </div>
          <div class="text-right">
            <div class="text-body-2 text-medium-emphasis">Last Updated</div>
            <div class="text-body-1">{{ formatDate(userStore.linguisticProfile?.last_assessed_at) }}</div>
          </div>
        </div>
      </v-card>

      <!-- No Profile Yet -->
      <v-card v-if="!userStore.hasLinguisticProfile" class="pa-8 text-center" elevation="2">
        <v-icon size="64" color="grey">mdi-account-question</v-icon>
        <div class="text-h6 mt-4">No assessment yet</div>
        <div class="text-body-2 text-medium-emphasis">
          Your teacher will assess your linguistic profile soon.
        </div>
      </v-card>

      <!-- Profile Skills -->
      <v-row v-else dense>
        <!-- Linguistic Precision -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 profile-card" elevation="2" rounded="lg">
            <div class="d-flex align-center mb-4">
              <v-icon size="32" color="blue" class="mr-3">mdi-check-decagram</v-icon>
              <div>
                <div class="text-h6">Linguistic Precision</div>
                <div class="text-caption text-medium-emphasis">Accuracy & Grammar</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Score</span>
                <div class="d-flex align-center gap-2">
                  <v-chip :color="getScoreColor(userStore.linguisticProfile?.linguistic_precision)" size="small">
                    {{ userStore.linguisticProfile?.linguistic_precision ?? '--' }}/10
                  </v-chip>
                  <v-chip 
                    v-if="userStore.linguisticProfile?.linguistic_precision" 
                    :color="getLevelColor(userStore.linguisticProfile.linguistic_precision)"
                    size="small"
                    variant="tonal"
                  >
                    {{ getLevel(userStore.linguisticProfile.linguistic_precision) }}
                  </v-chip>
                </div>
              </div>
              <v-slider
                :model-value="userStore.linguisticProfile?.linguistic_precision ?? 0"
                :max="10"
                :min="1"
                :step="1"
                :ticks="tickLabels"
                show-ticks="always"
                readonly
                :color="getScoreColor(userStore.linguisticProfile?.linguistic_precision)"
                thumb-label
                class="linguistic-slider"
              >
                <template v-slot:tick-label="{ index }">
                  {{ index + 1 }}
                </template>
              </v-slider>
              
              <!-- Level indicators -->
              <div class="level-indicators">
                <div class="level-segment beginner">
                  <span class="level-label">Beginner</span>
                  <span class="level-range">1-2</span>
                </div>
                <div class="level-segment intermediate">
                  <span class="level-label">Intermediate</span>
                  <span class="level-range">3-5</span>
                </div>
                <div class="level-segment upper-intermediate">
                  <span class="level-label">Upper-Int</span>
                  <span class="level-range">6-8</span>
                </div>
                <div class="level-segment advanced">
                  <span class="level-label">Advanced</span>
                  <span class="level-range">9-10</span>
                </div>
              </div>
            </div>

            <v-divider class="my-3" />

            <div v-if="userStore.linguisticProfile?.linguistic_precision_comment" class="comment-box">
              <div class="text-caption font-weight-bold mb-1">Teacher's Comments:</div>
              <div class="text-body-2">{{ userStore.linguisticProfile.linguistic_precision_comment }}</div>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              No comments yet.
            </div>
          </v-card>
        </v-col>

        <!-- Phonetic Clarity -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 profile-card" elevation="2" rounded="lg">
            <div class="d-flex align-center mb-4">
              <v-icon size="32" color="green" class="mr-3">mdi-microphone</v-icon>
              <div>
                <div class="text-h6">Phonetic Clarity</div>
                <div class="text-caption text-medium-emphasis">Pronunciation & Intonation</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Score</span>
                <div class="d-flex align-center gap-2">
                  <v-chip :color="getScoreColor(userStore.linguisticProfile?.phonetic_clarity)" size="small">
                    {{ userStore.linguisticProfile?.phonetic_clarity ?? '--' }}/10
                  </v-chip>
                  <v-chip 
                    v-if="userStore.linguisticProfile?.phonetic_clarity" 
                    :color="getLevelColor(userStore.linguisticProfile.phonetic_clarity)"
                    size="small"
                    variant="tonal"
                  >
                    {{ getLevel(userStore.linguisticProfile.phonetic_clarity) }}
                  </v-chip>
                </div>
              </div>
              <v-slider
                :model-value="userStore.linguisticProfile?.phonetic_clarity ?? 0"
                :max="10"
                :min="1"
                :step="1"
                :ticks="tickLabels"
                show-ticks="always"
                readonly
                :color="getScoreColor(userStore.linguisticProfile?.phonetic_clarity)"
                thumb-label
                class="linguistic-slider"
              >
                <template v-slot:tick-label="{ index }">
                  {{ index + 1 }}
                </template>
              </v-slider>
              
              <!-- Level indicators -->
              <div class="level-indicators">
                <div class="level-segment beginner">
                  <span class="level-label">Beginner</span>
                  <span class="level-range">1-2</span>
                </div>
                <div class="level-segment intermediate">
                  <span class="level-label">Intermediate</span>
                  <span class="level-range">3-5</span>
                </div>
                <div class="level-segment upper-intermediate">
                  <span class="level-label">Upper-Int</span>
                  <span class="level-range">6-8</span>
                </div>
                <div class="level-segment advanced">
                  <span class="level-label">Advanced</span>
                  <span class="level-range">9-10</span>
                </div>
              </div>
            </div>

            <v-divider class="my-3" />

            <div v-if="userStore.linguisticProfile?.phonetic_clarity_comment" class="comment-box">
              <div class="text-caption font-weight-bold mb-1">Teacher's Comments:</div>
              <div class="text-body-2">{{ userStore.linguisticProfile.phonetic_clarity_comment }}</div>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              No comments yet.
            </div>
          </v-card>
        </v-col>

        <!-- Communicative Flow -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 profile-card" elevation="2" rounded="lg">
            <div class="d-flex align-center mb-4">
              <v-icon size="32" color="orange" class="mr-3">mdi-run-fast</v-icon>
              <div>
                <div class="text-h6">Communicative Flow</div>
                <div class="text-caption text-medium-emphasis">Fluency & Strategy</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Score</span>
                <div class="d-flex align-center gap-2">
                  <v-chip :color="getScoreColor(userStore.linguisticProfile?.communicative_flow)" size="small">
                    {{ userStore.linguisticProfile?.communicative_flow ?? '--' }}/10
                  </v-chip>
                  <v-chip 
                    v-if="userStore.linguisticProfile?.communicative_flow" 
                    :color="getLevelColor(userStore.linguisticProfile.communicative_flow)"
                    size="small"
                    variant="tonal"
                  >
                    {{ getLevel(userStore.linguisticProfile.communicative_flow) }}
                  </v-chip>
                </div>
              </div>
              <v-slider
                :model-value="userStore.linguisticProfile?.communicative_flow ?? 0"
                :max="10"
                :min="1"
                :step="1"
                :ticks="tickLabels"
                show-ticks="always"
                readonly
                :color="getScoreColor(userStore.linguisticProfile?.communicative_flow)"
                thumb-label
                class="linguistic-slider"
              >
                <template v-slot:tick-label="{ index }">
                  {{ index + 1 }}
                </template>
              </v-slider>
              
              <!-- Level indicators -->
              <div class="level-indicators">
                <div class="level-segment beginner">
                  <span class="level-label">Beginner</span>
                  <span class="level-range">1-3</span>
                </div>
                <div class="level-segment intermediate">
                  <span class="level-label">Intermediate</span>
                  <span class="level-range">4-6</span>
                </div>
                <div class="level-segment upper-intermediate">
                  <span class="level-label">Upper-Int</span>
                  <span class="level-range">7-8</span>
                </div>
                <div class="level-segment advanced">
                  <span class="level-label">Advanced</span>
                  <span class="level-range">9-10</span>
                </div>
              </div>
            </div>

            <v-divider class="my-3" />

            <div v-if="userStore.linguisticProfile?.communicative_flow_comment" class="comment-box">
              <div class="text-caption font-weight-bold mb-1">Teacher's Comments:</div>
              <div class="text-body-2">{{ userStore.linguisticProfile.communicative_flow_comment }}</div>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              No comments yet.
            </div>
          </v-card>
        </v-col>

        <!-- Expressive Range -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 profile-card" elevation="2" rounded="lg">
            <div class="d-flex align-center mb-4">
              <v-icon size="32" color="purple" class="mr-3">mdi-book-alphabet</v-icon>
              <div>
                <div class="text-h6">Expressive Range</div>
                <div class="text-caption text-medium-emphasis">Vocabulary & Complexity</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Score</span>
                <div class="d-flex align-center gap-2">
                  <v-chip :color="getScoreColor(userStore.linguisticProfile?.expressive_range)" size="small">
                    {{ userStore.linguisticProfile?.expressive_range ?? '--' }}/10
                  </v-chip>
                  <v-chip 
                    v-if="userStore.linguisticProfile?.expressive_range" 
                    :color="getLevelColor(userStore.linguisticProfile.expressive_range)"
                    size="small"
                    variant="tonal"
                  >
                    {{ getLevel(userStore.linguisticProfile.expressive_range) }}
                  </v-chip>
                </div>
              </div>
              <v-slider
                :model-value="userStore.linguisticProfile?.expressive_range ?? 0"
                :max="10"
                :min="1"
                :step="1"
                :ticks="tickLabels"
                show-ticks="always"
                readonly
                :color="getScoreColor(userStore.linguisticProfile?.expressive_range)"
                thumb-label
                class="linguistic-slider"
              >
                <template v-slot:tick-label="{ index }">
                  {{ index + 1 }}
                </template>
              </v-slider>
              
              <!-- Level indicators -->
              <div class="level-indicators">
                <div class="level-segment beginner">
                  <span class="level-label">Beginner</span>
                  <span class="level-range">1-2</span>
                </div>
                <div class="level-segment intermediate">
                  <span class="level-label">Intermediate</span>
                  <span class="level-range">3-5</span>
                </div>
                <div class="level-segment upper-intermediate">
                  <span class="level-label">Upper-Int</span>
                  <span class="level-range">6-8</span>
                </div>
                <div class="level-segment advanced">
                  <span class="level-label">Advanced</span>
                  <span class="level-range">9-10</span>
                </div>
              </div>
            </div>

            <v-divider class="my-3" />

            <div v-if="userStore.linguisticProfile?.expressive_range_comment" class="comment-box">
              <div class="text-caption font-weight-bold mb-1">Teacher's Comments:</div>
              <div class="text-body-2">{{ userStore.linguisticProfile.expressive_range_comment }}</div>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              No comments yet.
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Profile Summary -->
      <v-card v-if="userStore.hasLinguisticProfile" class="mt-4 pa-6" elevation="2">
        <div class="text-h6 mb-4">Overall Profile</div>
        <div class="d-flex justify-space-around flex-wrap">
          <div class="text-center ma-2">
            <v-progress-circular
              :model-value="(userStore.linguisticProfile?.linguistic_precision ?? 0) * 10"
              :size="80"
              :width="8"
              :color="getScoreColor(userStore.linguisticProfile?.linguistic_precision)"
            >
              {{ userStore.linguisticProfile?.linguistic_precision ?? 0 }}
            </v-progress-circular>
            <div class="text-caption mt-2 font-weight-bold">Precision</div>
            <div class="text-caption text-medium-emphasis">
              {{ getLevel(userStore.linguisticProfile?.linguistic_precision) }}
            </div>
          </div>
          <div class="text-center ma-2">
            <v-progress-circular
              :model-value="(userStore.linguisticProfile?.phonetic_clarity ?? 0) * 10"
              :size="80"
              :width="8"
              :color="getScoreColor(userStore.linguisticProfile?.phonetic_clarity)"
            >
              {{ userStore.linguisticProfile?.phonetic_clarity ?? 0 }}
            </v-progress-circular>
            <div class="text-caption mt-2 font-weight-bold">Clarity</div>
            <div class="text-caption text-medium-emphasis">
              {{ getLevel(userStore.linguisticProfile?.phonetic_clarity) }}
            </div>
          </div>
          <div class="text-center ma-2">
            <v-progress-circular
              :model-value="(userStore.linguisticProfile?.communicative_flow ?? 0) * 10"
              :size="80"
              :width="8"
              :color="getScoreColor(userStore.linguisticProfile?.communicative_flow)"
            >
              {{ userStore.linguisticProfile?.communicative_flow ?? 0 }}
            </v-progress-circular>
            <div class="text-caption mt-2 font-weight-bold">Flow</div>
            <div class="text-caption text-medium-emphasis">
              {{ getLevel(userStore.linguisticProfile?.communicative_flow) }}
            </div>
          </div>
          <div class="text-center ma-2">
            <v-progress-circular
              :model-value="(userStore.linguisticProfile?.expressive_range ?? 0) * 10"
              :size="80"
              :width="8"
              :color="getScoreColor(userStore.linguisticProfile?.expressive_range)"
            >
              {{ userStore.linguisticProfile?.expressive_range ?? 0 }}
            </v-progress-circular>
            <div class="text-caption mt-2 font-weight-bold">Range</div>
            <div class="text-caption text-medium-emphasis">
              {{ getLevel(userStore.linguisticProfile?.expressive_range) }}
            </div>
          </div>
        </div>
      </v-card>
      
      <!-- Personality Type Card -->
      <v-card 
        v-if="userStore.hasLinguisticProfile && profileType" 
        class="my-4 pa-6 personality-card" 
        elevation="3"
        :color="getProfileColor(profileType.color)"
        rounded="lg"
      >
        <div class="d-flex align-items-start gap-4">
          <!-- Emoji Icon -->
          <div class="personality-emoji">
            {{ profileType.emoji }}
          </div>
          
          <!-- Content -->
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-2">
              <h3 class="text-h5 font-weight-bold mb-0">
                Your Profile: {{ profileType.type }}
              </h3>
              <v-chip 
                :color="profileType.color" 
                size="small" 
                variant="elevated"
                class="ms-3"
              >
                Based on latest assessment
              </v-chip>
            </div>
            
            <p class="text-body-1 mb-3">
              {{ profileType.description }}
            </p>
            
            <!-- Strengths & Focus Areas -->
            <v-row dense class="mb-3">
              <v-col cols="12" md="6">
                <div class="profile-section-label">
                  <v-icon size="small" class="mr-1">mdi-star</v-icon>
                  Your Strengths:
                </div>
                <v-chip
                  v-for="strength in profileType.strengths"
                  :key="strength"
                  size="small"
                  class="mr-1 mb-1"
                  color="success"
                  variant="tonal"
                >
                  {{ strength }}
                </v-chip>
              </v-col>
              <v-col cols="12" md="6">
                <div class="profile-section-label">
                  <v-icon size="small" class="mr-1">mdi-target</v-icon>
                  Focus On:
                </div>
                <v-chip
                  v-for="area in profileType.focus_areas"
                  :key="area"
                  size="small"
                  class="mr-1 mb-1"
                  color="warning"
                  variant="tonal"
                >
                  {{ area }}
                </v-chip>
              </v-col>
            </v-row>
            
            <!-- Advice -->
            <v-alert
              :color="profileType.color"
              variant="tonal"
              density="compact"
              class="mb-0"
            >
              <div class="d-flex align-items-start">
                <v-icon class="mr-2">mdi-lightbulb-on</v-icon>
                <div>
                  <strong>Personalized Advice:</strong> {{ profileType.advice }}
                </div>
              </div>
            </v-alert>
          </div>
        </div>
      </v-card>

      <!-- No Profile Yet -->
      <v-card v-if="!userStore.hasLinguisticProfile" class="pa-8 text-center" elevation="2">
        <!-- ... existing no profile content ... -->
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const tickLabels = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
};

function getScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'grey';
  if (score >= 9) return '#4caf50'; // Advanced - green
  if (score >= 6) return '#2196f3'; // Upper-intermediate - blue
  if (score >= 3) return '#ff9800'; // Intermediate - orange
  return '#f44336'; // Beginner - red
}

function getLevelColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'grey';
  if (score >= 9) return 'success';
  if (score >= 6) return 'info';
  if (score >= 3) return 'warning';
  return 'error';
}

function getLevel(score: number | null | undefined): string {
  if (score === null || score === undefined) return '--';
  if (score >= 9) return 'Advanced';
  if (score >= 6) return 'Upper-Intermediate';
  if (score >= 3) return 'Intermediate';
  return 'Beginner';
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// NEW: Computed for profile type
const profileType = computed(() => {
  return userStore.linguisticProfile?.profile_type || null;
});

function getProfileColor(color: string): string {
  const colorMap: Record<string, string> = {
    'success': 'green-lighten-5',
    'info': 'blue-lighten-5',
    'warning': 'orange-lighten-5',
    'primary': 'purple-lighten-5',
    'secondary': 'grey-lighten-4',
  };
  return colorMap[color] || 'grey-lighten-4';
}

</script>

<style scoped>
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.profile-card {
  height: 100%;
}

.comment-box {
  background: rgba(0, 0, 0, 0.03);
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid rgba(var(--v-theme-primary));
}

.gap-2 {
  gap: 8px;
}

/* Level indicators */
.level-indicators {
  display: flex;
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.level-segment {
  flex: 1;
  padding: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.level-segment.beginner {
  background: rgba(244, 67, 54, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.level-segment.intermediate {
  background: rgba(255, 152, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.level-segment.upper-intermediate {
  background: rgba(33, 150, 243, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.level-segment.advanced {
  background: rgba(76, 175, 80, 0.1);
}

.level-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-range {
  font-size: 10px;
  opacity: 0.7;
}

/* Custom slider styling */
.linguistic-slider :deep(.v-slider-track__fill) {
  transition: background-color 0.3s;
}

.linguistic-slider :deep(.v-slider-thumb) {
  transition: background-color 0.3s;
}

.personality-card {
  border-left: 6px solid currentColor;
}

.personality-emoji {
  font-size: 4rem;
  line-height: 1;
  min-width: 80px;
  text-align: center;
}

.profile-section-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

@media (max-width: 960px) {
  .personality-emoji {
    font-size: 3rem;
    min-width: 60px;
  }
}
</style>